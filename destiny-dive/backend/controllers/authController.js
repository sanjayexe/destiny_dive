const User = require("../models/User");
const bcrypt = require("bcryptjs"); // for password hashing
const jwt = require("jsonwebtoken"); // for JWT token generation
const { OAuth2Client } = require("google-auth-library");
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

// Helper function to detect if input is email or mobile
const detectInputType = (input) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const mobileRegex = /^\d{10}$/;

  if (emailRegex.test(input)) {
    return { type: "email", value: input.toLowerCase() };
  } else if (mobileRegex.test(input)) {
    return { type: "mobile", value: input };
  } else {
    return { type: "invalid", value: input };
  }
};

// Register user
exports.registerUser = async (req, res) => {
  const { username, emailOrMobile, password } = req.body;

  if (!username || !emailOrMobile || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    // Detect if input is email or mobile
    const inputType = detectInputType(emailOrMobile);

    if (inputType.type === "invalid") {
      return res.status(400).json({
        message:
          "Please enter a valid email address or 10-digit mobile number.",
      });
    }

    // Check if user already exists with emailOrMobile
    let existingUser = await User.findOne({ emailOrMobile });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists with this email or mobile number.",
      });
    }

    // Check if user exists with the specific field (email or phoneNumber)
    if (inputType.type === "email") {
      existingUser = await User.findOne({ email: inputType.value });
      if (existingUser) {
        return res.status(400).json({
          message: "User already exists with this email address.",
        });
      }
    } else if (inputType.type === "mobile") {
      existingUser = await User.findOne({ phoneNumber: inputType.value });
      if (existingUser) {
        return res.status(400).json({
          message: "User already exists with this mobile number.",
        });
      }
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed Password:", hashedPassword);

    // Create user data object
    const userData = {
      username,
      emailOrMobile,
      password: hashedPassword,
    };

    // Add to specific field based on input type
    if (inputType.type === "email") {
      userData.email = inputType.value;
    } else if (inputType.type === "mobile") {
      userData.phoneNumber = inputType.value;
    }

    // Create new user
    const newUser = new User(userData);
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
      token,
      userType: inputType.type, // Return whether user signed up with email or mobile
    });
  } catch (error) {
    console.error("Error registering user:", error);

    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      if (field === "email") {
        return res
          .status(400)
          .json({ message: "Email address already exists." });
      } else if (field === "phoneNumber") {
        return res
          .status(400)
          .json({ message: "Mobile number already exists." });
      }
    }

    res.status(500).json({ message: "Internal server error." });
  }
};

// Login user
exports.loginUser = async (req, res) => {
  const { emailOrMobile, password } = req.body;
  try {
    // Find user by email or mobileNumber
    const user = await User.findOne({
      $or: [{ email: emailOrMobile }, { mobileNumber: emailOrMobile }],
    });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;
    res.json({ user: userResponse });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.googleLoginUser = async (req, res) => {
  const { credential } = req.body;
  if (!credential) {
    return res.status(400).json({ message: "No credential provided" });
  }
  try {
    // Verify Google ID token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    // Extract user info
    const { sub, email, name, picture } = payload;
    // Find or create user
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({
        username: name,
        email,
        emailOrMobile: email, // Assign Google email to emailOrMobile
        profileImage: picture,
        googleId: sub,
        provider: "google",
        // No password for Google users
      });
      await user.save();
    } else {
      // Optionally update profile image, provider, and googleId if changed
      let updated = false;
      if (picture && user.profileImage !== picture) {
        user.profileImage = picture;
        updated = true;
      }
      if (!user.googleId) {
        user.googleId = sub;
        updated = true;
      }
      if (user.provider !== "google") {
        user.provider = "google";
        updated = true;
      }
      if (updated) await user.save();
    }
    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;
    res.json({ user: userResponse });
  } catch (err) {
    console.error("Google login error:", err);
    res.status(401).json({ message: "Invalid Google credential" });
  }
};
