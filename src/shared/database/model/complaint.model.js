import mongoose, { Schema, model, models } from "mongoose";

const ComplaintSchema = new Schema(
  {
    message:    { type: String, required: true },
    status:     { 
      type: String, 
      enum: ["Pending", "In Review", "Resolved", "Closed"], 
      default: "Pending" 
    },
    user:       { type: mongoose.Types.ObjectId, ref: "usercollection" },
    vendor:     { type: mongoose.Types.ObjectId, ref: "vendor_collection" },

  },
  { timestamps: true }
);

export const complaintModel =
  models.complaint_collection || model("complaint_collection", ComplaintSchema);
