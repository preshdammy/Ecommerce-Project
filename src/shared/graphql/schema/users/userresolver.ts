import { usermodel } from "../../../database/model/usermodel";
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
      { username, email, password }: { username: string; email: string; password: string }
    ) => {
      try {
        const existingUser = await usermodel.findOne({ email });
        if (existingUser) {
          throw new Error("User already exists");
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await usermodel.create({ username, email, password: hashedPassword });

        return {
          id: user._id,
          username: user.username,
          email: user.email
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

        const token = await Jwt.sign({ id: user._id, email: user.email }, "fNTji_M6acuUmbNc9iOIsMKPVcc", {
          expiresIn: "1d",
        });
         console.log(token, "token");
         if (token) {
          return {
            id: user._id,
            email: user.email,
            password:user.password,
            token,
          };
         }
      } catch (error: any) {
        throw new Error(error.message);
      }
    },
  },
}