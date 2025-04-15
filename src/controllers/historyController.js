import History from '../models/historyModel.js';
import Admin from '../models/adminModel.js';
import Client from '../models/clientModel.js';
import Nurse from '../models/nurseModel.js';
import Notification from '../models/NotificationModel.js';
import PatientData from '../models/patientDataModel.js';
import Service from '../models/serviceModel.js';
import Session from '../models/sessionModel.js';
import catchAsync from '../utilites/catchAsync.js';



const modelsMap = {
  Admin,
  Client,
  Nurse,
  Notification,
  PatientData,
  Service,
  Session
};

// restored data from history
export const restoreFromHistory = catchAsync(async (req, res) => {
    const { historyId } = req.params;
  
    const historyRecord = await History.findById(historyId);
    if (!historyRecord)
      return res.status(404).json({ message: "History record not found." });
  
    const Model = modelsMap[historyRecord.module];
    if (!Model)
      return res.status(400).json({ message: "Unsupported module type." });
  
    const restoredItem = new Model(historyRecord.data);
    await restoredItem.save();
  
    await History.findByIdAndDelete(historyId);
  
    res.status(200).json({
      message: `${historyRecord.module} restored successfully and history deleted`,
      restoredItem,
    });
  });
  
  // delete from history
  export const deleteHistoryItem = catchAsync(async (req, res) => {
    const { historyId } = req.params;
  
    const deleted = await History.findByIdAndDelete(historyId);
    if (!deleted)
      return res.status(404).json({ message: "History item not found." });
  
    res.status(200).json({ message: "History item permanently deleted." });
  });
  
  // All History
  export const getAllHistory = catchAsync(async (req, res) => {
    const allHistory = await History.find().sort({ deletedAt: -1 });
    res.status(200).json(allHistory);
  });