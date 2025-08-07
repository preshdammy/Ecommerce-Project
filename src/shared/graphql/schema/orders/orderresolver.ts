
import { OrderModel, IOrder } from "@/shared/database/model/orders.model";
import { productModel } from "@/shared/database/model/product.model";
import { vendorModel } from "@/shared/database/model/vendor.model";
import { usermodel } from "@/shared/database/model/user.model";
import { walletmodel } from "@/shared/database/model/wallet.model";
import { NotificationModel } from "@/shared/database/model/notifications.model";
import cron from "node-cron";
import axios from "axios";
import { Types } from "mongoose";


cron.schedule("*/5 * * * *", async () => {
  const cutoff = new Date(Date.now() - 30 * 60 * 1000); 

  try {
    const updated = await OrderModel.updateMany(
      {
        status: { $in: ["PENDING", "PROCESSING"] },
        createdAt: { $lt: cutoff },
        manualOverride: false,
        $or: [
          { paymentMethod: "POD", paymentStatus: "UNPAID" },
          { paymentMethod: { $ne: "POD" }, paymentStatus: "PAID" },
        ],
      },
      {
        $set: { status: "SHIPPED", shippedAt: new Date() },
      }
    );

    if (updated.modifiedCount > 0) {
      console.log(`[CRON] Marked ${updated.modifiedCount} orders as SHIPPED`);
    }
  } catch (error) {
    console.error("[CRON ERROR] Failed to auto-ship orders:", error);
  }
});

/* -------------------------------------------------------------------------------------------------
 * Shipping Fee
 * ------------------------------------------------------------------------------------------------- */
const SHIPPING_RATE_BY_STATE_NGN: Record<string, number> = {
  Lagos: 1500,
  "Abuja (FCT)": 2500,
  Oyo: 2000,
  Kano: 2800,
  Default: 3000,
};
function calcShippingFee(state: string): number {
  return SHIPPING_RATE_BY_STATE_NGN[state] ?? SHIPPING_RATE_BY_STATE_NGN.Default;
}


const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY || "";
const PAYSTACK_BASE = "https://api.paystack.co";

function toKobo(amountMajor: number): number {
  return Math.round(amountMajor * 100);
}

function buildOrderReference(orderId: string): string {
  return `ORD-${orderId}-${Date.now()}`;
}

function paymentMethodToChannels(pm: string): string[] | undefined {
  switch (pm) {
    case "PAYSTACK_CARD":
      return ["card"];
    case "PAYSTACK_TRANSFER":
      return ["bank_transfer"];
    case "PAYSTACK_USSD":
      return ["ussd"];
    case "PAYSTACK_MOBILE_MONEY":
      return ["mobile_money"];
    case "PAYSTACK_QR":
      return ["qr"];
    default:
      return undefined;
  }
}

async function createPaystackSplit(vendorShares: { subaccount: string; share: number }[]) {
  if (!PAYSTACK_SECRET) throw new Error("Missing PAYSTACK_SECRET_KEY env");
  const body = {
    name: `SPL-${Date.now()}`,
    type: "percentage",
    currency: "NGN",
    subaccounts: vendorShares,
    bearer_type: "all",
  };
  const res = await axios.post(`${PAYSTACK_BASE}/split`, body, {
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET}`,
      "Content-Type": "application/json",
    },
  });
  return res.data?.data?.split_code as string | undefined;
}


async function paystackInitialize(order: IOrder & { buyer: any }, channels?: string[]) {
  if (!PAYSTACK_SECRET) throw new Error("Missing PAYSTACK_SECRET_KEY env");

  // Ensure we have buyer email. If not populated, fetch.
  let buyerEmail: string = (order as any).buyer?.email || "";
  if (!buyerEmail) {
    const buyerDoc = await usermodel.findById(order.buyer).select("email");
    buyerEmail = buyerDoc?.email || "";
  }

  const amount = toKobo(order.totalAmount);
  const reference = buildOrderReference(String(order._id));

  const frontendBase = process.env.FRONTEND_URL || "";
  const callbackUrl = frontendBase
    ? `${frontendBase}/user/checkout-page/success?orderId=${order._id}&reference=${reference}`
    : undefined; 

  const body: any = {
    email: buyerEmail,
    amount,
    reference,
    metadata: {
      orderId: String(order._id),
      buyer: order.buyer.toString(),
      vendorCount: Array.isArray(order.vendors) ? order.vendors.length : 1,
    },
  };
  if (callbackUrl) body.callback_url = callbackUrl;
  if (channels?.length) body.channels = channels;
  if ((order as any).paystackSplitCode) body.split_code = (order as any).paystackSplitCode;

  const res = await axios.post(`${PAYSTACK_BASE}/transaction/initialize`, body, {
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET}`,
      "Content-Type": "application/json",
    },
  });

  const data = res.data?.data;
  if (!data?.authorization_url || !data?.reference) {
    throw new Error("Paystack init failed: missing authorization_url/reference");
  }
  return {
    authorizationUrl: data.authorization_url as string,
    reference: data.reference as string,
  };
}

