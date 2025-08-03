const User = require("../models/User");

// Update user information
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  console.log("User update request:", {
    userId: id,
    updateFields: Object.keys(updateData),
    hasProfileImage: !!updateData.profileImage,
    hasCustomProfileImage: updateData.hasCustomProfileImage,
  });

  try {
    // Validate the user exists
    const existingUser = await User.findById(id);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found." });
    }

    // Handle email uniqueness if email is being updated
    if (updateData.email && updateData.email !== existingUser.email) {
      const emailExists = await User.findOne({ email: updateData.email });
      if (emailExists) {
        return res.status(400).json({ message: "Email already exists." });
      }
    }

    // Validate profile image if it's being updated
    if (updateData.profileImage) {
      // Check if it's a valid data URL or URL
      if (
        !updateData.profileImage.startsWith("data:image/") &&
        !updateData.profileImage.startsWith("http://") &&
        !updateData.profileImage.startsWith("https://")
      ) {
        return res
          .status(400)
          .json({ message: "Invalid profile image format." });
      }

      // If it's a data URL (user uploaded image), mark it as custom
      if (updateData.profileImage.startsWith("data:image/")) {
        updateData.hasCustomProfileImage = true;
        console.log(
          "User update - Setting hasCustomProfileImage to true for uploaded image"
        );
      }
    }

    // Update the user
    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true, // Run schema validations
    });

    // Remove password from response
    const userResponse = updatedUser.toObject();
    delete userResponse.password;

    console.log("User updated successfully:", {
      userId: id,
      updatedFields: Object.keys(updateData),
      profileImageUpdated: !!updateData.profileImage,
      hasCustomProfileImage: updateData.hasCustomProfileImage,
    });

    res.status(200).json({
      message: "User updated successfully",
      user: userResponse,
    });
  } catch (error) {
    console.error("Error updating user:", error);

    // Handle mongoose validation errors
    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map(
        (err) => err.message
      );
      return res.status(400).json({
        message: "Validation error",
        errors: validationErrors,
      });
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json({
        message: `${field} already exists.`,
      });
    }

    res.status(500).json({ message: "Internal server error." });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  const { id } = req.params;

  console.log("Get user by ID request:", { userId: id });

  try {
    const user = await User.findById(id).select("-password");
    if (!user) {
      console.log("Get user by ID - User not found:", id);
      return res.status(404).json({ message: "User not found." });
    }

    console.log("Get user by ID - User found:", {
      username: user.username,
      email: user.email,
      profileImage: user.profileImage,
      hasProfileImage: !!user.profileImage,
      hasCustomProfileImage: user.hasCustomProfileImage,
    });

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};
