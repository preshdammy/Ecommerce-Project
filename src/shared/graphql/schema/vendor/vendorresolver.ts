import { vendorModel } from '@/shared/database/model/vendor.model';
import bcrypt from 'bcryptjs';
import cloudinary from '@/shared/utils/cloudinary';
import jwt from 'jsonwebtoken';
import { AuthenticationError } from 'apollo-server-express';

const JWT_SECRET = process.env.secret_key!;

export const VendorResolver = {
  Query: {
    vendors: async () => {
      return await vendorModel.find();
    },

    getVendorProfile: async (_: any, __: any, context: any) => {
      if (!context.vendor) throw new AuthenticationError('Unauthorized');
      const vendor = await vendorModel.findById(context.vendor.id);
      return vendor;
    },

    getVendorById: async (_: any, { id }: any) => {
        const vendor = await vendorModel.findById(id);
        if (!vendor) {
          throw new Error('Vendor not found');
        }
        return vendor;
      },
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

      const token = jwt.sign(
        { id: vendor._id, email: vendor.email, name: vendor.name, role: 'vendor' },
        JWT_SECRET,
        { expiresIn: '7d' }
      );
      console.log(token);
      

      return {
        ...vendor.toObject(),
        token,
      };
    },

    updateVendorProfile: async (_: any, args: any) => {
        const { email, avatar, ...rest } = args;
      
        if (!email) throw new Error("Email is required for updating vendor");
      
        const updateData: Record<string, any> = {};
      
        // Upload avatar to Cloudinary if it's a base64 or local file path
        if (avatar && avatar.startsWith("data:image")) {
          try {
            const uploadResponse = await cloudinary.uploader.upload(avatar, {
              folder: "vendor_avatars",
            });
            updateData.avatar = uploadResponse.secure_url;
          } catch (err) {
            throw new Error("Failed to upload avatar");
          }
        } else if (avatar) {
          updateData.avatar = avatar; // assume it's already a valid URL
        }
      
        // Merge other updatable fields
        const allowedFields = [
          "name",
          "storeName",
          "bio",
          "phone",
          "location",
          "address",
        ];
      
        for (const key of allowedFields) {
          if (rest[key] !== undefined) {
            updateData[key] = rest[key];
          }
        }
      
        const updatedVendor = await vendorModel.findOneAndUpdate(
          { email },
          { $set: updateData },
          { new: true }
        );
      
        if (!updatedVendor) throw new Error("Vendor not found");
      
        return updatedVendor;
      },

  },
};
