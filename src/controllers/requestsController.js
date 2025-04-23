// import Session from '../models/sessionModel.js';
// import asyncCatch  from '../utilites/catchAsync.js';

// // Create a new request
// export const createRequest = asyncCatch(async (req, res) => {
//     const newRequest = new Session(req.body);
//     await newRequest.save();
//     res.status(201).json(newRequest); // Return 201 for successfully created resources
// });

// // Update an existing request
// export const updateRequest = asyncCatch(async (req, res) => {
//     const updatedRequest = await Session.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
//     if (!updatedRequest) return res.status(404).json({ error: 'Request not found' }); // Return 404 if the request is not found
//     res.json(updatedRequest); // Return the updated request
// });

// // Delete a request
// export const deleteRequest = asyncCatch(async (req, res) => {
//     const deletedRequest = await Session.findByIdAndDelete(req.params.id);
//     if (!deletedRequest) return res.status(404).json({ error: 'Request not found' }); // Return 404 if the request is not found
//     res.json({ message: 'Request deleted successfully' }); // Success message for deletion
// });

// // Get all requests
// export const getAllRequests = asyncCatch(async (req, res) => {
//     const requests = await Session.find();
//     res.json(requests); // Return all requests
// });

// // Get a single request by ID
// export const getRequestById = asyncCatch(async (req, res) => {
//     const request = await Session.findById(req.params.id);
//     if (!request) return res.status(404).json({ error: 'Request not found' }); // Return 404 if not found
//     res.json(request); // Return the found request
// });
