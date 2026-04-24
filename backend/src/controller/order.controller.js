import userModel from "../models/user.model.js";
import orderModel from "../models/order.model.js";
import foodModel from "../models/food.model.js";
import foodPartnerModel from "../models/foodpartner.model.js";

export async function addToCart(req, res) {
    try {
        const { foodId, quantity } = req.body;
        const userId = req.user._id;

        const foodExists = await foodModel.findById(foodId);
        if (!foodExists) {
            return res.status(404).json({ message: "Food item not found" });
        }

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
        const user = await userModel.findById(userId).populate({
            path: 'cart.foodId',
            populate: {
                path: 'foodPartner',
                select: 'name _id'
            }
        });
        res.status(200).json({ cart: user.cart });
    } catch (err) {
        res.status(500).json({ message: "Error fetching cart", error: err.message });
    }
}

export async function createOrder(req, res) {
    try {
        const { address, location } = req.body; // location is { type: "Point", coordinates: [long, lat] }
        const userId = req.user._id;

        const user = await userModel.findById(userId).populate({
            path: 'cart.foodId',
            populate: {
                path: 'foodPartner',
                select: 'name openingTime closingTime'
            }
        });

        if (!user.cart || user.cart.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }

        // Filter out null foodIds (items that have been deleted)
        const validCartItems = user.cart.filter(item => item.foodId != null);

        if (validCartItems.length === 0) {
            user.cart = [];
            await user.save();
            return res.status(400).json({ message: "Sorry, the items in your cart are no longer available." });
        }

        if (validCartItems.length !== user.cart.length) {
            user.cart = validCartItems;
        }

        // Check Restaurant Availability
        const now = new Date();
        const currentHours = now.getHours();
        const currentMinutes = now.getMinutes();
        const currentMins = currentHours * 60 + currentMinutes;

        for (const item of validCartItems) {
            const partner = item.foodId.foodPartner;
            if (partner && partner.openingTime && partner.closingTime) {
                const [openHour, openMinute] = partner.openingTime.split(':').map(Number);
                const [closeHour, closeMinute] = partner.closingTime.split(':').map(Number);

                const openMins = openHour * 60 + openMinute;
                const closeMins = closeHour * 60 + closeMinute;

                let isOpen = false;
                if (closeMins < openMins) {
                    isOpen = currentMins >= openMins || currentMins <= closeMins;
                } else {
                    isOpen = currentMins >= openMins && currentMins <= closeMins;
                }

                if (!isOpen) {
                    return res.status(400).json({ message: `Sorry, ${partner.name} is currently closed.` });
                }
            }
        }

        // Group items by Partner
        const ordersByPartner = {};

        for (const item of validCartItems) {
            // item.foodId is populated, so it contains the full Food object
            const foodItem = item.foodId;
            const partnerId = foodItem.foodPartner.toString();

            if (!ordersByPartner[partnerId]) {
                ordersByPartner[partnerId] = {
                    items: [],
                    totalAmount: 0,
                    partnerId: partnerId // Store for later use
                };
            }

            const price = foodItem.price;

            ordersByPartner[partnerId].items.push({
                foodId: foodItem._id,
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
                foodPartner: orderData.partnerId,
                items: orderData.items,
                totalAmount: orderData.totalAmount,
                address,
                location
            });
            createdOrders.push(order);
            // Push order ID to user's orders array
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

export async function getUserOrders(req, res) {
    try {
        const userId = req.user._id;
        const orders = await orderModel.find({ customer: userId })
            .populate({
                path: 'items.foodId',
                select: 'name price video description'
            })
            .populate('foodPartner', 'name address')
            .sort({ createdAt: -1 });

        res.status(200).json({ orders });
    } catch (err) {
        console.error("Get User Orders Error:", err);
        res.status(500).json({ message: "Failed to fetch orders", error: err.message });
    }
}

// CONCEPT: Calculating Averages on the Fly
// When a user rates an order, we update the specific Order document, 
// then we recalculate the Food Partner's overall average rating using a mathematical formula
// before saving the Partner document.
export async function rateOrder(req, res) {
    try {
        const { orderId, rating, reviewText } = req.body;
        const userId = req.user._id;

        // 1. Find and update the Order
        const order = await orderModel.findOne({ _id: orderId, customer: userId });
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        if (order.rating) {
            return res.status(400).json({ message: "Order already rated" });
        }

        order.rating = rating;
        order.reviewText = reviewText;
        await order.save();

        // 2. Update the Food Partner's Average Rating
        const partner = await foodPartnerModel.findById(order.foodPartner);
        if (partner) {
            const currentTotalRatings = partner.totalRatings || 0;
            const currentTotalScore = (partner.averageRating || 0) * currentTotalRatings;

            partner.totalRatings = currentTotalRatings + 1;
            partner.averageRating = (currentTotalScore + rating) / partner.totalRatings;

            await partner.save();
        }

        res.status(200).json({ message: "Rating submitted successfully", order });
    } catch (err) {
        console.error("Rate Order Error:", err);
        res.status(500).json({ message: "Failed to submit rating", error: err.message });
    }
}
