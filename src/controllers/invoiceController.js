import Invoice from "../models/invoiceModel.js";
import catchAsync from "../utilites/catchAsync.js";
import pagination from "../utilites/pagination.js";
import uploadToCloudinary from "../middlewares/uploadToCloudinary.js";

export const createInvoice = catchAsync(async (req, res) => {
  const { nurse, client, session, services, code, amount, date } = req.body;

  let image = "";
  if (req.file) {
    try {
      image = await uploadToCloudinary(req.file.buffer); 
    } catch (error) {
      return res.status(500).json({ success: false, message: "Image upload failed" });
    }
  }

  let parsedServices = [];
  try {
    parsedServices = typeof services === "string" ? JSON.parse(services) : services;
  } catch (error) {
    return res.status(400).json({ success: false, message: "Invalid services format" });
  }

  const newInvoice = new Invoice({
    nurse,
    client,
    session,
    services: parsedServices,
    image,
    code,
    amount,
    date
  });

  await newInvoice.save();
  res.status(201).json({ success: true, message: "Invoice created successfully", data: newInvoice });
});


// Get All
export const getAllInvoices = catchAsync(async (req, res) => {
  const { page } = req.query;
  const data = await pagination(
    Invoice,
    {},
    page,
    14,
    {},
    'services image amount date client',
    { path: 'client', select: 'userName phone address' },
    { path: 'services', select: 'name' }
  );

  res.status(200).json({ message: "Invoices fetched successfully.", ...data });
});

// Get by id
export const getInvoiceById = catchAsync(async (req, res) => {
  const invoice = await Invoice.findById(req.params.id).populate("nurse client session services");
  if (!invoice) return res.status(404).json({ success: false, message: "Invoice not found" });
  res.status(200).json({ success: true, data: invoice });
});

// Update
export const updateInvoice = catchAsync(async (req, res) => {
  const { id } = req.params;

  const updatedData = { ...req.body };

  if (req.file) {
    try {
      const image = await uploadToCloudinary(req.file.buffer);
      updatedData.image = image;
    } catch (error) {
      return res.status(500).json({ success: false, message: "Image upload failed" });
    }
  }

  if (updatedData.services && typeof updatedData.services === 'string') {
    try {
      updatedData.services = JSON.parse(updatedData.services);
    } catch (err) {
      return res.status(400).json({ success: false, message: "Invalid services format" });
    }
  }

  const invoice = await Invoice.findByIdAndUpdate(id, updatedData, { new: true });

  if (!invoice) {
    return res.status(404).json({ success: false, message: "Invoice not found" });
  }

  res.status(200).json({ success: true, message: "Invoice updated successfully", data: invoice });
});


// Delete
export const deleteInvoice = catchAsync(async (req, res) => {
  const invoice = await Invoice.findByIdAndDelete(req.params.id);
  if (!invoice) return res.status(404).json({ success: false, message: "Invoice not found" });
  res.status(200).json({ success: true, message: "Invoice deleted successfully" });
});
