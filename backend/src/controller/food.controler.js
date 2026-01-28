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

export async function getFoodItems(req, res) {
    try {
        // Fetch all food and "populate" partner details if needed
        const foodItems = await foodModel.find({});
        
        res.status(200).json({
            success: true,
            foodItems
        });
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch food items", error: err.message });
    }
}