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
  dateOfBirth: { type: Date },
  walletBalance: { type: Number, default: 0 },
  status: {
    type: String,
    enum: [ "ACTIVE", "SUSPENDED", "BANNED"],
    default: "ACTIVE",
  },
  suspendedUntil: {
    type: Date,
    default: null,
  },
  actions: [
    {
      action: String, 
      performedBy: String,
      performedAt: Date,
      notes: String,
    },
  ],
}, { timestamps: true });

export const usermodel = models.usercollection || model("usercollection", userSchema);