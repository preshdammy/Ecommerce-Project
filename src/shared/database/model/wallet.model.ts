import mongoose, { Schema, model, models } from "mongoose";

const WalletTransactionSchema = new mongoose.Schema({
    user: { type: Schema.Types.ObjectId, ref: "usercollection", required: true },
    type: { type: String, enum: ["CREDIT", "DEBIT"], required: true },
    amount: { type: Number, required: true },
    description: String,
    status: { type: String, enum: ["PENDING", "SUCCESS", "FAILED"], default: "SUCCESS" },
    createdAt: { type: Date, default: Date.now },
    reference: { type: String, default: null },
  });

  export const walletmodel = models.walletcollection || model("walletcollection", WalletTransactionSchema);
  
  