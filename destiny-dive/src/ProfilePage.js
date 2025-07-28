import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "./UserContext";
import { useNavigate } from "react-router-dom";
import { BsChat, BsTelephone, BsQuestionCircle } from "react-icons/bs";
import { FiMenu } from "react-icons/fi";
import { Link } from "react-router-dom";
import {
  FaEdit,
  FaSave,
  FaTimes,
  FaUser,
  FaEnvelope,
  FaPhone,
} from "react-icons/fa";
import "./ProfilePage.css";
import logo from "./images/navlogo.png";
import star from "./images/star-img.png";
import defaultProfilePic from "./images/default-profile.png";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

function ProfilePage() {
  const { user, setUser } = useContext(UserContext); // Access user from context
  const navigate = useNavigate();
  const [profile, setProfile] = useState(user || {});
  const [image, setImage] = useState(""); // State to store uploaded image URL
  const [editFields, setEditFields] = useState({}); // Track edit states for fields
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // States for "See More" functionality
  const [showMoreStatus, setShowMoreStatus] = useState(false);
  const [showMoreWishlist, setShowMoreWishlist] = useState(false);

  // Initialize profile data
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    console.log("ProfilePage - Initializing profile data:", {
      user: user ? "exists" : "null",
      storedUser: storedUser ? "exists" : "null",
      userProfileImage: user?.picture ? "has image" : "no image",
      storedUserProfileImage: storedUser?.profileImage
        ? "has image"
        : "no image",
    });

    if (user) {
      setProfile(user);
    } else if (storedUser) {
      setProfile(storedUser);
      console.log("ProfilePage - Setting user from localStorage:", storedUser);
      setUser(storedUser); // <-- Store in context if loaded from localStorage
    } else {
      // Redirect to login if no user data
      navigate("/login");
    }
  }, [user, navigate, setUser]);

  // Load profile image
  useEffect(() => {
    if (user && user.profileImage) {
      setImage(user.profileImage);
    } else {
      setImage(""); // fallback if needed
    }
  }, [user]);

  const handleEditToggle = (field) => {
    setEditFields((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleInputChange = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (field) => {
    let value = profile[field];
    let valid = true;
    let errorMsg = "";

    if (field === "email") {
      const emailRegex = /^\S+@\S+\.\S+$/;
      if (!emailRegex.test(value)) {
        valid = false;
        errorMsg = "Please enter a valid email address.";
      }
    }
    if (field === "phoneNumber") {
      const phoneRegex = /^\d{10}$/;
      if (!phoneRegex.test(value)) {
        valid = false;
        errorMsg = "Please enter a valid 10-digit phone number.";
      }
    }
    // Add more field checks as needed

    if (!valid) {
      setError(errorMsg);
      return;
    }

    if (!profile.id && !profile._id) {
      setError("User ID is not defined");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const userId = user.id || user._id;
      const response = await axios.put(
        `http://localhost:4503/api/users/${userId}`,
        {
          [field]: profile[field],
        }
      );

      // Handle new API response format
      const updatedUser = response.data.user || response.data;
      setProfile(updatedUser);
      setUser(updatedUser); // Update context
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setEditFields((prev) => ({ ...prev, [field]: false }));

      // Show success message
      setError("");
      setTimeout(() => {
        alert(`${field} updated successfully!`);
      }, 100);
    } catch (error) {
      console.error("Error updating user:", error);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError(`Failed to update ${field}. Please try again.`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = (field) => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setProfile((prev) => ({ ...prev, [field]: storedUser[field] }));
    setEditFields((prev) => ({ ...prev, [field]: false }));
  };

  const checkFieldType = (value) => {
    const emailRegex = /^\S+@\S+\.\S+$/; // Matches an email format
    const phoneRegex = /^\d{10}$/; // Matches a 10-digit number (phone)

    if (emailRegex.test(value)) {
      return { type: "Email", displayValue: value };
    } else if (phoneRegex.test(value)) {
      return { type: "Phone", displayValue: value };
    } else {
      return { type: "Unknown", displayValue: value };
    }
  };
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("profileImage");
    setUser(null); // Clear user context
    navigate("/landing"); // Use navigate instead of window.location
  };
  // Compress image function
  const compressImage = (file, maxWidth = 800, quality = 0.7) => {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img;
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);
        const compressedDataUrl = canvas.toDataURL("image/jpeg", quality);
        resolve(compressedDataUrl);
      };

      img.src = URL.createObjectURL(file);
    });
  };

  // Handle File Upload
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file");
        return;
      }

      // Validate file size (max 10MB before compression)
      if (file.size > 10 * 1024 * 1024) {
        setError("Image size should be less than 10MB");
        return;
      }

      setLoading(true);
      setError("");

      try {
        // Compress the image
        const compressedImageData = await compressImage(file);

        // Check compressed size (should be much smaller)
        const compressedSize = Math.round((compressedImageData.length * 3) / 4);
        if (compressedSize > 5 * 1024 * 1024) {
          setError(
            "Image is still too large after compression. Please try a smaller image."
          );
          setLoading(false);
          return;
        }

        setImage(compressedImageData);
        // Update both user context and profile state
        const updatedUser = { ...user, profileImage: compressedImageData };
        setUser(updatedUser);
        setProfile(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));

        setError(""); // Clear any previous errors
        setLoading(false);
      } catch (error) {
        console.error("Error saving profile image:", error);
        if (error.response?.status === 413) {
          setError("Image is too large. Please try a smaller image.");
        } else {
          setError("Failed to save profile image. Please try again.");
        }
        setLoading(false);
      }
    }
  };

  return (
    <div
      className="container py-5"
      style={{ fontFamily: "Inter, sans-serif", maxWidth: 900 }}
    >
      <div
        className="card shadow-lg border-0 rounded-4 p-4 mx-auto"
        style={{ background: "#fff" }}
      >
        <div className="text-center mb-4">
          <img
            src={image || user?.profileImage || defaultProfilePic}
            alt="Profile"
            className="rounded-circle border border-3 border-primary shadow"
            style={{
              width: 120,
              height: 120,
              objectFit: "cover",
              marginBottom: 16,
            }}
          />
          <div className="mt-2">
            <label
              htmlFor="fileUpload"
              className="btn btn-outline-primary rounded-3 px-4 py-2 fw-semibold shadow-sm"
            >
              Upload Photo
            </label>
            <input
              type="file"
              id="fileUpload"
              accept="image/*"
              onChange={handleFileUpload}
              style={{ display: "none" }}
              disabled={loading}
            />
          </div>
        </div>
        <h3 className="fw-bold text-primary text-center mb-4">My Profile</h3>
        <form>
          <div className="row g-4">
            <div className="col-md-6">
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control rounded-3"
                  id="username"
                  value={profile.username || ""}
                  onChange={(e) =>
                    handleInputChange("username", e.target.value)
                  }
                  placeholder="Your Name"
                  disabled={loading}
                />
                <label htmlFor="username">Your Name</label>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-floating mb-3">
                <input
                  type="email"
                  className="form-control rounded-3"
                  id="email"
                  value={profile.email || ""}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Email"
                  disabled={loading}
                />
                <label htmlFor="email">Email</label>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-floating mb-3">
                <input
                  type="tel"
                  className="form-control rounded-3"
                  id="phoneNumber"
                  value={profile.phoneNumber || ""}
                  onChange={(e) =>
                    handleInputChange("phoneNumber", e.target.value)
                  }
                  placeholder="Phone Number"
                  disabled={loading}
                />
                <label htmlFor="phoneNumber">Phone Number</label>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control rounded-3"
                  id="about"
                  value={profile.about || ""}
                  onChange={(e) => handleInputChange("about", e.target.value)}
                  placeholder="About"
                  disabled={loading}
                />
                <label htmlFor="about">About</label>
              </div>
            </div>
          </div>
          <div className="text-center mt-4">
            <button
              type="button"
              className="btn btn-primary rounded-3 px-5 py-2 fw-bold shadow"
              style={{ background: "#2563eb" }}
              onClick={() => handleSave("all")}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProfilePage;
