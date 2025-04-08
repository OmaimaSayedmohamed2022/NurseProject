import Admin from "../models/adminModel.js";
import bcrypt from "bcryptjs";

export const getAdminById = async (req, res) => {
    const { id } = req.params;
  
    try {
      const admin = await Admin.findById(id);
  
      if (!admin) {
        return res.status(404).json({ success: false, message: "Admin not found" });
      }
  
      res.status(200).json({ success: true, admin });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  };

export const updateEmployeePermissions = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      addService,
      editService,
      deleteService,
      viewService
    } = req.body;

    const admin = await Admin.findById(id);
    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin not found" });
    }

    admin.permissions = {
      addService: addService ?? admin.permissions.addService,
      editService: editService ?? admin.permissions.editService,
      deleteService: deleteService ?? admin.permissions.deleteService,
      viewService: viewService ?? admin.permissions.viewService,
    };

    await admin.save();

    res.json({ success: true, message: "Permissions updated", admin });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating permissions", error: error.message });
  }
};
