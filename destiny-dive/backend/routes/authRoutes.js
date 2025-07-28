const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  googleLoginUser,
} = require("../controllers/authController"); // Importing googleLoginUser controller

// Route to register user
router.post("/users", registerUser);

// Route to login user
router.post("/login", loginUser);

// Route to login with Google
router.post("/google-login", googleLoginUser);

module.exports = router;
