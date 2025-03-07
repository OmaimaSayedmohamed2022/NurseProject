import Service from '../models/serviceModel.js';
import logger from "../utilites/logger.js";

// add service
export const addService = async (req, res) => {
    const { name, description, price, duration, subcategories } = req.body;

    try {
        const newService = new Service({ name, description, price, duration, subcategories: subcategories || [] });
        await newService.save();
        res.status(201).json({ status: true, message: "New service added successfully", newService });
    }
    catch (error) {
        logger.error(`Error adding service: ${error.message}`);
        res.status(500).json({ success: false, message: error.message})
    }
}

// get all services
export const getAllServices = async (req, res) => {
    try {
        const services = await Service.find({}, {"__v": 0});
        res.status(200).json({ status: true, services });
    }
    catch (error) {
        logger.error(`Error fetching services: ${error.message}`);
        res.status(500).json({ success: false, message: error.message })
    }
}

// get service by id
export const getServiceById = async (req, res) => {
    const { serviceId } = req.params;
    try {
        const service = await Service.findById(serviceId, {"__v": 0});
        res.status(200).json({ status: true, service });
    }
    catch (error) {
        logger.error(`Error fetching service by ID: ${error.message}`);
        res.status(500).json({ success: false, message: error.message })
    }
}

// update service
export const updateService = async (req, res) => {
    try{
        const { serviceId } = req.params;
        const updateService = await Service.findByIdAndUpdate(serviceId, req.body, { new: true });
        res.status(200).json({ status: true, message: "Service updated successfully", updateService });
    }
    catch (error) {
        logger.error(`Error updating service: ${error.message}`);
        res.status(500).json({ success: false, message: error.message })
    }
}

// delete service
export const deleteService = async (req, res) => {
    try {
        const { serviceId } = req.params;
        const deletedService = await Service.findByIdAndDelete(serviceId);
        res.status(200).json({ status: true, message: "Service deleted successfully" });
    }
    catch (error) {
        logger.error(`Error deleting service: ${error.message}`);
        res.status(500).json({ success: false, message: error.message })
    }
}