async function paystackVerify(reference: string) {
  if (!PAYSTACK_SECRET) throw new Error("Missing PAYSTACK_SECRET_KEY env");
  const res = await axios.get(`${PAYSTACK_BASE}/transaction/verify/${reference}`, {
    headers: { Authorization: `Bearer ${PAYSTACK_SECRET}` },
  });
  return res.data?.data;
}

/* -------------------------------------------------------------------------------------------------
 * Shared Types
 * ------------------------------------------------------------------------------------------------- */
type Ctx = {
  user?: { id: string };
  vendor?: { id: string };
  admin?: { id: string };
};

type OrderItemArg = { productId: string; quantity: number };
type ShippingAddressArg = {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

/* -------------------------------------------------------------------------------------------------
 * Helper: populateOrderById
 * ------------------------------------------------------------------------------------------------- */
async function populateOrderById(orderId: string) {
  return OrderModel.findById(orderId)
    .populate({ path: "items.product", select: "name images price seller" })
    .populate({ path: "items.vendor", select: "businessName paystackSubaccountCode" })
    .populate({ path: "buyer", select: "name email" })
    .populate({ path: "vendors", select: "businessName" })
    .exec();
}

interface VendorUpdateOrderStatusArgs {
  orderId: string;
  status: "PENDING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
}

interface OrderItem {
  product: Types.ObjectId | any; // adjust if populated
  vendor: Types.ObjectId | any;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

interface OrderType extends Document {
  _id: Types.ObjectId;
  items: OrderItem[];
  // other fields like buyer, totalAmount, etc.
  toObject: () => any;
}

/* -------------------------------------------------------------------------------------------------
 * Resolver
 * ------------------------------------------------------------------------------------------------- */
export const orderResolvers = {
  Query: {
    async myOrders(_: unknown, __: unknown, context: Ctx) {
      if (!context.user) throw new Error("Unauthorized");
      return OrderModel.find({ buyer: context.user.id })
        .sort({ createdAt: -1 })
        .populate({ path: "items.product", select: "name images price seller averageRating totalReviews" })
        .populate({ path: "items.vendor", select: "businessName paystackSubaccountCode" })
        .populate({ path: "buyer", select: "name email" })
        .populate({ path: "vendors", select: "businessName" })
        .exec();
    },

    async vendorOrders(_: unknown, __: unknown, context: Ctx) {
      if (!context.vendor) throw new Error("Unauthorized");
    
      const orders = await OrderModel.find({ vendors: context.vendor.id })
        .sort({ createdAt: -1 })
        .populate({ path: "items.product", select: "name images price seller averageRating totalReviews" })
        .populate({ path: "items.vendor", select: "businessName paystackSubaccountCode" })
        .populate({ path: "buyer", select: "name email" })
        .populate({ path: "vendors", select: "businessName" })
        .exec();
    
     
        return orders.map((order: any) => {
          const filteredItems = order.items.filter(
            (item: any) => item.vendor?._id.toString() === context.vendor!.id
          );
      
          const totalAmount = filteredItems.reduce((sum: number, item: any) => {
            return sum + item.quantity * item.product.price;
          }, 0);
      
          return {
            ...order.toObject(),
            id: order._id.toString(),
            items: filteredItems,
            totalAmount, 
          };
        });
      },
    

   async allOrders(_: unknown, __: unknown, context: Ctx) {
      if (!context.admin) throw new Error("Unauthorized");
      return OrderModel.find()
        .sort({ createdAt: -1 })
        .populate({ path: "items.product", select: "name images price seller" })
        .populate({ path: "items.vendor", select: "businessName paystackSubaccountCode" })
        .populate({ path: "buyer", select: "name email" })
        .populate({ path: "vendors", select: "businessName" })
        .exec();
    }, 

    async order(_: unknown, { id }: { id: string }, context: Ctx) {
      const order = await populateOrderById(id);
      if (!order) throw new Error("Order not found");
    
      const buyerId = order.buyer?._id?.toString() || order.buyer?.id || order.buyer;
    
      const vendorIds = Array.isArray(order.vendors)
        ? order.vendors.map((v: any) => v?._id?.toString() || v?.id || v)
        : [];
    
      const buyerMatch = !!(context.user && buyerId === context.user.id);
      const vendorMatch = !!(context.vendor && vendorIds.includes(context.vendor.id));
    
      if (context.admin || buyerMatch || vendorMatch) return order;
      throw new Error("Unauthorized");
    },
    ordersByStatus: async (_: any, { status }: { status: string }) => {
      return await OrderModel.find({ status }).populate("items.product buyer vendors");
    },
    
    
  },

  Mutation: {
    async createOrder(
      _: unknown,
      {
        items,
        shippingAddress,
        paymentMethod,
      }: {
        items: OrderItemArg[];
        shippingAddress: ShippingAddressArg;
        paymentMethod: string;
      },
      context: Ctx
    ) {
      if (!context.user) throw new Error("Unauthorized");
      if (!items?.length) throw new Error("No products in the order.");
      if (!shippingAddress?.state) throw new Error("Shipping state required.");

      // Build order items & vendor totals
      const orderItems: any[] = [];
      const vendorTotals = new Map<string, number>();
      let productsSubtotal = 0;

      for (const { productId, quantity } of items) {
        const product = await productModel
          .findById(productId)
          .select("price seller name stock");
        if (!product) throw new Error(`Product not found: ${productId}`);

        if (product.stock < quantity) {
          throw new Error(`Not enough stock for ${product.name}`);
        }
      
        product.stock -= quantity;
        if (isNaN(product.stock)) throw new Error(`Stock calculation failed for ${product.name}`);
        await product.save();


        const sellerId = product.seller.toString();
        const lineTotal = product.price * quantity;

        orderItems.push({
          product: product._id,
          vendor: product.seller,
          quantity,
          unitPrice: product.price,
          lineTotal,
        });

        productsSubtotal += lineTotal;
        vendorTotals.set(sellerId, (vendorTotals.get(sellerId) || 0) + lineTotal);
      }

      // Shipping
      const shippingFee = calcShippingFee(shippingAddress.state);
      const totalAmount = productsSubtotal + shippingFee;

      // Vendor Paystack split (percentage of products subtotal, not including shipping)
      const vendorDocs = await vendorModel.find({
        _id: { $in: Array.from(vendorTotals.keys()) },
      });

      const vendorSharesRaw = vendorDocs
        .filter((v: any) => v.paystackSubaccountCode)
        .map((v: any) => {
          const vTotal = vendorTotals.get(v._id.toString()) || 0;
          const pct = productsSubtotal > 0 ? (vTotal / productsSubtotal) * 90 : 0;
          return {
            subaccount: v.paystackSubaccountCode,
            share: Math.round(pct),
          };
        });

        const adminSubaccountCode = process.env.ADMIN_SUBACCOUNT_CODE;
        if (!adminSubaccountCode) throw new Error("Missing ADMIN_SUBACCOUNT_CODE in env");
        
        vendorSharesRaw.push({
          subaccount: adminSubaccountCode,
          share: 10,
        });

      let splitCode: string | undefined;
      if (vendorSharesRaw.length > 1) {
        splitCode = await createPaystackSplit(vendorSharesRaw);
      }

      // Vendor id list (as ObjectIds)
      const vendorIds = Array.from(vendorTotals.keys()).map((id) => new Types.ObjectId(id));

      const estimatedDeliveryDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000); // 3 days from now
      const adminCommission = productsSubtotal * 0.1;

      const order = await OrderModel.create({
        items: orderItems,
        buyer: context.user.id,
        vendors: vendorIds,
        totalAmount,
        shippingFee,
        shippingAddress,
        estimatedDeliveryDate,
        paymentMethod,
        paymentStatus: paymentMethod === "POD" ? "UNPAID" : "PENDING",
        paystackSplitCode: splitCode,
        status: "PENDING",
        adminCommission
      });


      // Notifications
      for (const vendorId of vendorTotals.keys()) {
        await NotificationModel.create({
          recipientId: vendorId,
          recipientRole: "VENDOR",
          type: "ORDER",
          title: "New Order",
          message: "A new order has been placed containing your product(s).",
          isRead: false,
        });
      }

      return populateOrderById(order._id.toString());
    },
    async payWithWallet(
      _: unknown,
      { orderId }: { orderId: string },
      context: Ctx
    ): Promise<{ success: boolean; message: string; updatedBalance?: number }> {
      if (!context.user) throw new Error("Unauthorized");
    
      const userId = context.user.id;
    
      const order = await OrderModel.findOne({
        _id: orderId,
        buyer: userId,
      });
    
      if (!order) {
        return {
          success: false,
          message: "Order not found",
        };
      }
    
      if (order.paymentMethod !== "WALLET_BALANCE") {
        return {
          success: false,
          message: "Order is not set to use wallet payment",
        };
      }
    
      if (order.paymentStatus === "PAID") {
        return {
          success: false,
          message: "Order is already paid",
        };
      }
    
      const user = await usermodel.findById(userId);
      if (!user) {
        return {
          success: false,
          message: "User not found",
        };
      }
    
      if (user.walletBalance < order.totalAmount) {
        return {
          success: false,
          message: "Insufficient wallet balance",
        };
      }
    
      // Deduct from user wallet balance
      user.walletBalance -= order.totalAmount;
      await user.save();
    
      // Update order status
      order.paymentStatus = "PAID";
      order.status = "PROCESSING";
      await order.save();
      console.log("Wallet Payment Order Updated:", order.status, order.paymentStatus);

    
      // Notify vendors
      for (const vendorId of order.vendors) {
        await NotificationModel.create({
          recipientId: vendorId,
          recipientRole: "VENDOR",
          type: "ORDER",
          title: "New Paid Order",
          message: "An order has been paid using wallet balance.",
          isRead: false,
        });
      }
    
      return {
        success: true,
        message: "Wallet payment successful",
        updatedBalance: user.walletBalance,
      };
    },    

    async initiatePaystackPayment(
      _: unknown,
      { orderId }: { orderId: string },
      context: Ctx
    ) {
      if (!context.user) throw new Error("Unauthorized");
    
      
      const order = await OrderModel.findOne({ _id: orderId, buyer: context.user.id })
        .populate({ path: "buyer", select: "email" })
        .exec();
    
      if (!order) throw new Error("Order not found"); 
    
      const channels = paymentMethodToChannels(order.paymentMethod);
      const init = await paystackInitialize(order as any, channels);
    
      order.paystackReference = init.reference;
      await order.save();
    
      return {
        authorizationUrl: init.authorizationUrl,
        reference: init.reference,
      };
    },

    // async markOrderShipped(_: unknown, { id }: { id: string }, context: Ctx) {
    //   if (!context.admin && !context.vendor) throw new Error("Unauthorized");
    
    //   const order = await OrderModel.findById(id);
    //   if (!order) throw new Error("Order not found");
    
    //   // Optional: if vendors are allowed to call this, validate vendor ownership
    //   if (context.vendor) {
    //     const isVendorInOrder = order.vendors
    //       .map((v: any) => v.toString())
    //       .includes(context.vendor.id);
    //     if (!isVendorInOrder) throw new Error("You cannot update this order");
    //   }
    
    //   if (order.status !== "PROCESSING" && order.status !== "PENDING") {
    //     throw new Error("Order must be in PROCESSING or PENDING state to be marked as SHIPPED");
    //   }
    
    //   order.status = "SHIPPED";
    //   order.shippedAt = new Date();
    //   order.manualOverride = true;
    //   await order.save();
    //   return populateOrderById(order._id.toString());
    // },

    // async markOrderDelivered(
    //   _: unknown,
    //   { id }: { id: string },
    //   context: Ctx
    // ) {
    //   if (!context.admin && !context.vendor) {
    //     throw new Error("Unauthorized");
    //   }
    
    //   const order = await OrderModel.findById(id);
    //   if (!order) throw new Error("Order not found");
    
    //   // Optional: validate vendor permission
    //   if (context.vendor) {
    //     const isVendorInOrder = order.vendors
    //       .map((v: any) => v.toString())
    //       .includes(context.vendor.id);
    //     if (!isVendorInOrder) {
    //       throw new Error("You cannot update this order");
    //     }
    //   }
    
    //   if (order.status !== "SHIPPED") {
    //     throw new Error("Order must be in SHIPPED state to be marked as DELIVERED");
    //   }
    
    //   order.status = "DELIVERED";
    //   order.deliveredAt = new Date();
    //   order.manualOverride = true;
    //   await order.save();
    
    //   return populateOrderById(order._id.toString());
    // },
    
    
    async vendorUpdateOrderStatus(
      _: unknown,
      { orderId, status }: VendorUpdateOrderStatusArgs,
      context: any
    ): Promise<IOrder> {
      const user = context.vendor;
      console.log(user);
      
    
      if (!user) {
        throw new Error("Unauthorized");
      }
    
      const order = await OrderModel.findOne({
        _id: new Types.ObjectId(orderId),
        vendors: new Types.ObjectId(user.id),
      });
    
      if (!order) {
        throw new Error("Order not found or not your order");
      }
    
      const validStatuses: VendorUpdateOrderStatusArgs["status"][] = [
        "PENDING",
        "SHIPPED",
        "DELIVERED",
        "CANCELLED",
      ];
      if (!validStatuses.includes(status)) {
        throw new Error("Invalid status");
      }
      if (status === "SHIPPED") {
        order.shippedAt = new Date();
      }
      if (status === "DELIVERED") {
        order.deliveredAt = new Date();
      }
      
    
      order.status = status;
      order.manualOverride = true;
      await order.save();
    
      return order;
    },

    async verifyPaystackPayment(
      _: unknown,
      { reference }: { reference: string },
      _context: Ctx
    ) {
      const tx = await paystackVerify(reference);
      if (!tx) throw new Error("Transaction verification failed");

      const order = await OrderModel.findOne({ paystackReference: reference }).exec();
      if (!order) throw new Error("Order not found");

      if (tx.status === "success") {
        order.paymentStatus = "PAID";
        order.status = "PROCESSING";
        await order.save();
      } else {
        order.paymentStatus = "FAILED";
        await order.save();
        throw new Error("Payment failed");
      }

      return populateOrderById(order._id.toString());
    },

    async adminUpdateOrderStatus(
      _: unknown,
      { orderId, status }: { orderId: string; status: string },
      context: any
    ): Promise<IOrder> {
      const user = context.admin;
    
      if (!user) throw new Error("Unauthorized");
    
      const order = await OrderModel.findById(orderId).populate("buyer");
      if (!order) throw new Error("Order not found");
    
      const validStatuses = ["PENDING", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"];
      if (!validStatuses.includes(status)) throw new Error("Invalid status");
    
      if (status === "SHIPPED") {
        order.shippedAt = new Date();
      }
    
      if (status === "DELIVERED") {
        order.deliveredAt = new Date();
      }
    
      if (status === "REFUNDED") {
        // Check if already refunded
        if (order.status === "REFUNDED" || order.refundedAt) {
          throw new Error("Order has already been refunded");
        }
    
        if (order.paymentStatus !== "PAID") {
          throw new Error("Cannot refund unpaid order");
        }
    
        const buyer = order.buyer as any; // populated user
    
        buyer.walletBalance += order.totalAmount;
        await buyer.save();
    
        order.paymentStatus = "REFUNDED";
        order.refundedAt = new Date();
      }
    
      order.status = status;
      order.manualOverride = true;
    
      await order.save();
    
      return order;
    },
    
  },
};
