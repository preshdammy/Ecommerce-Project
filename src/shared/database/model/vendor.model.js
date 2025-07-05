
import mongoose, { Schema, model, models } from "mongoose";

const VendorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  storeName: { type: String },
  avatar: { type: String },
  bio: { type: String },
  phone: { type: String },
  location: { type: String },
  address: {
    street: String,
    city: String,
    state: String,
    zip: String,
    country: String,
  },
}, { timestamps: true });

export const vendorModel = models.vendor_collection || model("vendor_collection", VendorSchema);

