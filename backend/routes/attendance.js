const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const AttendanceRecord = require('../models/AttendanceRecord');
const AttendanceStats = require('../models/AttendanceStats');
const AttendanceRestriction = require('../models/AttendanceRestriction');
const { protect } = require('../middlewares/authMiddleware');
const { Parser } = require('json2csv');
const { authenticateAdmin } = require('../middlewares/adminAuth');
/**
 * Route: GET /init-index
 * Purpose: Create a compound unique index on (studentId, date, period)
 */
router.get('/init-index', async (req, res) => {
  try {
    await AttendanceRecord.collection.createIndex(
      { studentId: 1, date: 1, period: 1 },
      { unique: true }
    );
    res.json({ message: 'Index created successfully' });
  } catch (err) {
    console.error('Index creation error:', err);
    res.status(500).json({ error: 'Index creation failed' });
  }
});

/**
 * Route: GET /students
 * Purpose: Filter students by department, year, and section.
 */
router.get('/students', protect, async (req, res) => {
  const { department, currentYear, section } = req.query;

  if (!department || !currentYear || !section) {
    return res.status(400).json({ error: 'Missing query parameters' });
  }

  try {
    const students = await Student.find({
      department,
      currentYear: Number(currentYear),
      section
    });

    if (students.length === 0) {
      return res.status(404).json({ error: 'No students found for this selection' });
    }

    res.json(students);
  } catch (err) {
    console.error('Error fetching students:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * Route: POST /mark
 * Purpose: Mark attendance using insertMany with duplicate prevention.
 */
router.post('/mark', protect, async (req, res) => {
  try {
    const { records } = req.body;
    if (!records || !Array.isArray(records)) {
      return res.status(400).json({ error: 'Invalid attendance data' });
    }

    const restriction = await AttendanceRestriction.findOne();
    if (restriction?.isRestricted && req.user.role === 'teacher') {
      const teacherSection = req.user.section;
      const invalidRecords = [];

      for (let record of records) {
        const student = await Student.findOne({ studentId: record.studentId });
        if (!student || student.section !== teacherSection) {
          invalidRecords.push(record.studentId);
        }
      }

      if (invalidRecords.length > 0) {
        return res.status(403).json({
          error: 'Restricted: You can only mark attendance for your own section',
          invalidStudentIds: invalidRecords
        });
      }
    }

    const result = await AttendanceRecord.insertMany(records, {
      ordered: false,
      rawResult: true
    });

    await updateAttendanceStats(records);

    res.status(201).json({
      message: 'Attendance processed',
      inserted: result.insertedCount,
      errors: result.getWriteErrors?.() || []
    });
  } catch (error) {
    handleAttendanceError(error, res);
  }
});

/**
 * Route: PUT /update
 * Purpose: Update existing attendance records atomically.
 */
router.put('/update', protect, async (req, res) => {
  try {
    const { records } = req.body;
    if (!records || !Array.isArray(records)) {
      return res.status(400).json({ error: 'Invalid attendance data' });
    }

    const restriction = await AttendanceRestriction.findOne();
    if (restriction?.isRestricted && req.user.role === 'teacher') {
      const teacherSection = req.user.section;
      const invalidRecords = [];

      for (let record of records) {
        const student = await Student.findOne({ studentId: record.studentId });
        if (!student || student.section !== teacherSection) {
          invalidRecords.push(record.studentId);
        }
      }

      if (invalidRecords.length > 0) {
        return res.status(403).json({
          error: 'Restricted: You can only update attendance for your own section',
          invalidStudentIds: invalidRecords
        });
      }
    }

    const bulkOps = records.map(record => ({
      updateOne: {
        filter: {
          studentId: record.studentId,
          date: record.date,
          period: record.period
        },
        update: { $set: record },
        upsert: false
      }
    }));

    const result = await AttendanceRecord.bulkWrite(bulkOps);
    await updateAttendanceStats(records);

    res.json({
      matched: result.matchedCount,
      modified: result.modifiedCount
    });
  } catch (error) {
    handleAttendanceError(error, res);
  }
});

/**
 * Function: updateAttendanceStats
 * Purpose: Update attendance statistics for students.
 */
async function updateAttendanceStats(records) {
  const studentIds = [...new Set(records.map(r => r.studentId))];

  for (const studentId of studentIds) {
    const allRecords = await AttendanceRecord.find({ studentId });

    let totalRecordedPeriods = 0;
    let totalPresentPeriods = 0;

    allRecords.forEach(record => {
      totalRecordedPeriods++;
      if (record.status === 'Present') {
        totalPresentPeriods++;
      }
    });

    const attendancePercentage = totalRecordedPeriods > 0
      ? Number(((totalPresentPeriods / totalRecordedPeriods) * 100).toFixed(2))
      : 0;

    await AttendanceStats.findOneAndUpdate(
      { studentId },
      {
        totalRecordedPeriods,
        totalPresentPeriods,
        attendancePercentage,
        performanceTier: calculateTier(attendancePercentage),
        lastUpdated: new Date()
      },
      { upsert: true, new: true }
    );
  }
}

/**
 * Helper: calculateTier
 */
function calculateTier(percentage) {
  return percentage >= 85 ? 'Excellent' :
    percentage >= 70 ? 'Good' :
    percentage >= 50 ? 'Average' : 'Low';
}

/**
 * Helper: handleAttendanceError
 */
function handleAttendanceError(error, res) {
  console.error('Attendance Error:', error);

  if (error.name === 'MongoBulkWriteError' && error.code === 11000) {
    return res.status(409).json({
      error: 'Duplicate entry',
      details: error.message
    });
  }

  res.status(500).json({
    error: 'Attendance processing failed',
    code: error.code || 'UNKNOWN'
  });
}

/**
 * Route: GET /view-stats
 */
router.get('/view-stats', protect, async (req, res) => {
  const { department, section, year } = req.query;
  if (!department || !section || !year) {
    return res.status(400).json({ error: 'Missing query parameters' });
  }

  try {
    const stats = await AttendanceStats.aggregate([
      {
        $lookup: {
          from: 'students',
          localField: 'studentId',
          foreignField: 'studentId',
          as: 'studentInfo'
        }
      },
      { $unwind: '$studentInfo' },
      {
        $match: {
          'studentInfo.department': department,
          'studentInfo.section': section,
          'studentInfo.currentYear': parseInt(year)
        }
      },
      {
        $project: {
          _id: 0,
          studentId: 1,
          name: '$studentInfo.name',
          attendancePercentage: 1,
          performanceTier: 1
        }
      }
    ]);

    res.status(200).json(stats);
  } catch (error) {
    console.error('🔥 Error fetching attendance stats:', error);
    res.status(500).json({ error: 'Server Error' });
  }
});

/**
 * Route: GET /download-csv
 */
router.get('/download-csv', protect, async (req, res) => {
  const { department, section, year } = req.query;
  if (!department || !section || !year) {
    return res.status(400).json({ error: 'Missing query parameters' });
  }

  try {
    const stats = await AttendanceStats.aggregate([
      {
        $lookup: {
          from: 'students',
          localField: 'studentId',
          foreignField: 'studentId',
          as: 'studentInfo'
        }
      },
      { $unwind: '$studentInfo' },
      {
        $match: {
          'studentInfo.department': department,
          'studentInfo.section': section,
          'studentInfo.currentYear': parseInt(year)
        }
      },
      {
        $project: {
          _id: 0,
          studentId: 1,
          name: '$studentInfo.name',
          attendancePercentage: 1,
          performanceTier: 1
        }
      }
    ]);

    if (!stats.length) {
      return res.status(404).json({ error: 'No stats found for selected filter' });
    }

    const fields = ['studentId', 'name', 'attendancePercentage', 'performanceTier'];
    const json2csv = new Parser({ fields });
    const csv = json2csv.parse(stats);

    res.header('Content-Type', 'text/csv');
    res.attachment(`Attendance-${department}-${section}-Y${year}.csv`);
    res.send(csv);
  } catch (error) {
    console.error('🔥 Error generating CSV:', error);
    res.status(500).json({ error: 'Failed to generate CSV' });
  }
});

/**
 * Route: POST /restrict
 * Purpose: Enable section-based attendance restriction
 */
router.post('/restrict', authenticateAdmin, async (req, res) => {
  try {
    await AttendanceRestriction.findOneAndUpdate(
      {},
      { isRestricted: true },
      { upsert: true, new: true }
    );
    res.status(200).json({ message: 'Restriction enabled' });
  } catch (error) {
    console.error('Error enabling restriction:', error);
    res.status(500).json({ error: 'Failed to enable restriction' });
  }
});

/**
 * Route: POST /unrestrict
 * Purpose: Disable section-based attendance restriction
 */
router.post('/unrestrict', authenticateAdmin, async (req, res) => {
  try {
    await AttendanceRestriction.findOneAndUpdate(
      {},
      { isRestricted: false },
      { upsert: true, new: true }
    );
    res.status(200).json({ message: 'Restriction disabled' });
  } catch (error) {
    console.error('Error disabling restriction:', error);
    res.status(500).json({ error: 'Failed to disable restriction' });
  }
});

// Route: GET /restriction-status
// Purpose: Get the current restriction status
router.get('/restriction-status', authenticateAdmin, async (req, res) => {
  try {
    const restriction = await AttendanceRestriction.findOne();
    res.status(200).json({ isRestricted: restriction?.isRestricted || false });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get restriction status' });
  }
});
/**
 * Route: GET /debug
 */
router.get('/debug', (req, res) => {
  res.status(200).json({ message: "✅ Attendance route works" });
});

module.exports = router;