import React, { useState, useEffect, useMemo, useCallback } from "react";
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

// Debounce hook
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

const CollegeList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const initialFormData = location.state?.formData || {};

  // Synonyms map for majors/degrees
  const degreeSynonyms = {
    engineering: ["engineering", "btech", "mtech", "technology"],
    technology: ["technology", "engineering", "btech", "mtech"],
    business: ["business", "mba", "management", "pgdm", "commerce"],
    management: ["management", "mba", "business", "pgdm"],
    mba: ["mba", "management", "business", "pgdm"],
    science: ["science", "bsc", "msc"],
    arts: ["arts", "ba", "bfa"],
    law: ["law", "llb", "llm"],
    medicine: ["medicine", "mbbs", "medical", "health"],
    finance: ["finance", "accounting", "commerce"],
    accounting: ["accounting", "finance", "commerce"],
    computer: ["computer", "it", "technology", "bca", "mca"],
    // Add more as needed
  };

  // Filters from form data
  const [selectedType, setSelectedType] = useState(initialFormData.type || "");
  console.log(initialFormData);
  const [selectedDegree, setSelectedDegree] = useState(
    initialFormData.major || "" //filtering by major instead of degree (cuz major is more specific)
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

  // Debounced search term
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const fetchColleges = useCallback(async () => {
    try {
      const response = await axios.get(
        "https://destiny-dive.onrender.com/colleges"
      );
      setColleges(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching colleges from DB:", error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchColleges();
  }, [fetchColleges]);

  const filterColleges = useCallback(() => {
    let filtered = colleges;
    // Debug: log all filter values
    console.log("Filter values:", {
      selectedType,
      selectedDegree,
      selectedState,
      selectedPercentage,
      selectedMajor,
      debouncedSearchTerm,
      selectedArea,
      selectedCountry,
      selectedUniversityType,
      selectedTuitionFee,
      selectedDuration,
      initialFormData,
    });
    if (initialFormData) {
      if (selectedType) {
        filtered = filtered.filter(
          (college) => college.type.toLowerCase() === selectedType.toLowerCase()
        );
      }
      if (selectedDegree) {
        filtered = filtered.filter((college) =>
          college.degree.some((degree) =>
            degree.toLowerCase().includes(selectedDegree.toLowerCase())
          )
        );
      }
      // Debug: log after degree filter
      console.log(
        "After degree filter:",
        filtered.map((c) => c.name)
      );
      // Fix: State filter should match partials like 'Delhi' in 'Delhi, India'
      if (selectedType === "Indian" && selectedState) {
        filtered = filtered.filter((college) =>
          college.location.toLowerCase().includes(selectedState.toLowerCase())
        );
      }
      // Debug: log after state filter
      console.log(
        "After state filter:",
        filtered.map((c) => c.name)
      );
      if (selectedPercentage) {
        filtered = filtered.filter(
          (college) => selectedPercentage >= college.minPercentage
        );
      }
      if (initialFormData.major) {
        const major = initialFormData.major.toLowerCase();
        const synonyms = degreeSynonyms[major] || [major];
        filtered = filtered.filter((college) =>
          college.degree.some((deg) =>
            synonyms.some((syn) => deg.toLowerCase().includes(syn))
          )
        );
      }
      if (selectedMajor) {
        filtered = filtered.filter((college) =>
          college.degree.some((deg) =>
            deg.toLowerCase().includes(selectedMajor.toLowerCase())
          )
        );
      }
    }
    if (debouncedSearchTerm.trim()) {
      filtered = filtered.filter((college) =>
        college.name
          .toLowerCase()
          .includes(debouncedSearchTerm.toLowerCase().trim())
      );
    }
    if (selectedArea.trim()) {
      filtered = filtered.filter((college) =>
        college.degree.some((deg) =>
          deg.toLowerCase().includes(selectedArea.toLowerCase().trim())
        )
      );
    }
    if (selectedCountry) {
      filtered = filtered.filter((college) => {
        const location = college.location.toLowerCase();
        const country = selectedCountry.toLowerCase();
        if (country === "united states" || country === "usa") {
          return location.includes("usa") || location.includes("united states");
        } else if (country === "united kingdom" || country === "uk") {
          return location.includes("uk") || location.includes("united kingdom");
        } else {
          return location.includes(country);
        }
      });
    }
    if (selectedUniversityType) {
      filtered = filtered.filter(
        (college) =>
          college.universityType.toLowerCase() ===
          selectedUniversityType.toLowerCase()
      );
    }
    if (selectedTuitionFee && !isNaN(selectedTuitionFee)) {
      const maxFee = parseInt(selectedTuitionFee);
      filtered = filtered.filter((college) => college.tuitionFee <= maxFee);
    }
    if (selectedDuration) {
      filtered = filtered.filter(
        (college) => college.courseDuration === selectedDuration
      );
    }
    // Debug: log final filtered colleges
    console.log(
      "Filtered colleges:",
      filtered.map((c) => c.name)
    );
    return filtered;
  }, [
    colleges,
    initialFormData,
    selectedType,
    selectedDegree,
    selectedState,
    selectedPercentage,
    selectedMajor,
    debouncedSearchTerm,
    selectedArea,
    selectedCountry,
    selectedUniversityType,
    selectedTuitionFee,
    selectedDuration,
  ]);

  const filteredColleges = useMemo(() => filterColleges(), [filterColleges]);

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

  const handleKnowMore = useCallback(
    (college, type) => {
      navigate("/collegeInfo", {
        state: { college, type },
      });
    },
    [navigate]
  );

  const clearAllFilters = useCallback(() => {
    setSearchTerm("");
    setSelectedArea("");
    setSelectedCountry("");
    setSelectedUniversityType("");
    setSelectedTuitionFee("");
    setSelectedDuration("");
    setShowAreaFilter(false);
    setShowCountryFilter(false);
    setShowUniversityTypeFilter(false);
    setShowTuitionFeeFilter(false);
    setShowDurationFilter(false);
  }, []);

  // Add this function to reset all filters and search
  const resetAllFilters = () => {
    setSelectedType("");
    setSelectedDegree("");
    setSelectedState("");
    setSelectedEducationLevel("");
    setSelectedBoard("");
    setSelectedPercentage(null);
    setSelectedMajor("");
    setSearchTerm("");
    setSelectedArea("");
    setSelectedCountry("");
    setSelectedUniversityType("");
    setSelectedTuitionFee("");
    setSelectedDuration("");
    setShowAreaFilter(false);
    setShowCountryFilter(false);
    setShowUniversityTypeFilter(false);
    setShowTuitionFeeFilter(false);
    setShowDurationFilter(false);
  };

  // Restore renderColleges to a regular function
  const renderColleges = (list, limit, viewMoreState, setViewMoreState) => (
    <>
      {list.length === 0 ? (
        <div className="text-center py-5">
          <h5 className="text-muted">
            No colleges found matching your criteria
          </h5>
          <p className="text-muted">
            Try adjusting your filters or search terms
          </p>
          <button className="btn btn-outline-primary" onClick={clearAllFilters}>
            Clear All Filters
          </button>
        </div>
      ) : (
        <>
          <div className="row">
            {list
              .slice(0, viewMoreState ? list.length : limit)
              .map((college) => (
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
                    <p>Courses: {college.degree.join(", ")}</p>
                    <div className="d-flex justify-content-between align-items-center mt-2">
                      <span className="badge bg-info">
                        Duration: {college.courseDuration}
                      </span>
                      <span className="badge bg-success">
                        Fee: ${college.tuitionFee.toLocaleString()}
                      </span>
                    </div>
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
                <img
                  src={continue_btn}
                  className="ms-1"
                  style={{
                    maxWidth: "2rem",
                    height: "auto",
                  }}
                />
              </button>
            </div>
          )}
        </>
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
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold mb-0">Filters</h5>
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={resetAllFilters}
              >
                Reset Filters
              </button>
            </div>
            <hr />
            {/* Area of Interest Filter */}
            <div className="filter-item pe-5">
              <button
                className="btn w-100 text-start d-inline filter-btn"
                onClick={() => {
                  if (showAreaFilter) setSelectedArea("");
                  setShowAreaFilter(!showAreaFilter);
                }}
              >
                <div
                  className={`star ${showAreaFilter ? "filled" : ""}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (showAreaFilter) setSelectedArea("");
                    setShowAreaFilter(!showAreaFilter);
                  }}
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
                onClick={() => {
                  if (showCountryFilter) setSelectedCountry("");
                  setShowCountryFilter(!showCountryFilter);
                }}
              >
                <div
                  className={`star ${showCountryFilter ? "filled" : ""}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (showCountryFilter) setSelectedCountry("");
                    setShowCountryFilter(!showCountryFilter);
                  }}
                >
                  ★ <span className="fs-6 fw-semibold text-dark">Country</span>{" "}
                  <br />
                </div>

                <small className="text-muted ms-4">Filter by country</small>
              </button>
              {showCountryFilter && (
                <div>
                  <select
                    className="form-control"
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                  >
                    <option value="">Select Country</option>
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
                onClick={() => {
                  if (showUniversityTypeFilter) setSelectedUniversityType("");
                  setShowUniversityTypeFilter(!showUniversityTypeFilter);
                }}
              >
                <div
                  className={`star ${showUniversityTypeFilter ? "filled" : ""}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (showUniversityTypeFilter) setSelectedUniversityType("");
                    setShowUniversityTypeFilter(!showUniversityTypeFilter);
                  }}
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
                onClick={() => {
                  if (showTuitionFeeFilter) setSelectedTuitionFee("");
                  setShowTuitionFeeFilter(!showTuitionFeeFilter);
                }}
              >
                <div
                  className={`star ${showTuitionFeeFilter ? "filled" : ""}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (showTuitionFeeFilter) setSelectedTuitionFee("");
                    setShowTuitionFeeFilter(!showTuitionFeeFilter);
                  }}
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
                <div>
                  <select
                    className="form-control mb-2"
                    value={selectedTuitionFee}
                    onChange={(e) => setSelectedTuitionFee(e.target.value)}
                  >
                    <option value="">Select Fee Range</option>
                    <option value="20000">Under 20,000</option>
                    <option value="30000">Under 30,000</option>
                    <option value="40000">Under 40,000</option>
                    <option value="50000">Under 50,000</option>
                    <option value="60000">Under 60,000</option>
                  </select>
                  <div className="d-flex align-items-center">
                    <input
                      type="number"
                      className="form-control me-2"
                      placeholder="Custom Max Fee"
                      value={
                        selectedTuitionFee &&
                        !["20000", "30000", "40000", "50000", "60000"].includes(
                          selectedTuitionFee
                        )
                          ? selectedTuitionFee
                          : ""
                      }
                      onChange={(e) => setSelectedTuitionFee(e.target.value)}
                    />
                    <small className="text-muted">USD</small>
                  </div>
                </div>
              )}
            </div>

            {/* Course Duration Filter */}
            <div className="filter-item">
              <button
                className="btn w-100 mb-1 d-inline text-start filter-btn"
                onClick={() => {
                  if (showDurationFilter) setSelectedDuration("");
                  setShowDurationFilter(!showDurationFilter);
                }}
              >
                <div
                  className={`star ${showDurationFilter ? "filled" : ""}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (showDurationFilter) setSelectedDuration("");
                    setShowDurationFilter(!showDurationFilter);
                  }}
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
                <div>
                  <select
                    className="form-control mb-2"
                    value={selectedDuration}
                    onChange={(e) => setSelectedDuration(e.target.value)}
                  >
                    <option value="">Select Duration</option>
                    <option value="6 months">6 months (Short-term)</option>
                    <option value="12 months">12 months (1 Year)</option>
                    <option value="24 months">24 months (2 Years)</option>
                    <option value="36 months">36 months (3 Years)</option>
                    <option value="48 months">48 months (4 Years)</option>
                  </select>
                  <div className="d-flex flex-wrap gap-1 mt-2">
                    <button
                      type="button"
                      className={`btn btn-sm ${
                        selectedDuration === "24 months"
                          ? "btn-primary"
                          : "btn-outline-secondary"
                      }`}
                      onClick={() =>
                        setSelectedDuration(
                          selectedDuration === "24 months" ? "" : "24 months"
                        )
                      }
                    >
                      MBA (2 Years)
                    </button>
                    <button
                      type="button"
                      className={`btn btn-sm ${
                        selectedDuration === "48 months"
                          ? "btn-primary"
                          : "btn-outline-secondary"
                      }`}
                      onClick={() =>
                        setSelectedDuration(
                          selectedDuration === "48 months" ? "" : "48 months"
                        )
                      }
                    >
                      Bachelor's (4 Years)
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Colleges List */}
          <div className="col-md-9">
            <div className="mb-4 d-flex justify-content-between align-items-center">
              <div className="input-group" style={{ maxWidth: "400px" }}>
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
              <button
                className="btn btn-outline-primary ms-3"
                onClick={resetAllFilters}
              >
                Reset Filters
              </button>
            </div>
            {/* Colleges Count Display */}
            <div className="mb-4">
              <div className="d-flex flex-wrap gap-4 justify-content-center align-items-center">
                <p className="count-display align-items-center gap-2">
                  <img src={dream} alt="Dream Icon" className="icon" />
                  <span className="count fs-4">{dreamCount}</span>
                  <strong className="fs-4 fw-medium">Hope</strong>
                </p>
                <p className="count-display align-items-center gap-2">
                  <img src={reach} alt="Reach Icon" className="icon" />
                  <span className="count fs-4">{reachCount}</span>
                  <strong className="fs-4 fw-medium">Approach</strong>
                </p>
                <p className="count-display align-items-center gap-2">
                  <img src={safe} alt="Safe Icon" className="icon" />
                  <span className="count fs-4">{safeCount}</span>
                  <strong className="fs-4 fw-medium">Secured</strong>
                </p>
              </div>

              {/* Active filters indicator */}
              {(searchTerm ||
                selectedArea ||
                selectedCountry ||
                selectedUniversityType ||
                selectedTuitionFee ||
                selectedDuration) && (
                <div className="mt-3 p-2 bg-light rounded">
                  <small className="text-muted">
                    <strong>Active Filters:</strong>
                    {searchTerm && ` Search: "${searchTerm}"`}
                    {selectedArea && ` Area: "${selectedArea}"`}
                    {selectedCountry && ` Country: "${selectedCountry}"`}
                    {selectedUniversityType &&
                      ` Type: "${selectedUniversityType}"`}
                    {selectedTuitionFee &&
                      ` Max Fee: $${parseInt(
                        selectedTuitionFee
                      ).toLocaleString()}`}
                    {selectedDuration && ` Duration: "${selectedDuration}"`}
                  </small>
                </div>
              )}
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
                    <span className="count  ">{dreamCount}</span> Hope
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
                    <span className="count  ">{reachCount}</span> Approach
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
                    <span className="count  ">{safeCount}</span> Secure
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
