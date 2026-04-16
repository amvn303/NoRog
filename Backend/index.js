import express from "express";
import cors from "cors";

import predictRoutes from "./routes/predict.js";
import simulateRoutes from "./routes/simulate.js";
import historyRoutes from "./routes/history.js";
import driftRoutes from "./routes/drift.js";
import profileRoutes from "./routes/profile.js";

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// API Routes
app.use("/api", predictRoutes);
app.use("/api", simulateRoutes);
app.use("/api", historyRoutes);
app.use("/api", driftRoutes);
app.use("/api", profileRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({
    name: "NoRog API",
    version: "2.0.0",
    status: "running",
    description: "AI-Powered Behavioral Health Intelligence System",
    endpoints: [
      "POST /api/predict",
      "POST /api/simulate",
      "GET  /api/history",
      "GET  /api/drift",
      "GET  /api/profile"
    ]
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.message);
  res.status(500).json({
    success: false,
    error: "Internal server error"
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🩺 NoRog API Server running on http://localhost:${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/`);
  console.log(`   Predict:      POST http://localhost:${PORT}/api/predict`);
  console.log(`   Simulate:     POST http://localhost:${PORT}/api/simulate`);
  console.log(`   History:      GET  http://localhost:${PORT}/api/history`);
  console.log(`   Drift:        GET  http://localhost:${PORT}/api/drift`);
  console.log(`   Profile:      GET  http://localhost:${PORT}/api/profile\n`);
});