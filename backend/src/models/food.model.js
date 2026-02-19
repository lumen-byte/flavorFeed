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
    }]
})
const foodModel = mongoose.model("Food", foodSchema);
export default foodModel;