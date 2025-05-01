import express from "express";
import {
  createInvoice,
  getAllInvoices,
  getInvoiceById,
  updateInvoice,
  deleteInvoice
} from "../controllers/invoiceController.js";
import upload from '../middlewares/uploadImage.js';

const router = express.Router();

router.post("/create", upload.single("image"), createInvoice);
router.get("/getAll", getAllInvoices);
router.get("/getInvoice/:id", getInvoiceById);
router.patch("/update/:id", updateInvoice);
router.delete("/delete/:id", deleteInvoice);

export default router;
