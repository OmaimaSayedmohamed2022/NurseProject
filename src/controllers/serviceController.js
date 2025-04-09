import Service from '../models/serviceModel.js';
import logger from "../utilites/logger.js";
import asyncCatch  from '../utilites/catchAsync.js';

// Add service
export const addService = asyncCatch(async (req, res) => {
    const { name, description, price, duration, subcategories } = req.body;

    const newService = new Service({ name, description, price, duration, subcategories: subcategories || [] });
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
