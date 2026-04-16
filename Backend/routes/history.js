import express from "express";
import { fetchHistory } from "../controllers/historyController.js";

const router = express.Router();

router.get("/history", fetchHistory);

export default router;