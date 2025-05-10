import { body } from 'express-validator';
import { validateRequest } from '../middlewares/validationResultMiddleware.js';
import User from '../models/clientModel.js';

export const userValidation = (isUpdate = false) => [

  body('userName')
    .if(() => !isUpdate) 
    .notEmpty()
    .withMessage('userName is required')
    .trim(), 
  // Validate email
  body("email")
    .optional()
    .isEmail()
    .withMessage("Invalid email format")
    .custom(async (value) => {
      if (!value) return true;

      const existingUser = await User.findOne({ email: value });
      if (existingUser) {
        throw new Error("Email already registered");
      }
    }),

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

  
  validateRequest,
];