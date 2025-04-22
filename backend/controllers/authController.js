const User = require('../models/User');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// ✅ Signup Handler
exports.signup = async (req, res) => {
    try {
        const {
            role,
            studentId,
            teacherId,
            phone,
            password,
            name,
            department
        } = req.body;

        if (!role || !phone || !password) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Check if user already exists with this phone
        const existingUser = await User.findOne({ phone });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this phone number' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUserData = {
            role,
            phone,
            password: hashedPassword
        };

        // If student
        if (role === 'student') {
            if (!studentId || !department) {
                return res.status(400).json({ message: 'Student ID and department are required' });
            }

            const student = await Student.findOne({ studentId, department });
            if (!student) {
                return res.status(400).json({ message: 'Student ID not found in college records' });
            }

            const studentUserExists = await User.findOne({ studentId });
            if (studentUserExists) {
                return res.status(400).json({ message: 'User already registered with this student ID' });
            }

            newUserData.studentId = studentId;
            newUserData.name = student.name;
            newUserData.department = department;
        }

        // If teacher
        if (role === 'teacher') {
            if (!teacherId) {
                return res.status(400).json({ message: 'Teacher ID is required' });
            }

            const teacher = await Teacher.findOne({ teacherId });
            if (!teacher) {
                return res.status(400).json({ message: 'Teacher ID not found in college records' });
            }

            const teacherUserExists = await User.findOne({ teacherId });
            if (teacherUserExists) {
                return res.status(400).json({ message: 'User already registered with this teacher ID' });
            }

            newUserData.teacherId = teacherId;
            newUserData.name = teacher.name;
            newUserData.department = teacher.department;
        }

        const newUser = new User(newUserData);
        await newUser.save();

        const token = jwt.sign(
            {
                id: newUser._id,
                role: newUser.role,
                studentId: newUser.studentId,
                teacherId: newUser.teacherId
            },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            message: 'Signup successful',
            token,
            user: {
                role: newUser.role,
                name: newUser.name,
                department: newUser.department,
                [role === 'student' ? 'studentId' : 'teacherId']:
                    role === 'student' ? newUser.studentId : newUser.teacherId
            }
        });

    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// ✅ Login Handler
exports.login = async (req, res) => {
    try {
        const { phone, password } = req.body;

        if (!phone || !password) {
            return res.status(400).json({ message: 'Missing phone or password' });
        }

        const user = await User.findOne({ phone });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        const token = jwt.sign(
            {
                id: user._id,
                role: user.role,
                studentId: user.studentId,
                teacherId: user.teacherId
            },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                role: user.role,
                name: user.name,
                department: user.department,
                [user.role === 'student' ? 'studentId' : 'teacherId']:
                    user.role === 'student' ? user.studentId : user.teacherId
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
