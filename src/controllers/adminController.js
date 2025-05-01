import Admin from "../models/adminModel.js";
import Nurse from "../models/nurseModel.js";
import Client from "../models/clientModel.js";
import catchAsync from "../utilites/catchAsync.js";
import bcrypt from "bcryptjs";
import uploadToCloudinary from "../middlewares/uploadToCloudinary.js"


export const getAdminById = catchAsync(async (req, res) => {
  const { id } = req.params;

  const admin = await Admin.findById(id);

  if (!admin) {
    return res.status(404).json({ success: false, message: "Admin not found" });
  }

  res.status(200).json({ success: true, admin });
});

export const updateEmployeePermissions = catchAsync(async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const admin = await Admin.findById(id);
  if (!admin) {
    return res.status(404).json({ success: false, message: "Admin not found" });
  }

  // تأكد من وجود permissions
  if (!admin.permissions) {
    admin.permissions = {};
  }

  // Update only provided fields 
  Object.keys(updates).forEach(key => {
    admin.permissions[key] = updates[key];
  });

  await admin.save();

  res.status(200).json({
    success: true,
    message: "Permissions updated successfully",
    admin
  });
});


// ✅ Create new employee
export const createEmployee = async (req, res) => {
  try {
    const { userName, email, password, role, ...rest } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    let image = "";
    if (req.file) {
      try {
        image = await uploadToCloudinary(req.file.buffer);
      } catch (error) {
        return res.status(500).json({ success: false, message: "Image upload failed" });
      }
    }

    
    const permissions = {};
    Object.keys(rest).forEach((key) => {
      permissions[key] = rest[key] === "true";
    });

    const newEmployee = new Admin({
      userName,
      email,
      password: hashedPassword,
      role,
      image,
      permissions,
    });

    await newEmployee.save();
    res.status(201).json({ success: true, employee: newEmployee });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// ✅ Update employee
export const updateEmployee = async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    if (req.file) {
      updateData.image = await uploadToCloudinary(req.file.buffer);
    }

    const updatedEmployee = await Admin.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedEmployee) {
      return res.status(404).json({ success: false, message: "Employee not found" });
    }

    res.json({ success: true, employee: updatedEmployee });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Delete employee
export const deleteEmployee = async (req, res) => {
  try {
    const deleted = await Admin.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Employee not found" });
    }
    res.json({ success: true, message: "Employee deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Get all employees
export const getAllEmployees = async (req, res) => {
  try {
    const employees = await Admin.find().sort({ createdAt: -1 }).select("-password");
    res.json({ success: true, employees });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const nurses = await Nurse.find({}, "-password"); // exclude password
    const clients = await Client.find({}, "-password");
    const admins = await Admin.find({}, "-password");

    const allUsers = [
      ...nurses.map(user => ({ ...user._doc, userType: "nurse" })),
      ...clients.map(user => ({ ...user._doc, userType: "client" })),
      ...admins.map(user => ({ ...user._doc, userType: "admin" }))
    ];

    res.status(200).json({ count: allUsers.length, users: allUsers });
  } catch (err) {
    console.error("❌ Error fetching users:", err);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};
