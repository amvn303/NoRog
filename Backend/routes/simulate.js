import express from "express";
import { simulateChange } from "../controllers/simulateController.js";

const router = express.Router();

router.post("/simulate", simulateChange);

export default router;