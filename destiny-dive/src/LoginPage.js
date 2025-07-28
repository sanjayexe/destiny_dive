import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./signup.css";
import logo from "./images/logo.png";
import bg from "./images/bg-color.jpeg";
import google from "./images/google.png";
import facebook from "./images/facebook.png";
import x from "./images/x.png";
import { GoogleLogin } from "@react-oauth/google";

const LoginPage = () => {
  const { setUser } = useContext(UserContext);
  const [formData, setFormData] = useState({
    emailOrMobile: "",
    email: "",
    mobile: Number,
    showPassword: false,
  });
  const [error, setError] = useState("");
  const [emailOrMobileError, setEmailOrMobileError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });
    console.log(formData);
    if (name === "emailOrMobile") {
      setEmailOrMobileError("");
    }
    if (name === "password") {
      setPasswordError("");
    }
  };

  const validateForm = () => {
    let isValid = true;

    if (!formData.emailOrMobile) {
      setEmailOrMobileError("Email or mobile number is required.");
      isValid = false;
    } else if (
      !/^\S+@\S+\.\S+$/.test(formData.emailOrMobile) && // Valid email format
      !/^\d{10}$/.test(formData.emailOrMobile) // Valid 10-digit mobile number
    ) {
      setEmailOrMobileError(
        "Please enter a valid email address or 10-digit mobile number."
      );
      isValid = false;
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    if (!formData.password) {
      setPasswordError("Password is required.");
      isValid = false;
    } else if (!passwordRegex.test(formData.password)) {
      setPasswordError(
        "Password must be at least 6 characters, include one uppercase, lowercase, number, and special character."
      );
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      // Send POST request for login
      const response = await axios.post(
        `http://localhost:4503/api/login`, // Assuming your route for login is '/login'
        {
          emailOrMobile: formData.emailOrMobile,
          password: formData.password,
        }
      );

      if (response.data && response.data.user) {
        const users = response.data.user;
        console.log(users);
        if (users.emailOrMobile === "admin") {
          setIsAdmin(true);
          setUser(users);
          localStorage.setItem("user", JSON.stringify(users)); // <-- ensure profileImage is included if present
          navigate("/adminDashboard");
          return;
        }
        setUser(users);
        localStorage.setItem("user", JSON.stringify(users)); // <-- ensure profileImage is included if present
        navigate("/Landing");
      } else {
        setError("Invalid email/mobile or password.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center min-vh-100 bg-light"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      <div
        className="card shadow-lg p-4 border-0 rounded-4"
        style={{ maxWidth: 400, width: "100%", background: "#fff" }}
      >
        <div className="text-center mb-4">
          <img
            src={logo}
            alt="Logo"
            style={{ width: 64, height: 64, borderRadius: 16 }}
          />
          <h2 className="fw-bold mt-3 mb-2 text-primary">Sign In</h2>
          <p className="text-muted">
            Welcome back! Please login to your account.
          </p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-floating mb-3">
            <input
              type="text"
              id="emailOrMobile"
              name="emailOrMobile"
              className={`form-control rounded-3 ${
                emailOrMobileError ? "is-invalid" : ""
              }`}
              value={formData.emailOrMobile}
              onChange={handleChange}
              placeholder="Email or Mobile"
              style={{ background: "#f8fafc" }}
            />
            <label htmlFor="emailOrMobile">Email or Mobile</label>
            {emailOrMobileError && (
              <div className="invalid-feedback">{emailOrMobileError}</div>
            )}
          </div>
          <div className="form-floating mb-3 position-relative">
            <input
              type={formData.showPassword ? "text" : "password"}
              id="password"
              name="password"
              className={`form-control rounded-3 ${
                passwordError ? "is-invalid" : ""
              }`}
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              style={{ background: "#f8fafc" }}
            />
            <label htmlFor="password">Password</label>
            <span
              className="position-absolute top-50 end-0 translate-middle-y pe-3"
              style={{ cursor: "pointer", color: "#2563eb" }}
              onClick={() =>
                setFormData({
                  ...formData,
                  showPassword: !formData.showPassword,
                })
              }
            >
              {formData.showPassword ? "🙈" : "👁️"}
            </span>
            {passwordError && (
              <div className="invalid-feedback">{passwordError}</div>
            )}
          </div>
          {error && (
            <div className="alert alert-danger py-2 mb-3 rounded-3">
              {error}
            </div>
          )}
          <button
            type="submit"
            className="btn btn-primary w-100 rounded-3 fw-bold mb-3"
            style={{ background: "#2563eb", fontWeight: 600 }}
          >
            Login
          </button>
        </form>
        <div className="text-center mb-3 text-muted">or sign in with</div>
        <div className="d-flex justify-content-center gap-3 mb-3">
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              try {
                const response = await axios.post(
                  "http://localhost:4503/api/google-login",
                  {
                    credential: credentialResponse.credential,
                  }
                );
                if (response.data && response.data.user) {
                  const normalizedUser = {
                    ...response.data.user,
                    profileImage:
                      response.data.user.profileImage ||
                      response.data.user.picture ||
                      "",
                  };
                  setUser(normalizedUser);
                  localStorage.setItem("user", JSON.stringify(normalizedUser));
                  navigate("/Landing");
                } else {
                  setError("Google login failed.");
                }
              } catch (err) {
                setError("Google login failed.");
              }
            }}
            onError={() => setError("Google login failed.")}
            width="100%"
          />
          <button
            className="btn btn-outline-secondary rounded-circle p-2 border-0 shadow-sm"
            style={{ width: 44, height: 44 }}
          >
            <img
              src={facebook}
              alt="facebook"
              style={{ width: 24, height: 24 }}
            />
          </button>
          <button
            className="btn btn-outline-secondary rounded-circle p-2 border-0 shadow-sm"
            style={{ width: 44, height: 44 }}
          >
            <img src={x} alt="x" style={{ width: 24, height: 24 }} />
          </button>
        </div>
        <div className="text-center mt-2">
          <span className="text-muted">Don't have an account? </span>
          <a
            href="/signup"
            className="fw-bold text-primary text-decoration-none"
          >
            Sign Up
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
