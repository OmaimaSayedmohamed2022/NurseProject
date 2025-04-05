import Session from '../models/sessionModel.js'

// Create a new request
export const createRequest = async (req, res) => {
    try {
        const newRequest = new Session(req.body);
        await newRequest.save();
        res.status(201).json(newRequest);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Update an existing request
export const updateRequest = async (req, res) => {
    try {
        const updatedRequest = await Session.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedRequest) return res.status(404).json({ error: 'Request not found' });
        res.json(updatedRequest);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Delete a request
export const deleteRequest = async (req, res) => {
    try {
        const deletedRequest = await Session.findByIdAndDelete(req.params.id);
        if (!deletedRequest) return res.status(404).json({ error: 'Request not found' });
        res.json({ message: 'Request deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};


// Get all requests
export const getAllRequests = async (req, res) => {
    try {
        const requests = await Session.find();
        res.json(requests);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Get a single request by ID
export const getRequestById = async (req, res) => {
    try {
        const request = await Session.findById(req.params.id);
        if (!request) return res.status(404).json({ error: 'Request not found' });
        res.json(request);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};
