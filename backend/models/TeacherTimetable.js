const mongoose = require('mongoose');

// Schema for individual timetable entries
const TimetableEntrySchema = new mongoose.Schema({
  Day: String,
  Period: Number,
  Subject: String,
  Section: String,
  Classroom: String,
  "Original Dept": String,
  "Effective Dept": String
});

// Schema for each teacher's timetable
const TeacherTimetableSchema = new mongoose.Schema({
  teacherId: { type: String, required: true },
  teacherName: String,
  timetable: [TimetableEntrySchema]
});

// Explicitly specify collection name as "teachertimetable"
module.exports = mongoose.model('TeacherTimetable', TeacherTimetableSchema, 'teachertimetable');
