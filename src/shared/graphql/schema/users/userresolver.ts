import { usermodel } from "../../../database/model/user.model";
import bcrypt from "bcryptjs";
import Jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import { AuthenticationError } from "apollo-server-express";
import { ContextType } from "../../../context";

// ✅ Configure Cloudinary (important to avoid "cloud_name is disabled" error)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const userresolver = {
  Query: {
    users: async () => {
      return await usermodel.find().select("-password");
    },

    user: async (_: unknown, { id }: { id: string }) => {
      if (!id) throw new Error("User ID is required");
      return await usermodel.findById(id).select("-password");
    },

    getUserProfile: async (_: unknown, __: unknown, context: ContextType) => {
      if (!context.user?.email) throw new AuthenticationError("Not authenticated");

      const profile = await usermodel
        .findOne({ email: context.user.email })
        .select("-password");

      if (!profile) throw new Error("User not found");
      return profile;
    },
  },

  Mutation: {
    createuser: async (
      _: unknown,
      { name, username, email, password }: { name: string; username: string; email: string; password: string }
    ) => {
      if (!name || !username || !email || !password)
        throw new Error("All fields are required");

      const existingUser = await usermodel.findOne({ email });
      if (existingUser) throw new Error("User already exists");

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await usermodel.create({
        name,
        username,
        email,
        password: hashedPassword,
      });

      return {
        id: user._id,
        name: user.name,
        email: user.email,
      };
    },

    loginuser: async (_: unknown, { email, password }: { email: string; password: string }) => {
      if (!email || !password) throw new Error("Email and password are required");

      const user = await usermodel.findOne({ email });
      if (!user) throw new Error("Invalid credentials");

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) throw new Error("Invalid credentials");

      const token = Jwt.sign(
        { id: user._id, email: user.email, name: user.name, role: "user" },
        process.env.secret_key!,
        { expiresIn: "1d" }
      );

      return {
        id: user._id,
        name: user.name,
        email: user.email,
        token,
      };
    },

    upsertProfile: async (_: unknown, { input }: { input: any }) => {
      if (!input?.id) throw new Error("User ID is required");

      let profilePicUrl = input.profilePicture;

      // ✅ Upload to Cloudinary only if it's base64
      if (profilePicUrl && profilePicUrl.startsWith("data:image")) {
        try {
          const uploadRes = await cloudinary.uploader.upload(profilePicUrl, {
            folder: "user_profile_pict",
          });
          profilePicUrl = uploadRes.secure_url;
        } catch (err) {
          console.error("Cloudinary Upload Error:", err);
          throw new Error("Failed to upload profile picture");
        }
      }

      // ✅ Prepare update object
      const updateData = {
        ...input,
        profilePicture: profilePicUrl || input.profilePicture,
      };

      const updatedUser = await usermodel
        .findByIdAndUpdate(input.id, { $set: updateData }, { new: true, upsert: false })
        .select("-password");

      if (!updatedUser) throw new Error("User not found or failed to update profile");

      return updatedUser;
    },

    deleteuser: async (_: unknown, { id }: { id: string }) => {
      if (!id) throw new Error("User ID is required");
      const deleted = await usermodel.findByIdAndDelete(id);
      return !!deleted;
    },
  },
};
