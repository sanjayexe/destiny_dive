import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Ensure you have react-router-dom installed
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./signup.css";
import logo from "./images/logo.png";
import bg from "./images/bg-color.jpeg";
import google from "./images/google.png";
import facebook from "./images/facebook.png";
import x from "./images/x.png";

const SignupPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    emailOrMobile: "",
    password: "",
    confirmPassword: "",
    otp: null,
  });
  var generatedOTP;
  const [otpSent, setOtpSent] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const sendOtp = async () => {
    generatedOTP = Math.floor(100000 + Math.random() * 900000);
    alert(generatedOTP);
    if (!formData.emailOrMobile) {
      setErrors({
        ...errors,
        emailOrMobile: "Please provide your email or mobile number.",
      });
      return;
    }

    // try {
    //   const response = await axios.post("http://localhost:4500/users", {
    //     otp: generatedOTP,
    //   });

    //   if (response.data.success) {
    //     setOtpSent(true);
    //     alert("OTP has been sent successfully.");
    //   } else {
    //     alert(response.data.message || "Failed to send OTP.");
    //   }
    // } catch (error) {
    //   console.error("Error sending OTP:", error);
    //   alert("An error occurred while sending OTP. Please try again.");
    // }
  };

  const validateForm = () => {
    const newErrors = {};
    const { username, emailOrMobile, password, confirmPassword, otp } =
      formData;
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    if (!username) {
      newErrors.username = "Username is required!";
    }

    if (!emailOrMobile) {
      newErrors.emailOrMobile = "Email or mobile number is required.";
    } else if (
      !/^\S+@\S+\.\S+$/.test(emailOrMobile) && // Check if it's a valid email
      !/^\d{10}$/.test(emailOrMobile) // Check if it's a valid 10-digit mobile number
    ) {
      newErrors.emailOrMobile =
        "Enter a valid email or 10-digit mobile number.";
    }

    if (!password) {
      newErrors.password = "Password is required.";
    } else if (!passwordRegex.test(formData.password)) {
      newErrors.password =
        "Password must be at least 6 characters, include one uppercase, lowercase, number, special character.";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password.";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }
    // if (!otp) {
    //   newErrors.otp = "OTP must be sent before submission.";
    // }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        await axios.post("http://localhost:4501/users", {
          username: formData.username,
          emailOrMobile: formData.emailOrMobile,
          password: formData.password,
          //otp: formData.otp,
        });

        alert("Signup successful! Redirecting to login...");
        navigate("/login"); // Redirect to login page
      } catch (error) {
        console.error("Error signing up:", error);
        alert("An error occurred while signing up. Please try again.");
      }
    }
  };

  return (
    <>
      <div
        className="d-flex  justify-content-center align-items-center "
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
          className="position-absolute top-0 start-0 "
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
              width: "10vw",
              height: "auto",
              maxWidth: "100%",
            }}
          />
        </div>
        <div
          className="shadow-lg form-bg mx-4"
          style={{
            maxWidth: "600px",
            width: "100%",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
            position: "relative",
          }}
        >
          <div
            className="text-center mt-5 mb-4 "
            style={{ paddingTop: "20px" }}
          >
            <h2
              className="fw-bolder"
              style={{
                color: "black",
                fontSize: "1.8rem",
                marginBottom: "10px",
              }}
            >
              Create Your Account
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
                id="username"
                name="username"
                className={`form-control ${
                  errors.username ? "is-invalid" : ""
                }`}
                value={formData.username}
                onChange={handleChange}
                placeholder="Create a username"
                style={{
                  borderRadius: "8px",
                  border: "none",
                  padding: "10px",
                  backgroundColor: "#f5f5f5",
                }}
              />
              {errors.username && (
                <div className="invalid-feedback">{errors.username}</div>
              )}
            </div>
            <div className="mb-3">
              <input
                type="text"
                id="emailOrMobile"
                name="emailOrMobile"
                className={`form-control ${
                  errors.emailOrMobile ? "is-invalid" : ""
                }`}
                value={formData.emailOrMobile}
                onChange={handleChange}
                placeholder="Enter your email or mobile number"
                style={{
                  borderRadius: "8px",
                  border: "none",
                  padding: "10px",
                  backgroundColor: "#f5f5f5",
                }}
              />
              {errors.emailOrMobile && (
                <div className="invalid-feedback">{errors.emailOrMobile}</div>
              )}
            </div>

            {/* <div className="mb-3">
              <button
                type="button"
                className="btn btn-primary w-100"
                onClick={sendOtp}
              >
                Send OTP
              </button>
            </div> */}
            {/* <div className="mb-3">
              <input
                type="text"
                id="otp"
                name="otp"
                className={`form-control ${errors.otp ? "is-invalid" : ""}`}
                value={formData.otp}
                onChange={handleChange}
                placeholder="Enter OTP"
                style={{
                  borderRadius: "8px",
                  border: "none",
                  padding: "10px",
                  backgroundColor: "#f5f5f5",
                }}
              />
              {errors.otp && (
                <div className="invalid-feedback">{errors.otp}</div>
              )}
            </div> */}

            <div className="mb-3">
              <input
                type="password"
                id="password"
                name="password"
                className={`form-control ${
                  errors.password ? "is-invalid" : ""
                }`}
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
              {errors.password && (
                <div className="invalid-feedback">{errors.password}</div>
              )}
            </div>

            <div className="mb-3">
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                className={`form-control ${
                  errors.confirmPassword ? "is-invalid" : ""
                }`}
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                style={{
                  borderRadius: "8px",
                  border: "none",
                  padding: "10px",
                  backgroundColor: "#f5f5f5",
                }}
              />
              {errors.confirmPassword && (
                <div className="invalid-feedback">{errors.confirmPassword}</div>
              )}
            </div>

            <button
              type="submit"
              className="btn button w-100 justify-content-center "
              style={{
                borderRadius: "8px",
                background: " #5885B8",
                color: "white",
                border: "none",
                padding: "10px",
                fontSize: "1rem",
                transition: "all 0.3s",
              }}
            >
              Sign Up
            </button>
          </form>
          <hr className="hr mx-auto border-3" />
          <div className="text-center mt-4">
            <p>Or sign up with</p>
            <div className="d-flex justify-content-center gap-3">
              <button
                className="btn btn-outline-secondary"
                style={{
                  borderRadius: "50%",
                  padding: "10px",
                  transition: "transform 0.3s",
                }}
              >
                <img
                  src={google}
                  alt="google"
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
              Already have an account?{" "}
              <a
                href="/login"
                style={{
                  textDecoration: "none",
                  color: "#66a6ff",
                  fontWeight: "bold",
                }}
              >
                Login here
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignupPage;
