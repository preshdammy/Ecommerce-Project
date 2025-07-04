import mongoose, { Schema, model, models } from "mongoose";

const ComplaintSchema = new Schema({
  message:      { type: String, required: true },
  user:         { type: mongoose.Types.ObjectId, ref: "usercollection" },
  vendor:       { type: mongoose.Types.ObjectId, ref: "vendor_collection" },
  createdAt:    { type: Date, default: Date.now },
}, { timestamps: true });

export const complaintModel = models.complaint_collection || model("complaint_collection", ComplaintSchema);
