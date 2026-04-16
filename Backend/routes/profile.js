import express from "express";
import {
  bootstrapUser,
  createProfile,
  fetchProfile,
  fetchProfiles
} from "../controllers/profileController.js";

const router = express.Router();

router.post("/users/bootstrap", bootstrapUser);
router.get("/profiles", fetchProfiles);
router.post("/profiles", createProfile);
router.get("/profile", fetchProfile);

export default router;
