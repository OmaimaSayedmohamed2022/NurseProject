import Patient from "../models/patientDataModel.js";

//add 
export const addPatient = async (req, res) => {
  try {
    const patient = new Patient(req.body);
    await patient.save();
    res.status(201).json({ success: true, message: "Patient added successfully.", data: patient });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2️⃣ Get All Patients
export const getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find().populate("services");
    res.status(200).json({ success: true, data: patients });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 3️⃣ Get Single Patient
export const getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id).populate("services");
    if (!patient) return res.status(404).json({ success: false, message: "Patient not found" });
    res.status(200).json({ success: true, data: patient });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 4️⃣ Update Patient
export const updatePatient = async (req, res) => {
  try {
    const updatedPatient = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedPatient) return res.status(404).json({ success: false, message: "Patient not found" });
    res.status(200).json({ success: true, message: "Patient updated.", data: updatedPatient });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 5️⃣ Delete Patient
export const deletePatient = async (req, res) => {
  try {
    const deletedPatient = await Patient.findByIdAndDelete(req.params.id);
    if (!deletedPatient) return res.status(404).json({ success: false, message: "Patient not found" });
    res.status(200).json({ success: true, message: "Patient deleted." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
