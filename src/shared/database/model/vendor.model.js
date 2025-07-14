import mongoose, { Schema, model, models } from "mongoose";

const VendorSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  storeName: { type: String },
  personalEmail: { type: String },
  personalProfilePic: { type: String },
  profileName: { type: String },
  profilePicture: { type: String },
  bio: { type: String },
  phone: { type: String },
  location: { type: String },
  gender: { type: String },
  joinedDate: { type: String },
  address: {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    zip: { type: String },
    country: { type: String },
  },
  businessName: { type: String },
  businessDescription: { type: String },
  businessAddress: { type: String },
  businessCertificate: { type: String },
  businessOpeningTime: { type: String },
  businessClosingTime: { type: String },
  businessAvailability: { type: String },

}, { timestamps: true });

export const vendorModel = models.vendor_collection || model("vendor_collection", VendorSchema);
