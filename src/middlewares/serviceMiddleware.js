import mongoose from "mongoose";
import Service from "../models/serviceModel.js"
import logger from "../utilites/logger.js";

const serviceMiddleware = async (req, res, next) => {
    try {
        const { serviceId } = req.params;
        const { name } = req.body;

        if (name) {
            let existingField = null;

            if (name) {
                const existingName = await Service.findOne({ name });
                if (existingName) existingField = "name";
            }

            if (existingField) {
                return res.status(400).json({ success: false, message: `${existingField} already exists` });
            }
        }

        if (serviceId) {
            if (!mongoose.Types.ObjectId.isValid(serviceId)) {
                return res.status(400).json({ success: false, message: "Invalid service ID format" });
            }

            const service = await Service.findById(serviceId);

            if (!service) {
                return res.status(404).json({ success: false, message: "service not found" });
            }

            req.document = service;
        }

        next();
    } catch (error) {
        logger.error("Error in serviceMiddleware:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export default serviceMiddleware;
