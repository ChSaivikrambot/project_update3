const mongoose = require('mongoose');

const TimetableSchema = new mongoose.Schema({
  day: { type: String, required: true },
  period: { type: Number, required: true },
  teacherId: { type: String, required: true },
  teacherName: { type: String, required: true },
  originalDepartment: { type: String, required: true },
  effectiveDepartment: { type: String, required: true },
  subject: { type: String, required: true },
  section: { type: String, required: true },
  classroom: { type: String, required: true },
  year: { type: String, required: true } // 👈 Add this line
});

// Collection name is 'timetable'
module.exports = mongoose.model('Timetable', TimetableSchema, 'timetable');
