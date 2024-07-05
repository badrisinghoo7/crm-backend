const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "lead-person",
    enum: ["lead-person", "sale-person", "admin"],
    required: true,
  },
});

const UserModel = mongoose.model("User", UserSchema);

module.exports = {
  UserModel,
};
