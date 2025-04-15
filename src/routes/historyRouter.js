import express from "express";
import {
  restoreFromHistory,
  deleteHistoryItem,
  getAllHistory,
} from "../controllers/historyController.js";

const router = express.Router();

router.post("/restore/:historyId", restoreFromHistory);
router.delete("/:historyId", deleteHistoryItem);
router.get("/", getAllHistory);

export default router;
