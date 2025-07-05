
import mongoose from 'mongoose';
const schema = new mongoose.Schema({
  adminId:      { type: mongoose.Types.ObjectId, required: true, unique: true },
  token:       { type: String, required: true },
  expires:     { type: Number, required: true },
});
export const resetModel = mongoose.models.ResetToken || mongoose.model('ResetToken', schema);
