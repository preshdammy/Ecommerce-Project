import Admin from "../../../database/model/admin.model";
import Vendor from "../../../database/model/vendor.model";
import User from "../../../database/model/user.model";
import Order from "../../../database/model/order.model";
import Product from "../../../database/model/product.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { ContextType } from "../../../../types/context"; // Update path as needed

export const adminresolver = {
  Query: {
    adminProfile: async (_: any, __: any, context: ContextType) => {
  if (!context.admin) throw new Error("Unauthorized");
  return context.admin;
  },



    allAdmins: async () => await Admin.find(),

    allVendors: async () => await Vendor.find(),

    allUsers: async () => await User.find(),

    getDashboardMetrics: async () => {
      const totalUsers = await User.countDocuments();
      const totalVendors = await Vendor.countDocuments();
      const totalOrders = await Order.countDocuments();
      const totalSales = await Order.aggregate([
        { $match: { status: "DELIVERED" } },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } }
      ]);
      return {
        totalUsers,
        totalVendors,
        totalOrders,
        totalSales: totalSales[0]?.total || 0
      };
    },
  },

  Mutation: {

    loginAdmin: async (_: any, args: { email: string; password: string }) => {
      
  const adminDoc = await Admin.findOne({ email: args.email });

  if (!adminDoc || !(await bcrypt.compare(args.password, adminDoc.password))) {
    throw new Error("Access denied! Please input valid credentials");
  }

    console.log("🔍 Raw AdminDoc:", adminDoc);

  // Safely extract fields (especially name)
  const admin = {
    id: adminDoc._id.toString(),
    name: adminDoc.name,
    email: adminDoc.email,
    role: adminDoc.role,
  };

  if (!admin.name) {
    throw new Error("Admin name is missing");
  }

  const token = jwt.sign(
    {
      id: admin.id,
      email: admin.email,
      role: admin.role,
    },
    process.env.JWT_SECRET!
  );

  return {
    token,
    admin, // Return safe plain object
  };
  console.log("✅ Returned admin from login:", admin);

},



    seedAdmin: async (_: any, args: { secret: string }) => {
      if (args.secret !== process.env.ADMIN_SEED_SECRET) throw new Error("Unauthorized");
      const hashedPassword = await bcrypt.hash("admin123", 10);
      await Admin.create({
        email: "admin@example.com",
        role: "ADMIN",
        password: hashedPassword,
      });
      return "Admin seeded successfully";
    },

    updateAdminRole: async (_: any, args: { id: string; role: string }) =>
      await Admin.findByIdAndUpdate(args.id, { role: args.role }, { new: true }),

    deleteAdmin: async (_: any, args: { id: string }) => {
      await Admin.findByIdAndDelete(args.id);
      return "Admin deleted";
    },

    addVendor: async (_: any, args: { name: string; email: string }) =>
      await Vendor.create({ name: args.name, email: args.email, isBanned: false }),

    deleteVendor: async (_: any, args: { id: string }) => {
      await Vendor.findByIdAndDelete(args.id);
      return "Vendor deleted";
    },

    banVendor: async (_: any, args: { id: string }) =>
      await Vendor.findByIdAndUpdate(args.id, { isBanned: true }, { new: true }),

    deleteUser: async (_: any, args: { id: string }) => {
      await User.findByIdAndDelete(args.id);
      return "User deleted";
    },

    banUser: async (_: any, args: { id: string }) =>
      await User.findByIdAndUpdate(args.id, { isBanned: true }, { new: true }),

    deleteProduct: async (_: any, args: { id: string }) => {
      await Product.findByIdAndDelete(args.id);
      return "Product deleted";
    },

    markOrderAsDelivered: async (_: any, args: { orderId: string }) => {
      await Order.findByIdAndUpdate(args.orderId, { status: "DELIVERED" });
      return "Order marked as delivered";
    },

    refundOrder: async (_: any, args: { orderId: string }) => {
      await Order.findByIdAndUpdate(args.orderId, { status: "REFUNDED" });
      return "Order refunded";
    },
  },
};
