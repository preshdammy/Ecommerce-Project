import { vendorModel } from '@/shared/database/model/vendor.model';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AuthenticationError } from 'apollo-server-express';

const JWT_SECRET = process.env.JWT_SECRET!;

export const VendorResolver = {
  Query: {
    vendors: async () => {
      return await vendorModel.find();
    },

    getVendorProfile: async (_: any, __: any, context: any) => {
      if (!context.user) throw new AuthenticationError('Unauthorized');
      const vendor = await vendorModel.findById(context.user.id);
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
    createvendor: async (_: any, args: any) => {
      const existingVendor = await vendorModel.findOne({ email: args.email });
      if (existingVendor) {
        throw new Error('Vendor already exists with this email');
      }

      const hashedPassword = await bcrypt.hash(args.password, 10);

      const newVendor = new vendorModel({
        ...args,
        password: hashedPassword,
        createdAt: new Date().toISOString(),
      });

      const savedVendor = await newVendor.save();
      return savedVendor;
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
        { id: vendor._id, email: vendor.email },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return {
        ...vendor.toObject(),
        token,
      };
    },

    updateVendorProfile: async (_: any, args: any) => {
        //   if (!context.user) throw new AuthenticationError('Unauthorized');
        const { email, ...rest } = args;

        if (!email) {
          throw new Error("Email is required for updating vendor");
        }
      
        const allowedFields = [
          'name',
          'storeName',
          'avatar',
          'bio',
          'phone',
          'location',
          'address'
        ];
      
        const updateData: Record<string, any> = {};
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
      
        if (!updatedVendor) {
          throw new Error('Vendor not found');
        }
      
        return updatedVendor;
      },

  },
};
