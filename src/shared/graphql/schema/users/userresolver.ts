import { usermodel } from "../../../database/model/user.model";
import bcrypt from "bcryptjs";
import Jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import { AuthenticationError } from "apollo-server-express";
import { ContextType } from "../../../context";

interface LeanUser {
  _id: string;
  name: string;
  profilePicture?: string;
}

export const userresolver = {
  Query: {
    users: async () => {
      return await usermodel.find().select("-password"); // exclude password
    },
    user: async (_: any, { id }: { id: string }) => {
      return await usermodel.findById(id).select("-password");
    },
    userChatList: async (_: any, { userId }: { userId: string }) => {
      const messages = await messageModel
        .find({ senderId: userId }) 
        .sort({ createdAt: -1 })
        .lean();
    
      const chatMap = new Map<string, typeof messages[0]>();
    
      for (const msg of messages) {
        if (!chatMap.has(msg.chatId)) {
          chatMap.set(msg.chatId, msg);
        }
      }
    
      const chatItems = [];
    
      for (const [chatId, latestMessage] of chatMap.entries()) {
        const vendorDoc = await vendorModel
          .findById(latestMessage.receiverId)
          .select("_id name profilePicture")
          .lean<LeanUser>();
    
        if (!vendorDoc) continue;
    
        chatItems.push({
          chatId,
          vendor: {
            id: vendorDoc._id.toString(),
            name: vendorDoc.name,
            profilePicture: vendorDoc.profilePicture ?? "", // handles null
          },
          latestMessage,
        });
      }
    
      return chatItems;
    },
    
     getUserProfile: async (
      _: unknown,
      __: unknown,
      context: ContextType
    ) => {
      if (!context.user?.email)
        throw new AuthenticationError("Not authenticated");

      const profile = await usermodel
        .findOne({ email: context.user.email })
        .select("-password");

      if (!profile) throw new Error("User not found");
      return profile;
    },
  },

  Mutation: {
   createuser: async (
  _: any,
  { name, username, email, password }: { name: string; username: string; email: string; password: string }
) => {
  try {
    const existingUser = await usermodel.findOne({ email });
    if (existingUser) {
      throw new Error("User already exists");
    }

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
      password:user.password
    };
  } catch (error: any) {
    throw new Error(error.message);
  }
},

    loginuser: async (
      _: any,
      { email, password }: { email: string; password: string }
    ) => {
      try {
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
          password: user.password,
          token,
        };
      } catch (error: any) {
        throw new Error(error.message);
      }
    },

 upsertProfile: async (_: unknown, { input }: { input: any }) => {
      if (!input?.id) throw new Error("User ID is required");

      let profilePicUrl = input.profilePicture;

      // ✅ Upload base64 images to Cloudinary
      if (profilePicUrl && profilePicUrl.startsWith("data:image")) {
        try {
          const uploadRes = await cloudinary.uploader.upload(profilePicUrl, {
            folder: "user_profile_pictures",
          });
          profilePicUrl = uploadRes.secure_url;
        } catch (err) {
          console.error("Cloudinary Upload Error:", err);
          throw new Error("Failed to upload profile picture");
        }
      }  

      // ✅ Update only if user exists
      const updatedUser = await usermodel
        .findByIdAndUpdate(
          input.id,
          { $set: { ...input, profilePicture: profilePicUrl } },
          { new: true, upsert: false }
        )
        .select("-password");
if (profilePicUrl) {
        updatedUser.personalProfilePic = profilePicUrl;
      }
      if (!updatedUser)
        throw new Error("User not found or failed to update profile");

      return updatedUser;
    },


    deleteuser: async (_: any, { id }: { id: string }) => {
      try {
        const deleted = await usermodel.findByIdAndDelete(id);
        return !!deleted;
      } catch (error: any) {
        throw new Error(error.message);
      }
    },
  },
};
