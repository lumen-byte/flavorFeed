import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    foodPartner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "FoodPartner",
        required: true
    },
    items: [
        {
            foodId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Food",
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                min: 1
            },
            price: {
                type: Number,
                required: true
            }
        }
    ],
    totalAmount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ["Pending", "Preparing", "Out_for_delivery", "Delivered", "Cancelled"],
        default: "Pending"
    },
    paymentStatus: {
        type: String,
        enum: ["Pending", "Paid", "Failed"],
        default: "Pending"
    },
    address: {
        type: String,
        required: true
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    }
}, { timestamps: true });

const orderModel = mongoose.model("Order", orderSchema);
export default orderModel;
