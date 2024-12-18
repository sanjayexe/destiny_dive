import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "./UserContext";
import { Link } from "react-router-dom";
import { BsChat, BsTelephone, BsQuestionCircle } from "react-icons/bs";
import { FaCaretDown } from "react-icons/fa"; // Import caret icon
import { FiMenu } from "react-icons/fi";
import "./ProfilePage.css";
import logo from "./images/navlogo.png";
import defaultProfilePic from "./images/default-profile.png";
function ProfilePage() {
  const { user } = useContext(UserContext); // Access user from context
  const [profile, setProfile] = useState(user || {});
  const [image, setImage] = useState(""); // State to store uploaded image URL

  // States for "See More" functionality
  const [showMoreStatus, setShowMoreStatus] = useState(false);
  const [showMoreWishlist, setShowMoreWishlist] = useState(false);

  useEffect(() => {
    // If no user in Context, retrieve from localStorage
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setProfile(storedUser);
    }
  }, [user]);

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
    user(null);
    window.location.href = "/"; // Redirect to homepage
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
              <div className="col-md-6 gap-4">
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
                    <div className="mb-3">
                      <div className="d-flex justify-content-between align-items-center">
                        <strong className="text-secondary">Your Name</strong>
                        <button
                          className="btn rounded-5 p-btn px-4 fw-semibold py-1 btn-sm"
                          style={{ backgroundColor: "#e9ecef" }}
                          onClick={() =>
                            sendFieldValue("Your Name", profile.username)
                          }
                        >
                          Edit
                        </button>
                      </div>
                      <div>{profile.username || "N/A"}</div>
                    </div>

                    <div className="mb-3">
                      <div className="d-flex justify-content-between align-items-center">
                        <strong className="text-secondary">Email</strong>
                        <button
                          className="btn rounded-5 p-btn px-4 fw-semibold py-1 btn-sm"
                          style={{ backgroundColor: "#e9ecef" }}
                          onClick={() =>
                            sendFieldValue(
                              "Email",
                              type === "Email" ? displayValue : "N/A"
                            )
                          }
                        >
                          Edit
                        </button>
                      </div>
                      <div>{(type === "Email" && displayValue) || "N/A"}</div>
                    </div>

                    <div className="mb-3">
                      <div className="d-flex justify-content-between align-items-center">
                        <strong className="text-secondary">Phone Number</strong>
                        <button
                          className="btn rounded-5 p-btn px-4 fw-semibold py-1 btn-sm"
                          style={{ backgroundColor: "#e9ecef" }}
                          onClick={() =>
                            sendFieldValue(
                              "Phone Number",
                              type === "Phone" ? displayValue : "N/A"
                            )
                          }
                        >
                          Edit
                        </button>
                      </div>
                      <div>{(type === "Phone" && displayValue) || "N/A"}</div>
                    </div>
                  </div>

                  {/* About Section */}
                  <div className="mb-4 p-3 border rounded">
                    <div className="d-flex justify-content-between align-items-center">
                      <strong className="text-dark fs-5">
                        About{" "}
                        <span className="text-primary">
                          {" "}
                          {profile.username}{" "}
                        </span>
                      </strong>
                      <button
                        className="btn rounded-5 p-btn px-4 fw-semibold py-1 btn-sm"
                        style={{ backgroundColor: "#e9ecef" }}
                        onClick={() => sendFieldValue("About", profile.about)}
                      >
                        Edit
                      </button>
                    </div>
                    <div>{profile.about || "N/A"}</div>
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
              <div className="col-md-6 gap-4">
                <div className="card px-4 py-5 p-container">
                  <h4 className="mb-4">College Details</h4>
                  <div className="d-flex justify-content-between">
                    <img
                      src="https://via.placeholder.com/150" // Placeholder image
                      alt="College"
                      className="rounded"
                      style={{ width: "100px", height: "150px" }}
                    />
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
