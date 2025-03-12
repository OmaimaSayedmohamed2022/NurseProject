import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    name:{
      type: String,
      enum: [
          "Catheterization",         
          "Nutrition",             
          "Consultations",         
          "Elderly Care",           
          "Bedridden Patient Care", 
          "Respiratory Care",       
          "Health Monitoring",      
          "Surgical Care",          
          "Wound Care",             
          "Medical Tests"   
      ],
      required: true,
      unique: true
  },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    duration: { type: String, required: true },
    icon: { type: String },
    subcategories: {
      type: [
        {
          name: { type: String, required: true }, 
          cashPrice: { type: Number, required: true }, 
          bookingPrice: { type: Number, required: true }, 
          duration: { type: Number, required: true } 
        }
      ],
      default: [], 
    }
  },
  { timestamps: true }
);

const Service = mongoose.model("Service", serviceSchema);
export default Service;