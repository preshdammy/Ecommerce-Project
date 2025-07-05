<<<<<<< HEAD
import mongoose from "mongoose"

const MONGO_URI = process.env.MONGODB!

export const connect = async () => {
    console.log("Attempting to connect to database...");
    try {
      const connection = await mongoose.connect(MONGO_URI);
      if (connection) {
        console.log("database connected successfully");
      }
    } catch (error) {
      console.log("Connection error:", error);
    }
  };
  
=======
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGODB;

export const connect = async () => {
  try {
    if (!MONGO_URI) {
      throw new Error("MONGO_URI is undefined. Check your .env.local file.");
    }

    const connection = await mongoose.connect(MONGO_URI);
    if (connection) {
      console.log(" Database connected successfully");
    }
  } catch (error) {
    console.error(" MongoDB connection failed:", error);
    process.exit(1);
  }
};
>>>>>>> 47e93d3dd353694d0eae13fd75ed00a429d61477
