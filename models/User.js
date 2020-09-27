const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  avator: {
    type: String,
  },

  date: {
    type: Date,
    default: Date.now,
  },
  password: {
    type: String,
  },
});

module.exports = User = mongoose.model('user', UserSchema);
