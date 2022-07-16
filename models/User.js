const mongoose = require('mongoose');

const UserScheme = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  avatarUrl: String
}, {
  timestamps: true,
});

module.exports.UserModel = mongoose.model('User', UserScheme);