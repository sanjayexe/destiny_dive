import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate, useLocation } from "react-router-dom";
import { FaSearch, FaBell, FaUser, FaBars } from "react-icons/fa";
import { MdOutlineReadMore } from "react-icons/md";
import axios from "axios";
import "./CollegeList.css";
import logo from "./images/navlogo.png";
import continue_btn from "./images/continue-btn.png";
import dream from "./college_icons/dream.png";
import reach from "./college_icons/reach.png";
import safe from "./college_icons/safe.png";
import Footer from "./Footer";
import Navbar from "./Navbar";

const CollegeList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const initialFormData = location.state?.formData || "";

  // Filters from form data
  const [selectedType, setSelectedType] = useState(initialFormData.type || "");
  const [selectedDegree, setSelectedDegree] = useState(
    initialFormData.degree || ""
  );
  const [selectedState, setSelectedState] = useState(
    initialFormData.state || ""
  );
  const [selectedEducationLevel, setSelectedEducationLevel] = useState(
    initialFormData.educationLevel || ""
  );
  const [selectedBoard, setSelectedBoard] = useState(
    initialFormData.board || ""
  );
  const [selectedPercentage, setSelectedPercentage] = useState(
    initialFormData.percentage || null
  );
  const [selectedMajor, setSelectedMajor] = useState(
    initialFormData.major || ""
  );

  const [colleges, setColleges] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [viewMoreDream, setViewMoreDream] = useState(false);
  const [viewMoreReach, setViewMoreReach] = useState(false);
  const [viewMoreSafe, setViewMoreSafe] = useState(false);

  // Filter states
  const [selectedArea, setSelectedArea] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedUniversityType, setSelectedUniversityType] = useState("");
  const [selectedTuitionFee, setSelectedTuitionFee] = useState("");
  const [selectedDuration, setSelectedDuration] = useState("");

  // State for toggling filter inputs
  const [showFilters, setShowFilters] = useState(false);
  const [showAreaFilter, setShowAreaFilter] = useState(false);
  const [showCountryFilter, setShowCountryFilter] = useState(false);
  const [showUniversityTypeFilter, setShowUniversityTypeFilter] =
    useState(false);
  const [showTuitionFeeFilter, setShowTuitionFeeFilter] = useState(false);
  const [showDurationFilter, setShowDurationFilter] = useState(false);

  useEffect(() => {
    // Fetch data from the fake JSON server
    const fetchColleges = async () => {
      try {
        const response = await axios.get("http://localhost:4501/colleges");
        setColleges(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching colleges:", error);
        setLoading(false);
      }
    };

    fetchColleges();
  }, []);

  // Filter colleges by search term and selected filters
  const filterColleges = () => {
    let filtered = colleges;

    // Apply form data filters
    // if (selectedType) {
    //   filtered = filtered.filter((college) =>
    //     college.type.toLowerCase().includes(selectedType.toLowerCase())
    //   );
    // }

    // if (selectedDegree) {
    //   filtered = filtered.filter((college) =>
    //     college.degree.some(
    //       (degree) =>
    //         typeof degree === "string" &&
    //         degree.toLowerCase().includes(selectedDegree.toLowerCase())
    //     )
    //   );
    // }
    // if (selectedType === "Indian") {
    //   if (selectedState) {
    //     filtered = filtered.filter((college) =>
    //       college.location.toLowerCase().includes(selectedState.toLowerCase())
    //     );
    //   }
    // }

    // if (selectedPercentage) {
    //   filtered = filtered.filter(
    //     (college) => college.minPercentage <= selectedPercentage
    //   );
    // }

    // if (selectedMajor) {
    //   filtered = filtered.filter((college) =>
    //     college.recommendedCourses.some(
    //       (recommendedCourses) =>
    //         typeof recommendedCourses === "string" &&
    //         recommendedCourses
    //           .toLowerCase()
    //           .includes(selectedMajor.toLowerCase())
    //     )
    //   );
    // }

    // Apply search term if any
    if (searchTerm) {
      filtered = filtered.filter((college) =>
        college.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (searchTerm) {
      filtered = filtered.filter((college) =>
        college.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedArea) {
      filtered = filtered.filter((college) =>
        college.recommendedCourses.some((course) =>
          course.toLowerCase().includes(selectedArea.toLowerCase())
        )
      );
    }

    if (selectedCountry) {
      filtered = filtered.filter((college) =>
        college.location.toLowerCase().includes(selectedCountry.toLowerCase())
      );
    }

    if (selectedUniversityType) {
      filtered = filtered.filter((college) =>
        college.universityType
          .toLowerCase()
          .includes(selectedUniversityType.toLowerCase())
      );
    }

    if (selectedTuitionFee) {
      filtered = filtered.filter(
        (college) => college.tuitionFee <= selectedTuitionFee
      );
    }

    if (selectedDuration) {
      filtered = filtered.filter(
        (college) => college.courseDuration === selectedDuration
      );
    }

    return filtered;
  };

  const filteredColleges = filterColleges();

  // Categorize colleges based on chances
  const dreamColleges = filteredColleges.filter(
    (college) => college.chances === 0
  );
  const reachColleges = filteredColleges.filter(
    (college) => college.chances === 50
  );
  const safeColleges = filteredColleges.filter(
    (college) => college.chances === 100
  );

  // Calculate counts for each category
  const dreamCount = dreamColleges.length;
  const reachCount = reachColleges.length;
  const safeCount = safeColleges.length;

  //know-more navigation based on college
  const handleKnowMore = (college, type) => {
    navigate("/collegeInfo", {
      state: { college, type },
    });
  };

  const renderColleges = (list, limit, viewMoreState, setViewMoreState) => (
    <>
      <div className="row">
        {list.slice(0, viewMoreState ? list.length : limit).map((college) => (
          <div className="col-md-6 mb-4" key={college.id}>
            <div className="card p-3 shadow-sm">
              <h5 className="fw-bold">{college.name}</h5>
              <p className="text-muted">{college.location}</p>
              <p className="d-flex">
                <p>Type: {college.type}</p>
                <span
                  className="text-info ms-auto know-more"
                  onClick={() => {
                    handleKnowMore(college.name, college.type);
                  }}
                >
                  <MdOutlineReadMore className="fs-3" /> Know More
                </span>
              </p>
              <p>University Type: {college.universityType}</p>
              <p>
                Recommended Courses: {college.recommendedCourses.join(", ")}
              </p>
            </div>
          </div>
        ))}
      </div>
      {list.length > 2 && (
        <div className="d-flex justify-content-center mt-4">
          <button
            className="btn board rounded-5"
            onClick={() => setViewMoreState(!viewMoreState)}
          >
            {viewMoreState ? "View Less" : "View More"}
            <img src={continue_btn} style={{ width: "2vw", height: "auto" }} />
          </button>
        </div>
      )}
    </>
  );

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // const Navbar = () => (
  //   <nav className="navbar navbar-expand-md navbar-light bg-light mb-4">
  //     <div className="container-fluid">
  //       <div className="position-absolute navbar-brand top-0 ">
  //         <img
  //           src={logo}
  //           alt="University Logo"
  //           style={{ height: "70px", cursor: "pointer" }}
  //         />
  //       </div>

  //       {/* Navbar Toggle for Small Screens */}
  //       <button
  //         className="navbar-toggler ms-auto"
  //         type="button"
  //         onClick={() => setShowFilters(!showFilters)}
  //       >
  //         <FaBars />
  //       </button>

  //       {/* Navbar Contents for Medium and Large Screens */}
  //       <div
  //         className={`collapse navbar-collapse d-md-flex ${
  //           showFilters ? "d-block" : "d-none d-md-block"
  //         }`}
  //       >
  //         {/* <form className="d-flex flex-grow-1 mx-md-3">
  //           <input
  //             type="text"
  //             className="form-control me-2"
  //             placeholder="Search for colleges..."
  //             value={searchTerm}
  //             onChange={(e) => setSearchTerm(e.target.value)}
  //           />
  //           <button className="btn btn-outline-primary" type="submit">
  //             <FaSearch />
  //           </button>
  //         </form> */}

  //         <ul className="navbar-nav ms-auto d-flex">
  //           <li className="nav-item">
  //             <a className="nav-link" href="#">
  //               <FaBell className="fs-2" />
  //             </a>
  //           </li>
  //           <li className="nav-item">
  //             <a className="nav-link" href="#">
  //               <FaUser className="fs-2" />
  //             </a>
  //           </li>
  //         </ul>
  //       </div>
  //     </div>
  //   </nav>
  //);

  return (
    <>
      <Navbar />
      <div className="container-fluid py-4">
        <div className="row">
          {/* Filter Panel on Left */}
          <div className="col-md-3 mb-4 filter-panel">
            <h5 className="fw-bold">Filters</h5>
            <hr />
            {/* Area of Interest Filter */}
            <div className="filter-item pe-5">
              <button
                className="btn w-100 text-start d-inline filter-btn"
                onClick={() => setShowAreaFilter(!showAreaFilter)}
              >
                <div
                  className={`star ${showAreaFilter ? "filled" : ""}`}
                  onClick={() => setShowAreaFilter(!showAreaFilter)}
                >
                  ★{" "}
                  <span className="fs-6 fw-semibold text-dark">
                    {" "}
                    Area of Interest
                  </span>{" "}
                  <br />
                </div>

                <small className="text-muted ms-4">
                  Filter by specific courses
                </small>
              </button>
              {showAreaFilter && (
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter course..."
                  value={selectedArea}
                  onChange={(e) => setSelectedArea(e.target.value)}
                />
              )}
            </div>

            {/* Country or State Filter */}
            <div className="filter-item">
              <button
                className="btn w-100 mb-1 d-inline text-start filter-btn"
                onClick={() => setShowCountryFilter(!showCountryFilter)}
              >
                <div
                  className={`star ${showCountryFilter ? "filled" : ""}`}
                  onClick={() => setShowCountryFilter(!showCountryFilter)}
                >
                  ★{" "}
                  <span className="fs-6 fw-semibold text-dark">
                    Country or State
                  </span>{" "}
                  <br />
                </div>

                <small className="text-muted ms-4">
                  Filter by country or state
                </small>
              </button>
              {showCountryFilter && (
                <div>
                  <select
                    className="form-control"
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                  >
                    <option value="">Select Country/State</option>
                    <option value="United States">United States</option>
                    <option value="Canada">Canada</option>
                    <option value="India">India</option>
                    <option value="Australia">Australia</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Germany">Germany</option>
                    <option value="France">France</option>
                    <option value="Japan">Japan</option>
                    <option value="Mexico">Mexico</option>
                    <option value="Brazil">Brazil</option>
                  </select>
                </div>
              )}
            </div>

            {/* University Type (Indian) Filter */}
            <div className="filter-item">
              <button
                className="btn w-100 mb-1 d-inline text-start filter-btn"
                onClick={() =>
                  setShowUniversityTypeFilter(!showUniversityTypeFilter)
                }
              >
                <div
                  className={`star ${showUniversityTypeFilter ? "filled" : ""}`}
                  onClick={() =>
                    setShowUniversityTypeFilter(!showUniversityTypeFilter)
                  }
                >
                  ★{" "}
                  <span className="fs-6 fw-semibold text-dark">
                    university type
                  </span>{" "}
                  <br />
                </div>

                <small className="text-muted ms-4">
                  Filter by university type
                </small>
              </button>
              {showUniversityTypeFilter && (
                <select
                  className="form-control"
                  value={selectedUniversityType}
                  onChange={(e) => setSelectedUniversityType(e.target.value)}
                >
                  <option value="">Select University Type</option>
                  <option value="Autonomous">Autonomous</option>
                  <option value="Affiliated">Affiliated</option>
                  <option value="Private">Private</option>
                  <option value="Public">Public</option>
                  <option value="Deemed to be University">
                    Deemed to be University
                  </option>
                </select>
              )}
            </div>

            {/* Tuition Fee Filter */}
            <div className="filter-item">
              <button
                className="btn w-100 mb-1 d-inline text-start filter-btn"
                onClick={() => setShowTuitionFeeFilter(!showTuitionFeeFilter)}
              >
                <div
                  className={`star ${showTuitionFeeFilter ? "filled" : ""}`}
                  onClick={() => setShowTuitionFeeFilter(!showTuitionFeeFilter)}
                >
                  ★{" "}
                  <span className="fs-6 fw-semibold text-dark">
                    Tuition Fee
                  </span>{" "}
                  <br />
                </div>

                <small className="text-muted ms-4">
                  Filter by tuition fee range
                </small>
              </button>
              {showTuitionFeeFilter && (
                <input
                  type="number"
                  className="form-control"
                  placeholder="Max Fee"
                  value={selectedTuitionFee}
                  onChange={(e) => setSelectedTuitionFee(e.target.value)}
                />
              )}
            </div>

            {/* Course Duration Filter */}
            <div className="filter-item">
              <button
                className="btn w-100 mb-1 d-inline text-start filter-btn"
                onClick={() => setShowDurationFilter(!showDurationFilter)}
              >
                <div
                  className={`star ${showDurationFilter ? "filled" : ""}`}
                  onClick={() => setShowDurationFilter(!showDurationFilter)}
                >
                  ★{" "}
                  <span className="fs-6 fw-semibold text-dark">
                    Course Duration
                  </span>{" "}
                  <br />
                </div>
                <small className="text-muted ms-4">
                  Filter by course duration
                </small>
              </button>
              {showDurationFilter && (
                <input
                  type="text"
                  className="form-control"
                  placeholder="Duration (e.g., 12 months)"
                  value={selectedDuration}
                  onChange={(e) => setSelectedDuration(e.target.value)}
                />
              )}
            </div>
          </div>

          {/* Colleges List */}
          <div className="col-md-9">
            <div className="mb-4 d-none d-md-block">
              <div className="input-group">
                <span className="input-group-text">
                  <FaSearch />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search for colleges..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            {/* Colleges Count Display */}
            <div className="mb-4 d-flex flex-wrap gap-4 justify-content-center align-items-center">
              <p className="count-display  align-items-center gap-2">
                <img src={dream} alt="Dream Icon" className="icon" />
                <span className="count fs-4">{dreamCount}</span>
                <strong className="fs-4 fw-medium">Dream</strong>
              </p>
              <p className="count-display  align-items-center gap-2">
                <img src={reach} alt="Reach Icon" className="icon" />
                <span className="count fs-4">{reachCount}</span>
                <strong className="fs-4 fw-medium">Reach</strong>
              </p>
              <p className="count-display  align-items-center gap-2">
                <img src={safe} alt="Safe Icon" className="icon" />
                <span className="count fs-4">{safeCount}</span>
                <strong className="fs-4 fw-medium">Safe</strong>
              </p>
            </div>
            <div className="clgs p-3">
              <div className="mb-5">
                <div className="d-flex gap-3 align-items-center ">
                  <img
                    src={dream}
                    alt="Dream Icon"
                    className="icon align-items-center"
                  />{" "}
                  <h4 className="text-dark fw-medium">
                    {" "}
                    <span className="count  ">{dreamCount}</span> Dream
                    Universities
                  </h4>
                </div>

                {renderColleges(
                  dreamColleges,
                  4,
                  viewMoreDream,
                  setViewMoreDream
                )}
              </div>

              <div className="mb-5">
                <div className="d-flex gap-3 align-items-center ">
                  <img
                    src={reach}
                    alt="Dream Icon"
                    className="icon align-items-center"
                  />{" "}
                  <h4 className="text-dark fw-medium">
                    {" "}
                    <span className="count  ">{reachCount}</span> Reach
                    Universities
                  </h4>
                </div>
                {renderColleges(
                  reachColleges,
                  4,
                  viewMoreReach,
                  setViewMoreReach
                )}
              </div>

              <div className="mb-5">
                <div className="d-flex gap-3 align-items-center ">
                  <img
                    src={safe}
                    alt="safe Icon"
                    className="icon align-items-center"
                  />{" "}
                  <h4 className="text-dark fw-medium">
                    {" "}
                    <span className="count  ">{safeCount}</span> Safe
                    Universities
                  </h4>
                </div>
                {renderColleges(safeColleges, 4, viewMoreSafe, setViewMoreSafe)}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CollegeList;
