import express from "express";
import { payWithWallet, payWithClick, clickCallbackHandler, payWithEfawatercom, efawatercomCallbackHandler } from "../controllers/paymentController.js";
// import {  } from "../middlewares/authMiddleware.js"; 

const router = express.Router();

router.post("/payWithWallet", payWithWallet);

// Click
router.post("/payWithClick", payWithClick);
router.post("/click-callback", clickCallbackHandler);

// Efawatercom
router.post("/payWithEfawatercom", payWithEfawatercom);
router.post("/efawatercom-callback", efawatercomCallbackHandler);

export default router;
