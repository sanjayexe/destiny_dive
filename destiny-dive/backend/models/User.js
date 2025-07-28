const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    emailOrMobile: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      unique: true,
      sparse: true, // Allows multiple null values
    },
    phoneNumber: {
      type: String,
      unique: true,
      sparse: true, // Allows multiple null values
    },
    password: {
      type: String,
      required: function () {
        // Only require password if provider is not 'google'
        return this.provider !== "google";
      },
    },
    about: {
      type: String,
    },
    profileImage: {
      type: String,
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    provider: {
      type: String,
      default: "local",
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
