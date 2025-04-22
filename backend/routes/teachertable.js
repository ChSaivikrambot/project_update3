const express = require('express');
const router = express.Router();
const TeacherTable = require('../models/TeacherTable');
const { authenticateAdmin } = require('../middlewares/adminAuth');
// ✅ Ensure this matches actual file name exactly
// ✅ GET all entries or filter by query (department, year, section, day, etc.)
router.get('/', async (req, res) => {
  try {
    const filter = {};

    if (req.query.department) filter.department = req.query.department;
    if (req.query.year) filter.year = req.query.year;
    if (req.query.section) filter.section = req.query.section;
    if (req.query.day) filter.day = req.query.day;
    if (req.query.period) filter.period = req.query.period;
    if (req.query.teacherId) filter.teacherId = req.query.teacherId;

    const data = await TeacherTable.find(filter);

    if (!data || data.length === 0) {
      return res.status(404).json({ message: "No timetable entries found matching the filters." });
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ POST a new timetable entry (Admin Only)
router.post('/', authenticateAdmin, async (req, res) => {
  const { department, year, section, day, period, teacherId, teacherName, subject } = req.body;

  if (!department || !year || !section || !day || !period || !teacherId || !teacherName || !subject) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const newEntry = new TeacherTable(req.body);
    const saved = await newEntry.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ✅ UPDATE an entry by ID (Admin Only)
router.put('/:id', authenticateAdmin, async (req, res) => {
  try {
    const updated = await TeacherTable.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ message: "Entry not found." });

    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ✅ DELETE an entry by ID (Admin Only)
router.delete('/:id', authenticateAdmin, async (req, res) => {
  try {
    const deleted = await TeacherTable.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Entry not found." });

    res.json({ message: "Deleted successfully." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
