import mongoose from "mongoose";
const foodSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    video: {
        type: String,
        required: true
    },
    thumbnail: {
        type: String
    },
    description: {
        type: String,
        required: true
    },
    foodPartner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "FoodPartner"
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    price: {
        type: Number,
        required: true
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }],
    hashtags: [{
        type: String,
        trim: true
    }],
    addOns: [{
        name: { type: String, required: true },
        price: { type: Number, required: true },
        maxQuantity: { type: Number, default: 1 }
    }],
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });
const foodModel = mongoose.model("Food", foodSchema);
export default foodModel;