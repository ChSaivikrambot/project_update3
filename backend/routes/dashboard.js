const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const User = require("../models/User");
const Student = require("../models/Student");
const Teacher = require("../models/Teacher"); // Make sure to import Teacher model

// Student Dashboard Route
router.get("/student", protect, async (req, res) => {
  if (req.user.role !== "student") {
    return res.status(403).json({ message: "Access forbidden: Students only" });
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const studentProfile = await Student.findOne({ studentId: user.studentId });
    if (!studentProfile) {
      return res.status(404).json({ message: "Student profile not found in college records" });
    }

    res.json({
      message: "Welcome to the Student Dashboard",
      profile: {
        ...studentProfile.toObject(),
        phone: user.phone // Combine data from both collections
      }
    });
  } catch (error) {
    console.error("Error fetching student dashboard:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Teacher Dashboard Route
router.get("/teacher", protect, async (req, res) => {
  if (req.user.role !== "teacher") {
    return res.status(403).json({ message: "Access forbidden: Teachers only" });
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const teacherProfile = await Teacher.findOne({ teacherId: user.teacherId });
    if (!teacherProfile) {
      return res.status(404).json({ message: "Teacher profile not found in college records" });
    }

    res.json({
      message: "Welcome to the Teacher Dashboard",
      profile: {
        ...teacherProfile.toObject(),
        phone: user.phone, // Include user contact info
        email: user.email || teacherProfile.email // Prefer user's email if exists
      }
    });
  } catch (error) {
    console.error("Error fetching teacher dashboard:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;