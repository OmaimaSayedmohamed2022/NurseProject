import mongoose from "mongoose";

const settingSchema = new mongoose.Schema(
  {
    image: {
      type: String,
    },
    message: {
      type: String,
    //   required: true,
    },
    privacyPolicy: {
        type: String,
      },
      email: {
        type: String,
      },
      location: {
        type: String,
      },
      photo:{
        type:String
      },
      contactUs: {
        type: String,
      },
      facebook: {
        type: String,
      },
      whatsapp: {
        type: String,
      },
  },
  {
    timestamps: true,
  }
);

const Setting = mongoose.model("Setting", settingSchema);
export default Setting;
