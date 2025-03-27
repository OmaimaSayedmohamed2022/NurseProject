import PatientData from "../models/patientDataModel.js"; 
import uploadToCloudinary from "../middlewares/uploadToCloudinary.js";

//add 
export const addPatient = async (req, res) => {
  try {
    const { client, name, code, services, description, phoneNumber, date } = req.body;

    // Get uploaded file paths
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

  
// 2️⃣ Get All Patients
export const getAllPatients = async (req, res) => {
  try {
    const patients = await PatientData.find().populate("services");
    res.status(200).json({ success: true, data: patients });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 3️⃣ Get Single Patient
export const getPatientById = async (req, res) => {
  try {
    const { clientId } = req.params;
    // console.log("Client ID:", clientId); 
    const patient = await PatientData.find({ client: clientId }).populate("services");
    if (!patient) return res.status(404).json({ success: false, message: "Patient not found" });
    res.status(200).json({ success: true, data: patient });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 4️⃣ Update Patient
export const updatePatient = async (req, res) => {
  try {
    const updatedPatient = await PatientData.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedPatient) return res.status(404).json({ success: false, message: "Patient not found" });
    res.status(200).json({ success: true, message: "Patient updated.", data: updatedPatient });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 5️⃣ Delete Patient
export const deletePatient = async (req, res) => {
  try {
    const deletedPatient = await PatientData.findByIdAndDelete(req.params.id);
    if (!deletedPatient) return res.status(404).json({ success: false, message: "Patient not found" });
    res.status(200).json({ success: true, message: "Patient deleted." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
