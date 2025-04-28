import Service from '../models/serviceModel.js';
import uploadToCloudinary from "../middlewares/uploadToCloudinary.js";
import asyncCatch  from '../utilites/catchAsync.js';

// Add service
export const addService = asyncCatch(async (req, res) => {
    const { name, description, price, duration, subcategories } = req.body;

    let icon = "";
        if (req.file) {
            try {
                icon = await uploadToCloudinary(req.file.buffer);
            } catch (error) {
                return res.status(500).json({ success: false, message: "Icon upload failed" });
            }
        }
    
        let parsedSubcategories = [];
        if (subcategories) {
            try {
                parsedSubcategories = JSON.parse(subcategories);
            } catch (error) {
                return res.status(400).json({ success: false, message: "Invalid subcategories format" });
            }
        }    

    const newService = new Service({ name, description, price, duration, icon, subcategories: parsedSubcategories });
    await newService.save();
    res.status(201).json({ status: true, message: "New service added successfully", newService });
});

// Get all services
export const getAllServices = asyncCatch(async (req, res) => {
    const services = await Service.find({}, {"__v": 0});
    res.status(200).json({ status: true, services });
});

// Get service by id
export const getServiceById = asyncCatch(async (req, res) => {
    const { serviceId } = req.params;
    const service = await Service.findById(serviceId, {"__v": 0});
    res.status(200).json({ status: true, service });
});

// Update service
export const updateService = asyncCatch(async (req, res) => {
    const { serviceId } = req.params;
    const updateService = await Service.findByIdAndUpdate(serviceId, req.body, { new: true });
    res.status(200).json({ status: true, message: "Service updated successfully", updateService });
});

// Delete service
export const deleteService = asyncCatch(async (req, res) => {
    const { serviceId } = req.params;
    const deletedService = await Service.findByIdAndDelete(serviceId);
    res.status(200).json({ status: true, message: "Service deleted successfully" });
});
