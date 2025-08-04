import React, { useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import logo from "./images/navlogo.png";
import back_btn from "./images/back-btn.png";
import continue_btn from "./images/continue-btn.png";
import Footer from "./Footer";
import { UserContext } from "./UserContext";
import { jsPDF } from "jspdf";
import "./scholarship-form.css";

const ScholarShipForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(UserContext);
  const selectedScholarship = location.state?.scholarship;

  // Form state
  const [formData, setFormData] = useState({
    fullName: "",
    mobileNumber: "",
    gender: "",
    dateOfBirth: "",
    twelfthMark: "",
    tenthMark: "",
    firstGraduate: "",
    annualIncome: "",
    cgMq: "",
    religion: "",
    singleParent: "",
    caste: "",
    status: "Pending",
  });

  // Error state
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  // Validate form inputs
  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim())
      newErrors.fullName = "Full Name is required.";
    if (!/^\d{10}$/.test(formData.mobileNumber))
      newErrors.mobileNumber = "Mobile Number must be a 10-digit number.";
    if (!formData.gender) newErrors.gender = "Gender is required.";
    if (!formData.dateOfBirth)
      newErrors.dateOfBirth = "Date of Birth is required.";
    if (!/^\d{1,3}$/.test(formData.twelfthMark) || formData.twelfthMark > 100)
      newErrors.twelfthMark =
        "Twelfth Mark must be a valid percentage (0-100).";
    if (!/^\d{1,3}$/.test(formData.tenthMark) || formData.tenthMark > 100)
      newErrors.tenthMark = "Tenth Mark must be a valid percentage (0-100).";
    if (!formData.firstGraduate)
      newErrors.firstGraduate = "This field is required.";
    if (!/^\d+$/.test(formData.annualIncome))
      newErrors.annualIncome = "Annual Income must be a valid number.";
    if (!formData.cgMq) newErrors.cgMq = "CG/MQ is required.";
    if (!formData.religion) newErrors.religion = "Religion is required.";
    if (!formData.singleParent)
      newErrors.singleParent = "This field is required.";
    if (!formData.caste) newErrors.caste = "Caste is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // PDF generation function
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Scholarship Application Form", 10, 15);
    doc.setFontSize(12);
    let y = 30;

    // Add scholarship info if available
    if (selectedScholarship) {
      doc.setFontSize(14);
      doc.text(`Scholarship: ${selectedScholarship.name}`, 10, y);
      y += 10;
      doc.setFontSize(12);
    }

    Object.entries({
      ...formData,
      userName: user?.username || "",
      userEmail: user?.email || "",
    }).forEach(([key, value]) => {
      const label = key
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (str) => str.toUpperCase());
      doc.text(`${label}: ${value}`, 10, y);
      y += 10;
    });
    doc.save("scholarship_application.pdf");
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        const payload = {
          ...formData,
          userName: user?.username || "",
          userEmail: user?.email || "",
          scholarshipName: selectedScholarship?.name || "",
        };
        await axios.post("http://localhost:4503/scholarships", payload);
        setShowSuccess(true);
      } catch (error) {
        console.error("Error submitting form:", error);
        alert(
          "There was an error submitting your application. Please try again."
        );
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <>
      <div className="scholarship-form-container">
        {/* Header */}
        <div className="form-header">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-md-8">
                <h1 className="form-title">Scholarship Application</h1>
                {selectedScholarship && (
                  <div className="selected-scholarship">
                    <i className="fas fa-award text-primary me-2"></i>
                    <span className="scholarship-name">
                      {selectedScholarship.name}
                    </span>
                    <span className="scholarship-amount">
                      ({selectedScholarship.amount})
                    </span>
                  </div>
                )}
              </div>
              <div className="col-md-4 text-end">
                <button className="back-btn" onClick={() => navigate(-1)}>
                  <img src={back_btn} alt="Back" />
                  <span>Back</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Success Modal */}
        {showSuccess && (
          <div className="success-modal-overlay">
            <div className="success-modal">
              <div className="success-icon">
                <svg width="80" height="80" viewBox="0 0 80 80">
                  <circle
                    cx="40"
                    cy="40"
                    r="38"
                    stroke="#4BB543"
                    strokeWidth="4"
                    fill="none"
                  />
                  <polyline
                    points="22,42 36,56 58,28"
                    fill="none"
                    stroke="#4BB543"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <animate
                      attributeName="points"
                      dur="0.5s"
                      to="22,42 36,56 58,28"
                      fill="freeze"
                    />
                  </polyline>
                </svg>
              </div>
              <h3 className="success-title">
                Application Submitted Successfully!
              </h3>
              <p className="success-message">
                Your scholarship application has been submitted. You will
                receive a confirmation email shortly.
              </p>
              <div className="success-actions">
                <button className="btn btn-primary" onClick={handleDownloadPDF}>
                  <i className="fas fa-download me-2"></i>
                  Download PDF
                </button>
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => {
                    setShowSuccess(false);
                    navigate("/ProfilePage");
                  }}
                >
                  Go to Profile
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Form Section */}
        <div className="form-section">
          <div className="container">
            <div className="form-card">
              <form onSubmit={handleSubmit}>
                {/* Personal Information Section */}
                <div className="form-section-header">
                  <div className="section-icon">
                    <i className="fas fa-user"></i>
                  </div>
                  <h3>Personal Information</h3>
                </div>

                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label">
                        <i className="fas fa-user me-2"></i>
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className={`form-control ${
                          errors.fullName ? "is-invalid" : ""
                        }`}
                        placeholder="Enter your full name"
                      />
                      {errors.fullName && (
                        <div className="invalid-feedback">
                          {errors.fullName}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label">
                        <i className="fas fa-phone me-2"></i>
                        Mobile Number
                      </label>
                      <input
                        type="text"
                        name="mobileNumber"
                        value={formData.mobileNumber}
                        onChange={handleChange}
                        className={`form-control ${
                          errors.mobileNumber ? "is-invalid" : ""
                        }`}
                        placeholder="Enter 10-digit mobile number"
                      />
                      {errors.mobileNumber && (
                        <div className="invalid-feedback">
                          {errors.mobileNumber}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label">
                        <i className="fas fa-venus-mars me-2"></i>
                        Gender
                      </label>
                      <div className="radio-group">
                        {["Male", "Female", "Other"].map((gender) => (
                          <div
                            key={gender}
                            className="form-check form-check-inline"
                          >
                            <input
                              type="radio"
                              name="gender"
                              value={gender}
                              onChange={handleChange}
                              className="form-check-input"
                              id={`gender-${gender}`}
                            />
                            <label
                              className="form-check-label"
                              htmlFor={`gender-${gender}`}
                            >
                              {gender}
                            </label>
                          </div>
                        ))}
                      </div>
                      {errors.gender && (
                        <div className="invalid-feedback d-block">
                          {errors.gender}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label">
                        <i className="fas fa-calendar me-2"></i>
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        className={`form-control ${
                          errors.dateOfBirth ? "is-invalid" : ""
                        }`}
                      />
                      {errors.dateOfBirth && (
                        <div className="invalid-feedback">
                          {errors.dateOfBirth}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Academic Information Section */}
                <div className="form-section-header">
                  <div className="section-icon">
                    <i className="fas fa-graduation-cap"></i>
                  </div>
                  <h3>Academic Information</h3>
                </div>

                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label">
                        <i className="fas fa-percentage me-2"></i>
                        Twelfth Percentage
                      </label>
                      <input
                        type="text"
                        name="twelfthMark"
                        value={formData.twelfthMark}
                        onChange={handleChange}
                        className={`form-control ${
                          errors.twelfthMark ? "is-invalid" : ""
                        }`}
                        placeholder="Enter percentage (0-100)"
                      />
                      {errors.twelfthMark && (
                        <div className="invalid-feedback">
                          {errors.twelfthMark}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label">
                        <i className="fas fa-percentage me-2"></i>
                        Tenth Percentage
                      </label>
                      <input
                        type="text"
                        name="tenthMark"
                        value={formData.tenthMark}
                        onChange={handleChange}
                        className={`form-control ${
                          errors.tenthMark ? "is-invalid" : ""
                        }`}
                        placeholder="Enter percentage (0-100)"
                      />
                      {errors.tenthMark && (
                        <div className="invalid-feedback">
                          {errors.tenthMark}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label">
                        <i className="fas fa-user-graduate me-2"></i>
                        First Graduate
                      </label>
                      <div className="radio-group">
                        {["Yes", "No"].map((option) => (
                          <div
                            key={option}
                            className="form-check form-check-inline"
                          >
                            <input
                              type="radio"
                              name="firstGraduate"
                              value={option}
                              onChange={handleChange}
                              className="form-check-input"
                              id={`firstGraduate-${option}`}
                            />
                            <label
                              className="form-check-label"
                              htmlFor={`firstGraduate-${option}`}
                            >
                              {option}
                            </label>
                          </div>
                        ))}
                      </div>
                      {errors.firstGraduate && (
                        <div className="invalid-feedback d-block">
                          {errors.firstGraduate}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label">
                        <i className="fas fa-rupee-sign me-2"></i>
                        Annual Income
                      </label>
                      <input
                        type="text"
                        name="annualIncome"
                        value={formData.annualIncome}
                        onChange={handleChange}
                        className={`form-control ${
                          errors.annualIncome ? "is-invalid" : ""
                        }`}
                        placeholder="Enter annual family income"
                      />
                      {errors.annualIncome && (
                        <div className="invalid-feedback">
                          {errors.annualIncome}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Additional Information Section */}
                <div className="form-section-header">
                  <div className="section-icon">
                    <i className="fas fa-info-circle"></i>
                  </div>
                  <h3>Additional Information</h3>
                </div>

                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label">
                        <i className="fas fa-tag me-2"></i>
                        CG/MQ
                      </label>
                      <input
                        type="text"
                        name="cgMq"
                        value={formData.cgMq}
                        onChange={handleChange}
                        className={`form-control ${
                          errors.cgMq ? "is-invalid" : ""
                        }`}
                        placeholder="Enter CG/MQ details"
                      />
                      {errors.cgMq && (
                        <div className="invalid-feedback">{errors.cgMq}</div>
                      )}
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label">
                        <i className="fas fa-pray me-2"></i>
                        Religion
                      </label>
                      <select
                        name="religion"
                        value={formData.religion}
                        onChange={handleChange}
                        className={`form-select ${
                          errors.religion ? "is-invalid" : ""
                        }`}
                      >
                        <option value="">Select Religion</option>
                        <option value="Hindu">Hindu</option>
                        <option value="Muslim">Muslim</option>
                        <option value="Christian">Christian</option>
                        <option value="Sikh">Sikh</option>
                        <option value="Buddhist">Buddhist</option>
                        <option value="Jain">Jain</option>
                        <option value="Other">Other</option>
                      </select>
                      {errors.religion && (
                        <div className="invalid-feedback">
                          {errors.religion}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label">
                        <i className="fas fa-users me-2"></i>
                        Single Parent
                      </label>
                      <div className="radio-group">
                        {["Yes", "No"].map((option) => (
                          <div
                            key={option}
                            className="form-check form-check-inline"
                          >
                            <input
                              type="radio"
                              name="singleParent"
                              value={option}
                              onChange={handleChange}
                              className="form-check-input"
                              id={`singleParent-${option}`}
                            />
                            <label
                              className="form-check-label"
                              htmlFor={`singleParent-${option}`}
                            >
                              {option}
                            </label>
                          </div>
                        ))}
                      </div>
                      {errors.singleParent && (
                        <div className="invalid-feedback d-block">
                          {errors.singleParent}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label">
                        <i className="fas fa-layer-group me-2"></i>
                        Caste
                      </label>
                      <select
                        name="caste"
                        value={formData.caste}
                        onChange={handleChange}
                        className={`form-select ${
                          errors.caste ? "is-invalid" : ""
                        }`}
                      >
                        <option value="">Select Caste</option>
                        <option value="General">General</option>
                        <option value="OBC">OBC</option>
                        <option value="SC">SC</option>
                        <option value="ST">ST</option>
                        <option value="Others">Others</option>
                      </select>
                      {errors.caste && (
                        <div className="invalid-feedback">{errors.caste}</div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="form-actions">
                  <button
                    type="submit"
                    className="submit-btn"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                        ></span>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-paper-plane me-2"></i>
                        Submit Application
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ScholarShipForm;
