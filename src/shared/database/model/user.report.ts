import mongoose, { Schema, Document, Model } from "mongoose";

const reportSchema = new Schema(
  {
    reportType: { type: String, enum: ["user", "vendor"], required: true },
    reportedId: { type: mongoose.Schema.Types.ObjectId, required: true },
    targetName: { type: String, required: true },
    reason: { type: String, required: true },
    reportedBy: { type: String, required: true },
    reporterType: { type: String, enum: ["user", "vendor"], default: "user" },
    status: { type: String, enum: ["pending", "reviewed", "resolved"], default: "pending" },
    adminReply: { type: String },
  },
  { timestamps: true }
);
export const ReportModel = mongoose.models.report || mongoose.model("report", reportSchema)