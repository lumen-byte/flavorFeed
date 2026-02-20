import foodPartnerModel from "../models/foodpartner.model.js";
import userModel from "../models/user.model.js"; // ADD THIS IMPORT
import jwt from "jsonwebtoken";

export async function authFoodPartnerMiddleware(req, res, next) {
    const token = req.cookies.partner_token;
    if (!token) {
        return res.status(401).json({
            message: "please login as a food partner to access this resource"
        })
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const foodPartner = await foodPartnerModel.findById(decoded.id);
        if (!foodPartner) {
            return res.status(401).json({ message: "Food partner account not found. Please login as a food partner." });
        }
        req.foodPartner = foodPartner;
        next();
    }
    catch (err) {
        return res.status(401).json({
            message: "invalid token"
        })
    }
}
export async function authUserMiddleware(req, res, next) {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: "please login to access this resource" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // ✅ THE FIX: Use userModel, not foodPartnerModel
        const user = await userModel.findById(decoded.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        req.user = user;
        next();
    } catch (err) {
        return res.status(401).json({ message: "invalid token" });
    }
}