// import foodModel from "../models/food.model.js";

export async function createFood(req, res) {
    try {
        // You can now access the foodPartner attached by your middleware
        console.log("Creating food for partner:", req.foodPartner);
        
        // Example logic to save to database
        // const newFood = await foodModel.create({ ...req.body, foodPartner: req.foodPartner._id });

        res.status(201).send("food item created");
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// export default { createFood };
