const mongoose = require('mongoose');

// Define the schema for attendance records
const recordSchema = new mongoose.Schema({
  studentId: { type: String, required: true },  // studentId is now required
  date: { type: String, required: true },  // date is now required
  period: { type: Number, required: true },  // period as a number
  status: { type: String, required: true },  // status is required
  section: { type: String, required: true },  // added section field (required)
  department: { type: String, required: true }  // added department field (required)
}, { timestamps: true }); // added timestamps to track creation and update times

// Export the model using the 'records' collection
module.exports = mongoose.model('AttendanceRecord', recordSchema, 'records');
