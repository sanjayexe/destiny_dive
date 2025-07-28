import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import logo from "./images/navlogo.png";
import back_btn from "./images/back-btn.png";
import continue_btn from "./images/continue-btn.png";
import Footer from "./Footer";
import { UserContext } from "./UserContext";
import { jsPDF } from "jspdf";

const ScholarShipForm = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

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

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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
    return Object.keys(newErrors).length === 0; // Returns true if no errors
  };

  // PDF generation function
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Scholarship Form Details", 10, 15);
    doc.setFontSize(12);
    let y = 30;
    Object.entries({
      ...formData,
      userName: user?.username || "",
      userEmail: user?.email || "",
    }).forEach(([key, value]) => {
      doc.text(`${key}: ${value}`, 10, y);
      y += 10;
    });
    doc.save("scholarship_form.pdf");
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(user);
    if (validateForm()) {
      try {
        const payload = {
          ...formData,
          userName: user?.username || "",
          userEmail: user?.email || "",
        };
        console.log(user.username);
        await axios.post("http://localhost:4503/scholarships", payload);
        setShowSuccess(true);
      } catch (error) {
        setShowSuccess(false);
        // Optionally, you can set an error state and show an error message in the UI if needed
      }
    }
  };

  return (
    <>
      <div className="position-absolute  top-0 end-0 m-3">
        <img
          src={logo}
          alt="University Logo"
          style={{ height: "70px", cursor: "pointer" }}
        />
      </div>
      <div
        className="position-absolute top-0 start-0 m-3"
        onClick={() => navigate(-1)}
      >
        <img src={back_btn} alt="" height={"auto"} width={"50px"} />
      </div>
      <div className="container py-5">
        <h2 className="text-center">Scholarship Form</h2>
        {/* Success Modal */}
        {showSuccess && (
          <div
            className="modal fade show d-block"
            tabIndex="-1"
            style={{ background: "rgba(0,0,0,0.5)" }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content text-center p-4">
                <div className="mb-3">
                  {/* Animated SVG Checkmark */}
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
                <h4 className="text-success mb-3">
                  Form Submitted Successfully!
                </h4>
                <button
                  className="btn btn-primary mb-2"
                  onClick={handleDownloadPDF}
                >
                  Download PDF
                </button>
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => {
                    setShowSuccess(false);
                    navigate("/ProfilePage");
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            {/* Full Name */}
            <div className="col-md-6">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className={`form-control ${
                  errors.fullName ? "is-invalid" : ""
                }`}
              />
              {errors.fullName && (
                <div className="invalid-feedback">{errors.fullName}</div>
              )}
            </div>

            {/* Mobile Number */}
            <div className="col-md-6">
              <label className="form-label">Mobile Number</label>
              <input
                type="text"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleChange}
                className={`form-control ${
                  errors.mobileNumber ? "is-invalid" : ""
                }`}
              />
              {errors.mobileNumber && (
                <div className="invalid-feedback">{errors.mobileNumber}</div>
              )}
            </div>

            {/* Gender */}
            <div className="col-md-6">
              <label className="form-label">Gender</label>
              <div>
                <div className="form-check form-check-inline">
                  <input
                    type="radio"
                    name="gender"
                    value="Male"
                    onChange={handleChange}
                    className="form-check-input"
                  />
                  <label className="form-check-label">Male</label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    type="radio"
                    name="gender"
                    value="Female"
                    onChange={handleChange}
                    className="form-check-input"
                  />
                  <label className="form-check-label">Female</label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    type="radio"
                    name="gender"
                    value="Other"
                    onChange={handleChange}
                    className="form-check-input"
                  />
                  <label className="form-check-label">Other</label>
                </div>
              </div>
              {errors.gender && (
                <div className="invalid-feedback d-block">{errors.gender}</div>
              )}
            </div>

            {/* Date of Birth */}
            <div className="col-md-6">
              <label className="form-label">Date of Birth</label>
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
                <div className="invalid-feedback">{errors.dateOfBirth}</div>
              )}
            </div>

            {/* Twelfth Mark */}
            <div className="col-md-6">
              <label className="form-label">Twelfth Percentage</label>
              <input
                type="text"
                name="twelfthMark"
                value={formData.twelfthMark}
                onChange={handleChange}
                className={`form-control ${
                  errors.twelfthMark ? "is-invalid" : ""
                }`}
              />
              {errors.twelfthMark && (
                <div className="invalid-feedback">{errors.twelfthMark}</div>
              )}
            </div>

            {/* Tenth Mark */}
            <div className="col-md-6">
              <label className="form-label">Tenth Percentage</label>
              <input
                type="text"
                name="tenthMark"
                value={formData.tenthMark}
                onChange={handleChange}
                className={`form-control ${
                  errors.tenthMark ? "is-invalid" : ""
                }`}
              />
              {errors.tenthMark && (
                <div className="invalid-feedback">{errors.tenthMark}</div>
              )}
            </div>

            {/* First Graduate */}
            <div className="col-md-6">
              <label className="form-label">First Graduate</label>
              <div>
                <div className="form-check form-check-inline">
                  <input
                    type="radio"
                    name="firstGraduate"
                    value="Yes"
                    onChange={handleChange}
                    className="form-check-input"
                  />
                  <label className="form-check-label">Yes</label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    type="radio"
                    name="firstGraduate"
                    value="No"
                    onChange={handleChange}
                    className="form-check-input"
                  />
                  <label className="form-check-label">No</label>
                </div>
              </div>
              {errors.firstGraduate && (
                <div className="invalid-feedback d-block">
                  {errors.firstGraduate}
                </div>
              )}
            </div>

            {/* Annual Income */}
            <div className="col-md-6">
              <label className="form-label">Annual Income</label>
              <input
                type="text"
                name="annualIncome"
                value={formData.annualIncome}
                onChange={handleChange}
                className={`form-control ${
                  errors.annualIncome ? "is-invalid" : ""
                }`}
              />
              {errors.annualIncome && (
                <div className="invalid-feedback">{errors.annualIncome}</div>
              )}
            </div>

            {/* CG/MQ */}
            <div className="col-md-6">
              <label className="form-label">CG/MQ</label>
              <input
                type="text"
                name="cgMq"
                value={formData.cgMq}
                onChange={handleChange}
                className={`form-control ${errors.cgMq ? "is-invalid" : ""}`}
              />
              {errors.cgMq && (
                <div className="invalid-feedback">{errors.cgMq}</div>
              )}
            </div>

            {/* Religion */}
            <div className="col-md-6">
              <label className="form-label">Religion</label>
              <select
                name="religion"
                value={formData.religion}
                onChange={handleChange}
                className={`form-select ${errors.religion ? "is-invalid" : ""}`}
              >
                <option value="">Select</option>
                <option value="Hindu">Hindu</option>
                <option value="Muslim">Muslim</option>
                <option value="Christian">Christian</option>
                <option value="Sikh">Sikh</option>
                <option value="Buddhist">Buddhist</option>
                <option value="Jain">Jain</option>
                <option value="Other">Other</option>
              </select>
              {errors.religion && (
                <div className="invalid-feedback">{errors.religion}</div>
              )}
            </div>

            {/* Single Parent */}
            <div className="col-md-6">
              <label className="form-label">Single Parent</label>
              <div>
                <div className="form-check form-check-inline">
                  <input
                    type="radio"
                    name="singleParent"
                    value="Yes"
                    onChange={handleChange}
                    className="form-check-input"
                  />
                  <label className="form-check-label">Yes</label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    type="radio"
                    name="singleParent"
                    value="No"
                    onChange={handleChange}
                    className="form-check-input"
                  />
                  <label className="form-check-label">No</label>
                </div>
              </div>
              {errors.singleParent && (
                <div className="invalid-feedback d-block">
                  {errors.singleParent}
                </div>
              )}
            </div>

            {/* Caste */}
            <div className="col-md-6">
              <label className="form-label">Caste</label>
              <select
                name="caste"
                value={formData.caste}
                onChange={handleChange}
                className={`form-select ${errors.caste ? "is-invalid" : ""}`}
              >
                <option value="">Select</option>
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

          <div className="d-flex justify-content-center mt-4">
            <button type="submit" className="continue-btn rounded-5">
              Submit
              <img
                src={continue_btn}
                className="ms-1"
                style={{
                  maxWidth: "2rem",
                  //minwidth: "4rem",
                  height: "auto",
                }}
              />
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default ScholarShipForm;
