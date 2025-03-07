import Session from '../models/sessionModel.js';
import Nurse from '../models/nurseModel.js';
import Service from '../models/serviceModel.js';
import Client from '../models/clientModel.js';
import logger from "../utilites/logger.js";

export const createSession = async (req, res) => {
    try {
        const { service, client } = req.body;

        const serviceData = await Service.findById(service);
        const clientData = await Client.findById(client);
        const nearestNurse = await Nurse.findOne({ service });

        if (!nearestNurse) {
            return res.status(404).json({ message: 'No available nurses for this service' });
        }

        const session = new Session({
            serviceData,
            clientData,
            nearestNurse,
            status: 'pending'
        });

        await session.save();

        const populatedSession = await Session.findById(session._id)
            .populate('service')
            .populate('nurse')
            .populate('client');

        res.status(201).json({status: true, message: "Session created sucsessfully", data: populatedSession});

    } catch (error) {
        logger.error(`Error creating session: ${error.message}`);
        res.status(500).json({ success: false, message: error.message });
    }
};
