const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  hn: {
    type: String,
    required: true
  },
  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const UserModel = mongoose.model("User", userSchema); 

module.exports = UserModel;