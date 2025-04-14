import asyncCatch from '../utilites/catchAsync.js';
import Setting from "../models/settingModel.js";
import uploadToCloudinary from "../middlewares/uploadToCloudinary.js";

// Update Setting
export const updateSetting = asyncCatch(async (req, res) => {
  let image = "";

  if (req.file) {
    image = await uploadToCloudinary(req.file.buffer);
  }

  const { message } = req.body;

  const updated = await Setting.findOneAndUpdate(
    {}, 
    {
      $set: {
        ...(image && { image }),
        message,
      },
    },
    {
      new: true,
      upsert: true, // create if not exist
    }
  );

  res.status(200).json({ success: true, setting: updated });
});

// Get Setting
export const getSetting = asyncCatch(async (req, res) => {
  const setting = await Setting.findOne().select(
    "image message"
  );

  if (!setting) {
    return res.status(404).json({ success: false, message: "Setting not found" });
  }

  res.status(200).json({ success: true, setting });
});

// Update Privacy Policy
export const updatePrivacyPolicy = asyncCatch(async (req, res) => {
  const updated = await Setting.findOneAndUpdate(
    {},
    { privacyPolicy: req.body.privacyPolicy },
    { new: true, upsert: true }
  );

  res.json({ success: true, data: updated });
});

// Render Privacy Policy Page
export const renderPrivacyPolicyPage = asyncCatch(async (req, res) => {
  const setting = await Setting.findOne();
  const policyText = setting?.privacyPolicy || "No privacy policy available.";

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Privacy Policy</title>
        <meta charset="UTF-8" />
      </head>
      <body>
        <h1>Privacy Policy</h1>
        <p>${policyText}</p>
      </body>
    </html>
  `;

  res.send(htmlContent);
});


export const helpSetting = asyncCatch(async (req, res) => {
  let photo  = "";

  if (req.file) {
    photo  = await uploadToCloudinary(req.file.buffer);
  }

  const {
    email,
    location,
    contactUs,
    facebook,
    whatsapp
  } = req.body;

  const updated = await Setting.findOneAndUpdate(
    {},
    {
      $set: {
        ...(photo && { photo  }),
        ...(email && { email }),
        ...(location && { location }),
        ...(contactUs && { contactUs }),
        ...(facebook && { facebook }),
        ...(whatsapp && { whatsapp }),
      },
    },
    { new: true, upsert: true }
  );

  res.status(200).json({ success: true, setting: updated });
});


export const getHelp = asyncCatch(async (req, res) => {
  const setting = await Setting.findOne().select(
    "photo email location contactUs facebook whatsapp"
  );

  if (!setting) {
    return res
      .status(404)
      .json({ success: false, message: "Help info not found" });
  }

  res.status(200).json({ success: true, help: setting });
});
