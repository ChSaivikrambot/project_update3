const mongoose = require('mongoose');

// Define the AttendanceRestriction schema
const attendanceRestrictionSchema = new mongoose.Schema(
  {
    isRestricted: {
      type: Boolean,
      default: false, // Initially, the restriction is off
    },
  },
  { timestamps: true } // This will automatically add createdAt and updatedAt fields
);

// Create the model
const AttendanceRestriction = mongoose.model('AttendanceRestriction', attendanceRestrictionSchema);

module.exports = AttendanceRestriction;
