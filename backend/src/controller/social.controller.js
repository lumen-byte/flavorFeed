import userModel from "../models/user.model.js";
import commentModel from "../models/comment.model.js";

// Like a Food/Reel
export async function likeReel(req, res) {
    try {
        const { foodId } = req.body;
        const userId = req.user._id;

        const user = await userModel.findById(userId);
        if (!user.likes.includes(foodId)) {
            user.likes.push(foodId);
            await user.save();
        }

        res.status(200).json({ message: "Liked successfully", likes: user.likes });
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
