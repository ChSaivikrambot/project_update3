// models/AttendanceStats.js
const mongoose = require('mongoose');

const attendanceStatsSchema = new mongoose.Schema({
  studentId: { type: String, required: true },
  performanceTier: String,
  attendancePercentage: Number,
  fullDays: Number,
  absentDays: Number,
  partial20Days: Number,
  partial40Days: Number,
  partial80Days: Number,
});

// Set the collection name explicitly to 'attendance_stats'
module.exports = mongoose.model('AttendanceStats', attendanceStatsSchema, 'attendance_stats');
