const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const AttendanceRecord = require('../models/AttendanceRecord');
const AttendanceStats = require('../models/AttendanceStats');

// GET student profile by studentId
router.get('/profile/:studentId', async (req, res) => {
  console.log(`🔥 /profile route hit with studentId: ${req.params.studentId}`);
  try {
    const student = await Student.findOne({ studentId: req.params.studentId });
    if (!student) {
      console.log('❌ Student not found in DB');
      return res.status(404).json({ error: 'Student not found' });
    }
    console.log('✅ Student found:', student);
    res.json(student);
  } catch (err) {
    console.error('❌ Error fetching student profile:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET attendance records by studentId
router.get('/attendrecords/:studentId', async (req, res) => {
  try {
    const records = await AttendanceRecord.find({ studentId: req.params.studentId }).sort({ date: -1 });
    if (records.length === 0) {
      return res.status(404).json({ error: 'No attendance records found for this student' });
    }
    res.json(records);
  } catch (err) {
    console.error('Error fetching attendance records:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET attendance stats by studentId
router.get('/attendance_stats/:studentId', async (req, res) => {
  try {
    const stats = await AttendanceStats.findOne({ studentId: req.params.studentId });
    if (!stats) {
      return res.status(404).json({ error: 'Attendance stats not found for this student' });
    }
    res.json(stats);
  } catch (err) {
    console.error('Error fetching attendance stats:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST route to upload/update student photo
router.post('/upload-photo', async (req, res) => {
  const { studentId, photo } = req.body;

  if (!studentId || !photo) {
    return res.status(400).json({ error: 'Missing studentId or photo' });
  }

  try {
    const updatedStudent = await Student.findOneAndUpdate(
      { studentId },
      { photo },
      { new: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json({ message: 'Photo updated successfully', photo: updatedStudent.photo });
  } catch (err) {
    console.error('Error uploading photo:', err);
    res.status(500).json({ error: 'Server error while uploading photo' });
  }
});

module.exports = router;
