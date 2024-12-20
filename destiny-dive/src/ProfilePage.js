import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "./UserContext";
import { Link } from "react-router-dom";
import { BsChat, BsTelephone, BsQuestionCircle } from "react-icons/bs";
import { FaCaretDown } from "react-icons/fa"; // Import caret icon
import { FiMenu } from "react-icons/fi";
import "./ProfilePage.css";
import logo from "./images/navlogo.png";
import star from "./images/star-img.png";
import defaultProfilePic from "./images/default-profile.png";
function ProfilePage() {
  const { user } = useContext(UserContext); // Access user from context
  const [profile, setProfile] = useState(user || {});
  const [image, setImage] = useState(""); // State to store uploaded image URL
  const [editFields, setEditFields] = useState({}); // Track edit states for fields

  // States for "See More" functionality
  const [showMoreStatus, setShowMoreStatus] = useState(false);
  const [showMoreWishlist, setShowMoreWishlist] = useState(false);

  useEffect(() => {
    console.log(user);
    const storedUser = JSON.parse(localStorage.getItem("user")); // if there is no user in useContext
    if (storedUser) {
      setProfile(storedUser);
    }
  }, [user]);

  useEffect(() => {
    const storedImage = localStorage.getItem("profileImage");
    if (storedImage) {
      setImage(storedImage);
    }
  }, []);

  const handleEditToggle = (field) => {
    setEditFields((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleInputChange = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = (field) => {
    setEditFields((prev) => ({ ...prev, [field]: false }));
    localStorage.setItem("user", JSON.stringify(profile));
    // alert(`${field} updated successfully!`);
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
    // user(null);
    window.location.href = "/landing"; // Redirect to homepage
  };
  const { type, displayValue } = checkFieldType(profile.emailOrMobile || "");

  // Handle File Upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0]; // Get the selected file
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target.result); // Set image to preview
        localStorage.setItem("profileImage", event.target.result); // Save to localStorage
      };
      reader.readAsDataURL(file); // Convert image to data URL
    }
  };

  // Load stored image on page load
  useEffect(() => {
    const storedImage = localStorage.getItem("profileImage");
    if (storedImage) {
      setImage(storedImage);
    }
  }, []);

  // Function to send field value
  const sendFieldValue = (fieldName, value) => {
    console.log(`${fieldName}: ${value}`); // Replace this with an API call if required
    alert(`${fieldName}: ${value}`); // Feedback to the user
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
            <img
              src={logo}
              alt="Logo"
              style={{
                width: "10vw",
                height: "auto",
                maxWidth: "100%",
              }}
            />
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
                  src={image || defaultProfilePic}
                  alt="Profile"
                  className="rounded-3"
                  style={{
                    width: "60px",
                    height: "60px",
                    objectFit: "cover",
                    marginRight: "10px", // Space between image and text
                  }}
                />{" "}
                <span style={{ marginLeft: "5px" }}>
                  Welcome Back, <br /> {profile.username}
                </span>{" "}
                {/* Adjust spacing */}
              </a>
              <div class="dropdown">
                <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                  <li className="text-center">
                    <button
                      className="dropdown-item text-danger"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </li>
                </div>
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

        <div
          className="container dashboard rounded-4 "
          style={{
            padding: "20px",
            minHeight: "30vh", // Ensure full height
          }}
        >
          <div className="d-flex justify-content-between align-items-center">
            {/* Left-aligned Text */}
            <h3 className="text-white">My Profile</h3>

            {/* Right-aligned Button */}
            <button className="btn btn-light">My Data</button>
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
                      src={image || "https://via.placeholder.com/80"} // Placeholder avatar
                      alt="profile"
                      className="rounded-circle"
                      style={{ width: "110px", height: "110px" }}
                    />
                    <div
                      className="p-btn ms-auto btn-sm rounded-5"
                      style={{ width: "fit-content" }}
                    >
                      <label
                        htmlFor="fileUpload"
                        className="btn fw-semibold px-3 "
                      >
                        Upload Photo
                      </label>
                      <input
                        type="file"
                        id="fileUpload"
                        accept="image/*"
                        onChange={handleFileUpload}
                        style={{ display: "none" }}
                      />
                    </div>
                  </div>

                  {/* Fields */}
                  <div className="mb-4 p-3 border rounded">
                    {/* Editable Fields */}
                    <div className="mb-3">
                      <strong className="text-secondary">Your Name</strong>
                      {editFields.username ? (
                        <div className="d-flex align-items-center">
                          <input
                            type="text"
                            className="form-control me-2"
                            value={profile.username || ""}
                            onChange={(e) =>
                              handleInputChange("username", e.target.value)
                            }
                          />
                          <button
                            className="btn btn-success"
                            onClick={() => handleSave("username")}
                          >
                            Save
                          </button>
                          <button
                            className="btn btn-danger ms-2"
                            onClick={() => handleCancel("username")}
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="d-flex justify-content-between">
                          <span>{profile.username || "N/A"}</span>
                          <button
                            className="btn rounded-5 p-btn px-4 fw-semibold py-1 btn-sm"
                            style={{ backgroundColor: "#e9ecef" }}
                            onClick={() => handleEditToggle("username")}
                          >
                            Edit
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="mb-3">
                      <strong className="text-secondary">Email</strong>
                      {editFields.email ? (
                        <div className="d-flex align-items-center">
                          <input
                            type="email"
                            className="form-control me-2"
                            value={profile.email || ""}
                            onChange={(e) =>
                              handleInputChange("email", e.target.value)
                            }
                          />
                          <button
                            className="btn btn-success"
                            onClick={() => handleSave("email")}
                          >
                            Save
                          </button>
                          <button
                            className="btn btn-danger ms-2"
                            onClick={() => handleCancel("email")}
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="d-flex justify-content-between">
                          <span>{profile.email || "N/A"}</span>
                          <button
                            className="btn rounded-5 p-btn px-4 fw-semibold py-1 btn-sm"
                            style={{ backgroundColor: "#e9ecef" }}
                            onClick={() => handleEditToggle("email")}
                          >
                            Edit
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="mb-3">
                      <strong className="text-secondary">Phone Number</strong>
                      {editFields.phoneNumber ? (
                        <div className="d-flex align-items-center">
                          <input
                            type="text"
                            className="form-control me-2"
                            value={profile.phoneNumber || ""}
                            onChange={(e) =>
                              handleInputChange("phoneNumber", e.target.value)
                            }
                          />
                          <button
                            className="btn btn-success"
                            onClick={() => handleSave("phoneNumber")}
                          >
                            Save
                          </button>
                          <button
                            className="btn btn-danger ms-2"
                            onClick={() => handleCancel("phoneNumber")}
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="d-flex justify-content-between">
                          <span>{profile.phoneNumber || "N/A"}</span>
                          <button
                            className="btn rounded-5 p-btn px-4 fw-semibold py-1 btn-sm"
                            style={{ backgroundColor: "#e9ecef" }}
                            onClick={() => handleEditToggle("phoneNumber")}
                          >
                            Edit
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* About Section */}
                  {/* About Section */}
                  <div className="mb-4 p-3 border rounded">
                    <div className="d-flex justify-content-between align-items-center">
                      <strong className="text-dark fs-5">
                        About{" "}
                        <span className="text-primary">{profile.username}</span>
                      </strong>
                      {!editFields.about ? (
                        <button
                          className="btn rounded-5 p-btn px-4 fw-semibold py-1 btn-sm"
                          style={{ backgroundColor: "#e9ecef" }}
                          onClick={() => handleEditToggle("about")}
                        >
                          Edit
                        </button>
                      ) : (
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-success px-4 fw-semibold py-1 btn-sm"
                            onClick={() => handleSave("about")}
                          >
                            Save
                          </button>
                          <button
                            className="btn btn-danger px-4 fw-semibold py-1 btn-sm"
                            onClick={() => handleCancel("about")}
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                    {!editFields.about ? (
                      <div>{profile.about || "N/A"}</div>
                    ) : (
                      <textarea
                        className="form-control mt-3"
                        value={profile.about || ""}
                        onChange={(e) =>
                          handleInputChange("about", e.target.value)
                        }
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
