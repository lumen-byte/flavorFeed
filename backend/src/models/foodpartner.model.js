import mongoose from "mongoose";

const foodPartnerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  contactName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String,
    required: true
  },
  addressDetails: {
    shopName: { type: String, required: true },
    buildingNo: { type: String, required: true },
    landmark: { type: String },
    area: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String },
    pincode: { type: String, required: true }
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  password: {
    type: String,
    required: true
  },
  averageRating: {
    type: Number,
    default: 0
  },
  totalRatings: {
    type: Number,
    default: 0
  },
  openingTime: {
    type: String, // format "HH:mm" e.g., "09:00"
    default: "00:00" // 24/7 by default if not set
  },
  closingTime: {
    type: String, // format "HH:mm" e.g., "23:59"
    default: "23:59"
  }
});

const foodPartnerModel = mongoose.model(
  "FoodPartner",
  foodPartnerSchema
);

foodPartnerSchema.index({ location: "2dsphere" });

export default foodPartnerModel; 