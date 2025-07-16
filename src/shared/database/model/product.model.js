import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
    name: {type: String, required: true},
    description: {type: String, required: true},
    extendedDescription: {type: String},
    price: {type: Number, required: true},
    category: {type: String, required: true},
    minimumOrder: { type: Number, required: true, default: 1 },
    color: { type: String },
    subCategory: { type: String },
    slug: {type:String, required: true},
    categorySlug: { type: String },
    condition: { type: String, enum: ['new', 'used'], required: true },
    images: [{type: String, required: true}],
    stock: {type: Number, required: true, default: 0, min: 0},
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'vendor_collection', required: true },
    averageRating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'review' }],
    isFeatured: { type: Boolean, default: false },
    originalPrice: { type: Number }

}, {timestamps: true})

export const productModel = mongoose.models.products || mongoose.model("products", productSchema)
