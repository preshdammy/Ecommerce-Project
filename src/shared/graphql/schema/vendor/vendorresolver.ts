import { vendorModel } from '@/shared/database/model/vendor.model';
import { productModel } from '@/shared/database/model/product.model';
import { OrderModel } from '@/shared/database/model/orders.model';
import bcrypt from 'bcryptjs';
import cloudinary from '@/shared/utils/cloudinary';
import jwt from 'jsonwebtoken';
import { AuthenticationError } from 'apollo-server-express';
import { messageModel } from '@/shared/database/model/message.model';


const MESSAGE_SENT = 'MESSAGE_SENT';

const JWT_SECRET = process.env.secret_key!;

interface Message {
  id: string;
  chatId: string;
  sender: string;
  content: string;
  createdAt: string;
}

interface VendorAction {
  performedAt: string;
  [key: string]: any;
}
interface ExtendedVendor extends Document {
  actions: VendorAction[];
}


export const VendorResolver = {
  Query: {
    vendors: async () => {
      return await vendorModel.find();
    },

    getVendorProfile: async (_: any, __: any, context: any) => {
      if (!context?.vendor?.id) {
        throw new AuthenticationError('Unauthorized');
      }

      const vendor = await vendorModel.findById(context.vendor.id);
      if (!vendor) throw new Error("Vendor not found");

      return vendor;
    },

    getVendorById: async (_: any, { id }: any, context: any) => {
      const vendor = await vendorModel.findById(id).populate("actions");
    
      if (!vendor) {
        throw new Error("Vendor not found");
      }
    
      // Get vendor's products
      const products = await productModel.find({ seller: id });
    
      // Sort actions by most recent
      const actions = (vendor.actions || []).sort(
        (
          a: { performedAt: string | Date },
          b: { performedAt: string | Date }
        ) =>
          new Date(b.performedAt).getTime() - new Date(a.performedAt).getTime()
      );
    
      // Fetch all orders containing items sold by this vendor
      const orders = await OrderModel.find({ 'items.vendor': id });
    
      let totalSales = 0;
      const salesPerMonthMap: Record<string, number> = {};

      orders.forEach((order: any) => {
        order.items.forEach((item: {
          vendor: { toString: () => string };
          quantity: number;
        }) => {
          if (item.vendor.toString() === id.toString()) {
            totalSales += item.quantity;

            const date = new Date(order.createdAt);
            const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;

            salesPerMonthMap[monthKey] = (salesPerMonthMap[monthKey] || 0) + item.quantity;
          }
        });
      });

    
      const salesPerMonth = Object.entries(salesPerMonthMap).map(([month, total]) => ({
        month,
        total,
      }));
    
      // Calculate average rating across all vendor products
      const ratingSum = products.reduce((sum, p) => sum + (p.averageRating || 0), 0);
      const productCount = products.length;
      const ratingAverage = productCount ? ratingSum / productCount : null;
    
      const stats = {
        totalSales,
        productCount,
        ratingAverage,
        salesPerMonth,
      };
    
      return {
        ...vendor.toObject(),
        id: vendor._id.toString(),
        products,
        actions,
        stats,
      };
    },
    

    messages: async (_: any, { chatId }: { chatId: string }) => {
      return await messageModel.find({ chatId }).sort({ createdAt: 1 });
    },

    messagesBetween: async (_: any, { senderId, receiverId }: any) => {
      const chatId = [senderId, receiverId].sort().join("_");
      return await messageModel.find({ chatId }).sort({ createdAt: 1 });
    }
  },

  Mutation: {
    createVendor: async (_: any, args: { name: string; email: string; password: string }) => {
      const { name, email, password } = args;

      const existingVendor = await vendorModel.findOne({ email });
      if (existingVendor) {
        throw new Error('Vendor already exists with this email');
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newVendor = new vendorModel({
        name,
        email,
        password: hashedPassword,
        createdAt: new Date().toISOString(),
      });

      const savedVendor = await newVendor.save();
      return {
        id: savedVendor._id,
        name: savedVendor.name,
        email: savedVendor.email,
      };
    },

    loginVendor: async (_: any, { email, password }: any) => {
      const vendor = await vendorModel.findOne({ email });
      if (!vendor) {
        throw new Error('Invalid email or password');
      }

      const valid = await bcrypt.compare(password, vendor.password);
      if (!valid) {
        throw new Error('Invalid email or password');
      }
      if (vendor.status === "PENDING") {
        throw new Error("Account pending approval.");
      }
      if (vendor.status === "BANNED") {
        throw new Error("Account is banned.");
      }
      if (vendor.status === "SUSPENDED" && vendor.suspendedUntil && vendor.suspendedUntil > new Date()) {
        throw new Error(`Account suspended until ${vendor.suspendedUntil.toDateString()}.`);
      }

      if (vendor.status === "SUSPENDED" && vendor.suspendedUntil <= new Date()) {
        vendor.status = "APPROVED";
        vendor.suspendedUntil = null;
        await vendor.save();
      }
      
      

      const token = jwt.sign(
        { id: vendor._id, email: vendor.email, name: vendor.name, role: 'vendor' },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      const { password: ignored, ...safeVendor } = vendor.toObject();

      return {
        ...safeVendor,
        token,
      };
    },

    updateVendorProfile: async (_: any, args: any, context: any) => {
      if (!context?.vendor?.id) {
        throw new AuthenticationError('Unauthorized');
      }

      const {
        profilePicture,
        gender,
        joinedDate,
        businessCertificate,
        personalProfilePic,
        ...rest
      } = args;

      const updateData: Record<string, any> = {};

      if (profilePicture && profilePicture.startsWith("data:image")) {
        try {
          const uploadResponse = await cloudinary.uploader.upload(profilePicture, {
            folder: "vendor_profile_pictures",
          });
          updateData.profilePicture = uploadResponse.secure_url;
        } catch {
          throw new Error("Failed to upload profile picture");
        }
      } else if (profilePicture) {
        updateData.profilePicture = profilePicture;
      }

      if (businessCertificate && businessCertificate.startsWith("data:image")) {
        try {
          const uploadResponse = await cloudinary.uploader.upload(businessCertificate, {
            folder: "vendor_business_certificates",
          });
          updateData.businessCertificate = uploadResponse.secure_url;
        } catch {
          throw new Error("Failed to upload business certificate");
        }
      } else if (businessCertificate) {
        updateData.businessCertificate = businessCertificate;
      }

      if (personalProfilePic && personalProfilePic.startsWith("data:image")) {
        try {
          const uploadResponse = await cloudinary.uploader.upload(personalProfilePic, {
            folder: "vendor_personal_profile_pictures",
          });
          updateData.personalProfilePic = uploadResponse.secure_url;
        } catch {
          throw new Error("Failed to upload personal profile picture");
        }
      } else if (personalProfilePic) {
        updateData.personalProfilePic = personalProfilePic;
      }

      if (gender) updateData.gender = gender;
      if (joinedDate) updateData.joinedDate = joinedDate;

      const allowedFields = [
        "name", "storeName", "bio", "phone", "location", "address", "personalProfilePic",
        "businessName", "businessDescription", "businessAddress", "personalEmail",
        "businessOpeningTime", "businessClosingTime", "businessAvailability", "profileName"
      ];

      for (const key of allowedFields) {
        if (rest[key] !== undefined) {
          updateData[key] = rest[key];
        }
      }

      const updatedVendor = await vendorModel.findByIdAndUpdate(
        context.vendor.id,
        { $set: updateData },
        { new: true }
      );

      if (!updatedVendor) throw new Error("Vendor not found");

      return updatedVendor;
    },

    changeVendorPassword: async (_: any, { currentPassword, newPassword }: any, context: any) => {
      if (!context?.vendor?.id) {
        throw new AuthenticationError("Unauthorized");
      }

      const existingVendor = await vendorModel.findById(context.vendor.id);
      if (!existingVendor) {
        throw new Error("Vendor not found");
      }

      const isMatch = await bcrypt.compare(currentPassword, existingVendor.password);
      if (!isMatch) {
        throw new Error("Incorrect current password");
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      existingVendor.password = hashedPassword;
      await existingVendor.save();

      return true;
    },

    sendMessage: async (_: any, { senderId, receiverId, content }: any) => {
      const chatId = [senderId, receiverId].sort().join("_");
      const message = await messageModel.create({
        chatId,
        senderId,
        receiverId,
        content,
      });
    
      return message; // ✅ includes createdAt automatically
    }
    

  },


};
