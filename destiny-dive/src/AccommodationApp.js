import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Footer from "./Footer";
import Navbar from "./Navbar";
import back_btn from "./images/back-btn.png";
import continue_btn from "./images/continue-btn.png";
import chennai from "./images/chennai.png";
import banglore from "./images/banglore.png";
import Coimbatore from "./images/coimbatore.png";
import pg from "./images/pg.png";

const AccommodationApp = () => {
  const [step, setStep] = useState(1); // Tracks the current step
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedPG, setSelectedPG] = useState({});
  const [searchCity, setSearchCity] = useState(""); // Search term for Step 1
  const [formData, setFormData] = useState({
    roomType: "",
    stayDuration: "",
    moveInDate: "",
    moveOutDate: "",
    fullName: "",
    email: "",
    city: "",
    gender: "",
    mobileNo: "",
    country: "",
    state: "",
    address: "",
    universityName: "",
    courseName: "",
    enrolmentStatus: "",
  });

  const [errors, setErrors] = useState({});

  const [searchTerm, setSearchTerm] = useState(""); // For the search bar
  const [pgLimit, setPGLimit] = useState(2); // Number of PGs displayed initially
  const handleBookingSubmit = () => {
    // Perform validation before submitting
    const newErrors = {};
    if (!formData.roomType) newErrors.roomType = "Room Type is required";
    if (!formData.stayDuration)
      newErrors.stayDuration = "Stay Duration is required";
    if (!formData.moveInDate) newErrors.moveInDate = "Move In Date is required";
    if (!formData.moveOutDate)
      newErrors.moveOutDate = "Move Out Date is required";
    if (!formData.fullName) newErrors.fullName = "Full Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.city) newErrors.city = "City is required";
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.mobileNo) newErrors.mobileNo = "Mobile No is required";
    if (!formData.country) newErrors.country = "Country is required";
    if (!formData.state) newErrors.state = "State is required";
    if (!formData.address) newErrors.address = "Address is required";
    if (!formData.universityName)
      newErrors.universityName = "University Name is required";
    if (!formData.courseName) newErrors.courseName = "Course Name is required";
    if (!formData.enrolmentStatus)
      newErrors.enrolmentStatus = "Enrolment Status is required";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      // Submit the form
      console.log(formData);
    }
  };
  const cities = [
    { name: "Coimbatore", image: Coimbatore },
    { name: "Bangalore", image: banglore },
    { name: "Chennai", image: chennai },
  ];

  const pgs = [
    {
      id: 1,
      name: "Sugam Hostel",
      city: "Coimbatore",
      rent: "Rs 6000/Month",
      img: pg,
    },
    {
      id: 2,
      name: "Dream PG",
      city: "Coimbatore",
      rent: "Rs 7000/Month",
      img: pg,
    },
    {
      id: 3,
      name: "Star PG",
      city: "Coimbatore",
      rent: "Rs 5000/Month",
      img: pg,
    },
    {
      id: 4,
      name: "Skyline Hostel",
      city: "Coimbatore",
      rent: "Rs 6500/Month",
    },
    {
      id: 5,
      name: "Skyline Hostel",
      city: "Bangalore",
      rent: "Rs 6500/Month",
    },
  ];

  const [universityFilter, setUniversityFilter] = useState("");
  const [localityFilter, setLocalityFilter] = useState("");
  const [budgetFilter, setBudgetFilter] = useState("");
  const [moveInMonthFilter, setMoveInMonthFilter] = useState("");
  const [durationFilter, setDurationFilter] = useState("");
  const [roomTypeFilter, setRoomTypeFilter] = useState("");

  const [showUniversityFilter, setShowUniversityFilter] = useState(false);
  const [showLocalityFilter, setShowLocalityFilter] = useState(false);
  const [showBudgetFilter, setShowBudgetFilter] = useState(false);
  const [showMoveInMonthFilter, setShowMoveInMonthFilter] = useState(false);
  const [showDurationFilter, setShowDurationFilter] = useState(false);
  const [showRoomTypeFilter, setShowRoomTypeFilter] = useState(false);

  const filteredPGs = pgs
    .filter((pg) => pg.city === selectedCity)
    .filter((pg) => pg.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter((pg) =>
      universityFilter
        ? pg.university?.toLowerCase().includes(universityFilter.toLowerCase())
        : true
    )
    .filter((pg) =>
      localityFilter
        ? pg.locality?.toLowerCase().includes(localityFilter.toLowerCase())
        : true
    )
    .filter((pg) =>
      budgetFilter
        ? parseInt(pg.rent.replace(/\D/g, "")) <= parseInt(budgetFilter)
        : true
    )
    .filter((pg) =>
      moveInMonthFilter ? pg.moveInMonth === moveInMonthFilter : true
    )
    .filter((pg) =>
      durationFilter ? pg.duration >= parseInt(durationFilter) : true
    )
    .filter((pg) => (roomTypeFilter ? pg.roomType === roomTypeFilter : true));

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    setStep(2); // Go to PG listings
  };

  const handleSearchCity = () => {
    // Filter cities by search input (case-insensitive)
    return cities.filter((city) =>
      city.name.toLowerCase().includes(searchCity.toLowerCase())
    );
  };

  const handlePGSelect = (pg) => {
    setSelectedPG(pg);
    setStep(3); // Go to Enquiry Form
  };

  const handleEnquirySubmit = () => {
    setStep(4); // Go to Booking Form
  };

  // Back button handler
  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  // Handle "See More" button
  const handleSeeMore = () => {
    setPGLimit(pgLimit + 2); // Display 2 more PGs
  };

  // Filter PGs based on search input and selected city
  const filterPGs = pgs
    .filter((pg) => pg.city === selectedCity)
    .filter((pg) => pg.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <>
      <Navbar />
      <div className="container my-5">
        {/* Back Button */}
        {step > 1 && (
          <div
            className="position-absolute top-0 start-0 m-3"
            onClick={handleBack}
            style={{ cursor: "pointer", zIndex: 1000 }}
          >
            <img src={back_btn} alt="" height={"auto"} width={"50px"} />
          </div>
        )}

        {/* Step 1: City Selection */}
        {step === 1 && (
          <div>
            <div className="text-center">
              <h2 className="text-center fw-bold mb-4">Accommodation</h2>
              <h5 className="fw-medium">
                Book Student accommodation near Colleges{" "}
              </h5>
            </div>
            {/* Search Bar for Cities */}
            <div className="mb-4 d-flex">
              <input
                type="text"
                className="form-control"
                placeholder="Search City..."
                onChange={(e) => setSearchCity(e.target.value)}
              />
              <button
                className="btn btn-primary ms-2"
                onClick={handleSearchCity}
              >
                Search
              </button>
            </div>

            {/* Filtered Cities */}
            <div className="row">
              {handleSearchCity().map((city, index) => (
                <div key={index} className="col-md-4 mb-3">
                  <div
                    className="card"
                    onClick={() => handleCitySelect(city.name)}
                    style={{ cursor: "pointer" }}
                  >
                    <img
                      src={city.image}
                      className="card-img-top"
                      alt={city.name}
                    />
                    <div className="card-body">
                      <h5 className="card-title text-center">{city.name}</h5>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: PG Listings */}
        {step === 2 && (
          <div>
            <h2 className="text-center mb-4">
              PGs Available in {selectedCity}
            </h2>

            {/* Filters */}
            <div className="row mb-4">
              {/* University Filter */}
              <div className="col-md-4">
                <button
                  className="btn btn-outline-primary w-100 mb-2"
                  onClick={() => setShowUniversityFilter(!showUniversityFilter)}
                >
                  Filter by University
                </button>
                {showUniversityFilter && (
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter university"
                    onChange={(e) => setUniversityFilter(e.target.value)}
                  />
                )}
              </div>

              {/* Locality Filter */}
              <div className="col-md-4">
                <button
                  className="btn btn-outline-primary w-100 mb-2"
                  onClick={() => setShowLocalityFilter(!showLocalityFilter)}
                >
                  Filter by Locality
                </button>
                {showLocalityFilter && (
                  <select
                    className="form-control"
                    onChange={(e) => setLocalityFilter(e.target.value)}
                  >
                    <option value="">Select Locality</option>
                    <option value="RS Puram">RS Puram</option>
                    <option value="Saibaba Colony">Saibaba Colony</option>
                    <option value="Gandhipuram">Gandhipuram</option>
                    <option value="Peelamedu">Peelamedu</option>
                    <option value="Race Course">Race Course</option>
                  </select>
                )}
              </div>

              {/* Budget Filter */}
              <div className="col-md-4">
                <button
                  className="btn btn-outline-primary w-100 mb-2"
                  onClick={() => setShowBudgetFilter(!showBudgetFilter)}
                >
                  Filter by Budget
                </button>
                {showBudgetFilter && (
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Enter budget"
                    onChange={(e) => setBudgetFilter(e.target.value)}
                  />
                )}
              </div>

              {/* Move-in Month Filter */}
              <div className="col-md-4">
                <button
                  className="btn btn-outline-primary w-100 mb-2"
                  onClick={() =>
                    setShowMoveInMonthFilter(!showMoveInMonthFilter)
                  }
                >
                  Filter by Move-in Month
                </button>
                {showMoveInMonthFilter && (
                  <select
                    className="form-control"
                    onChange={(e) => setMoveInMonthFilter(e.target.value)}
                  >
                    <option value="">Select</option>
                    <option value="January">January</option>
                    <option value="February">February</option>
                    <option value="March">March</option>
                    <option value="April">April</option>
                    <option value="May">May</option>
                    <option value="June">June</option>
                    <option value="July">July</option>
                    <option value="August">August</option>
                    <option value="September">September</option>
                    <option value="October">October</option>
                    <option value="November">November</option>
                    <option value="December">December</option>
                  </select>
                )}
              </div>

              {/* Stay Duration Filter */}
              <div className="col-md-4">
                <button
                  className="btn btn-outline-primary w-100 mb-2"
                  onClick={() => setShowDurationFilter(!showDurationFilter)}
                >
                  Filter by Stay Duration
                </button>
                {showDurationFilter && (
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Enter duration"
                    onChange={(e) => setDurationFilter(e.target.value)}
                  />
                )}
              </div>

              {/* Room Type Filter */}
              <div className="col-md-4">
                <button
                  className="btn btn-outline-primary w-100 mb-2"
                  onClick={() => setShowRoomTypeFilter(!showRoomTypeFilter)}
                >
                  Filter by Room Type
                </button>
                {showRoomTypeFilter && (
                  <select
                    className="form-control"
                    onChange={(e) => setRoomTypeFilter(e.target.value)}
                  >
                    <option value="">Select</option>
                    <option value="Single">Single</option>
                    <option value="Double Sharing">Double Sharing</option>
                    <option value="Triple Sharing">Triple Sharing</option>
                  </select>
                )}
              </div>
            </div>

            {/* Search Bar */}
            <div className="mb-4">
              <input
                type="text"
                className="form-control"
                placeholder="Search PGs..."
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filtered PG Listings */}
            <div className="row">
              {filteredPGs.slice(0, pgLimit).map((pg) => (
                <div key={pg.id} className="col-md-6 mb-3">
                  <div className="card">
                    <div className="card-body">
                      <h5 className="card-title">{pg.name}</h5>
                      <img src={pg.img} alt="" srcset="" />
                      <p>{pg.rent}</p>
                      <button
                        className="btn btn-primary"
                        onClick={() => handlePGSelect(pg)}
                      >
                        Enquire Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* See More Button */}
            {pgLimit < filteredPGs.length && (
              <div className="text-center mt-4">
                <button className="btn btn-secondary" onClick={handleSeeMore}>
                  See More
                </button>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Enquiry Form */}
        {step === 3 && (
          <div>
            <h2 className="text-center mb-4">Enquire Now</h2>

            {/* Selected PG Details */}
            <div className="card mb-4">
              <div className="row g-0">
                <div className="col-md-4">
                  {/* PG Image */}
                  <img
                    src={pg} // Replace with actual PG image URL if available
                    className="img-fluid rounded-start"
                    alt={selectedPG.name}
                  />
                </div>
                <div className="col-md-8">
                  <div className="card-body">
                    <h5 className="card-title">{selectedPG.name}</h5>
                    <p className="card-text">
                      <b>Rent:</b> {selectedPG.rent}
                    </p>
                    <p className="card-text">
                      <b>City:</b> {selectedCity}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Enquiry Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault(); // Prevent default form submission
                if (!formData.fullName || !formData.email || !formData.mobile) {
                  alert("Please fill in all required fields.");
                  return;
                }
                handleEnquirySubmit();
              }}
            >
              <div className="mb-3">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className={`form-control ${
                    !formData.fullName && "is-invalid" // Add 'is-invalid' class for validation
                  }`}
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                />
                {!formData.fullName && (
                  <div className="invalid-feedback">Full Name is required.</div>
                )}
              </div>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className={`form-control ${!formData.email && "is-invalid"}`}
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
                {!formData.email && (
                  <div className="invalid-feedback">Email is required.</div>
                )}
              </div>
              <div className="mb-3">
                <label className="form-label">Mobile Number</label>
                <input
                  type="text"
                  className={`form-control ${!formData.mobile && "is-invalid"}`}
                  placeholder="Enter your mobile number"
                  value={formData.mobile}
                  onChange={(e) =>
                    setFormData({ ...formData, mobile: e.target.value })
                  }
                />
                {!formData.mobile && (
                  <div className="invalid-feedback">
                    Mobile Number is required.
                  </div>
                )}
              </div>
              <div className="d-flex justify-content-center mt-4">
                <button className="continue-btn rounded-5" type="submit">
                  Book Now
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
        )}

        {/* Step 4: Booking Form */}
        {step === 4 && (
          <div>
            <h2 className="text-center mb-4">Booking Form</h2>

            {/* Accommodation Details */}
            <div className="mb-3">
              <label>Room Type</label>
              <select
                className="form-control"
                value={formData.roomType}
                onChange={(e) =>
                  setFormData({ ...formData, roomType: e.target.value })
                }
              >
                <option value="">Select Room Type</option>
                <option value="Single">Single</option>
                <option value="Double Sharing">Double Sharing</option>
              </select>
              {errors.roomType && (
                <small className="text-danger">{errors.roomType}</small>
              )}
            </div>

            <div className="mb-3">
              <label>Stay Duration</label>
              <select
                className="form-control"
                value={formData.stayDuration}
                onChange={(e) =>
                  setFormData({ ...formData, stayDuration: e.target.value })
                }
              >
                <option value="">Select Duration</option>
                <option value="1 week">1 week</option>
                <option value="2 weeks">2 weeks</option>
                <option value="1 month">1 month</option>
                <option value="2 months">2 months</option>
              </select>
              {errors.stayDuration && (
                <small className="text-danger">{errors.stayDuration}</small>
              )}
            </div>

            <div className="mb-3">
              <label>Move In Date</label>
              <select
                className="form-control"
                value={formData.moveInDate}
                onChange={(e) =>
                  setFormData({ ...formData, moveInDate: e.target.value })
                }
              >
                <option value="">Select Move In Date</option>
                <option value="01-01-2024">01-01-2024</option>
                <option value="01-02-2024">01-02-2024</option>
                <option value="01-03-2024">01-03-2024</option>
              </select>
              {errors.moveInDate && (
                <small className="text-danger">{errors.moveInDate}</small>
              )}
            </div>

            <div className="mb-3">
              <label>Move Out Date</label>
              <select
                className="form-control"
                value={formData.moveOutDate}
                onChange={(e) =>
                  setFormData({ ...formData, moveOutDate: e.target.value })
                }
              >
                <option value="">Select Move Out Date</option>
                <option value="01-02-2024">01-02-2024</option>
                <option value="01-03-2024">01-03-2024</option>
              </select>
              {errors.moveOutDate && (
                <small className="text-danger">{errors.moveOutDate}</small>
              )}
            </div>

            {/* Personal Details */}
            <div className="mb-3">
              <label>Full Name</label>
              <input
                type="text"
                className="form-control"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
              />
              {errors.fullName && (
                <small className="text-danger">{errors.fullName}</small>
              )}
            </div>

            <div className="mb-3">
              <label>Email Id</label>
              <input
                type="email"
                className="form-control"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
              {errors.email && (
                <small className="text-danger">{errors.email}</small>
              )}
            </div>

            <div className="mb-3">
              <label>City</label>
              <input
                type="text"
                className="form-control"
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
              />
              {errors.city && (
                <small className="text-danger">{errors.city}</small>
              )}
            </div>

            <div className="mb-3">
              <label>Gender</label>
              <select
                className="form-control"
                value={formData.gender}
                onChange={(e) =>
                  setFormData({ ...formData, gender: e.target.value })
                }
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              {errors.gender && (
                <small className="text-danger">{errors.gender}</small>
              )}
            </div>

            <div className="mb-3">
              <label>Mobile No</label>
              <input
                type="text"
                className="form-control"
                value={formData.mobileNo}
                onChange={(e) =>
                  setFormData({ ...formData, mobileNo: e.target.value })
                }
              />
              {errors.mobileNo && (
                <small className="text-danger">{errors.mobileNo}</small>
              )}
            </div>

            <div className="mb-3">
              <label>Country</label>
              <input
                type="text"
                className="form-control"
                value={formData.country}
                onChange={(e) =>
                  setFormData({ ...formData, country: e.target.value })
                }
              />
              {errors.country && (
                <small className="text-danger">{errors.country}</small>
              )}
            </div>

            <div className="mb-3">
              <label>State</label>
              <input
                type="text"
                className="form-control"
                value={formData.state}
                onChange={(e) =>
                  setFormData({ ...formData, state: e.target.value })
                }
              />
              {errors.state && (
                <small className="text-danger">{errors.state}</small>
              )}
            </div>

            <div className="mb-3">
              <label>Address</label>
              <input
                type="text"
                className="form-control"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
              />
              {errors.address && (
                <small className="text-danger">{errors.address}</small>
              )}
            </div>

            {/* University Details */}
            <div className="mb-3">
              <label>University Name / College Name</label>
              <input
                type="text"
                className="form-control"
                value={formData.universityName}
                onChange={(e) =>
                  setFormData({ ...formData, universityName: e.target.value })
                }
              />
              {errors.universityName && (
                <small className="text-danger">{errors.universityName}</small>
              )}
            </div>

            <div className="mb-3">
              <label>Course Name</label>
              <input
                type="text"
                className="form-control"
                value={formData.courseName}
                onChange={(e) =>
                  setFormData({ ...formData, courseName: e.target.value })
                }
              />
              {errors.courseName && (
                <small className="text-danger">{errors.courseName}</small>
              )}
            </div>

            <div className="mb-3">
              <label>Enrolment Status</label>
              <select
                className="form-control"
                value={formData.enrolmentStatus}
                onChange={(e) =>
                  setFormData({ ...formData, enrolmentStatus: e.target.value })
                }
              >
                <option value="">Select Enrolment Status</option>
                <option value="Enrolled">Enrolled</option>
                <option value="Not Enrolled">Not Enrolled</option>
              </select>
              {errors.enrolmentStatus && (
                <small className="text-danger">{errors.enrolmentStatus}</small>
              )}
            </div>

            <div className="d-flex justify-content-center mt-4">
              <button className="continue-btn rounded-5">
                Pay Now
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
      <Footer />
    </>
  );
};

export default AccommodationApp;
