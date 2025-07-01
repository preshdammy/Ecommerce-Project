import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'usercollection', required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'products', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
}, { timestamps: true });

export const reviewModel = mongoose.models.review || mongoose.model("review", reviewSchema);
