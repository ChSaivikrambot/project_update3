const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  teacherId: { 
    type: String, 
    required: true, 
    unique: true 
  },
  name: { 
    type: String, 
    required: true 
  },
  department: { 
    type: String, 
    required: true 
  },
  subjects: [{ 
    type: String 
  }],
  yearsOfExperience: { 
    type: Number 
  },
  email: String,
  phone: String
}, { timestamps: true });

module.exports = mongoose.model('Teacher', teacherSchema);