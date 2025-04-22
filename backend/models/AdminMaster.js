const mongoose = require('mongoose');

// Define the admin master schema
const adminMasterSchema = new mongoose.Schema({
  admin_id: { type: String, required: true, unique: true },  // Admin identifier
  main_role: { type: String, required: true },  // Main role of the admin
  phone: { type: String, required: false },  // Optional phone number
  email: { type: String, required: false },  // Optional email address
  name: { type: String, required: true },  // Admin's name
}, { collection: 'admins' });  // Ensuring collection name is 'admins'

// Export the model for AdminMaster
module.exports = mongoose.model('AdminMaster', adminMasterSchema);
