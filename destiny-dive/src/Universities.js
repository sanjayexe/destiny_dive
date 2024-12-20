import React, { useState } from "react";
import Footer from "./Footer";
import "./university.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate, useLocation } from "react-router-dom";
import mba from "./university-images/mba.png";
import bsc from "./university-images/bachelors.png";
import msc from "./university-images/masters.png";

import logo from "./images/navlogo.png";
import back_btn from "./images/back-btn.png";
import continue_btn from "./images/continue-btn.png";

import chennai from "./city-images/chennai.png";
import delhi from "./city-images/delhi.png";
import mumbai from "./city-images/mumbai.png";
import Kolkata from "./city-images/kolkata.png";
import bengaluru from "./city-images/bengaluru.jpeg";
import ahemedabad from "./city-images/ahemedabad.jpeg";

import Management from "./major-images/management.png";
import law from "./major-images/law.png";
import archi from "./major-images/archi.png";
import finance from "./major-images/finance.png";
import eng from "./major-images/eng.png";
import med from "./major-images/med.png";

const Universities = () => {
  const location = useLocation();
  const type = location.state?.type;

  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    type: type,
    degree: "",
    state: "",
    educationLevel: "",
    frstDegree: "", //masters
    occupation: "", //masters,mba
    courseBased: "", //mba
    board: "",
    percentage: null,
    major: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [errors, setErrors] = useState({});

  const statesWithImages = [
    { name: "Mumbai", img: mumbai },
    {
      name: "Kolkata",
      img: Kolkata,
    },
    {
      name: "Chennai",
      img: chennai,
    },
    {
      name: "Ahmedabad",
      img: ahemedabad,
    },
    { name: "Delhi", img: delhi },
    {
      name: "Bengaluru",
      img: bengaluru,
    },
  ];

  const majors = [
    { name: "Management", img: Management },
    { name: "Engineering", img: eng },
    { name: "Finance and Bank", img: finance },
    { name: "Medicine", img: med },
    { name: "Architecture", img: archi },
    { name: "Law", img: law },
  ];

  const handleNextStep = () => {
    const newErrors = {};
    if (step === 3) {
      if (!formData.educationLevel)
        newErrors.educationLevel = "Please select your education level.";
      if (!formData.board) newErrors.board = "Please select your board.";
      if (formData.percentage <= 0 && formData.percentage > 100) {
        newErrors.newpercentage = "Please enter valid percentage.";
      }
      if (!formData.percentage)
        newErrors.percentage = "Please enter your percentage.";
      if (formData.degree != "Bachelors") {
        setStep(step + 2);
      }
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) setStep(step + 1);
  };

  const handlePrevStep = () => {
    if (type === "Abroad" && step === 3) {
      setStep(1);
    }
    if (type === "Abroad" && step != 3) setStep(step - 1); //normal back button if its not 3rd step
    if (type !== "Abroad") setStep(step - 1);
    if (step === 5 && formData.degree != "Bachelors") setStep(step - 2);
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
    if (field === "degree") {
      setStep(type === "Abroad" ? 3 : 2);
    }
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  const filteredStates = statesWithImages.filter((state) =>
    state.name.toLowerCase().includes(searchQuery)
  );

  const handleStateSelection = (stateName) => {
    setFormData({ ...formData, state: stateName });
    setStep(3); // Move to the next step
  };

  return (
    <>
      <div className="container-fluid bg-light vh-100 position-relative">
        {/* Back Icon at Top Left */}
        {step > 1 && (
          <div
            className="position-absolute top-0 start-0 m-3"
            onClick={handlePrevStep}
            style={{ cursor: "pointer", zIndex: 1000 }}
          >
            <img src={back_btn} alt="" height={"auto"} width={"50px"} />
          </div>
        )}
        {/* Logo at Top Right */}
        <div className="position-absolute  top-0 end-0 m-3">
          <img
            src={logo}
            alt="University Logo"
            style={{ height: "70px", cursor: "pointer" }}
          />
        </div>
        {/* Main Content */}
        <div className="d-flex justify-content-center align-items-center vh-100">
          <div
            className="card shadow-lg  mt-5   p-4 w-100 col-11 col-md-8 col-lg-6"
            style={{ maxWidth: "600px" }}
          >
            {(step === 3 ||
              (step === 4 && formData.degree === "Bachelors")) && (
              <p className="fw-semibold fs-4">
                Current Track:{" "}
                <span className="text-primary">{formData.degree}</span>
              </p>
            )}
            {/* Header */}
            <div className="text-center mb-4 ">
              <h4 className="fw-bold text-dark">
                {step === 1 && "Which Degree do you Wish to Pursue?"}
                {step === 2 &&
                  "Which State Do You Wish to Pursue Your Education In?"}

                {step === 3 &&
                  formData.degree === "Bachelors" &&
                  "What is Your Highest Education Level?"}
                {step === 3 &&
                  (formData.degree === "Masters" ||
                    formData.degree === "MBA") &&
                  "What is Your current occupation?"}
                {step === 4 &&
                  formData.degree === "Bachelors" &&
                  "Which Major Do You Want to Pursue?"}
                {step === 5 && "Summary of Your Selection"}
              </h4>
            </div>

            {/* Content Based on Step */}
            {step === 1 && (
              <div className="text-center d-flex justify-content-evenly">
                {[
                  { name: "Bachelors", img: bsc },
                  { name: "Masters", img: msc },
                  { name: "MBA", img: mba },
                ].map((degree) => (
                  <div
                    key={degree.name}
                    className={`degree-option mb-3 ${
                      formData.degree === degree.name ? "selected" : ""
                    }`}
                    onClick={() => handleChange("degree", degree.name)}
                    style={{ cursor: "pointer" }}
                  >
                    <img
                      src={degree.img}
                      alt={degree.name}
                      style={{ maxWidth: "80px" }}
                      className="img-fluid"
                    />
                    <p className="mt-2 fw-semibold fs-5 ">{degree.name}</p>
                  </div>
                ))}
              </div>
            )}

            {step === 2 && (
              <div>
                {/* Search Bar */}
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search for a state..."
                    value={searchQuery}
                    onChange={handleSearch}
                  />
                </div>

                <div className="d-flex flex-wrap align-items-center justify-content-center  ">
                  {filteredStates.map((state) => (
                    <div
                      key={state.name}
                      className={`state-option text-center m-sm-2 m-0  gap-3 ${
                        formData.state === state.name ? "selected" : ""
                      }`}
                      onClick={() => handleStateSelection(state.name)}
                      style={{ cursor: "pointer" }}
                    >
                      <img
                        src={state.img}
                        alt={state.name}
                        style={{
                          maxWidth: "120px",
                          minWidth: "80px",
                          cursor: "pointer",
                        }}
                      />
                      <p className="mt-2">{state.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                {/* Masters-Specific Question */}
                {formData.degree === "Masters" ? (
                  <>
                    {/* Occupation Question */}
                    <div className="text-center mb-3 d-sm-flex d-block">
                      <button
                        className={`rounded-2 btn mx-2 rounded-5 board mb-1 ${
                          formData.occupation === "Bachelor Graduate"
                            ? "active btn-success "
                            : ""
                        }`}
                        onClick={() =>
                          handleChange("occupation", "Bachelor Graduate")
                        }
                      >
                        Bachelor Graduate
                      </button>

                      <button
                        className={`rounded-2 btn mx-2 rounded-5 board mb-1 ${
                          formData.occupation === "An Employee"
                            ? "active btn-success"
                            : ""
                        }`}
                        onClick={() =>
                          handleChange("occupation", "An Employee")
                        }
                      >
                        An Employee
                      </button>
                    </div>
                    {errors.occupation && (
                      <p className="text-danger text-center">
                        {errors.occupation}
                      </p>
                    )}

                    {/* Masters Degree-Based Question */}
                    <div className="mt-4">
                      <center>
                        <label
                          htmlFor="masters-degree"
                          className="form-label fw-bold fs-4"
                        >
                          What is Your Masters Degree Based On?
                        </label>
                      </center>
                      <select
                        id="masters-degree"
                        className={`form-select mx-auto board rounded-5 ${
                          formData.frstDegree ? "selected" : ""
                        }`}
                        value={formData.frstDegree}
                        onChange={(e) =>
                          handleChange("frstDegree", e.target.value)
                        }
                      >
                        <option value="">Select Degree</option>
                        <option value="BE">BE</option>
                        <option value="BTech">BTech</option>
                        <option value="EEE">EEE</option>
                      </select>
                      {errors.frstDegree && (
                        <p className="text-danger">{errors.frstDegree}</p>
                      )}
                    </div>
                  </>
                ) : formData.degree === "MBA" ? (
                  <>
                    {/* Occupation Question */}
                    <div className="text-center mb-3 d-flex">
                      <button
                        className={`rounded-2 btn mx-2 rounded-5 board mb-1 ${
                          formData.occupation === "Bachelor Graduate"
                            ? "active btn-success "
                            : ""
                        }`}
                        onClick={() =>
                          handleChange("occupation", "Bachelor Graduate")
                        }
                      >
                        Bachelor Graduate
                      </button>

                      <button
                        className={`rounded-2 btn mx-2 rounded-5 board mb-1 ${
                          formData.occupation === "An Employee"
                            ? "active btn-success"
                            : ""
                        }`}
                        onClick={() =>
                          handleChange("occupation", "An Employee")
                        }
                      >
                        An Employee
                      </button>
                    </div>
                    {errors.occupation && (
                      <p className="text-danger text-center">
                        {errors.occupation}
                      </p>
                    )}

                    {/* mba Degree-Based Question */}
                    <div className="mt-4">
                      <center>
                        <label
                          htmlFor="mba-degree"
                          className="form-label fw-bold fs-4"
                        >
                          What is Your course Degree Based On?
                        </label>
                      </center>
                      <select
                        id="courseBased"
                        className="form-select mx-auto board rounded-5"
                        value={formData.courseBased}
                        onChange={(e) =>
                          handleChange("courseBased", e.target.value)
                        }
                      >
                        <option value="">Select Course</option>
                        <option value="Accounting">Accounting</option>
                        <option value="Computer Application">
                          Computer Application
                        </option>
                        <option value="Finance">Finance</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Operations Management">
                          Operations Management
                        </option>
                        <option value="Human Resources">Human Resources</option>
                        <option value="Entrepreneurship">
                          Entrepreneurship
                        </option>
                        <option value="Supply Chain Management">
                          Supply Chain Management
                        </option>
                      </select>
                      {errors.courseBased && (
                        <p className="text-danger">{errors.courseBased}</p>
                      )}
                    </div>
                  </>
                ) : (
                  // Original Grade 12 Block (for non-Masters degrees)
                  <>
                    <div className="text-center mb-3 d-flex ">
                      <button
                        className={`rounded-2 btn mx-2 rounded-5 board mb-1 ${
                          formData.educationLevel === "Grade 12"
                            ? "active btn-success "
                            : ""
                        }`}
                        onClick={() =>
                          handleChange("educationLevel", "Grade 12")
                        }
                      >
                        Grade 12
                      </button>

                      <button
                        className={`rounded-2 btn mx-2 rounded-5 board mb-1 ${
                          formData.educationLevel === "Undergraduate Diploma"
                            ? "active btn-success "
                            : ""
                        }`}
                        onClick={() =>
                          handleChange(
                            "educationLevel",
                            "Undergraduate Diploma"
                          )
                        }
                      >
                        Undergraduate Diploma
                      </button>
                    </div>
                    {errors.educationLevel && (
                      <p className="text-danger text-center">
                        {errors.educationLevel}
                      </p>
                    )}

                    <div className="mt-4">
                      <center>
                        <label
                          htmlFor="board"
                          className="form-label fw-bold fs-4 "
                        >
                          What is Your Board in 12?
                        </label>
                      </center>
                      <select
                        id="board"
                        className={`form-select mx-auto board rounded-5 ${
                          formData.board ? "selected" : ""
                        }`}
                        value={formData.board}
                        onChange={(e) => handleChange("board", e.target.value)}
                      >
                        <option value="">Select Board</option>
                        <option value="CBSE">CBSE</option>
                        <option value="ICSE">ICSE</option>
                        <option value="State Board">State Board</option>
                      </select>
                      {errors.board && (
                        <p className="text-danger">{errors.board}</p>
                      )}
                    </div>
                  </>
                )}

                {/* Percentage Section (Common for All Degrees) */}
                <div className="mt-4">
                  <center>
                    <label
                      htmlFor="percentage"
                      className="form-label fw-bold fs-4"
                    >
                      {formData.degree === "Bachelors" &&
                        " What is Your Expected or Gained Percentage"}

                      {formData.degree === "Masters" &&
                        " What is Your Expected or Gained GPA"}

                      {formData.degree === "MBA" &&
                        " What is Your Expected or Gained percentage in entrance exam"}
                    </label>
                  </center>
                  <input
                    id="percentage"
                    type="number"
                    className="form-control"
                    required
                    min="0"
                    max="100"
                    placeholder="Enter percentage"
                    value={formData.percentage || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === "" || (value >= 0 && value <= 100)) {
                        handleChange("percentage", value);
                      }
                    }}
                    onBlur={(e) => {
                      const value = e.target.value;
                      if (value < 0 || value > 100) {
                        handleChange("percentage", "");
                      }
                    }}
                  />
                  {errors.percentage && (
                    <p className="text-danger">{errors.percentage}</p>
                  )}
                  {errors.newpercentage && (
                    <p className="text-danger">{errors.newpercentage}</p>
                  )}
                </div>

                {/* Next Button */}
                <div className="d-flex justify-content-center mt-4">
                  <button
                    className="continue-btn rounded-5"
                    onClick={handleNextStep}
                  >
                    Continue
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
              </div>
            )}

            {step === 4 &&
              (formData.degree != "Masters" || formData.degree != "MBA") && (
                <div>
                  {/* Search Bar for Majors */}
                  <div className="mb-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search for more majors..."
                      value={searchQuery}
                      onChange={handleSearch}
                    />
                  </div>

                  {/* Display Majors */}
                  <div className="d-flex flex-wrap justify-content-center">
                    {searchQuery
                      ? majors
                          .filter((major) =>
                            major.name
                              .toLowerCase()
                              .includes(searchQuery.toLowerCase())
                          )
                          .slice(0, 6) // Limit search results to 6
                          .map((major) => (
                            <div
                              key={major.name}
                              className="major-option text-center m-sm-3 p-sm-3 m-0 p-2 "
                              onClick={() => {
                                handleChange("major", major.name);
                                handleNextStep(); // Proceed to the next step
                              }}
                              style={{ cursor: "pointer" }}
                            >
                              <img
                                src={major.img}
                                alt={major.name}
                                width={"43vw"}
                                height={"auto"}
                              />
                              <p className="mt-2 fw-semibold">{major.name}</p>
                            </div>
                          ))
                      : majors
                          .slice(0, 6) // Display only the first 6 majors when no search is active
                          .map((major) => (
                            <div
                              key={major.name}
                              className="major-option text-center m-sm-3 p-sm-3 m-0 p-2 "
                              onClick={() => {
                                handleChange("major", major.name);
                                handleNextStep(); // Proceed to the next step
                              }}
                              style={{ cursor: "pointer" }}
                            >
                              <img
                                src={major.img}
                                alt={major.name}
                                width={"43vw"}
                                height={"auto"}
                              />
                              <p className="mt-2 fw-semibold">{major.name}</p>
                            </div>
                          ))}
                  </div>

                  {/* Error Message for Major Selection */}
                  {errors.major && (
                    <p className="text-danger text-center">{errors.major}</p>
                  )}
                </div>
              )}

            {step === 5 && (
              <div className="text-center">
                <p>University Type: {formData.type}</p>
                <p>Degree: {formData.degree}</p>
                {type != "Abroad" && <p>State: {formData.state}</p>}

                <p>
                  {formData.degree === "Bachelors" &&
                    `Education Level: ${formData.educationLevel}`}
                  {formData.degree === "Masters" ||
                    (formData.degree === "MBA" &&
                      `Current  Occupation: ${formData.occupation}`)}
                </p>
                <p>
                  {formData.degree === "Bachelors" &&
                    `Board : ${formData.board}`}
                  {formData.degree === "Masters" &&
                    `Degree based  : ${formData.frstDegree}`}
                  {formData.degree === "MBA" &&
                    `Course  based  : ${formData.courseBased}`}
                </p>
                <p>
                  {" "}
                  {formData.degree === "Bachelors" &&
                    `Percentage : ${formData.percentage}%`}
                  {formData.degree === "Masters" &&
                    `Expected or Gained GPA : ${formData.percentage}`}
                  {formData.degree === "MBA" &&
                    `Expected or Gained Percentage : ${formData.percentage}%`}
                </p>
                <p>
                  {formData.degree === "Bachelors" &&
                    `Major : ${formData.major}`}
                </p>
                {/* Next Button */}
                <div className="d-flex justify-content-center mt-4">
                  <button
                    className="continue-btn rounded-5"
                    onClick={() => {
                      navigate("/colleges", { state: { formData } });
                    }}
                  >
                    View Recommended Colleges
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
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Universities;
