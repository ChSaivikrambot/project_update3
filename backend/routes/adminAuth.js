// routes/adminAuth.js
const express = require('express');
const router = express.Router();

// Import controller methods
const { adminLogin, adminSignup } = require('../controllers/adminAuthController');

// Define routes for admin login and signup
router.post('/admin-login', adminLogin);  // Handles login requests
router.post('/admin-signup', adminSignup);  // Handles signup requests

// Export the router
module.exports = router;
