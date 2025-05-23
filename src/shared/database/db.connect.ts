import mongoose from "mongoose"

const MONGO_URI = process.env.MONGODB!

export const connect = async() => {
    try {
       const connection = await mongoose.connect(MONGO_URI)
       if (connection) {
        console.log("database connected successfully");
        
       }
    } catch (error) {
        console.log(error);
        
    }
}
