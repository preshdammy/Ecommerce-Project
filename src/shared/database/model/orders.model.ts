import mongoose, { Schema, Document } from "mongoose";

export interface IOrderItem {
  product: mongoose.Types.ObjectId;
  vendor: mongoose.Types.ObjectId;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface IShippingAddress {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface IOrder extends Document {
  items: IOrderItem[];
  buyer: mongoose.Types.ObjectId;
  vendors: mongoose.Types.ObjectId[];
  totalAmount: number;
  shippingFee: number;
  shippingAddress: IShippingAddress;
  paymentMethod: string;
  paymentStatus: "UNPAID" | "PENDING" | "PAID" | "FAILED";
  manualOverride: boolean;
  paystackReference?: string;
  paystackSplitCode?: string;
  status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  createdAt: Date;
  updatedAt: Date;
  shippedAt: Date;
  deliveredAt: Date;
}

const orderItemSchema = new Schema<IOrderItem>(
  {
    product: { type: Schema.Types.ObjectId, ref: "products", required: true },
    vendor: { type: Schema.Types.ObjectId, ref: "vendor_collection", required: true },
    quantity: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
    lineTotal: { type: Number, required: true },
  },
  { _id: false }
);

const shippingAddressSchema = new Schema<IShippingAddress>(
  {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
  },
  { _id: false }
);

const orderSchema = new Schema<IOrder>(
  {
    items: [orderItemSchema],
    buyer: { type: Schema.Types.ObjectId, ref: "usercollection", required: true },
    vendors: [{ type: Schema.Types.ObjectId, ref: "vendor_collection" }],
    totalAmount: { type: Number, required: true },
    shippingFee: { type: Number, required: true },
    shippingAddress: { type: shippingAddressSchema, required: true },
    paymentMethod: { type: String, enum: ["POD", "PAYSTACK_CARD", "PAYSTACK_TRANSFER", "PAYSTACK_USSD", "PAYSTACK_MOBILE_MONEY", "PAYSTACK_QR"], required: true },
    paymentStatus: { type: String, enum: ["UNPAID", "PENDING", "PAID", "FAILED"], default: "UNPAID" },
    paystackReference: { type: String },
    paystackSplitCode: { type: String },
    status: {
      type: String,
      enum: ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"],
      default: "PENDING",
    },
    manualOverride: {
      type: Boolean,
      default: false,
    },
    shippedAt: {
      type: Date,
      default: null,
    },
    deliveredAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export const OrderModel = mongoose.models.orders || mongoose.model<IOrder>("orders", orderSchema);
