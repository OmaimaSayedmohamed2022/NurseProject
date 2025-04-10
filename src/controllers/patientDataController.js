import PatientData from "../models/patientDataModel.js"; 
import uploadToCloudinary from "../middlewares/uploadToCloudinary.js";

// Add patient
export const addPatient = async (req, res) => {
  try {
    const { client, name, code, services, description, phoneNumber, date } = req.body;

    let videoOrPhotos = null;

    // Check if an image is uploaded
    if (req.file) {
      try {
        videoOrPhotos = await uploadToCloudinary(req.file.buffer);
      } catch (error) {
        return res.status(500).json({ success: false, message: "Image upload failed", error: error.message });
      }
    }

    const patient = new PatientData({
      client,
      name,
      code,
      services,
      description,
      phoneNumber,
      date,
      videoOrPhotos,
    });

    await patient.save();
    res.status(201).json({ success: true, message: "Patient added successfully.", data: patient });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all patients
export const getAllPatients = async (req, res) => {
  try {
    const patients = await PatientData.find().populate("services");
    res.status(200).json({ success: true, data: patients });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single patient by clientId
export const getPatientById = async (req, res) => {
  try {
    const { clientId } = req.params;
    const patient = await PatientData.find({ client: clientId }).populate("services");

    if (!patient) return res.status(404).json({ success: false, message: "Patient not found" });
    res.status(200).json({ success: true, data: patient });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update patient
export const updatePatient = async (req, res) => {
  try {
    const updatedPatient = await PatientData.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!updatedPatient) return res.status(404).json({ success: false, message: "Patient not found" });
    res.status(200).json({ success: true, message: "Patient updated.", data: updatedPatient });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete patient
export const deletePatient = async (req, res) => {
  try {
    const deletedPatient = await PatientData.findByIdAndDelete(req.params.id);

    if (!deletedPatient) return res.status(404).json({ success: false, message: "Patient not found" });
    res.status(200).json({ success: true, message: "Patient deleted." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
