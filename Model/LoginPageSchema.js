const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  resetString: {
    type: String,
  },
});

const loginUser = mongoose.model("loginUser", userSchema);

module.exports = loginUser;
