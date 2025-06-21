import mongoose from "mongoose";

const vendorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    businessName: {
      type: String,
      required: false,
    },
    phone: {
      type: String,
      required: false,
    },
    address: {
      type: String,
      required: false,
    },
    role: {
      type: String,
      default: "vendor",
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

// Optional: Add index for better search (if needed)
// vendorSchema.index({ email: 1 });

export const Vendor = mongoose.models.Vendor || mongoose.model("Vendor", vendorSchema);


