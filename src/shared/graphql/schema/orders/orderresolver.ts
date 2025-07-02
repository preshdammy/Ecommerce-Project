import {OrderModel} from "@/shared/database/model/orders.model";
import { productModel } from "@/shared/database/model/product.model";
import { usermodel } from "@/shared/database/model/usermodel";
import { vendorModel } from "@/shared/database/model/vendor.model";
import { NotificationModel } from "@/shared/database/model/notifications.model";


enum OrderStatus {
    PENDING,
    PROCESSING,
    SHIPPED,
    DELIVERED,
    CANCELLED
  }
export const orderResolvers = {
  Query: {
    async myOrders(_: any, context: any) {
      if (!context.user) throw new Error("Unauthorized");
      return OrderModel.find({ buyer: context.user.id }).sort({ createdAt: -1 })
        .populate("product")
        .populate("vendor")
        .populate("buyer");
    },
    async vendorOrders(_: any, context: any) {
      if (!context.vendor) throw new Error("Unauthorized");
      return OrderModel.find({ vendor: context.vendor.id }).sort({ createdAt: -1 })
        .populate("product")
        .populate("vendor")
        .populate("buyer");
    },
    async allOrders(_: any, context: any) {
      if (!context.admin) throw new Error("Unauthorized");
      return OrderModel.find().sort({ createdAt: -1 })
        .populate("product")
        .populate("vendor")
        .populate("buyer");
    },
    async order(_: any, { id }: {id: string}, context: any) {
      const order = await OrderModel.findById(id)
        .populate("product")
        .populate("vendor")
        .populate("buyer");
      if (!order) throw new Error("Order not found");

      if (
        context.admin ||
        (context.user && order.buyer._id.toString() === context.user.id) ||
        (context.vendor && order.vendor._id.toString() === context.vendor.id)
      ) {
        return order;
      }
      throw new Error("Unauthorized");
    },
  },

  Mutation: {
    async createOrder(_: any, { productId, quantity }: {productId: string, quantity: number}, context: any) {
      if (!context.user) throw new Error("Unauthorized");

      const product = await productModel.findById(productId);
      if (!product) throw new Error("Product not found");

      const totalAmount = product.price * quantity;

      const order = await OrderModel.create({
        product: product._id,
        buyer: context.user.id,
        vendor: product.seller,
        quantity,
        totalAmount,
        status: "PENDING",
      });

      await NotificationModel.create({
        recipient: product.seller,
        recipientType: "vendor",
        message: `A new order has been placed for ${product.name}.`,
        read: false,
      });

      return order.populate("product").populate("vendor").populate("buyer");
    },

    async updateOrderStatus(_: any, { id, status }: {id: string, status: OrderStatus}, context: any) {
      const order = await OrderModel.findById(id);
      if (!order) throw new Error("Order not found");

      if (
        context.admin ||
        (context.vendor && order.vendor.toString() === context.vendor.id)
      ) {
        order.status = status;
        await order.save();
        return order.populate("product").populate("vendor").populate("buyer");
      }

      throw new Error("Unauthorized");
    },

    async markOrderShipped(_: any, { id }: {id: string}, context: any) {
        if (!context.vendor) throw new Error("Unauthorized");
    
        const order = await OrderModel.findById(id).populate("product buyer vendor");
        if (!order) throw new Error("Order not found");
    
        if (order.vendor._id.toString() !== context.vendor.id) {
          throw new Error("You are not authorized to update this order");
        }
    
        order.status = "SHIPPED";
        await order.save();
    
        // Notify the user
        await NotificationModel.create({
          recipient: order.buyer._id,
          recipientType: "user",
          message: `Your order for "${order.product.name}" has been shipped.`,
          read: false,
        });
    
        // Notify the vendor
        await NotificationModel.create({
          recipient: order.vendor._id,
          recipientType: "vendor",
          message: `You marked the order for "${order.product.name}" as shipped.`,
          read: false,
        });
    
        return order;
  },
}};
