import { usermodel } from "../../../database/model/user.model";
import bcrypt from "bcryptjs";
import Jwt from "jsonwebtoken";

export const userresolver = {
  Query: {
    users: async () => {
      return await usermodel.find().select("-password"); // exclude password
    },
    user: async (_: any, { id }: { id: string }) => {
      return await usermodel.findById(id).select("-password");
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

 updateuser: async (_: any, { input }: { input: any }) => {
  try {
    const {
      id,
      name,
      email,
      password,
      address,
      state,
      city,
      gender,
      dateOfBirth,
      profilePicture,
    } = input;

    const updates: any = {};
    if (name) updates.name = name;
    if (email) updates.email = email;
    if (password) updates.password = await bcrypt.hash(password, 10);
    if (address) updates.address = address;
    if (state) updates.state = state;
    if (city) updates.city = city;
    if (gender) updates.gender = gender;
    if (dateOfBirth) updates.dateOfBirth = dateOfBirth;
    if (profilePicture) updates.profilePicture = profilePicture;

    const updatedUser = await usermodel
      .findByIdAndUpdate(id, updates, { new: true })
      .select("-password");

    if (!updatedUser) throw new Error("User not found");

 return {
  id: updatedUser._id,
  name: updatedUser.name,
  email: updatedUser.email,
  address: updatedUser.address,
  state: updatedUser.state,
  city: updatedUser.city , 
  gender: updatedUser.gender,
  dateOfBirth: updatedUser.dateOfBirth, 
  profilePicture: updatedUser.profilePicture ,
};


  } catch (error: any) {
    throw new Error(error.message);
  }
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