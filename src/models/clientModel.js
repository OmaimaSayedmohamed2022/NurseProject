import mongoose from "mongoose"

const clientSchema = new mongoose.Schema({

    userName: { type: String, required: true },
    email: { type: String, required: true, unique: true},
    password: { type: String, required: true },
    role: { type: String, enum: ['sick', 'nurse'], required: true },
    phone: { type: Number},
    fingerPrint:{type:String},
    image: { type: String }, 

    // complete profile
    idCard: { type: String, required: false },
    healthNumber: { type: String, required: false },
    bloodType: { type: String },

    generalHealthStatus: {
     chronicDiseases: { type: String },
     allergies: { type: String },
     currentMedications: { type: String },
     lastExaminationDate: { type: Date },
    },
    stateOfEmergency: {
     emergencyContact: { type: String },
     lastHospitalAdmissionDate: { type: Date },
     previousSurgeries: { type: String },
   },
   medicalHistory:{
    laboratoryTests: [{ testName: String, date: Date }],
    medicalReports: { type: String },
    medicalDiagnoses: { type: String },
    vaccinations: [{ vaccineName: String, date: Date }],
   },
   previousMedications:{
    previousTestComparisons: [{ testName: String, results: [Number] }],  
    pastMedications: [{ medicationName: String, duration: String }],
   },
   familyHealthHistory: { type: String }, 
   comments: [{ text: { type: String, },
                 date: { type: Date, default: Date.now }} ],
   medicalFiles: [{ filename: String,fileUrl: String,
                     uploadedAt: { type: Date, default: Date.now } }]
},
 { timestamps: true });

const Client = mongoose.model("Client" ,clientSchema);
export default Client;