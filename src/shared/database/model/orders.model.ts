import mongoose, { Schema, Document } from "mongoose";

export interface IOrder extends Document {
  product: mongoose.Types.ObjectId;
  buyer: mongoose.Types.ObjectId;
  vendor: mongoose.Types.ObjectId;
  quantity: number;
  totalAmount: number;
  status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<IOrder>(
  {
    product: { type: Schema.Types.ObjectId, ref: "products", required: true },
    buyer: { type: Schema.Types.ObjectId, ref: "usercollection", required: true },
    vendor: { type: Schema.Types.ObjectId, ref: "vendor_collection", required: true },
    quantity: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);

export const OrderModel = mongoose.models.orders || mongoose.model<IOrder>("orders", orderSchema);

