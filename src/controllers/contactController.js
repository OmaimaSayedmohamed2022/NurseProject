import Contact from "../models/contactModel.js";
import catchAsync from "../utilites/catchAsync.js";

export const contactUs = catchAsync(async (req, res) => {
  const { fullName, message } = req.body;
  const { id, role } = req.user;

  if (!fullName || !message) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  const newContact = new Contact({
    userId: id,
    role,
    fullName,
    message
  });

  await newContact.save();

  res.status(200).json({ success: true, message: "Message sent successfully" });
});
