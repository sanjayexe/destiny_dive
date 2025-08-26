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
        `https://destiny-dive.onrender.com/api/login`, // Assuming your route for login is '/login'
        {
          emailOrMobile: formData.emailOrMobile,
          password: formData.password,
        }
      );

      if (response.data && response.data.user) {
        const users = response.data.user;
        console.log("Login successful - User data:", {
          username: users.username,
          email: users.email,
          profileImage: users.profileImage,
          hasProfileImage: !!users.profileImage,
          hasCustomProfileImage: users.hasCustomProfileImage,
        });

        if (users.emailOrMobile === "admin") {
          setIsAdmin(true);
          setUser(users);
          localStorage.setItem("user", JSON.stringify(users));
          navigate("/adminDashboard");
          return;
        }
        setUser(users);
        localStorage.setItem("user", JSON.stringify(users));
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
    <>
      <div
        className="d-flex justify-content-center align-items-center"
        style={{
          backgroundImage: `url(${bg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          height: "100vh",
          fontFamily: "'Roboto', sans-serif",
        }}
      >
        <div
          className="position-absolute top-0 start-0"
          style={{
            zIndex: 9999,
            paddingTop: "20px",
            paddingLeft: "20px",
          }}
        >
          <img
            src={logo}
            alt="Logo"
            style={{
              width: "8rem",
              height: "auto",
              maxWidth: "100%",
            }}
          />
        </div>
        <div
          className="shadow-lg form-bg mx-4"
          style={{
            maxWidth: "500px",
            width: "100%",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
            position: "relative",
          }}
        >
          <div className="text-center mt-5 mb-4" style={{ paddingTop: "20px" }}>
            <h2
              className="fw-bolder"
              style={{
                color: "black",
                fontSize: "1.8rem",
                marginBottom: "10px",
              }}
            >
              Sign In to Your Account
            </h2>
          </div>
          <form
            onSubmit={handleSubmit}
            className="mx-auto"
            style={{ width: "60%" }}
          >
            <div className="mb-3">
              <input
                type="text"
                id="emailOrMobile"
                name="emailOrMobile"
                className={`form-control ${
                  emailOrMobileError ? "is-invalid" : ""
                }`}
                value={formData.emailOrMobile}
                onChange={handleChange}
                placeholder="Email or Mobile"
                style={{
                  borderRadius: "8px",
                  border: "none",
                  padding: "10px",
                  backgroundColor: "#f5f5f5",
                }}
              />
              {emailOrMobileError && (
                <div className="invalid-feedback">{emailOrMobileError}</div>
              )}
            </div>
            <div className="mb-3 position-relative">
              <input
                type={formData.showPassword ? "text" : "password"}
                id="password"
                name="password"
                className={`form-control ${passwordError ? "is-invalid" : ""}`}
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                style={{
                  borderRadius: "8px",
                  border: "none",
                  padding: "10px",
                  backgroundColor: "#f5f5f5",
                }}
              />
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
              className="btn button w-100 justify-content-center"
              style={{
                borderRadius: "8px",
                background: "#5885B8",
                color: "white",
                border: "none",
                padding: "10px",
                fontSize: "1rem",
                transition: "all 0.3s",
              }}
            >
              Login
            </button>
          </form>
          <hr className="hr mx-auto border-3" />
          <div className="text-center mt-4">
            <p>Or sign in with</p>
            <div className="d-flex justify-content-center gap-3">
              <GoogleLogin
                onSuccess={async (credentialResponse) => {
                  try {
                    const response = await axios.post(
                      "https://destiny-dive.onrender.com/api/google-login",
                      {
                        credential: credentialResponse.credential,
                      }
                    );
                    if (response.data && response.data.user) {
                      // Ensure profileImage is properly set from Google data
                      const normalizedUser = {
                        ...response.data.user,
                        profileImage: response.data.user.profileImage || "",
                      };
                      console.log("Google login successful:", {
                        username: normalizedUser.username,
                        email: normalizedUser.email,
                        profileImage: normalizedUser.profileImage,
                        hasProfileImage: !!normalizedUser.profileImage,
                        hasCustomProfileImage:
                          normalizedUser.hasCustomProfileImage,
                      });
                      setUser(normalizedUser);
                      localStorage.setItem(
                        "user",
                        JSON.stringify(normalizedUser)
                      );
                      navigate("/Landing");
                    } else {
                      setError("Google login failed.");
                    }
                  } catch (err) {
                    console.error("Google login error:", err);
                    setError("Google login failed.");
                  }
                }}
                onError={() => setError("Google login failed.")}
                width="100%"
              />
              <button
                className="btn btn-outline-secondary"
                style={{
                  borderRadius: "50%",
                  padding: "10px",
                  transition: "transform 0.3s",
                }}
              >
                <img
                  src={facebook}
                  alt="facebook"
                  style={{
                    width: "24px",
                    height: "24px",
                  }}
                />
              </button>
              <button
                className="btn btn-outline-secondary"
                style={{
                  borderRadius: "50%",
                  padding: "10px",
                  transition: "transform 0.3s",
                }}
              >
                <img
                  src={x}
                  alt="x"
                  style={{
                    width: "24px",
                    height: "24px",
                  }}
                />
              </button>
            </div>
          </div>
          <div className="text-center mt-3">
            <p>
              Don't have an account?{" "}
              <a
                href="/signup"
                style={{
                  textDecoration: "none",
                  color: "#66a6ff",
                  fontWeight: "bold",
                }}
              >
                Sign Up here
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
