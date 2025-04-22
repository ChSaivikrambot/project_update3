const mongoose = require('mongoose');

// Define the schema for the teachertable collection
const teacherTableSchema = new mongoose.Schema({
  department: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  section: {
    type: String,
    required: true,
  },
  day: {
    type: String,
    required: true, // Added 'day' field as per your example data
  },
  period: {
    type: String,
    required: true,
  },
  teacherId: {
    type: String,
    required: true,
  },
  teacherName: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  }
}, { collection: 'teachertable' }); // MongoDB collection name

// Create and export the model
const TeacherTable = mongoose.model('TeacherTable', teacherTableSchema);

module.exports = TeacherTable;
