const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    studentId: String,
    name: String,
    department: String,
    section: String,
    currentYear: Number,
    yearOfAdmission: String,
    photo: String
});

module.exports = mongoose.model('Student', studentSchema);
