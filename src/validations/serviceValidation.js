import { body } from "express-validator";
import { validateRequest } from '../middlewares/validationResultMiddleware.js';

export const validateService = (isUpdate = false) => [

    body("name")
    .if(() => !isUpdate) 
    .notEmpty().withMessage("Service name is required")
    .isIn([
        "Catheterization", "Nutrition", "Consultations", "Elderly Care",
        "Bedridden Patient Care", "Respiratory Care", "Health Monitoring",
        "Surgical Care", "Wound Care", "Medical Tests"
    ]).withMessage("Invalid service name")
    .trim(),

body("description")
    .if(() => !isUpdate)
    .notEmpty().withMessage("Service description is required")
    .isString().withMessage("Description must be a string")
    .trim(),

body("price")
    .if(() => !isUpdate) 
    .notEmpty().withMessage("Service price is required")
    .isFloat({ min: 1, max: 10000 }).withMessage("Price must be between 1 and 10000"),

body("duration")
    .if(() => !isUpdate) 
    .notEmpty().withMessage("Service duration is required")
    .isInt({ min: 5, max: 1440 }).withMessage("Duration must be between 5 and 1440 minutes"),

body("subcategories").optional().isArray().withMessage("Subcategories must be an array"),

    body("subcategories.*.name")
        .if((value, { req }) => req.body.subcategories && req.body.subcategories.length > 0)
        .notEmpty().withMessage("Subcategory name is required")
        .isString().withMessage("Subcategory name must be a string"),

    body("subcategories.*.cashPrice")
        .if((value, { req }) => req.body.subcategories && req.body.subcategories.length > 0)
        .notEmpty().withMessage("Subcategory cash price is required")
        .isFloat({ gt: 0 }).withMessage("Cash price must be a positive number"),

    body("subcategories.*.bookingPrice")
        .if((value, { req }) => req.body.subcategories && req.body.subcategories.length > 0)
        .notEmpty().withMessage("Subcategory booking price is required")
        .isFloat({ gt: 0 }).withMessage("Booking price must be a positive number"),

    body("subcategories.*.duration")
        .if((value, { req }) => req.body.subcategories && req.body.subcategories.length > 0)
        .notEmpty().withMessage("Subcategory duration is required")
        .isInt({ gt: 0 }).withMessage("Subcategory duration must be a positive number"),

        validateRequest,
];
