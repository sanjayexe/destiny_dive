const mongoose = require("mongoose");

const collegeSchema = new mongoose.Schema({
  name: String,
  location: String,
  type: String,
  chances: Number,
  minPercentage: Number,
  degree: [String],
  universityType: String,
  tuitionFee: Number,
  courseDuration: String,
});

module.exports = mongoose.model("colleges", collegeSchema);
