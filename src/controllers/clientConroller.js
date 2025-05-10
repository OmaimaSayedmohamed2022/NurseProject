import Client from "../models/clientModel.js";
import bcrypt from "bcryptjs";
import logger from "../utilites/logger.js";
import { generateToken } from "../middlewares/authMiddleware.js";
import uploadToCloudinary from "../middlewares/uploadToCloudinary.js";
import { calculateProfileCompletion } from "../utilites/calculateProfileCompletion.js";
import catchAsync from "../utilites/catchAsync.js";

// Create user
export const createUser = catchAsync(async (req, res) => {
  const { userName, email, password, role, phone, age, years, gender } = req.body;

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = new Client({
    userName,
    email,
    password: hashedPassword,
    role,
    phone,
    age,
    years,
    gender,
  });

  const token = generateToken({ _id: newUser._id, email, role });
  await newUser.save();

  res.status(201).json({ message: "New user created successfully", newUser, token });
});

// Update user profile
export const updateUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  const updatedData = { ...req.body };

  if (req.file) {
    const imageUrl = await uploadToCloudinary(req.file);
    updatedData.image = imageUrl;
  }

  const updatedUser = await Client.findByIdAndUpdate(id, updatedData, {
    new: true,
    runValidators: true,
  });

  if (!updatedUser) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json({ message: "User updated successfully", updatedUser });
});

// Delete user
export const deleteUser = catchAsync(async (req, res) => {
  const { id } = req.params;

  const deletedUser = await Client.findByIdAndDelete(id);

  res.status(200).json({ message: "User deleted successfully", deletedUser });
});

// Get user by ID
export const getUserById = catchAsync(async (req, res) => {
  const { id } = req.params;

  const user = await Client.findById(id);

  res.status(200).json({ message: "User fetched successfully", user });
});

// Get all users
export const getAllUsers = catchAsync(async (req, res) => {
  const users = await Client.find().select("-password");

  res.status(200).json({ message: "Users fetched successfully", users });
});

// Get profile completion
export const getProfileCompletion = catchAsync(async (req, res) => {
  const { id } = req.params;

  const completionPercentage = await calculateProfileCompletion(id);

  res.status(200).json({
    message: "Profile completion retrieved successfully",
    profileCompletion: `${completionPercentage}%`,
  });
});

// Complete user profile
export const completeUserProfile = catchAsync(async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  if (req.files && req.files.length > 0) {
    const uploadedFiles = await Promise.all(
      req.files.map(file => uploadToCloudinary(file))
    );
    updatedData.medicalFiles = uploadedFiles.map(url => ({ fileUrl: url }));
  }

  const user = await Client.findByIdAndUpdate(id, updatedData, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json({ message: "User profile updated successfully", user });
});
