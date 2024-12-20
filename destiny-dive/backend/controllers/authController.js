const User = require("../models/User");
const bcrypt = require("bcryptjs"); // for password hashing
const jwt = require("jsonwebtoken"); // for JWT token generation

// Register user
exports.registerUser = async (req, res) => {
  const { username, emailOrMobile, password } = req.body;

  if (!username || !emailOrMobile || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    // Check if user already exists
    let user = await User.findOne({ emailOrMobile });
    if (user) {
      return res.status(400).json({
        message: "User already exists with this email or mobile number.",
      });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed Password:", hashedPassword);

    // Create new user
    const newUser = new User({
      username,
      emailOrMobile,
      password: hashedPassword,
    });

    await newUser.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser._id },
      "6a37d725ab81d366809e1b94bbfbee00fb4110de13f663aaf55076a725843257136131bea0ac817dcdb8e44b36c8c27856b6f6510c8cda4f41b6896518321d88",
      {
        expiresIn: "1h",
      }
    );

    res.status(201).json({
      message: "User registered successfully!",
      token, // Return the JWT token
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Login user
exports.loginUser = async (req, res) => {
  const { emailOrMobile, password } = req.body;

  if (!emailOrMobile || !password) {
    return res
      .status(400)
      .json({ message: "Email or mobile and password are required." });
  }

  try {
    // Find user by email or mobile
    const user = await User.findOne({
      emailOrMobile: emailOrMobile.toLowerCase(),
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid Email/mobile or password." });
    }

    // Compare the password
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password Match:", isMatch);

    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Invalid email/mobile or password." });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      "6a37d725ab81d366809e1b94bbfbee00fb4110de13f663aaf55076a725843257136131bea0ac817dcdb8e44b36c8c27856b6f6510c8cda4f41b6896518321d88",
      {
        expiresIn: "1h",
      }
    );

    res.status(200).json({
      message: "Login successful!",
      token, // Send the token back to the client
      user, // Send user details if needed
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};
