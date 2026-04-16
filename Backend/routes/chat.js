import express from "express";
import { getChat, postChatMessage } from "../controllers/chatController.js";

const router = express.Router();

router.get("/chat", getChat);
router.post("/chat", postChatMessage);

export default router;

