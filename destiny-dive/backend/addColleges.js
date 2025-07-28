const mongoose = require("mongoose");
const College = require("./models/College");
const CollegeInfo = require("./models/CollegeInfo");
const fs = require("fs");
const path = require("path");

const MONGODB_URI = process.env.MONGO_URI;

// Read colleges from db.json
const dbPath = path.join(__dirname, "../../db.json");
const dbData = JSON.parse(fs.readFileSync(dbPath, "utf-8"));
const colleges = dbData.colleges;

// Map db.json fields to College model fields
const mappedColleges = colleges.map((college) => ({
  name: college.name,
  location: college.location,
  type: college.type,
  chances: college.chances,
  minPercentage: college.minPercentage,
  degree: college.degree,
  universityType: college.universityType,
  tuitionFee: college.tuitionFee,
  courseDuration: college.courseDuration,
}));

// Insert collegeInfo data
const collegeInfos = dbData.collegeInfo;
const mappedCollegeInfos = collegeInfos.map((info) => ({
  name: info.name,
  image: info.image,
  about: info.about,
  courses: info.courses,
}));

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    const collegeCount = await College.countDocuments();
    if (collegeCount > 0) {
      console.log("Colleges already exist in MongoDB. Skipping insert.");
      mongoose.disconnect();
      return;
    }
    console.log("MongoDB connected");
    await College.insertMany(mappedColleges);
    await CollegeInfo.insertMany(mappedCollegeInfos);
    console.log("Colleges and CollegeInfo inserted successfully!");
    mongoose.disconnect();
  })
  .catch((err) => {
    console.error("Error:", err);
    mongoose.disconnect();
  });
