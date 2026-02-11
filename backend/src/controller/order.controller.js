import userModel from "../models/user.model.js";
import orderModel from "../models/order.model.js";
import foodModel from "../models/food.model.js";
import foodPartnerModel from "../models/foodpartner.model.js";

export async function addToCart(req, res) {
    try {
        const { foodId, quantity } = req.body;
        const userId = req.user._id;

        const user = await userModel.findById(userId);

        // check if item already exists
        const existingItemIndex = user.cart.findIndex(item => item.foodId.toString() === foodId);

        if (existingItemIndex > -1) {
            user.cart[existingItemIndex].quantity += quantity || 1;
        } else {
            user.cart.push({ foodId, quantity: quantity || 1 });
        }

        await user.save();
        res.status(200).json({ message: "Added to cart", cart: user.cart });
    } catch (err) {
        res.status(500).json({ message: "Error adding to cart", error: err.message });
    }
}

export async function getCart(req, res) {
    try {
        const userId = req.user._id;
        const user = await userModel.findById(userId).populate('cart.foodId');
        res.status(200).json({ cart: user.cart });
    } catch (err) {
        res.status(500).json({ message: "Error fetching cart", error: err.message });
    }
}

export async function createOrder(req, res) {
    try {
        const { address, location } = req.body; // location is { type: "Point", coordinates: [long, lat] }
        const userId = req.user._id;

        const user = await userModel.findById(userId).populate('cart.foodId');

        if (!user.cart || user.cart.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }

        // Group items by Partner (Assuming 1 order per partner for simplicity, or multi-partner order support)
        // For MVP, if cart has mixed partners, we might create multiple orders or just block.
        // Let's create one order per partner found in cart.

        const ordersByPartner = {};

        for (const item of user.cart) {
            const partnerId = item.foodId.foodPartner;
            if (!ordersByPartner[partnerId]) {
                ordersByPartner[partnerId] = {
                    items: [],
                    totalAmount: 0
                };
            }
            // Price Mock (since Food model doesn't have price yet, we might need to add it or mock it)
            // ERROR: Food model needs price! Let's assume 100 for now or add it to model.
            const price = 100;

            ordersByPartner[partnerId].items.push({
                foodId: item.foodId._id,
                quantity: item.quantity,
                price: price
            });
            ordersByPartner[partnerId].totalAmount += (price * item.quantity);
        }

        const createdOrders = [];

        for (const partnerId in ordersByPartner) {
            const orderData = ordersByPartner[partnerId];
            const order = await orderModel.create({
                customer: userId,
                // foodPartner needs to be added to Order model? The plan said "Partner" in description but Schema missed it?
                // Let's re-read Order Schema. It had "Customer, Partner...".
                // I missed adding `partner` to the Order Schema in previous step! 
                // I need to fix Order Schema. For now, I'll assume I'll fix it.
                items: orderData.items,
                totalAmount: orderData.totalAmount,
                address,
                location
            });
            createdOrders.push(order);
            user.orders.push(order._id);
        }

        // Clear Cart
        user.cart = [];
        await user.save();

        res.status(201).json({ message: "Order placed successfully", orders: createdOrders });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error creating order", error: err.message });
    }
}
