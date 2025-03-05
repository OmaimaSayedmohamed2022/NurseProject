import { body } from 'express-validator';
import { validateRequest } from '../middlewares/validationResultMiddleware.js';
import Nurse from '../models/nurseModel.js';

export const nurseValidation = (isUpdate = false) => [

  body('userName')
    .if(() => !isUpdate) 
    .notEmpty()
    .withMessage('userName is required')
    .trim(), 

  // Validate email
  body('email')
  .isEmail()
  .withMessage('Invalid email format')
  .custom(async (value, { req }) => {
    if (isUpdate) {
      const user = await Nurse.findById(req.params.id);
      if (!user) throw new Error('Nurse not found');
      if (value === user.email) return true; 
    }
    const existingUser = await Nurse.findOne({ email: value, _id: { $ne: req.params.id } });
    if (existingUser) throw new Error('Email already registered');
    return true;
  }),

  // Validate password 
  body('password')
    .if(() => !isUpdate) // Only validate for registration
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .trim(),

  // Validate phone (required for registration only)
  body('phone')
    .if(() => !isUpdate) // Only validate for registration
    .isMobilePhone()
    .withMessage('Enter a valid phone number')
    .trim(), // Sanitize: Remove extra spaces

  // Validate role (required for registration only)
  body('role')
    .if(() => !isUpdate) 
    .notEmpty()
    .withMessage('Role is required')
    .isIn(['nurse', 'client']) 
    .withMessage('Invalid role'),

  // Validate experience
  body('experience')
    .if(() => !isUpdate)
    .notEmpty()
    .withMessage('Experience is required')
    .trim(),

  // Validate specialty
  body('specialty')
    .if(() => !isUpdate)
    .notEmpty()
    .withMessage('Specialty is required')
    .trim(),

  // Validate location
  body('location')
    .if(() => !isUpdate)
    .notEmpty()
    .withMessage('Location is required')
    .trim(),

  // Validate ID card
  body('idCard')
    .if(() => !isUpdate)
    .notEmpty()
    .withMessage('ID card is required')
    .matches(/^\d{14}$/)
    .withMessage('ID Card must be a valid 14-digit number')
    .trim(),

  validateRequest,
];