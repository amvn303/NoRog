import express from "express";
import { fetchDrift } from "../controllers/driftController.js";

const router = express.Router();

router.get("/drift", fetchDrift);

export default router;
