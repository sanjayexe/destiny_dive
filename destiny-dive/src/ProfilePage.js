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

function ProfilePage() {
  const { user, setUser } = useContext(UserContext); // Access user from context
  const navigate = useNavigate();
  const [profile, setProfile] = useState(user || {});
  const [image, setImage] = useState(""); // State to store uploaded image URL
  const [editFields, setEditFields] = useState({}); // Track edit states for fields
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploadProgress, setUploadProgress] = useState("");

  // States for "See More" functionality
  const [showMoreStatus, setShowMoreStatus] = useState(false);
  const [showMoreWishlist, setShowMoreWishlist] = useState(false);

  // Function to refresh user data from database
  const refreshUserData = async () => {
    try {
      const userId = user?.id || user?._id || profile?.id || profile?._id;
      if (!userId) {
        console.log("ProfilePage - No user ID found for refresh");
        return;
      }

      console.log("ProfilePage - Refreshing user data from database...");
      const response = await axios.get(
        `http://localhost:4503/api/users/${userId}`
      );
      const refreshedUser = response.data;

      console.log("ProfilePage - Refreshed user data:", {
        username: refreshedUser.username,
        profileImage: refreshedUser.profileImage,
        hasProfileImage: !!refreshedUser.profileImage,
      });

      setUser(refreshedUser);
      setProfile(refreshedUser);
      localStorage.setItem("user", JSON.stringify(refreshedUser));

      if (refreshedUser.profileImage) {
        setImage(refreshedUser.profileImage);
      }
    } catch (error) {
      console.error("ProfilePage - Error refreshing user data:", error);
    }
  };

  // Initialize profile data
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    console.log("ProfilePage - Initializing profile data:", {
      user: user ? "exists" : "null",
      storedUser: storedUser ? "exists" : "null",
      userProfileImage: user?.profileImage ? "has image" : "no image",
      storedUserProfileImage: storedUser?.profileImage
        ? "has image"
        : "no image",
      userProfileImageValue: user?.profileImage,
      storedUserProfileImageValue: storedUser?.profileImage,
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
    console.log("ProfilePage - Loading profile image:", {
      user: user ? "exists" : "null",
      userProfileImage: user?.profileImage,
      profileProfileImage: profile?.profileImage,
      currentImage: image,
    });

    if (user && user.profileImage) {
      console.log(
        "ProfilePage - Setting image from user.profileImage:",
        user.profileImage
      );
      setImage(user.profileImage);
    } else if (profile && profile.profileImage) {
      console.log(
        "ProfilePage - Setting image from profile.profileImage:",
        profile.profileImage
      );
      setImage(profile.profileImage);
    } else {
      console.log("ProfilePage - No profile image found, setting empty");
      setImage(""); // fallback if needed
    }
  }, [user, profile]);

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
      setUploadProgress("Compressing image...");

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
          setUploadProgress("");
          return;
        }

        setUploadProgress("Saving to database...");

        // Get user ID
        const userId = user?.id || user?._id || profile?.id || profile?._id;
        if (!userId) {
          setError("User ID not found. Please try logging in again.");
          setLoading(false);
          return;
        }

        // Save to database
        const response = await axios.put(
          `http://localhost:4503/api/users/${userId}`,
          {
            profileImage: compressedImageData,
          }
        );

        // Update local state with response from server
        const updatedUser = response.data.user;
        setImage(compressedImageData);
        setUser(updatedUser);
        setProfile(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));

        setError(""); // Clear any previous errors
        setLoading(false);
        setUploadProgress("");

        // Show success message
        setTimeout(() => {
          alert("Profile picture updated successfully!");
        }, 100);
      } catch (error) {
        console.error("Error saving profile image:", error);
        if (error.response?.status === 413) {
          setError("Image is too large. Please try a smaller image.");
        } else if (error.response?.status === 404) {
          setError("User not found. Please try logging in again.");
        } else if (error.response?.status === 400) {
          setError(error.response.data.message || "Invalid image format.");
        } else if (error.response?.data?.message) {
          setError(error.response.data.message);
        } else if (error.code === "NETWORK_ERROR") {
          setError(
            "Network error. Please check your connection and try again."
          );
        } else {
          setError("Failed to save profile image. Please try again.");
        }
        setLoading(false);
        setUploadProgress("");
      }
    }
  };

  return (
    <div className="container-fluid px-5">
      <div>
        {/* Navbar */}
        <nav className="navbar navbar-light bg-light px-3">
          <button
            className="btn btn-light"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#sidebarOffcanvas"
            aria-controls="sidebarOffcanvas"
          >
            <FiMenu size={24} />
          </button>

          <div className="me-auto">
            {" "}
            <Link to="/" className="navbar-brand">
              <img
                src={logo}
                alt="Logo"
                style={{
                  width: "10vw",
                  height: "auto",
                  maxWidth: "100%",
                }}
              />
            </Link>
          </div>
          <ul
            className="navbar-nav px-2 me-2 rounded-3 "
            style={{
              border: "1px solid #ccc",
            }}
          >
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle d-flex justify-content-between align-items-center fw-semibold"
                href="#"
                id="userDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <img
                  src={
                    image ||
                    user?.profileImage ||
                    profile?.profileImage ||
                    defaultProfilePic
                  }
                  alt="Profile"
                  className="rounded-3"
                  style={{
                    width: "60px",
                    height: "60px",
                    objectFit: "cover",
                    marginRight: "10px",
                  }}
                  onError={(e) => {
                    console.log(
                      "ProfilePage - Image failed to load, using default:",
                      e.target.src
                    );
                    e.target.src = defaultProfilePic;
                  }}
                  onLoad={(e) => {
                    console.log(
                      "ProfilePage - Image loaded successfully:",
                      e.target.src
                    );
                  }}
                />
                <span style={{ marginLeft: "5px" }}>
                  Welcome Back, <br /> {profile.username || "User"}
                </span>
              </a>
              <div className="dropdown-menu" aria-labelledby="userDropdown">
                <button
                  className="dropdown-item text-danger"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            </li>
          </ul>
        </nav>

        {/* Sidebar Offcanvas */}
        <div
          className="offcanvas offcanvas-start"
          tabIndex="-1"
          id="sidebarOffcanvas"
          aria-labelledby="sidebarOffcanvasLabel"
        >
          <div className="offcanvas-header">
            <img
              src={logo}
              alt="Logo"
              style={{
                width: "10vw",
                height: "auto",
                maxWidth: "100%",
              }}
            />
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            ></button>
          </div>
          <div className="offcanvas-body d-flex flex-column align-items-center py-4">
            <div className="d-flex flex-column gap-4 w-100">
              <button className="btn btn-light d-flex align-items-center gap-2">
                <BsChat /> Chat
              </button>
              <button className="btn btn-light d-flex align-items-center gap-2">
                <BsTelephone /> Call
              </button>
              <button className="btn btn-light d-flex align-items-center gap-2">
                <BsQuestionCircle /> Questions
              </button>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div
            className="alert alert-danger alert-dismissible fade show"
            role="alert"
          >
            {error}
            <button
              type="button"
              className="btn-close"
              onClick={() => setError("")}
            ></button>
          </div>
        )}

        <div
          className="container dashboard rounded-4 "
          style={{
            padding: "20px",
            minHeight: "30vh",
          }}
        >
          <div className="d-flex justify-content-between align-items-center">
            <h3 className="text-white">My Profile</h3>
            <div className="d-flex gap-2">
              <button
                className="btn btn-outline-light btn-sm"
                onClick={refreshUserData}
                title="Refresh profile data from database"
              >
                🔄 Refresh
              </button>
              <button className="btn btn-light">
                {loading ? "Saving..." : "My Data"}
              </button>
            </div>
          </div>
        </div>
        <div className="container px-sm-5 " style={{ marginTop: "-15vh" }}>
          {/* Dashboard content */}
          <div className="row container  mx-auto justify-content-center  p-4">
            <div
              className="d-block d-md-flex  w-100 gap-4"
              style={{ height: "100%" }}
            >
              {/* Profile Content */}
              <div className="col-md-6 gap-4 mb-4 sm-mb-0">
                <div className="card px-4 py-5 p-container">
                  <div className="d-block d-sm-flex justify-content-between align-items-center mb-3">
                    <img
                      src={
                        image ||
                        user?.profileImage ||
                        profile?.profileImage ||
                        defaultProfilePic
                      }
                      alt="profile"
                      className="rounded-circle"
                      style={{
                        width: "110px",
                        height: "110px",
                        objectFit: "cover",
                      }}
                      onError={(e) => {
                        console.log(
                          "ProfilePage - Main profile image failed to load, using default:",
                          e.target.src
                        );
                        e.target.src = defaultProfilePic;
                      }}
                      onLoad={(e) => {
                        console.log(
                          "ProfilePage - Main profile image loaded successfully:",
                          e.target.src
                        );
                      }}
                    />
                    <div
                      className="p-btn ms-auto btn-sm rounded-5"
                      style={{ width: "fit-content" }}
                    >
                      <div>
                        <label
                          htmlFor="fileUpload"
                          className={`btn fw-semibold px-3 ${
                            loading ? "disabled" : ""
                          }`}
                          style={{
                            opacity: loading ? 0.6 : 1,
                            cursor: loading ? "not-allowed" : "pointer",
                          }}
                        >
                          {loading ? "Uploading..." : "Upload Photo"}
                        </label>
                        {uploadProgress && (
                          <div className="mt-2">
                            <small className="text-muted">
                              {uploadProgress}
                            </small>
                          </div>
                        )}
                      </div>
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

                  {/* Card Content */}
                  <>
                    {/* Name and Contact Fields */}
                    {/* Name Field */}
                    <div className="mb-4 p-3 border rounded">
                      <div className="mb-3">
                        <strong className="text-secondary d-flex align-items-center">
                          <FaUser className="me-2" />
                          Your Name
                        </strong>
                        {editFields.username ? (
                          <div className="d-flex align-items-center">
                            <input
                              type="text"
                              className="form-control me-2"
                              value={profile.username || ""}
                              onChange={(e) =>
                                handleInputChange("username", e.target.value)
                              }
                              placeholder="Enter your name"
                              disabled={loading}
                            />
                            <button
                              className="btn btn-success btn-sm"
                              onClick={() => handleSave("username")}
                              disabled={loading || !profile.username?.trim()}
                            >
                              <FaSave />
                            </button>
                            <button
                              className="btn btn-danger btn-sm ms-2"
                              onClick={() => handleCancel("username")}
                              disabled={loading}
                            >
                              <FaTimes />
                            </button>
                          </div>
                        ) : (
                          <div className="d-flex justify-content-between">
                            <span>{profile.username || "N/A"}</span>
                            <button
                              className="btn rounded-5 p-btn px-4 fw-semibold py-1 btn-sm"
                              style={{ backgroundColor: "#e9ecef" }}
                              onClick={() => handleEditToggle("username")}
                              disabled={loading}
                            >
                              <FaEdit className="me-1" />
                              Edit
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Contact Information Section */}
                    <div className="mb-4 p-3 border rounded">
                      <strong className="text-secondary d-flex align-items-center mb-3">
                        <FaEnvelope className="me-2" />
                        Contact Information
                      </strong>
                      {/* Primary Contact (what user signed up with) */}
                      {(profile.email || profile.phoneNumber) && (
                        <div className="mb-3 p-2 bg-light rounded">
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <strong className="text-secondary d-flex align-items-center">
                                {profile.email ? (
                                  <FaEnvelope className="me-2" />
                                ) : (
                                  <FaPhone className="me-2" />
                                )}
                                {profile.email ? "Email" : "Phone Number"}
                              </strong>
                              <div className="mt-1">
                                <span className="fw-semibold">
                                  {profile.email || profile.phoneNumber}
                                </span>
                                <br />
                                <small className="text-success">
                                  ✓ Primary contact (used for signup)
                                </small>
                              </div>
                            </div>
                            <button
                              className="btn rounded-5 p-btn px-3 fw-semibold py-1 btn-sm"
                              style={{ backgroundColor: "#e9ecef" }}
                              onClick={() =>
                                handleEditToggle(
                                  profile.email ? "email" : "phoneNumber"
                                )
                              }
                              disabled={loading}
                            >
                              <FaEdit className="me-1" />
                              Edit
                            </button>
                          </div>
                          {/* Edit mode for primary contact */}
                          {editFields[
                            profile.email ? "email" : "phoneNumber"
                          ] && (
                            <div className="d-flex align-items-center mt-2">
                              <input
                                type={profile.email ? "email" : "tel"}
                                className="form-control me-2"
                                value={
                                  profile[
                                    profile.email ? "email" : "phoneNumber"
                                  ] || ""
                                }
                                onChange={(e) =>
                                  handleInputChange(
                                    profile.email ? "email" : "phoneNumber",
                                    e.target.value
                                  )
                                }
                                placeholder={`Enter your ${
                                  profile.email ? "email" : "phone number"
                                }`}
                                disabled={loading}
                              />
                              <button
                                className="btn btn-success btn-sm"
                                onClick={() =>
                                  handleSave(
                                    profile.email ? "email" : "phoneNumber"
                                  )
                                }
                                disabled={
                                  loading ||
                                  !profile[
                                    profile.email ? "email" : "phoneNumber"
                                  ]?.trim()
                                }
                              >
                                <FaSave />
                              </button>
                              <button
                                className="btn btn-danger btn-sm ms-2"
                                onClick={() =>
                                  handleCancel(
                                    profile.email ? "email" : "phoneNumber"
                                  )
                                }
                                disabled={loading}
                              >
                                <FaTimes />
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                      {/* Secondary Contact (optional) */}
                      <div className="mb-3">
                        <strong className="text-secondary d-flex align-items-center">
                          {!profile.email ? (
                            <FaEnvelope className="me-2" />
                          ) : (
                            <FaPhone className="me-2" />
                          )}
                          Add {!profile.email ? "Email" : "Phone Number"}{" "}
                          (Optional)
                        </strong>
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <span
                              className={
                                !profile[
                                  !profile.email ? "email" : "phoneNumber"
                                ]
                                  ? "text-muted"
                                  : "fw-semibold"
                              }
                            >
                              {profile[
                                !profile.email ? "email" : "phoneNumber"
                              ] || "Not added yet"}
                            </span>
                            {!profile[
                              !profile.email ? "email" : "phoneNumber"
                            ] && (
                              <small className="text-muted">
                                Add an additional contact method for better
                                communication
                              </small>
                            )}
                          </div>
                          <button
                            className={`btn rounded-5 px-3 fw-semibold py-1 btn-sm ${
                              !profile[!profile.email ? "email" : "phoneNumber"]
                                ? "btn-primary"
                                : "p-btn"
                            }`}
                            style={
                              !profile[!profile.email ? "email" : "phoneNumber"]
                                ? {}
                                : { backgroundColor: "#e9ecef" }
                            }
                            onClick={() =>
                              handleEditToggle(
                                !profile.email ? "email" : "phoneNumber"
                              )
                            }
                            disabled={loading}
                          >
                            <FaEdit className="me-1" />
                            {!profile[!profile.email ? "email" : "phoneNumber"]
                              ? "Add"
                              : "Edit"}
                          </button>
                        </div>
                        {/* Edit mode for secondary contact */}
                        {editFields[
                          !profile.email ? "email" : "phoneNumber"
                        ] && (
                          <div className="d-flex align-items-center mt-2">
                            <input
                              type={!profile.email ? "email" : "tel"}
                              className="form-control me-2"
                              value={
                                profile[
                                  !profile.email ? "email" : "phoneNumber"
                                ] || ""
                              }
                              onChange={(e) =>
                                handleInputChange(
                                  !profile.email ? "email" : "phoneNumber",
                                  e.target.value
                                )
                              }
                              placeholder={`Enter your ${
                                !profile.email ? "email" : "phone number"
                              }`}
                              disabled={loading}
                            />
                            <button
                              className="btn btn-success btn-sm"
                              onClick={() =>
                                handleSave(
                                  !profile.email ? "email" : "phoneNumber"
                                )
                              }
                              disabled={
                                loading ||
                                !profile[
                                  !profile.email ? "email" : "phoneNumber"
                                ]?.trim()
                              }
                            >
                              <FaSave />
                            </button>
                            <button
                              className="btn btn-danger btn-sm ms-2"
                              onClick={() =>
                                handleCancel(
                                  !profile.email ? "email" : "phoneNumber"
                                )
                              }
                              disabled={loading}
                            >
                              <FaTimes />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* About Section */}
                    <div className="mb-4 p-3 border rounded">
                      <div className="d-flex justify-content-between align-items-center">
                        <strong className="text-dark fs-5">
                          About{" "}
                          <span className="text-primary">
                            {profile.username || "User"}
                          </span>
                        </strong>
                        {!editFields.about ? (
                          <button
                            className="btn rounded-5 p-btn px-4 fw-semibold py-1 btn-sm"
                            style={{ backgroundColor: "#e9ecef" }}
                            onClick={() => handleEditToggle("about")}
                            disabled={loading}
                          >
                            <FaEdit className="me-1" />
                            Edit
                          </button>
                        ) : (
                          <div className="d-flex gap-2">
                            <button
                              className="btn btn-success px-4 fw-semibold py-1 btn-sm"
                              onClick={() => handleSave("about")}
                              disabled={loading}
                            >
                              <FaSave className="me-1" />
                              Save
                            </button>
                            <button
                              className="btn btn-danger px-4 fw-semibold py-1 btn-sm"
                              onClick={() => handleCancel("about")}
                              disabled={loading}
                            >
                              <FaTimes className="me-1" />
                              Cancel
                            </button>
                          </div>
                        )}
                      </div>
                      {!editFields.about ? (
                        <div className="mt-2">
                          {profile.about ? (
                            <p className="text-muted">{profile.about}</p>
                          ) : (
                            <p className="text-muted fst-italic">
                              No description added yet.
                            </p>
                          )}
                        </div>
                      ) : (
                        <textarea
                          className="form-control mt-3"
                          value={profile.about || ""}
                          onChange={(e) =>
                            handleInputChange("about", e.target.value)
                          }
                          placeholder="Tell us about yourself..."
                          rows="4"
                          disabled={loading}
                        />
                      )}
                    </div>

                    {/* Application Forms */}
                    <div className="mb-4 p-3 border rounded">
                      <div className="mt-3">
                        <strong className="text-dark fs-4">
                          Application Form
                        </strong>
                        <div className="d-flex justify-content-between align-items-center mt-2">
                          <span>Visa application form</span>
                          <button className="btn btn-success rounded-5 px-4 fw-semibold py-1 btn-sm">
                            Fill
                          </button>
                        </div>
                        <div className="d-flex justify-content-between align-items-center mt-2">
                          <span>Personal information form</span>
                          <button className="btn btn-success rounded-5 px-4 fw-semibold py-1 btn-sm">
                            Fill
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                </div>
              </div>

              {/* College Info */}
              <div className="col-md-6 gap-4 ">
                <div className="card px-4 py-5 p-container">
                  <div className="d-flex justify-content-between p-3 border-custom m-3 mx-auto">
                    <div className="w-75 ">
                      <h5 className="mb-4 text-dark fw-bold ">
                        College Details
                      </h5>
                      <p>
                        This are the professional details shown to users in the
                        app.
                      </p>
                    </div>
                    <img
                      src={star} // Placeholder image
                      alt="College"
                      className="rounded"
                      style={{ width: "50px", height: "50px" }}
                    />
                  </div>

                  <div className="d-flex justify-content-between">
                    <div className="d-flex flex-column justify-content-center">
                      <strong>PSG Institutions, Coimbatore</strong>
                      <span className="text-secondary">Tamil Nadu, India</span>
                      <p>
                        Professional details about the college and its programs.
                      </p>
                      {/* See More Button */}
                      {!showMoreStatus && (
                        <button
                          className="btn btn-link"
                          onClick={() => setShowMoreStatus(true)}
                        >
                          See More
                        </button>
                      )}
                      {showMoreStatus && <p>Additional college details...</p>}
                    </div>
                  </div>

                  {/* Wishlist */}
                  <div className="col-md-7 mt-4">
                    <div className="card px-4 py-5 p-container">
                      <h4 className="mb-4">Wishlist</h4>
                      <div className="mb-3">
                        <strong>1. PSG Institutions</strong>
                        <button className="btn btn-info ms-3">View</button>
                      </div>
                      {showMoreWishlist && (
                        <div className="mb-3">
                          <strong>2. Other College Name</strong>
                          <button className="btn btn-info ms-3">View</button>
                        </div>
                      )}
                      <button
                        className="btn btn-link"
                        onClick={() => setShowMoreWishlist(!showMoreWishlist)}
                      >
                        {showMoreWishlist ? "See Less" : "See More"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
