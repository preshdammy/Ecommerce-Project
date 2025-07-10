import adminModel from "../../../database/model/admin.model";
import { vendorModel } from "../../../database/model/vendor.model";
import { usermodel } from "../../../database/model/user.model";
import { OrderModel } from "../../../database/model/orders.model";
import { productModel } from "../../../database/model/product.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { complaintModel } from "@/shared/database/model/complaint.model";


export const adminresolver = {
  Query: {
    adminProfile: async (_: any, __: any, context: any) => {
      
      if (!context.admin?.id) throw new Error("Unauthorized");
      const admin = await adminModel
        .findById(context.admin.id)
        .select("-password")
        .lean();
      if (!admin) throw new Error("Admin not found");
      return admin;
    },

    allAdmins: async () => {
      return await adminModel.find().select('-password').lean();
    },

    allVendors: async () => {
      return await vendorModel
        .find()
        .select("name email storeName avatar phone location createdAt")
        .lean();
    },

    allProducts: async () => await productModel.find(),

    allOrders: async () =>
      await OrderModel.find()
        .populate('buyer')
        .populate('product')
        .populate('vendor'),

    allUsers: async () => {
      return await usermodel
        .find()
        .select("name email profilePicture city state gender dateOfBirth")
        .lean();
    },

    complaints: async () => {
      return complaintModel
        .find()
        .populate("user")   
        .populate("vendor"); 
      },

    getDashboardMetrics: async () => {
      const totalUsers = await usermodel.countDocuments();
      const totalVendors = await vendorModel.countDocuments();
      const totalOrders = await OrderModel.countDocuments();
      const totalSalesAgg = await OrderModel.aggregate([
        { $match: { status: "DELIVERED" } },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } },
      ]);
      return {
        totalUsers,
        totalVendors,
        totalOrders,
        totalSales: totalSalesAgg[0]?.total || 0,
      };
    },
   myComplaints: async (_: any, __: any, context: { user?: any; vendor?: any }) => {
  const { user, vendor } = context;

  if (!user && !vendor) throw new Error("Unauthorized");

  const filter = user ? { user: user.id } : { vendor: vendor.id };

  const complaints = await complaintModel.find(filter).sort({ createdAt: -1 });

  return complaints  // 👈 Ensure it's a proper string
  ;
},


    

  },

  Mutation: {
    loginAdmin: async (_: any, { email, password }: { email: string; password: string }) => {
      const normalizedEmail = email.toLowerCase().trim();
      const admin = await adminModel.findOne({ email: normalizedEmail });
      if (!admin) throw new Error("Invalid credentials");

      const isValid = await bcrypt.compare(password, admin.password);
      if (!isValid) throw new Error("Invalid credentials");

      const token = jwt.sign(
        { id: admin.id, email: admin.email, role: admin.role.toLowerCase() },
        process.env.secret_key!,
        { expiresIn: '7d' }
      );

      return {
        token,
        admin: {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
        },
      };
    },

    seedAdmin: async (_: any, args: { secret: string }) => {
      if (args.secret !== process.env.ADMIN_SEED_SECRET) throw new Error("Unauthorized");
      const exists = await adminModel.findOne({ email: "admins@example.com" });
      if (exists) return "Admin already exists";
      const hashedPassword = await bcrypt.hash("admin123##", 10);
      await adminModel.create({
        name: "Precious",
        email: "Preciousdammy02@gmail.com",
        role: "ADMIN",
        password: hashedPassword,
      });
      return "Admin seeded successfully";
    },

    updateAdminRole: async (_: any, args: { id: string; role: string }) =>
      await adminModel.findByIdAndUpdate(args.id, { role: args.role }, { new: true }),

    deleteAdmin: async (_: any, args: { id: string }) => {
      await adminModel.findByIdAndDelete(args.id);
      return "Admin deleted";
    },

    addVendor: async (_: any, args: { name: string; email: string }) =>
      await vendorModel.create({ name: args.name, email: args.email, isBanned: false }),

    deleteVendor: async (_: any, args: { id: string }) => {
      await vendorModel.findByIdAndDelete(args.id);
      return "Vendor deleted";
    },

    banVendor: async (_: any, args: { id: string }) =>
      await vendorModel.findByIdAndUpdate(args.id, { isBanned: true }, { new: true }),

    deleteUser: async (_: any, args: { id: string }) => {
      await usermodel.findByIdAndDelete(args.id);
      return "User deleted";
    },

    banUser: async (_: any, args: { id: string }) =>
      await usermodel.findByIdAndUpdate(args.id, { isBanned: true }, { new: true }),

    deleteProduct: async (_: any, args: { id: string }) => {
      await productModel.findByIdAndDelete(args.id);
      return "Product deleted";
    },

    markOrderAsDelivered: async (_: any, args: { orderId: string }) => {
      await OrderModel.findByIdAndUpdate(args.orderId, { status: "DELIVERED" });
      return "Order marked as delivered";
    },

    refundOrder: async (_: any, args: { orderId: string }) => {
      await OrderModel.findByIdAndUpdate(args.orderId, { status: "REFUNDED" });
      return "Order refunded";
    },

   addComplaint: async ( _: any, args: { message: string }, context: { user?: { id: string }; vendor?: { id: string } }) => {
    const { user, vendor } = context;
    const { message } = args;

    if (!user && !vendor) {
      throw new Error("Unauthorized");
    }

    const complaintData: any = {
      message,
      status: "Pending",
      createdAt: new Date(),
    };

    if (user) complaintData.user = user.id;
    if (vendor) complaintData.vendor = vendor.id;

    const complaint = await complaintModel.create(complaintData);
    return complaint;
   },

  updateComplaintStatus: async (_: any, { id, status }: { id: string; status: string }) => {
    const validStatuses = ["Pending", "In Review", "Resolved", "Closed"];
    if (!validStatuses.includes(status)) throw new Error("Invalid status");

    const complaint = await complaintModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate("user").populate("vendor");

    if (!complaint) throw new Error("Complaint not found");
    return complaint;
  },


  },  
};
