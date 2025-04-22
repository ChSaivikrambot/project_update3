require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const teacherRoutes = require('./routes/teacher');
const app = express();

// ✅ Increase body parser limits (before routes)
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

// ✅ Security & logging middleware
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

// ✅ Fix for express-rate-limit error
app.set('trust proxy', 1);

// ✅ Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: "Too many requests from this IP, please try again later",
});
app.use(limiter);

// ✅ MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// ✅ Import routes
const authRoutes = require("./routes/auth");
const dashboardRoutes = require("./routes/dashboard");
const studentRoutes = require("./routes/student");
const attendanceRoutes = require("./routes/attendance");
const timetableRoutes = require("./routes/timetable");
const adminAuthRoutes = require('./routes/adminAuth');
const teacherTableRoutes = require('./routes/teachertable');
// ✅ Use routes
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/timetable", timetableRoutes);
console.log("📦 Attendance routes loaded");
app.use('/api/teachers', teacherRoutes); 
app.use('/api/auth', adminAuthRoutes);
app.use('/api/teachertable', teacherTableRoutes);
// ✅ Root test route
app.get("/", (req, res) => {
  res.status(200).json({ message: "Attendance Tracker API is running 🚀" });
});

// ✅ 404 route
app.use((req, res) => {
  res.status(404).json({ message: "Not Found" });
});

// ✅ Global error handler
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err);
  if (process.env.NODE_ENV === 'development') {
    res.status(500).json({ error: err.message, stack: err.stack });
  } else {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
