const express = require("express");
const router = express.Router();
const { updateUser } = require("../controllers/userController");

// Route to update user information
router.put("/users/:id", updateUser);

module.exports = router;
