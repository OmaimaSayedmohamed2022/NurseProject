import { body } from 'express-validator';
import validationResult from "../middlewares/validationResult.js";

const validateNurse = [
    body('fullName')
        .trim()
        .isLength({ min: 3, max: 50 })
        .withMessage('Full name must be between 3 and 50 characters'),

    body('email')
        .trim()
        .isEmail()
        .withMessage('Invalid email format'),

    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters'),

    body('phoneNumber')
        .trim()
        .matches(/^\d{10,15}$/)
        .withMessage('Phone number must be between 10 to 15 digits'),

    validationResult
];

export default validateNurse;
