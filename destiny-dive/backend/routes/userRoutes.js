const express = require("express");
const router = express.Router();
const { updateUser, getUserById } = require("../controllers/userController");

// Route to update user information
router.put("/users/:id", updateUser);

// Route to get user by ID
router.get("/users/:id", getUserById);

module.exports = router;
