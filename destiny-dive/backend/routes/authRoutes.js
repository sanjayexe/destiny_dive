const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');  // Importing loginUser controller

// Route to register user
router.post('/users', registerUser);

// Route to login user
router.post('/login', loginUser);

module.exports = router;
