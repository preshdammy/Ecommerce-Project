import { usermodel } from "../../../database/model/usermodel";
import bcrypt from "bcryptjs";
import Jwt from "jsonwebtoken";

export const userresolver = {
  Query: {
    users: () => [
      { id: "1", name: "Alice", email: "alice@example.com", role: "user" },
      { id: "2", name: "Bob", email: "bob@example.com", role: "user" }
    ]
  }
};
