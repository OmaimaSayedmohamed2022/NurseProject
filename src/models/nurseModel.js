import mongoose from 'mongoose';

const nurseSchema = new mongoose.Schema({
    fullName: {
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
    phoneNumber: {
        type: String,
        required: true,
        unique: true
    },
    imageUrl: {
        type: String,
    }
}, {
    timestamps: true
});

const Nurse = mongoose.model('Nurse', nurseSchema);
export default Nurse;
