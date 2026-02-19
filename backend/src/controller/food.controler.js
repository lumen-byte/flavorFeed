import foodModel from "../models/food.model.js";
import foodPartnerModel from "../models/foodpartner.model.js";
import * as storageService from "../services/storage.service.js";
import jwt from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';

export async function createFood(req, res) {
    try {
        // Validation: Prevent 500 errors if file is missing
        if (!req.file) {
            return res.status(400).json({ message: "Video file is required" });
        }

        const fileUploadResult = await storageService.uploadFile(req.file.buffer, uuid());

        console.log("CreateFood: Partner ID:", req.foodPartner?._id);

        const foodItem = await foodModel.create({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            video: fileUploadResult.url,
            // FIX: Access ID from req.foodPartner (attached by middleware)
            foodPartner: req.foodPartner._id
        });

        res.status(201).json({
            message: "Food created successfully",
            food: foodItem
        });
    } catch (err) {
        console.error("Create Food Error:", err);
        return res.status(500).json({
            message: "Internal Server Error",
            error: err.message
        });
    }
}

// Get Food for Logged-in Partner
export async function getPartnerFoodItems(req, res) {
    try {
        const partnerId = req.foodPartner._id; // set by middleware
        const foodItems = await foodModel.find({ foodPartner: partnerId });
        res.status(200).json({ foodItems });
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch your food", error: err.message });
    }
}

// Delete Food
export async function deleteFood(req, res) {
    try {
        const { id } = req.params;
        const partnerId = req.foodPartner._id;

        const food = await foodModel.findOneAndDelete({ _id: id, foodPartner: partnerId });

        if (!food) {
            return res.status(404).json({ message: "Food not found or unauthorized" });
        }

        res.status(200).json({ message: "Food deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Failed to delete food", error: err.message });
    }
}

// Update Food
export async function updateFood(req, res) {
    try {
        const { id } = req.params;
        const partnerId = req.foodPartner._id;
        const { name, description, price } = req.body;

        const food = await foodModel.findOneAndUpdate(
            { _id: id, foodPartner: partnerId },
            { name, description, price },
            { new: true }
        );

        if (!food) {
            return res.status(404).json({ message: "Food not found or unauthorized" });
        }

        res.status(200).json({ message: "Food updated successfully", food });
    } catch (err) {
        res.status(500).json({ message: "Failed to update food", error: err.message });
    }
}

// Get Food Items (Global or Nearby)
export async function getFoodItems(req, res) {
    try {
        const { type, lat, long } = req.query;
        let query = {};

        if (type === 'nearby' && lat && long) {
            // Find partners within 10km
            const nearbyPartners = await foodPartnerModel.find({
                location: {
                    $near: {
                        $geometry: {
                            type: "Point",
                            coordinates: [parseFloat(long), parseFloat(lat)]
                        },
                        $maxDistance: 10000 // 10km in meters
                    }
                }
            }).select('_id');

            const partnerIds = nearbyPartners.map(p => p._id);
            query = { foodPartner: { $in: partnerIds } };
        }

        // For global, query stays empty {} to get all foods

        const foodItems = await foodModel.find(query).populate('foodPartner', 'name location');

        // If global, shuffle randomly
        if (type === 'global') {
            for (let i = foodItems.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [foodItems[i], foodItems[j]] = [foodItems[j], foodItems[i]];
            }
        }

        res.status(200).json({
            success: true,
            foodItems
        });
    } catch (err) {
        console.error("Get Food Error:", err);
        res.status(500).json({ message: "Failed to fetch food items", error: err.message });
    }
}