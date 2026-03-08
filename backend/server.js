import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

// Route imports
import authRoutes from "./routes/authRoutes.js";
import employeeRoutes from "./routes/employeeRoutes.js";
import departmentRoutes from "./routes/departmentRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: ["http://localhost:5173", /\.vercel\.app$/, /\.onrender\.com$/],
  credentials: true,
}));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/analytics", analyticsRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ message: "TMS API is running ✅" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`));
