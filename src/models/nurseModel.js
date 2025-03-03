import mongoose from 'mongoose';

const nurseSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['client', 'nurse'],
        required: true
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String,
    },
    experience: {
        type: String, 
        required: true
    },
    specialty: {
        type: String, 
        required: true
    },
    location: {
        type: String, 
        required: true
    },
    idCard: {
        type: String, 
        required: true
    }
}, {
    timestamps: true
});

const Nurse = mongoose.model('Nurse', nurseSchema);
export default Nurse;