import adminModel from "../../../database/model/admin.model";
import { vendorModel } from "../../../database/model/vendor.model";
import { usermodel } from "../../../database/model/user.model";
import { OrderModel } from "../../../database/model/orders.model";
import { productModel } from "../../../database/model/product.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { complaintModel } from "@/shared/database/model/complaint.model";
import { NotificationModel } from "@/shared/database/model/notifications.model";
import mongoose from "mongoose";


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
        .select("name email storeName avatar phone location createdAt status suspendedUntil")
        .lean();
    },
  
    allProducts: async (_: any, { limit = 20, offset = 0 }: { limit: number, offset: number }) => {
      const products = await productModel.find()
        .limit(limit)
        .skip(offset)
        .lean();

      const sellers = await Promise.all(
        products.map(product =>
          product.seller ? vendorModel.findById(product.seller) : Promise.resolve(null)
        )
      );

      return products.map((product, idx) => ({
        ...product,
        seller: sellers[idx],
        averageRating: product.averageRating || 0 // Ensure default value
      }));
    },

    product: async (_: any, { id }: { id: string }) => {
      console.log('Fetching product ID:', id); // Debugging
      
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error('Invalid product ID format');
      }

      const product = await productModel.findById(id)
        .populate('seller', 'name storeName')
        .lean();

      if (!product) {
        console.error('Product not found for ID:', id);
        throw new Error('Product not found');
      }

      // Ensure all required fields exist
      if (Array.isArray(product)) {
        throw new Error("Product not found");
      }
      return {
        ...product,
        stats: (product as any).stats || { /* default values */ },
        reviews: (product as any).reviews || []
      };
    },

    allUsers: async () => {
      const users = await usermodel.find()
        .select('name email status walletBalance createdAt actions')
        .lean();

      return users.map(user => ({
         id: user._id?.toString() || '', 
        name: user.name || "",
        email: user.email || "",
        status: user.status || 'ACTIVE', // Default value
        walletBalance: user.walletBalance || 0, // Direct float value
        createdAt: user.createdAt || new Date(),
        actions: user.actions?.slice(0, 1) || []
      }));
    },

    user: async (_: any, { id }: { id: string }) => {
      const user = await usermodel
        .findById(id)
        .select("name email password profilePicture address state city gender dateOfBirth walletBalance createdAt updatedAt actions suspendedUntil status")
        .lean();

      if (!user) throw new Error("User not found");
      
      // If user is an array, skip or handle accordingly
      if (Array.isArray(user)) {
        throw new Error("User not found");
      }

      // Fetch related complaints and orders
      const [complaints, orders] = await Promise.all([
        complaintModel.find({ user: id }),
      OrderModel.find({ buyer: id })
        .populate({
          path: 'items.product',
          model: 'products', // Must match your product model name
          select: 'name price images' // Only get needed fields
        })
        .populate({
          path: 'items.vendor',
          model: 'vendor_collection',
          select: 'name storeName'
        })
      ]);

      interface UserComplaint {
        id: string;
        message: string;
        status: string;
        createdAt: Date;
      }

      interface OrderProduct {
        id: string;
        name: string;
        price: number;
        image: string | null;
      }

      interface OrderItem {
        product: OrderProduct;
        quantity: number;
      }

      interface UserOrder {
        id: string;
        totalAmount: number;
        status: string;
        createdAt: Date;
        items: OrderItem[];
      }
      
      interface UserActions {
        action: string;
            performedBy: string;
            performedAt: Date;
            notes: string
      }


      interface UserDetails {
        id: string;
        name: string;
        email: string;
        password: string;
        profilePicture: string | null;
        createdAt: Date | null;
        address: string | null;
        state: string | null;
        city: string | null;
        gender: string | null;
        dateOfBirth: Date | null;
        actions: UserActions[]
        walletBalance: number;
        orders: UserOrder[];
        status: string;
        complaints: UserComplaint[];
      }

      return {
        id: (user._id as string | { toString(): string }).toString(),
        name: user.name,
        email: user.email,
        password: user.password,
        profilePicture: user.profilePicture || "",
        address: user.address || "",
        state: user.state || "",
        city: user.city || "",
        createdAt: user.createdAt.toISOString(), 
        gender: user.gender || "",
        actions: user.actions || [],
        dateOfBirth: user.dateOfBirth || "",
        walletBalance: user.walletBalance || 0,
        status: user.status || "ACTIVE",
        orders: orders.map((order: any): UserOrder => ({
          id: order._id.toString(),
          totalAmount: order.totalAmount,
          status: order.status,
          createdAt: order.createdAt,
          items: order.items.map((item: any): OrderItem => ({
            product: item.product ? {
              id: item.product._id?.toString() || 'unknown',
              name: item.product.name || 'Deleted Product',
              price: item.product.price || 0,
              image: item.product.images?.[0] || null
            } : {
              id: 'unknown',
              name: 'Deleted Product',
              price: 0,
              image: null
            },
            quantity: item.quantity
          }))
        })),
        complaints: complaints.map((c: any): UserComplaint => ({
          id: c._id.toString(),
          message: c.message,
          status: c.status,
          createdAt: c.createdAt
        }))
      } as UserDetails;
    },

    allOrders: async () => {
    const orders = await OrderModel.find()
      .populate({
        path: 'buyer',
        match: { id: { $ne: null } }, 
        select: "name email"
      })
      .populate('product')
      .populate('vendor');
    return orders.map(order => ({
      ...order.toObject(),
      buyer: order.buyer ? order.buyer : null, 
    }));
    },

    complaints: async () => {
      return complaintModel
        .find()
        .populate("user")   
        .populate("vendor"); 
    },

    getDashboardMetrics: async () => {
      const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);

        const yesterdayCommissionAgg = await OrderModel.aggregate([
          {
            $match: {
              status: "DELIVERED",
              createdAt: { $gte: yesterday, $lt: today },
            },
          },
          {
            $group: {
              _id: null,
              total: { $sum: "$adminCommission" },
            },
          },
        ]);

      const yesterdayAdminCommission = yesterdayCommissionAgg[0]?.total || 0;
      const adminCommissionAgg = await OrderModel.aggregate([
        { $match: { status: "DELIVERED" } },
        { $group: { _id: null, total: { $sum: "$adminCommission" } } },
      ]);
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
        totalAdminCommission: adminCommissionAgg[0]?.total || 0,
        yesterdayAdminCommission
      };
    
    },

    weeklyAdminCommissions: async () => {
      const today = new Date();
      const past7Days = [...Array(7)].map((_, i) => {
        const date = new Date();
        date.setDate(today.getDate() - i);
        return date.toISOString().slice(0, 10); 
      });
      
      const commissions = await OrderModel.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(past7Days[past7Days.length - 1]),
            },
            status: "DELIVERED",
          },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
            },
            total: { $sum: "$adminCommission" },
          },
        },
      ]);
      
      // Ensure all 7 days are returned
      const fullData = past7Days.map((date) => {
        const match = commissions.find((d) => d._id === date);
        return { date, total: match?.total || 0 };
      });
      
      return fullData.reverse(); // Chronological order
      
    },
    
   myComplaints: async (_: any, __: any, context: { user?: any; vendor?: any }) => {
  const { user, vendor } = context;

  if (!user && !vendor) throw new Error("Unauthorized");

  const filter = user ? { user: user.id } : { vendor: vendor.id };

  const complaints = await complaintModel.find(filter).sort({ createdAt: -1 });

  return complaints  // 👈 Ensure it's a proper string
  ;
    },

    recentAdminCommissions: async () => {
      const recentOrders = await OrderModel.find({
        status: "DELIVERED",
      })
        .sort({ createdAt: -1 })
        .limit(3)
        .populate("buyer")
        .populate("items.product");

      return recentOrders.map((order) => ({
        buyerName: order.buyer?.name || "Someone",
        productName: order.items[0]?.product?.name || "a product",
        amount: order.adminCommission,
        createdAt: order.createdAt.toISOString(),
      }));
    }

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

    deleteUser: async (_: any, args: { id: string }) => {
      await usermodel.findByIdAndDelete(args.id);
      return "User deleted";
    },

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

      if (complaint.user) {
      await NotificationModel.create({
        recipientId: complaint.user._id.toString(),
        recipientRole: "USER",
        type: "COMPLAINT",
        title: "Complaint Resolved",
        message: `Your complaint has been ${status.toLowerCase()}.`,
        isRead: false,
      });
    } else if (complaint.vendor) {
      await NotificationModel.create({
        recipientId: complaint.vendor._id.toString(),
        recipientRole: "VENDOR",
        type: "COMPLAINT",
        title: "Complaint in Review",
        message: `Your complaint is in ${status.toLowerCase()}.`,
        isRead: false,
      });
    }

      return complaint;
    },
    approveVendor: async (_: any, { vendorId }: { vendorId: string }, context: any) => {
      const admin = context?.admin;
      

      if (!admin) throw new Error("Unauthorized");
    
      const vendor = await vendorModel.findById(vendorId);
      if (!vendor) throw new Error("Vendor not found");
    
      vendor.status = "APPROVED";
      vendor.suspendedUntil = null;
      
    
      vendor.actions.push({
        action: "APPROVED",
        performedBy: admin.email,
        performedAt: new Date(),
        notes: "Vendor approved by admin",
      });
    
      await vendor.save();

      await NotificationModel.create({
      recipientId: vendorId,
      recipientRole: "VENDOR",
      type: "SYSTEM",
      title: "Vendor Approved",
      message: `Your vendor account has been approved by admin ${admin.email}.`,
      isRead: false,
    });

      return vendor;
    },
    
   suspendVendor: async (
    _: any,
    { vendorId, until }: { vendorId: string; until: string },
    context: any
   ) => {
    const admin = context?.admin;

    if (!admin) throw new Error("Unauthorized");
  
    const vendor = await vendorModel.findById(vendorId);
    if (!vendor) throw new Error("Vendor not found");
  
    const date = new Date(until);
    vendor.status = "SUSPENDED";
    vendor.suspendedUntil = date;
  
    vendor.actions.push({
      action: "SUSPENDED",
      performedBy: admin.email,
      performedAt: new Date(),
      notes: `Vendor suspended until ${date.toISOString()}`,
    });
  
    await vendor.save();

    return vendor;
    },

    unsuspendVendor: async (_: any, { vendorId }: { vendorId: string }, context: any) => {
      const admin = context?.admin;
      if (!admin) throw new Error("Unauthorized");
    
      const vendor = await vendorModel.findById(vendorId);
      if (!vendor) throw new Error("Vendor not found");
    
      vendor.suspendedUntil = null;
      vendor.status = "APPROVED";
    
      vendor.actions.push({
        action: "UNSUSPENDED",
        performedBy: admin.email,
        performedAt: new Date(),
        notes: "Vendor unsuspended by admin",
      });
    
      await vendor.save();

      return vendor;
    },

    banVendor: async (_: any, { vendorId }: { vendorId: string }, context: any) => {
      const admin = context?.admin;
      if (!admin) throw new Error("Unauthorized");
    
      const vendor = await vendorModel.findById(vendorId);
      if (!vendor) throw new Error("Vendor not found");
    
      vendor.status = "BANNED";
      vendor.suspendedUntil = null;
    
      vendor.actions.push({
        action: "BANNED",
        performedBy: admin.email,
        performedAt: new Date(),
        notes: "Vendor banned by admin",
      });
    
      await vendor.save();

      return vendor;
    }, 

    suspendUser: async (
      _: any,
      { UserId, until }: { UserId: string; until: string },
      context: any
    ) => {
      const admin = context?.admin;
      if (!admin) throw new Error("Unauthorized");
    
      const user = await usermodel.findById(UserId);
      if (!user) throw new Error("User not found");
    
      const date = new Date(until);
      user.status = "SUSPENDED";
      user.suspendedUntil = date;
    
      user.actions.push({
        action: "SUSPENDED",
        performedBy: admin.email,
        performedAt: new Date(),
        notes: `until ${date.toLocaleDateString()}`,
      });
    
      await user.save();

      return user;
    },

    unsuspendUser: async (
      _: any,
      { UserId }: { UserId: string },
      context: any
    ) => {
      const admin = context?.admin;
      if (!admin) throw new Error("Unauthorized");
    
      const user = await usermodel.findById(UserId);
      if (!user) throw new Error("User not found");
    
      user.suspendedUntil = null;
      user.status = "ACTIVE";
    
      user.actions.push({
        action: "UNSUSPENDED",
        performedBy: admin.email,
        performedAt: new Date(),
        notes: " by admin",
      });
    
      await user.save();
      return user;
    },

    banUser: async (
      _: any,
      { UserId }: { UserId: string },
      context: any
    ) => {
      const admin = context?.admin;
      if (!admin) throw new Error("Unauthorized");
    
      const user = await usermodel.findById(UserId);
      if (!user) throw new Error("User not found");
    
      user.status = "BANNED";
      user.suspendedUntil = null;
    
      user.actions.push({
        action: "BANNED",
        performedBy: admin.email,
        performedAt: new Date(),
        notes: "User banned by admin",
      });
    
      await user.save();

      return user;
    },

  },
}
