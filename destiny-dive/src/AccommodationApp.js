import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const AccommodationApp = () => {
  const [step, setStep] = useState(1); // Tracks the current step
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedPG, setSelectedPG] = useState({});
  const [searchCity, setSearchCity] = useState(""); // Search term for Step 1
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobile: "",
    roomType: "",
    stayDuration: "",
    moveInDate: "",
    university: "",
    course: "",
  });

  const [searchTerm, setSearchTerm] = useState(""); // For the search bar
  const [pgLimit, setPGLimit] = useState(2); // Number of PGs displayed initially

  const cities = [
    { name: "Coimbatore", image: "city1.jpg" },
    { name: "Bangalore", image: "city2.jpg" },
    { name: "Chennai", image: "city3.jpg" },
  ];

  const pgs = [
    { id: 1, name: "Sugam Hostel", city: "Coimbatore", rent: "Rs 6000/Month" },
    { id: 2, name: "Dream PG", city: "Coimbatore", rent: "Rs 7000/Month" },
    { id: 3, name: "Star PG", city: "Coimbatore", rent: "Rs 5000/Month" },
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

  const handleBookingSubmit = () => {
    console.log("Form Data Submitted: ", formData);
    alert("Your booking has been successfully submitted!");
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
  const filteredPGs = pgs
    .filter((pg) => pg.city === selectedCity)
    .filter((pg) => pg.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="container my-5">
      {/* Back Button */}
      {step > 1 && (
        <button
          className="btn btn-outline-secondary mb-3"
          onClick={handleBack}
          style={{ position: "absolute", top: "20px", left: "20px" }}
        >
          ← Back
        </button>
      )}

      {/* Step 1: City Selection */}
      {step === 1 && (
        <div>
          <h2 className="text-center mb-4">Select a City</h2>

          {/* Search Bar for Cities */}
          <div className="mb-4 d-flex">
            <input
              type="text"
              className="form-control"
              placeholder="Search City..."
              onChange={(e) => setSearchCity(e.target.value)}
            />
            <button className="btn btn-primary ms-2" onClick={handleSearchCity}>
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
          <h2 className="text-center mb-4">PGs Available in {selectedCity}</h2>

          {/* Search Bar */}
          <div className="mb-4">
            <input
              type="text"
              className="form-control"
              placeholder="Search PGs..."
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="row">
            {filteredPGs.slice(0, pgLimit).map((pg) => (
              <div key={pg.id} className="col-md-6 mb-3">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">{pg.name}</h5>
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
          <p>
            You selected <b>{selectedPG.name}</b> ({selectedPG.rent})
          </p>
          <div className="mb-3">
            <label>Full Name</label>
            <input
              type="text"
              className="form-control"
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
            />
          </div>
          <div className="mb-3">
            <label>Email</label>
            <input
              type="email"
              className="form-control"
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>
          <div className="mb-3">
            <label>Mobile Number</label>
            <input
              type="text"
              className="form-control"
              onChange={(e) =>
                setFormData({ ...formData, mobile: e.target.value })
              }
            />
          </div>
          <button className="btn btn-success" onClick={handleEnquirySubmit}>
            Next
          </button>
        </div>
      )}

      {/* Step 4: Booking Form */}
      {step === 4 && (
        <div>
          <h2 className="text-center mb-4">Booking Form</h2>
          <div className="mb-3">
            <label>Room Type</label>
            <select
              className="form-control"
              onChange={(e) =>
                setFormData({ ...formData, roomType: e.target.value })
              }
            >
              <option>Single</option>
              <option>Double Sharing</option>
            </select>
          </div>
          <div className="mb-3">
            <label>Stay Duration</label>
            <input
              type="text"
              className="form-control"
              onChange={(e) =>
                setFormData({ ...formData, stayDuration: e.target.value })
              }
            />
          </div>
          <div className="mb-3">
            <label>University Name</label>
            <input
              type="text"
              className="form-control"
              onChange={(e) =>
                setFormData({ ...formData, university: e.target.value })
              }
            />
          </div>
          <button className="btn btn-primary" onClick={handleBookingSubmit}>
            Pay Now
          </button>
        </div>
      )}
    </div>
  );
};

export default AccommodationApp;
