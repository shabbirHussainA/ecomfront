import mongoose, { Schema } from "mongoose";

// Cart Schema
const CartSchema = new Schema({
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

const CartModel = mongoose.models.Cart || mongoose.model("Cart", CartSchema);
export default CartModel;
