const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  // Personal Information
  fullName: String,
  gender: String,
  dob: String,
  community: String,
  nationality: String,
  aadharNumber: String,
  phoneNumber: String,
  email: String,
  address: String,
  parentsName: String,
  parentsOccupation: String,
  parentsPhone: String,
  // Academic Information
  tenthBoard: String,
  tenthYear: String,
  tenthPercentage: String,
  twelfthBoard: String,
  twelfthYear: String,
  twelfthPercentage: String,
  stream: String,
  rollNumber12: String,
  // Subject Specialization
  subjectSpecialization: String,
  // Entrance Exam Details
  examName: String,
  rollNumber: String,
  scoreRank: String,
  // Documents (store as Mixed for flexibility)
  passportPhoto: mongoose.Schema.Types.Mixed,
  marksheet: mongoose.Schema.Types.Mixed,
  certificate: mongoose.Schema.Types.Mixed,
  examScorecard: mongoose.Schema.Types.Mixed,
  supportingDocument: mongoose.Schema.Types.Mixed,
  // Declaration
  declaration: Boolean,
  // College Info
  collegeName: String,
  Type: String,
  submissionDate: String,
  // Abroad-specific fields (optional)
  twelfthSubjects: String,
  gradeOrGPA: String,
  predictedGrade: String,
  testName: String,
  testScore: String,
  classRank: String,
  desiredMajor: String,
  reasonForProgram: String,
  extracurricular: mongoose.Schema.Types.Mixed,
  leadershipRoles: String,
  awardsHonors: String,
  essay: String,
  sop: String,
  financialInfo: String,
  financialAid: String,
  documents: mongoose.Schema.Types.Mixed,
  applicationFee: String,
  agreement: String,
});

module.exports = mongoose.model("Application", applicationSchema);
