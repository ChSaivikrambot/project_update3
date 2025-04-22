const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Admin schema
const adminSchema = new mongoose.Schema({
  adminId: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
});

// Hash the password before saving it
adminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next(); // Skip if password isn't modified
  this.password = await bcrypt.hash(this.password, 10); // Hash the password with salt rounds
  next();
});

// Method to compare the password
adminSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password); // Compare the passwords
};

module.exports = mongoose.model('Admin', adminSchema, 'admin_users');
