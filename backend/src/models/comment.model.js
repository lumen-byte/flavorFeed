import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    food: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Food",
        required: true
    },
    text: {
        type: String,
        required: true
    }
}, { timestamps: true });

const commentModel = mongoose.model("Comment", commentSchema);
export default commentModel;
