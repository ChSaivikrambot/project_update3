const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const sendEmail = require('../utils/sendEmail');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const OTP_EXPIRY_MINUTES = 5;
const ALLOWED_ROLES = ['student', 'teacher'];

// 📌 Send OTP (uses phone + ID to verify)
router.post('/send-otp', async (req, res) => {
  const { phone, studentId, teacherId, email } = req.body;

  if (!phone || !email) return res.status(400).json({ message: 'Phone and email are required' });

  const query = studentId ? { phone, studentId } : teacherId ? { phone, teacherId } : null;
  if (!query) return res.status(400).json({ message: 'Student ID or Teacher ID is required' });

  try {
    const user = await User.findOne(query);
    if (!user) return res.status(404).json({ message: 'User not found with provided details' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpiry = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60000);
    await user.save();

    const subject = 'Your OTP for Password Reset';
    const text = `Hi ${user.name || 'User'},\n\nYour OTP is: ${otp}\nIt will expire in ${OTP_EXPIRY_MINUTES} minutes.\n\n- KMIT Attendance System`;

    await sendEmail(email, subject, text);

    res.status(200).json({ message: 'OTP sent successfully to email' });
  } catch (err) {
    console.error('Send OTP error:', err);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
});

// 📌 Verify OTP
router.post('/verify-otp', async (req, res) => {
  const { phone, studentId, teacherId, otp } = req.body;

  const query = studentId ? { phone, studentId } : teacherId ? { phone, teacherId } : null;
  if (!query || !otp) return res.status(400).json({ message: 'Phone, ID, and OTP required' });

  try {
    const user = await User.findOne(query);
    if (!user || user.otp !== otp || user.otpExpiry < new Date()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    res.status(200).json({ message: 'OTP verified' });
  } catch (err) {
    console.error('OTP verify error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// 📌 Reset Password
router.post('/reset-password', async (req, res) => {
  const { phone, studentId, teacherId, otp, newPassword } = req.body;

  const query = studentId ? { phone, studentId } : teacherId ? { phone, teacherId } : null;
  if (!query || !otp || !newPassword) {
    return res.status(400).json({ message: 'Phone, ID, OTP, and new password required' });
  }

  try {
    const user = await User.findOne(query);
    if (!user || user.otp !== otp || user.otpExpiry < new Date()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (err) {
    console.error('Password reset error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Signup
router.post('/signup', async (req, res) => {
  try {
    const { role, phone, password, studentId, teacherId, department, email } = req.body;

    if (!role || !phone || !password || !email) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    if (!ALLOWED_ROLES.includes(role)) {
      return res.status(400).json({ message: 'Invalid role specified' });
    }

    const idField = role === 'student' ? 'studentId' : 'teacherId';
    const idValue = role === 'student' ? studentId : teacherId;
    const existingUser = await User.findOne({ phone, [idField]: idValue });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this phone and ID' });
    }

    const userData = {
      role,
      phone,
      email,
      password: await bcrypt.hash(password, 10),
    };

    if (role === 'student') {
      if (!studentId || !department) {
        return res.status(400).json({ message: 'Student ID and department are required' });
      }

      const student = await Student.findOne({ studentId, department });
      if (!student) return res.status(400).json({ message: 'Student ID not recognized' });

      userData.studentId = studentId;
      userData.department = department;
      userData.name = student.name;
    }

    if (role === 'teacher') {
      if (!teacherId) return res.status(400).json({ message: 'Teacher ID required' });

      const teacher = await Teacher.findOne({ teacherId });
      if (!teacher) return res.status(400).json({ message: 'Teacher ID not recognized' });

      userData.teacherId = teacherId;
      userData.name = teacher.name;
    }

    const newUser = new User(userData);
    await newUser.save();

    const token = jwt.sign({ id: newUser._id, role: newUser.role }, JWT_SECRET, { expiresIn: '1d' });

    res.status(201).json({ message: 'Signup successful', token, role: newUser.role });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Login (Updated with college records check)
router.post('/login', async (req, res) => {
  try {
    const { role, password, studentId, teacherId } = req.body;

    if (!role || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const identifier = role === 'student' ? studentId : teacherId;
    const idField = role === 'student' ? 'studentId' : 'teacherId';

    if (!identifier) {
      return res.status(400).json({ message: `${role === 'student' ? 'Student' : 'Teacher'} ID is required` });
    }

    // 🔎 Check college database first
    if (role === 'student') {
      const existsInStudents = await Student.findOne({ studentId });
      if (!existsInStudents) {
        return res.status(404).json({ message: 'Invalid College ID: Student not found in college records' });
      }
    }

    if (role === 'teacher') {
      const existsInTeachers = await Teacher.findOne({ teacherId });
      if (!existsInTeachers) {
        return res.status(404).json({ message: 'Invalid College ID: Teacher not found in college records' });
      }
    }

    const user = await User.findOne({ [idField]: identifier });
    if (!user) return res.status(400).json({ message: 'Invalid credentials (Not signed up yet)' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials (Wrong password)' });

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({
      message: 'Login successful',
      token,
      role: user.role,
      studentId: user.studentId,
      teacherId: user.teacherId,
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
