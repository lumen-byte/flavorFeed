import mongoose from "mongoose";

const foodPartnerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  contactName:{
    type: String,
    required:true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone:{
    type:String,
    required:true
  },
  address:{
    type:String,
    required:true
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