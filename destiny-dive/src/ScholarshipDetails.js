import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import logo from "./images/navlogo.png";
import back_btn from "./images/back-btn.png";
import continue_btn from "./images/continue-btn.png";
import Footer from "./Footer";
import Navbar from "./Navbar";
import axios from "axios";
import "./scholarship-details.css";

const ScholarshipDetails = () => {
  const navigate = useNavigate();

  // Initial Scholarship Data
  const initialData = [
    {
      name: "BC/MBC Scholarship",
      description:
        "For students belonging to BC/MBC categories with family income less than ₹2.5L.",
      eligibility: "Minimum 75% in Class 12. Resident of Tamil Nadu.",
      deadline: "31st January 2025",
      amount: "₹50,000",
      category: "Merit-Based",
      type: "State",
      icon: "fas fa-award",
    },
    {
      name: "SC/ST Scholarship",
      description:
        "Financial assistance for SC/ST students pursuing higher education.",
      eligibility: "Minimum 60% in Class 10/12. Annual income below ₹2L.",
      deadline: "28th February 2025",
      amount: "₹75,000",
      category: "Need-Based",
      type: "Central",
      icon: "fas fa-users",
    },
    {
      name: "Merit-Based Scholarship",
      description:
        "Scholarship for meritorious students scoring above 90% in academics.",
      eligibility: "Minimum 90% aggregate in Class 12 or equivalent.",
      deadline: "15th March 2025",
      amount: "₹1,00,000",
      category: "Merit-Based",
      type: "National",
      icon: "fas fa-trophy",
    },
    {
      name: "First Graduate Scholarship",
      description:
        "Support for first-generation graduates from economically weaker sections.",
      eligibility: "First graduate in the family. Family income below ₹3L.",
      deadline: "30th April 2025",
      amount: "₹60,000",
      category: "Need-Based",
      type: "State",
      icon: "fas fa-graduation-cap",
    },
  ];

  // Additional Data
  const additionalData = [
    {
      name: "National Scholarship",
      description:
        "A central government scholarship for economically backward students.",
      eligibility: "Minimum 85% in Class 12. Annual income below ₹1.5L.",
      deadline: "15th May 2025",
      amount: "₹80,000",
      category: "Need-Based",
      type: "Central",
      icon: "fas fa-flag",
    },
    {
      name: "Sports Scholarship",
      description:
        "For students excelling in state/national-level sports competitions.",
      eligibility: "Participation in at least two national-level events.",
      deadline: "10th June 2025",
      amount: "₹1,20,000",
      category: "Sports",
      type: "National",
      icon: "fas fa-medal",
    },
  ];

  const [scholarships, setScholarships] = useState([]);
  const [scholarshipData, setScholarshipData] = useState(initialData);
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(false);

  const fetchScholarships = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://destiny-dive.onrender.com/scholarship"
      );
      setScholarships(response.data);
    } catch (error) {
      console.error("Error fetching scholarships:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScholarships();
  }, []);

  // Toggle Additional Data
  const toggleSeeMore = () => {
    if (isExpanded) {
      setScholarshipData(initialData);
    } else {
      setScholarshipData([...initialData, ...additionalData]);
    }
    setIsExpanded(!isExpanded);
  };

  // Filter scholarships based on search and category
  const filteredScholarships = scholarshipData.filter((scholarship) => {
    const matchesSearch =
      scholarship.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scholarship.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || scholarship.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Get unique categories
  const categories = [
    "All",
    ...new Set(scholarshipData.map((s) => s.category)),
  ];

  // View Button Handler
  const handleViewDetails = (scholarship) => {
    navigate("/scForm", { state: { scholarship } });
  };

  return (
    <>
      <Navbar />
      <div className="scholarship-details-container">
        {/* Header */}
        <div className="header-section">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-md-8">
                <h1 className="page-title">Available Scholarships</h1>
                <p className="page-subtitle">
                  Discover and apply for scholarships that match your profile
                </p>
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

        {/* Search and Filter Section */}
        <div className="search-section">
          <div className="container">
            <div className="row g-3">
              <div className="col-md-6">
                <div className="search-box">
                  <i className="fas fa-search search-icon"></i>
                  <input
                    type="text"
                    placeholder="Search scholarships..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                  />
                </div>
              </div>
              <div className="col-md-6">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="category-select"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Scholarships Grid */}
        <div className="scholarships-section">
          <div className="container">
            {loading ? (
              <div className="loading-container">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <>
                {filteredScholarships.length === 0 ? (
                  <div className="no-results">
                    <i className="fas fa-search fa-3x text-muted mb-3"></i>
                    <h4>No scholarships found</h4>
                    <p>
                      Try adjusting your search criteria or browse all
                      scholarships
                    </p>
                  </div>
                ) : (
                  <div className="row g-4">
                    {filteredScholarships.map((item, index) => (
                      <div key={index} className="col-lg-6 col-xl-4">
                        <div className="scholarship-card">
                          <div className="card-header">
                            <div className="scholarship-icon">
                              <i className={item.icon}></i>
                            </div>
                            <div className="scholarship-amount">
                              {item.amount}
                            </div>
                          </div>
                          <div className="card-body">
                            <h5 className="scholarship-name">{item.name}</h5>
                            <p className="scholarship-description">
                              {item.description}
                            </p>

                            <div className="scholarship-details">
                              <div className="detail-item">
                                <i className="fas fa-user-graduate"></i>
                                <span>
                                  <strong>Eligibility:</strong>{" "}
                                  {item.eligibility}
                                </span>
                              </div>
                              <div className="detail-item">
                                <i className="fas fa-calendar-alt"></i>
                                <span>
                                  <strong>Deadline:</strong> {item.deadline}
                                </span>
                              </div>
                            </div>

                            <div className="scholarship-tags">
                              <span
                                className={`tag tag-${item.category
                                  .toLowerCase()
                                  .replace(" ", "-")}`}
                              >
                                {item.category}
                              </span>
                              <span className="tag tag-type">{item.type}</span>
                            </div>
                          </div>
                          <div className="card-footer">
                            <button
                              className="btn btn-primary apply-btn"
                              onClick={() => handleViewDetails(item)}
                            >
                              <i className="fas fa-arrow-right me-2"></i>
                              Apply Now
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Load More Button */}
                <div className="load-more-section">
                  <button className="load-more-btn" onClick={toggleSeeMore}>
                    {isExpanded ? "Show Less" : "Load More Scholarships"}
                    <img
                      src={continue_btn}
                      className="ms-2"
                      style={{
                        maxWidth: "1.5rem",
                        height: "auto",
                      }}
                    />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ScholarshipDetails;
