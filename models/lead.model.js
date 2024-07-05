const mongoose = require("mongoose");

const LeadSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    country: String,
    phone: String,
    Course: String,
    psuodoID: String,
    SalePerson: String,
    source: String,
    status: {
      type: String,
      enum: ["starting", "intrested", "buy-course", "payment-done"],
      default: "starting",
    },
    feedback: String,
    username: String,
    userID: String,
    role: String,
  },

  {
    timestamps: true, // Use Mongoose's built-in timestamps feature
  }
);

const LeadModel = mongoose.model("lead", LeadSchema);

module.exports = { LeadModel,LeadSchema };
