const express = require('express');
const router = express.Router();
const Timetable = require('../models/StudentTimetable');
const { protect } = require('../middlewares/authMiddleware');

// ---------------- Teacher Timetable ----------------
router.get('/teacher', protect, async (req, res) => {
  const { teacherId, day } = req.query;

  if (!teacherId || !day) {
    return res.status(400).json({ msg: 'Missing teacherId or day in query params' });
  }

  try {
    const timetable = await Timetable.find({
      teacherId: teacherId,
      day: day
    });

    if (timetable.length === 0) {
      return res.status(404).json({ msg: `No classes found for teacher ${teacherId} on ${day}` });
    }

    const formatted = timetable.map(entry => ({
      Period: entry.period,
      Subject: entry.subject,
      Classroom: entry.classroom,
      Section: entry.section,
      Department: entry.effectiveDepartment
    }));

    res.status(200).json({ timetable: formatted });
  } catch (err) {
    console.error('Error in GET /api/timetable/teacher:', err.message);
    res.status(500).json({ msg: 'Internal server error' });
  }
});

// ---------------- Student Timetable ----------------
router.get('/student', protect, async (req, res) => {
  const { department, section, day, year } = req.query;

  if (!department || !section || !day || !year) {
    return res.status(400).json({ msg: 'Missing department, section, year, or day in query params' });
  }

  try {
    const query = {
      effectiveDepartment: department,
      section: section,
      year: year
    };

    if (day !== "All") {
      query.day = day;
    }

    const timetable = await Timetable.find(query);

    if (timetable.length === 0) {
      return res.status(404).json({
        msg: `No timetable found for ${department} ${section} ${year}${day !== "All" ? ` on ${day}` : ""}`
      });
    }

    const formatted = timetable.map(entry => ({
      Day: entry.day,
      Period: entry.period,
      Subject: entry.subject,
      TeacherName: entry.teacherName,
      Classroom: entry.classroom
    }));

    res.status(200).json({ timetable: formatted });
  } catch (err) {
    console.error('Error in GET /api/timetable/student:', err.message);
    res.status(500).json({ msg: 'Internal server error' });
  }
});

module.exports = router;
