import userModel from "../models/user.model.js";
import commentModel from "../models/comment.model.js";
import foodModel from "../models/food.model.js";

// Like a Food/Reel
// Toggle Like a Food/Reel
export async function likeReel(req, res) {
    try {
        const { foodId } = req.body;
        const userId = req.user._id;

        const food = await foodModel.findById(foodId);
        const user = await userModel.findById(userId);

        if (!food || !user) return res.status(404).json({ message: "Not found" });

        const isLiked = food.likes.includes(userId);

        if (isLiked) {
            // Unlike
            food.likes = food.likes.filter(id => id.toString() !== userId.toString());
            user.likes = user.likes.filter(id => id.toString() !== foodId.toString());
        } else {
            // Like
            food.likes.push(userId);
            user.likes.push(foodId);
        }

        await food.save();
        await user.save();

        res.status(200).json({
            message: isLiked ? "Unliked" : "Liked",
            likesCount: food.likes.length,
            isLiked: !isLiked
        });
    } catch (err) {
        res.status(500).json({ message: "Error liking reel", error: err.message });
    }
}

// See if user liked specific reel - helper (optional, can be part of user profile)

// Comment on a Food/Reel
export async function addComment(req, res) {
    try {
        const { foodId, text } = req.body;
        const userId = req.user._id;

        const comment = await commentModel.create({
            user: userId,
            food: foodId,
            text
        });

        const populatedComment = await comment.populate('user', 'fullName');

        // Add to Food's comments array
        await foodModel.findByIdAndUpdate(foodId, {
            $push: { comments: comment._id }
        });

        res.status(201).json({ message: "Comment added", comment: populatedComment });
    } catch (err) {
        res.status(500).json({ message: "Error adding comment", error: err.message });
    }
}

// Get Comments for a Reel
export async function getComments(req, res) {
    try {
        const { foodId } = req.params;
        const comments = await commentModel.find({ food: foodId })
            .populate('user', 'fullName')
            .sort({ createdAt: -1 });

        res.status(200).json({ comments });
    } catch (err) {
        res.status(500).json({ message: "Error fetching comments", error: err.message });
    }
}
