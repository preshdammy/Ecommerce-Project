import mongoose, { Schema, model, models } from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  profilePicture: { type: String },
  address: { type: String },
  state: { type: String },
  city: { type: String },
  gender: { type: String },
  dateOfBirth: { type: Date} 
}, { timestamps: true });



export const usermodel = models.usercollection || model("usercollection", userSchema);
