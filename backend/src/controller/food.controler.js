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

        // Parse Hashtags
        const extractedHashtags = req.body.description ? req.body.description.match(/#[a-zA-Z0-9_]+/g) || [] : [];
        const parsedAddOns = req.body.addOns ? JSON.parse(req.body.addOns) : [];

        const foodItem = await foodModel.create({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            video: fileUploadResult.url,
            // FIX: Access ID from req.foodPartner (attached by middleware)
            foodPartner: req.foodPartner._id,
            hashtags: extractedHashtags,
            addOns: parsedAddOns
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
        const foodItems = await foodModel.find({ foodPartner: partnerId, isActive: { $ne: false } });
        res.status(200).json({ foodItems });
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch your food", error: err.message });
    }
}

// Delete Food (Soft Delete)
export async function deleteFood(req, res) {
    try {
        const { id } = req.params;
        const partnerId = req.foodPartner._id;

        const food = await foodModel.findOneAndUpdate(
            { _id: id, foodPartner: partnerId },
            { isActive: false },
            { new: true }
        );

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

        // Parse Hashtags
        const extractedHashtags = description ? description.match(/#[a-zA-Z0-9_]+/g) || [] : [];
        const parsedAddOns = req.body.addOns ? JSON.parse(req.body.addOns) : undefined; // Optional update

        const updatePayload = { name, description, price, hashtags: extractedHashtags };
        if (parsedAddOns !== undefined) {
            updatePayload.addOns = parsedAddOns;
        }

        const food = await foodModel.findOneAndUpdate(
            { _id: id, foodPartner: partnerId },
            updatePayload,
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
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page - 1) * limit;

        let query = { isActive: { $ne: false } };

        if (type === 'nearby' && lat && long) {
            // Find partners within 15km (Zone Delivery limit)
            const nearbyPartners = await foodPartnerModel.find({
                location: {
                    $near: {
                        $geometry: {
                            type: "Point",
                            coordinates: [parseFloat(long), parseFloat(lat)]
                        },
                        $maxDistance: 15000 // 15km in meters
                    }
                }
            }).select('_id');

            const partnerIds = nearbyPartners.map(p => p._id);
            query.foodPartner = { $in: partnerIds };
        }

        const totalItems = await foodModel.countDocuments(query);

        // Fetch paginated, sorted by newest to ensure stable pagination without duplicates
        const foodItems = await foodModel.find(query)
            .populate('foodPartner', 'name location attribute averageRating openingTime closingTime')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        // Add distance to the response if lat/long provided
        let foodsWithDistance = foodItems;
        if (lat && long) {
            const userLat = parseFloat(lat);
            const userLong = parseFloat(long);

            // Haversine formula
            const getDistance = (lat1, lon1, lat2, lon2) => {
                const R = 6371; // km
                const dLat = (lat2 - lat1) * (Math.PI / 180);
                const dLon = (lon2 - lon1) * (Math.PI / 180);
                const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
                    Math.sin(dLon / 2) * Math.sin(dLon / 2);
                const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                return R * c;
            };

            foodsWithDistance = foodItems.map(food => {
                const foodObj = food.toObject();
                if (food.foodPartner && food.foodPartner.location && food.foodPartner.location.coordinates) {
                    const [pLong, pLat] = food.foodPartner.location.coordinates;
                    foodObj.distance = getDistance(userLat, userLong, pLat, pLong);
                } else {
                    foodObj.distance = null;
                }
                return foodObj;
            });
        }

        res.status(200).json({
            success: true,
            foodItems: foodsWithDistance,
            currentPage: page,
            totalPages: Math.ceil(totalItems / limit),
            hasMore: skip + foodItems.length < totalItems
        });
    } catch (err) {
        console.error("Get Food Error:", err);
        res.status(500).json({ message: "Failed to fetch food items", error: err.message });
    }
}