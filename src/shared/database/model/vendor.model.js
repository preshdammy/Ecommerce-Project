import mongoose, { Schema, Document } from 'mongoose';

const VendorSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    isBanned: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Vendor || mongoose.model('Vendor', VendorSchema);
