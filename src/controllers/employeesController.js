import bcrypt from "bcryptjs";
import Admin from "../models/adminModel.js";
import uploadToCloudinary from "../middlewares/uploadToCloudinary.js";

export const createEmployee = async (req, res) => {
  try {
    const { userName, email, password, role } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

      let image= "";
            if (req.file) {
                try {
                    image = await uploadToCloudinary(req.file.buffer);
                } catch (error) {
                    return res.status(500).json({ success: false, message: "Image upload failed" });
                }
            }

    const newEmployee = new Admin({
      userName,
      email,
      password: hashedPassword,
      role,
      image,
      permissions: {
        addService: req.body.addService === 'true',
        editService: req.body.editService === 'true',
        deleteService: req.body.deleteService === 'true',
        viewService: req.body.viewService === 'true',
      }
    });

    await newEmployee.save();

    res.status(201).json({ success: true, employee: newEmployee });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
// Update employees
export const updateEmployee = async (req, res) => {
    try {
      const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!employee) return res.status(404).json({ message: "Employee not found" });
      res.json({ success: true, employee });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  };
  
// Delete employee
export const deleteEmployee = async (req, res) => {
    try {
      await Employee.findByIdAndDelete(req.params.id);
      res.json({ success: true, message: "Employee deleted" });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  };
  

// all employees
export const getAllEmployees = async (req, res) => {
    try {
      const employees = await Employee.find().sort({ createdAt: -1 });
      res.json({ success: true, employees });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  };
  