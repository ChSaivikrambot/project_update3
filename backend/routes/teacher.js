const express = require('express');
const router = express.Router();
const Teacher = require('../models/Teacher'); // Make sure this points to your Teacher model

// Route to get teacher by ID
router.get('/:teacherId', async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.teacherId);
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    res.json(teacher);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Route to update teacher profile
router.put('/:teacherId', async (req, res) => {
  try {
    const { name, department, phone } = req.body;
    
    // Validate the fields
    if (!name || !department || !phone) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Find teacher by ID and update
    const updatedTeacher = await Teacher.findByIdAndUpdate(
      req.params.teacherId,
      { name, department, phone },
      { new: true } // Return the updated teacher data
    );

    if (!updatedTeacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    res.json(updatedTeacher); // Send the updated teacher data as a response
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
