const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['student', 'teacher'],
    required: true,
  },
  phone: {
    type: String,
    required: true,
    // removed `unique: true` based on your update
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  studentId: {
    type: String,
    required: function () {
      return this.role === 'student';
    },
    unique: true,
    sparse: true,
  },
  teacherId: {
    type: String,
    required: function () {
      return this.role === 'teacher';
    },
    unique: true,
    sparse: true,
  },

  // 🔐 New Fields for OTP
  otp: {
    type: String,
  },
  otpExpiry: {
    type: Date,
  },
});

module.exports = mongoose.model('User', userSchema);
