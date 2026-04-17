import { Router } from "express";
import User from "../models/User.js";
import HealthProfile from "../models/HealthProfile.js";
import SymptomLog from "../models/SymptomLog.js";
import Prediction from "../models/Prediction.js";
import MedicineLog from "../models/MedicineLog.js";
import { generateHealthPDF } from "../services/pdfService.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = Router();
router.use(authMiddleware);

// GET /api/report/generate — generate and download PDF report
router.get("/generate", async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    const profile = await HealthProfile.findOne({ userId: req.user.id });
    const symptomLogs = await SymptomLog.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(30);
    const prediction = await Prediction.findOne({ userId: req.user.id })
      .sort({ createdAt: -1 });
    const medicineLogs = await MedicineLog.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(1);

    const pdfBuffer = await generateHealthPDF({
      user,
      profile,
      symptomLogs,
      prediction,
      medicineLogs
    });

    const filename = `HealthReport_${user.name?.replace(/\s+/g, "_") || "Patient"}_${new Date().toISOString().split("T")[0]}.pdf`;

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Content-Length": pdfBuffer.length
    });

    res.send(pdfBuffer);
  } catch (error) {
    console.error("Report generation error:", error);
    res.status(500).json({ success: false, error: "Failed to generate report" });
  }
});

export default router;
