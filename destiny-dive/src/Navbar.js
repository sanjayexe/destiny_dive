import React from "react";
import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./navbar.css"; // Import the CSS file
import logo from "./images/navlogo.png";
import defaultProfilePic from "./images/default-profile.png";
import { UserContext } from "./UserContext";

const Navbar = () => {
  const { user, setUser } = useContext(UserContext);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/"; // Redirect to homepage
  };

  return (
    <nav className="navbar  navbar-expand-lg navbar-light bg-light">
      <div className="container">
        {/* Logo */}
        <Link to="/" className="navbar-brand">
          <img
            src={logo}
            alt="Logo"
            style={{
              width: "25vw",
              height: "auto",
              maxWidth: "150px",
            }}
          />
        </Link>

        {/* Toggler Button for Mobile View */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Collapsible Menu */}
        <div className="collapse navbar-collapse" id="navbarNav">
          {/* Navigation Links */}
          <ul className="navbar-nav mx-auto gap-3">
            <li className="nav-item">
              <Link
                className="nav-link fw-semibold text-secondary"
                to="/colleges"
              >
                Universities
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link fw-semibold text-secondary"
                to="/notifications"
              >
                Notifications
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link fw-semibold text-secondary" to="/about">
                About
              </Link>
            </li>
          </ul>{" "}
          <ul className="navbar-nav text-light">
            {user ? (
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle d-flex align-items-center fw-semibold"
                  href="#"
                  id="userDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <img
                    src={user.profileImage || defaultProfilePic}
                    alt="Profile"
                    className="rounded-circle"
                    style={{
                      width: "40px",
                      height: "40px",
                      objectFit: "cover",
                      marginRight: "10px",
                    }}
                  />
                  {user.username}
                </a>
                <ul
                  className="dropdown-menu dropdown-menu-end"
                  aria-labelledby="userDropdown"
                >
                  <li>
                    <Link className="dropdown-item" to="/ProfilePage">
                      My Profile
                    </Link>
                  </li>
                  <li>
                    <button
                      className="dropdown-item text-danger"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </li>
            ) : (
              <li className="nav-item d-flex">
                <Link className="btn fw-bold mx-2" to="/login">
                  LOGIN
                </Link>
                <Link
                  className="btn btn-warning text-light fw-semibold border-0 rounded-0 px-4 py-2"
                  to="/signup"
                >
                  SIGN UP
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
