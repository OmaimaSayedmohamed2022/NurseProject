import Transaction from "../models/transactionModel.js";
import Session from "../models/sessionModel.js";
import catchAsync from "../utilites/catchAsync.js";
import axios from "axios";


export const payWithWallet = catchAsync(async (req, res) => {
  const { sessionId, amount, paymentMethod } = req.body;

  if (!sessionId || !amount || !paymentMethod) {
    return res.status(400).json({ success: false, message: "Missing data" });
  }

  const session = await Session.findById(sessionId);
  if (!session) {
    return res.status(404).json({ success: false, message: "Session not found" });
  }

  const transaction = await Transaction.create({
    session: session._id,
    nurse: session.nurse,
    client: session.client,
    amount,
    paymentMethod,
    paymentStatus: "paid",
  });

  session.paymentStatus = paymentMethod;  // update session
  await session.save();

  res.status(201).json({
    success: true,
    message: "Payment done successfully",
    transaction,
  });
});


// Click
export const payWithClick = catchAsync(async (req, res) => {
  const { sessionId, amount, clientPhone } = req.body;

  if (!sessionId || !amount || !clientPhone) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }

  const session = await Session.findById(sessionId);
  if (!session) {
    return res.status(404).json({ success: false, message: "Session not found" });
  }

  // Prepare request to Click API
  const data = {
    merchant_id: process.env.CLICK_MERCHANT_ID,
    secret_key: process.env.CLICK_SECRET_KEY,
    amount,
    phone: clientPhone,
    currency: "JOD",
    description: "Session Payment",
    callback_url: `${process.env.BASE_URL}/api/payment/click-callback`, // Webhook link 
  };

  // Send request to Click
  const response = await axios.post("https://api.click.jo/payment", data);
  const paymentData = response.data;

  if (!paymentData.payment_url) {
    return res.status(500).json({ success: false, message: "Failed to initiate payment" });
  }

  // Save transaction with pending status
  await Transaction.create({
    session: session._id,
    nurse: session.nurse,
    client: session.client,
    amount,
    paymentMethod: "Click",
    paymentStatus: "pending",
  });

  res.status(200).json({
    success: true,
    paymentUrl: paymentData.payment_url, 
  });
});

// Webhook to receive payment confirmation from Click
export const clickCallbackHandler = catchAsync(async (req, res) => {
  const { session_id, status } = req.body; 

  if (!session_id || !status) {
    return res.status(400).json({ success: false, message: "Invalid callback data" });
  }

  const session = await Session.findById(session_id);
  if (!session) {
    return res.status(404).json({ success: false, message: "Session not found" });
  }

  const transaction = await Transaction.findOne({ session: session._id });

  if (!transaction) {
    return res.status(404).json({ success: false, message: "Transaction not found" });
  }

  if (status === "paid") {
    transaction.paymentStatus = "paid";
    await transaction.save();
  } else if (status === "failed") {
    transaction.paymentStatus = "failed";
    await transaction.save();
  }

  res.status(200).json({ success: true, message: "Payment status updated" });
});




// Efawatercom
export const payWithEfawatercom = catchAsync(async (req, res) => {
  const { sessionId, amount, clientPhone } = req.body;

  if (!sessionId || !amount || !clientPhone) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }

  const session = await Session.findById(sessionId);
  if (!session) {
    return res.status(404).json({ success: false, message: "Session not found" });
  }

  // Prepare request to Efawatercom
  const data = {
    merchant_id: process.env.EFAWATERCOM_MERCHANT_ID,
    secret_key: process.env.EFAWATERCOM_SECRET_KEY,
    amount,
    mobile: clientPhone,
    currency: "JOD",
    description: "Session Payment",
    callback_url: `${process.env.BASE_URL}/api/payment/efawatercom-callback`, // Webhook link
  };

  // Send request to Efawatercom
  const response = await axios.post("https://api.efawatercom.jo/payment", data);
  const paymentData = response.data;

  if (!paymentData.payment_url) {
    return res.status(500).json({ success: false, message: "Failed to initiate payment" });
  }

  // Save transaction with pending status
  await Transaction.create({
    session: session._id,
    nurse: session.nurse,
    client: session.client,
    amount,
    paymentMethod: "Efawatercom",
    paymentStatus: "pending",
  });

  res.status(200).json({
    success: true,
    paymentUrl: paymentData.payment_url, // لينك الدفع
  });
});



// Webhook to receive payment confirmation from Efawateercom
export const efawatercomCallbackHandler = catchAsync(async (req, res) => {
  const { session_id, status } = req.body; 

  if (!session_id || !status) {
    return res.status(400).json({ success: false, message: "Invalid callback data" });
  }

  const session = await Session.findById(session_id);
  if (!session) {
    return res.status(404).json({ success: false, message: "Session not found" });
  }

  const transaction = await Transaction.findOne({ session: session._id });

  if (!transaction) {
    return res.status(404).json({ success: false, message: "Transaction not found" });
  }

  if (status === "paid") {
    transaction.paymentStatus = "paid";
    await transaction.save();
  } else if (status === "failed") {
    transaction.paymentStatus = "failed";
    await transaction.save();
  }

  res.status(200).json({ success: true, message: "Payment status updated" });
});
