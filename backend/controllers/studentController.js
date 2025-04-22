const Student = require("../models/Student");

exports.getStudentProfile = async (req, res) => {
  try {
    const { studentId } = req.params;
    const student = await Student.findOne({ studentId });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json(student);
  } catch (err) {
    console.error("Fetch student error:", err);
    res.status(500).json({ message: "Server error" });
  }
};