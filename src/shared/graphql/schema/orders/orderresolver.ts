// src/shared/graphql/schema/orders/orderResolvers.ts

import { OrderModel, IOrder } from "@/shared/database/model/orders.model";
import { productModel } from "@/shared/database/model/product.model";
import { vendorModel } from "@/shared/database/model/vendor.model";
import { usermodel } from "@/shared/database/model/user.model";
import { NotificationModel } from "@/shared/database/model/notifications.model";
import axios from "axios";
import { Types } from "mongoose";

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
      return OrderModel.find({ vendors: context.vendor.id })
        .sort({ createdAt: -1 })
        .populate({ path: "items.product", select: "name images price seller averageRating totalReviews" })
        .populate({ path: "items.vendor", select: "businessName paystackSubaccountCode" })
        .populate({ path: "buyer", select: "name email" })
        .populate({ path: "vendors", select: "businessName" })
        .exec();
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
    
  },

  Mutation: {
    /* ---------------------------------------------------------------------------
     * createOrder
     * ------------------------------------------------------------------------ */
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
          .select("price seller name");
        if (!product) throw new Error(`Product not found: ${productId}`);

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
          const pct = productsSubtotal > 0 ? (vTotal / productsSubtotal) * 100 : 0;
          return {
            subaccount: v.paystackSubaccountCode,
            share: Math.round(pct),
          };
        });

      let splitCode: string | undefined;
      if (vendorSharesRaw.length > 1) {
        splitCode = await createPaystackSplit(vendorSharesRaw);
      }

      // Vendor id list (as ObjectIds)
      const vendorIds = Array.from(vendorTotals.keys()).map((id) => new Types.ObjectId(id));

      const estimatedDeliveryDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000); // 3 days from now

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

    /* ---------------------------------------------------------------------------
     * updateOrderStatus

      * ------------------------------------------------------------------------ */
     async updateOrderStatus(
  _: unknown,
  { id, status }: { id: string; status: string },
  context: Ctx
) {
  // 1. Ensure authentication
  if (!context.vendor && !context.admin) {
    throw new Error("Unauthorized - only vendors or admins can update orders.");
  }

  // 2. Fetch the order with vendor IDs
  const order = await OrderModel.findById(id)
    .populate({ path: "buyer", select: "name email" })
    .populate({ path: "vendors", select: "_id businessName" }) // ✅ Ensure we have _id
    .exec();

  if (!order) {
    throw new Error(`Order with id ${id} not found`);
  }

  // 3. Extract IDs for authorization
  const buyerId = order.buyer?._id?.toString() || order.buyer?.id || order.buyer;
  const vendorIds = Array.isArray(order.vendors)
    ? order.vendors.map((v: any) => v?._id?.toString() || v?.id || v)
    : [];

  // Debug logs
  console.log("Auth Check => Vendor Context:", context.vendor);
  console.log("Vendor IDs on Order:", vendorIds);
  console.log("Buyer ID on Order:", buyerId);

  // 4. Check if the request is from an admin or a vendor assigned to the order
  const vendorMatch = !!(context.vendor && vendorIds.includes(context.vendor.id));
  const adminMatch = !!context.admin;

  if (!adminMatch && !vendorMatch) {
    throw new Error("Unauthorized to update this order");
  }

  // 5. Update the order status
  order.status = status;
  order.updatedAt = new Date().toISOString();
  await order.save();

  // 6. Send notifications based on status
  if (status === "SHIPPED") {
    await NotificationModel.create({
      recipientId: buyerId,
      recipientRole: "USER",
      type: "ORDER",
      title: "Order Shipped",
      message: "Your order has been shipped.",
      isRead: false,
    });
  }

  // 7. Return updated order with full population
  return populateOrderById(id);
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
  },
};
