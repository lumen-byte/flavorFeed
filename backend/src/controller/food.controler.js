import foodModel from "../models/food.model.js";
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

        const foodItem = await foodModel.create({
            name: req.body.name,
            description: req.body.description,
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
        } else if (type === 'global') {
            // Randomize or just latest for now
            query = {};
        }

        const foodItems = await foodModel.find(query).populate('foodPartner', 'name location');

        // If global, maybe shuffle randomly
        if (type === 'global') {
            // Simple Shuffle
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