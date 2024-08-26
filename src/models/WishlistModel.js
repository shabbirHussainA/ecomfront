import mongoose, { Schema } from "mongoose";

// Wishlist Schema
const WishlistSchema = new Schema({
    productName: {
        type: String,
        required: true
    },
    unitPrice: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    stockStatus: {
        type: String,
        required: true
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    }
});

const WishlistModel = mongoose.models.Wishlist || mongoose.model("Wishlist", WishlistSchema);
export default WishlistModel;
