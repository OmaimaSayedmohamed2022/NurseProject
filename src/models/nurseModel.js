
import mongoose from "mongoose";

const nurseSchema = new mongoose.Schema(
  {
    userName: {
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
    role: {
      type: String,
      enum: ["client", "nurse"],
      required: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      type: String,
    },
    cv: {
      type: String,
    },
    experience: {
      type: String,
      required: true,
    },
    specialty: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    }],
    location: {
        type: String,
      },
    idCard: {
      type: String,
      required: true,
    },
    clients: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Client",
      },
    ],
    rating: {
      type: Number,
      default: 0,
    },
    language: {
      type: [String],
      default: ["Arabic"],
    },
    completedSessions: {
      type: Number,
      default: 0, 
    },
    reviews: [{
      client: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Client",
          required: true
      },
      comment: {
          type: String,
          required: true
      },
      rating: {
          type: Number,
          required: true,
          min: 1,
          max: 5
      },

      createdAt: {
          type: Date,
          default: Date.now
      }
  }],
  },
  
  {
    timestamps: true,
  }
);

nurseSchema.index({ location: "2dsphere" });

const Nurse = mongoose.model("Nurse", nurseSchema);
export default Nurse;