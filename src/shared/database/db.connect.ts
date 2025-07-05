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
  