const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    category: String,
    popularCourses: String,
    fees: String,
  },
  { _id: false }
);

const collegeInfoSchema = new mongoose.Schema({
  name: String,
  image: String,
  about: String,
  courses: [courseSchema],
});

module.exports = mongoose.model("CollegeInfo", collegeInfoSchema);
