const mongoose = require("mongoose");

const scholarshipSchema = new mongoose.Schema({
  userName: String,
  userEmail: String,
  fullName: String,
  mobileNumber: String,
  gender: String,
  dateOfBirth: String,
  twelfthMark: String,
  tenthMark: String,
  firstGraduate: String,
  annualIncome: String,
  cgMq: String,
  religion: String,
  singleParent: String,
  caste: String,
  status: { type: String, default: "Pending" },
});

module.exports = mongoose.model("Scholarship", scholarshipSchema);
