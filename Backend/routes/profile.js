import express from "express";
import { fetchProfile } from "../controllers/profileController.js";

const router = express.Router();

router.get("/profile", fetchProfile);

export default router;
