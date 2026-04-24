import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    orders: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order'
        }
    ],
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Food'
        }
    ],
    savedReels: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Food'
        }
    ],
    savedRestaurants: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'FoodPartner'
        }
    ],
    cart: [
        {
            foodId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Food',
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                min: 1,
                default: 1
            }
        }
    ],
    addresses: [
        {
            label: { type: String, enum: ['Home', 'Work', 'Other'], default: 'Other' },
            fullAddress: { type: String, required: true },
            city: { type: String },
            area: { type: String },
            street: { type: String },
            pincode: { type: String, required: true },
            location: {
                type: { type: String, enum: ['Point'], default: 'Point' },
                coordinates: { type: [Number], required: true } // [longitude, latitude]
            },
            isDefault: { type: Boolean, default: false }
        }
    ]
}, { timestamps: true });

const userModel = mongoose.model('User', userSchema);

export default userModel;

