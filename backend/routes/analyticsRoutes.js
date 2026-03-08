import express from "express";
import { getTaskAnalytics } from "../controllers/analyticsController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getTaskAnalytics);

export default router;
