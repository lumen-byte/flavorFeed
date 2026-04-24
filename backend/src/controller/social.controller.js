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

// Toggle Save a Reel
export async function toggleSaveReel(req, res) {
    try {
        const { foodId } = req.body;
        const userId = req.user._id;

        const user = await userModel.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        const isSaved = user.savedReels.includes(foodId);

        if (isSaved) {
            user.savedReels = user.savedReels.filter(id => id.toString() !== foodId.toString());
        } else {
            user.savedReels.push(foodId);
        }

        await user.save();

        res.status(200).json({
            message: isSaved ? "Removed from saved reels" : "Saved to reels",
            isSaved: !isSaved
        });
    } catch (err) {
        res.status(500).json({ message: "Error saving reel", error: err.message });
    }
}

// Toggle Save a Restaurant
export async function toggleSaveRestaurant(req, res) {
    try {
        const { partnerId } = req.body;
        const userId = req.user._id;

        const user = await userModel.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        const isSaved = user.savedRestaurants.includes(partnerId);

        if (isSaved) {
            user.savedRestaurants = user.savedRestaurants.filter(id => id.toString() !== partnerId.toString());
        } else {
            user.savedRestaurants.push(partnerId);
        }

        await user.save();

        res.status(200).json({
            message: isSaved ? "Removed from saved restaurants" : "Saved to restaurants",
            isSaved: !isSaved
        });
    } catch (err) {
        res.status(500).json({ message: "Error saving restaurant", error: err.message });
    }
}

// Get Saved Items (Populated)
export async function getSavedItems(req, res) {
    try {
        const userId = req.user._id;
        const user = await userModel.findById(userId)
            .populate({ path: 'savedReels', populate: { path: 'foodPartner', select: 'name address' } })
            .populate('savedRestaurants');

        res.status(200).json({
            savedReels: user.savedReels || [],
            savedRestaurants: user.savedRestaurants || []
        });
    } catch (err) {
        res.status(500).json({ message: "Error fetching saved items", error: err.message });
    }
}
