require('dotenv').config();  // Ensure dotenv is required to access environment variables
const Admin = require('../models/Admin');
const AdminMaster = require('../models/AdminMaster');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Admin Signup Controller
exports.adminSignup = async (req, res) => {
  const { adminId, password, phone } = req.body;
  
  console.log('Admin Signup Request:', { adminId, password, phone });

  try {
    // Check if the admin already exists
    const existing = await Admin.findOne({ adminId });
    if (existing) {
      console.log(`Admin with adminId ${adminId} already exists.`);
      return res.status(409).json({ success: false, message: 'Admin already exists' });
    }

    // Create the new admin object without hashing the password manually
    const admin = new Admin({ adminId, password, phone });
    
    // Save the new admin to the database
    await admin.save();

    // Return success response
    res.status(201).json({ success: true, message: 'Signup successful' });
  } catch (err) {
    console.error('Signup Error:', err);
    res.status(500).json({ success: false, message: 'Signup failed' });
  }
};

// Admin Login Controller
exports.adminLogin = async (req, res) => {
  const { adminId, password } = req.body;

  console.log('Admin Login Request:', { adminId, password });

  try {
    // Find the admin by adminId
    const adminUser = await Admin.findOne({ adminId });
    if (!adminUser) {
      console.log(`Admin with adminId ${adminId} not found.`);
      return res.status(404).json({ success: false, message: 'Invalid adminId or password' });
    }

    // Compare the password with the hashed password in the database
    console.log('Stored Hashed Password:', adminUser.password);
    const isMatch = await bcrypt.compare(password, adminUser.password);
    console.log('Password Match:', isMatch);
    
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid adminId or password' });
    }

    // Check if the admin is authorized (exists in AdminMaster)
    const masterExists = await AdminMaster.findOne({ admin_id: adminId });
    if (!masterExists) {
      console.log(`Admin with adminId ${adminId} is not authorized in AdminMaster.`);
      return res.status(403).json({ success: false, message: 'Not authorized as admin' });
    }

    // Create a JWT token with the secret key from the .env file
    const token = jwt.sign({ id: adminUser._id, adminId }, process.env.JWT_SECRET, { expiresIn: '7d' });
    console.log('Generated Token:', token);

    // Send success response with token and admin data
    res.json({
      success: true,
      token,
      message: 'Login successful',
      adminData: masterExists,
    });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
