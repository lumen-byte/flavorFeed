import mongoose from "mongoose";

const foodPartnerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
});

const foodPartnerModel = mongoose.model(
  "FoodPartner",
  foodPartnerSchema
);

export default foodPartnerModel; 