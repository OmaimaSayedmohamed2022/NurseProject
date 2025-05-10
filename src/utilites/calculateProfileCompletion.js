import Client from "../models/clientModel.js";

export const calculateProfileCompletion = async (id) => {
  try {
    
    const user = await Client.findById(id);
    if (!user) {
      throw new Error("User not found");
    }
    const requiredFields = [
      "userName", "email", "password", "gender", "age", "phone", "role",
      "bloodType", "healthNumber", "idCard", "familyHealthHistory",
      "generalHealthStatus.chronicDiseases", "generalHealthStatus.allergies",
      "generalHealthStatus.currentMedications", "generalHealthStatus.lastExaminationDate",
      "stateOfEmergency.emergencyContact", "stateOfEmergency.lastHospitalAdmissionDate",
      "stateOfEmergency.previousSurgeries", "medicalHistory.laboratoryTests",
      "medicalHistory.medicalReports", "medicalHistory.medicalDiagnoses",
      "medicalHistory.vaccinations", "previousMedications.previousTestComparisons",
      "previousMedications.pastMedications", "medicalFiles"
    ];

    let filledFields = 0;

    requiredFields.forEach(field => {
      const keys = field.split(".");
      let value = user;
      for (const key of keys) {
        value = value?.[key];
        if (value === undefined || value === "" || (Array.isArray(value) && value.length === 0)) {
          return; 
        }
      }
      filledFields++;
    });

    
    return Math.round((filledFields / requiredFields.length) * 100);
    
  } catch (error) {
    console.error("Error calculating profile completion:", error.message);
    return 0; 
  }
};
