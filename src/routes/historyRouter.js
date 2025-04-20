import express from "express";
import {
  restoreFromHistory,
  deleteHistoryItem,
  getAllHistory,
} from "../controllers/historyController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { autoPermission } from "../middlewares/autoPermissions.js";
const router = express.Router();

router.use(verifyToken);
router.use(autoPermission("history")); 

router.post("/restore/:historyId", restoreFromHistory);
router.delete("/:historyId", deleteHistoryItem);
router.get("/", getAllHistory);

export default router;
