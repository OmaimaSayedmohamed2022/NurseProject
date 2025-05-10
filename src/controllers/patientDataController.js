import PatientData from "../models/patientDataModel.js";
import uploadToCloudinary ,{createAndUploadPdf} from "../middlewares/uploadToCloudinary.js";
import catchAsync from "../utilites/catchAsync.js";



export const addPatient = catchAsync(async (req, res) => {
  const { client, name, code, services, description, phoneNumber, date } = req.body;
  
  let videoOrPhotos = null;

  // If a file is provided, upload it to Cloudinary
  if (req.file) {
    try {
      // Ensure req.file.buffer exists before uploading
      if (!req.file.buffer) {
        return res.status(400).json({ success: false, message: "No file buffer found" });
      }
      videoOrPhotos = await uploadToCloudinary(req.file);  // Ensure req.file is passed correctly
    } catch (error) {
      return res.status(500).json({ success: false, message: "Image upload failed", error: error.message });
    }
  }

  // Create a new PatientData object
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

  let pdfUrl;
  try {
    // If videoOrPhotos exists, use it, otherwise generate a PDF without the image
    pdfUrl = await createAndUploadPdf( videoOrPhotos || null, description);
  
  } catch (error) {
    return res.status(500).json({ success: false, message: "PDF creation or upload failed", error: error.message });
  }

  // Respond with success
  res.status(201).json({
    success: true,
    message: "تم رفع البيانات وإرسال الإشعار بنجاح",
    data: { pdfUrl }
  });
});



// Get all patients
export const getAllPatients = catchAsync(async (req, res) => {
  const patients = await PatientData.find().populate("services");
  res.status(200).json({ success: true, data: patients });
});

// Get single patient by clientId
export const getPatientById = catchAsync(async (req, res) => {
  const { clientId } = req.params;
  const patient = await PatientData.find({ client: clientId }).populate("services");

  if (!patient) return res.status(404).json({ success: false, message: "Patient not found" });
  res.status(200).json({ success: true, data: patient });
});

// Update patient
export const updatePatient = catchAsync(async (req, res) => {
  const updatedPatient = await PatientData.findByIdAndUpdate(req.params.id, req.body, { new: true });

  if (!updatedPatient) return res.status(404).json({ success: false, message: "Patient not found" });
  res.status(200).json({ success: true, message: "Patient updated.", data: updatedPatient });
});

// Delete patient
export const deletePatient = catchAsync(async (req, res) => {
  const deletedPatient = await PatientData.findByIdAndDelete(req.params.id);

  if (!deletedPatient) return res.status(404).json({ success: false, message: "Patient not found" });
  res.status(200).json({ success: true, message: "Patient deleted." });
});


// // Get all patients with service = "Medical Tests"
// export const getAnalysisAndReports = catchAsync(async (req, res) => {
//   const medicalTestService = await Service.findOne({ name: "Medical Tests" });

//   if (!medicalTestService) {
//     return res.status(404).json({
//       success: false,
//       message: "Medical Tests service not found",
//     });
//   }
//   const patients = await PatientData.find({
//     services: medicalTestService._id,
//   }).populate("services");

//   res.status(200).json({
//     success: true,
//     data: patients,
//   });
// });
