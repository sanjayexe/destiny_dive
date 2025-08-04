const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");
const College = require("./models/College");
const Scholarship = require("./models/Scholarships");
const CollegeInfo = require("./models/CollegeInfo");
const User = require("./models/User");
const Application = require("./models/Application");
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB Atlas
const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  console.error(
    "MONGO_URI is not set. Please set your MongoDB Atlas connection string in the .env file."
  );
  process.exit(1);
}
mongoose
  .connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Atlas connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Use routes
app.use("/api", authRoutes);

const userRoutes = require("./routes/userRoutes");
app.use("/api", userRoutes);
//GET all users
app.get("/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});
// GET all colleges
app.get("/colleges", async (req, res) => {
  try {
    const colleges = await College.find();
    res.json(colleges);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch colleges" });
  }
});

app.get("/collegeinfos", async (req, res) => {
  try {
    const { name } = req.query;
    let query = {};

    if (name) {
      query.name = { $regex: name, $options: "i" }; // Case-insensitive search
    }

    const infos = await CollegeInfo.find(query);
    res.json(infos);
  } catch (error) {
    console.error("Error fetching college infos:", error);
    res.status(500).json({ error: "Failed to fetch college infos" });
  }
});

// POST: Submit scholarship form
app.post("/scholarships", async (req, res) => {
  try {
    const scholarship = new Scholarship(req.body);
    await scholarship.save();
    res.status(201).json(scholarship);
  } catch (err) {
    res.status(500).json({ error: "Failed to submit scholarship form" });
  }
});

// GET: Fetch all scholarship applications
app.get("/scholarships", async (req, res) => {
  try {
    const scholarships = await Scholarship.find();
    res.json(scholarships);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch scholarships" });
  }
});

// PATCH: Accept a scholarship application
app.patch("/scholarships/:id/accept", async (req, res) => {
  try {
    const scholarship = await Scholarship.findByIdAndUpdate(
      req.params.id,
      { status: "Accepted" },
      { new: true }
    );
    res.json(scholarship);
  } catch (err) {
    res.status(500).json({ error: "Failed to accept scholarship" });
  }
});

// PATCH: Reject a scholarship application
app.patch("/scholarships/:id/reject", async (req, res) => {
  try {
    const scholarship = await Scholarship.findByIdAndUpdate(
      req.params.id,
      { status: "Rejected" },
      { new: true }
    );
    res.json(scholarship);
  } catch (err) {
    res.status(500).json({ error: "Failed to reject scholarship" });
  }
});

// POST: Submit college application form
app.post("/applications", async (req, res) => {
  try {
    console.log("POST /applications - Received data:", req.body);
    console.log("Email in request:", req.body.email);

    const application = new Application(req.body);
    console.log("Created application object:", application);

    await application.save();
    console.log("Application saved successfully with ID:", application._id);

    res
      .status(201)
      .json({ message: "Application submitted successfully!", application });
  } catch (err) {
    console.error("Error saving application:", err);
    res.status(500).json({ error: "Failed to submit application" });
  }
});
//GET all applications
app.get("/applications", async (req, res) => {
  try {
    const { email } = req.query;
    let query = {};

    console.log("GET /applications - Query params:", req.query);
    console.log("Email filter:", email);

    if (email) {
      query.email = email;
    }

    console.log("MongoDB query:", query);
    const applications = await Application.find(query);
    console.log("Found applications:", applications.length);
    console.log("Applications:", applications);

    res.json(applications);
  } catch (err) {
    console.error("Error fetching applications:", err);
    res.status(500).json({ error: "Failed to fetch applications" });
  }
});

// Start server
const port = process.env.PORT || 4503;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
