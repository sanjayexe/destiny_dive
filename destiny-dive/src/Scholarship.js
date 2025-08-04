import React from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./Navbar";
import Footer from "./Footer";
import sc1 from "./images/scholarship1.png";
import sc2 from "./images/scholarship2.png";
import "./scholarship.css";

const Scholarship = () => {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <div className="scholarship-hero py-4">
        <div className="container">
          <div className="row align-items-center min-vh-100">
            <div className="col-lg-6">
              <div className="hero-content">
                <h1 className="hero-title">
                  Unlock Your{" "}
                  <span className="text-dark">Educational Dreams</span>
                </h1>
                <p className="hero-subtitle">
                  Discover and apply for scholarships that can make your
                  educational dreams a reality. We believe that every student
                  deserves access to quality education, regardless of their
                  background.
                </p>
                <div className="hero-stats">
                  <div className="stat-item">
                    <h3 className="stat-number">500+</h3>
                    <p className="stat-label">Scholarships</p>
                  </div>
                  <div className="stat-item">
                    <h3 className="stat-number">₹50Cr+</h3>
                    <p className="stat-label">Awarded</p>
                  </div>
                  <div className="stat-item">
                    <h3 className="stat-number">10K+</h3>
                    <p className="stat-label">Students Helped</p>
                  </div>
                </div>
                <button
                  className="btn btn-primary btn-lg explore-btn"
                  onClick={() => navigate("/scdetails")}
                >
                  <i className="fas fa-search me-2"></i>
                  Explore Scholarships
                </button>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="hero-images">
                <div className="image-container">
                  <img
                    src={sc1}
                    alt="Scholarship Opportunities"
                    className="hero-image main-image"
                  />
                </div>
                <div className="image-container mt-4">
                  <img
                    src={sc2}
                    alt="Students Success"
                    className="hero-image secondary-image"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="features-section py-5">
        <div className="container">
          <div className="row text-center mb-5">
            <div className="col-12">
              <h2 className="section-title">
                Why Choose Our Scholarship Platform?
              </h2>
              <p className="section-subtitle">
                We make the scholarship application process simple, transparent,
                and accessible
              </p>
            </div>
          </div>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="fas fa-search"></i>
                </div>
                <h4>Easy Discovery</h4>
                <p>
                  Find scholarships that match your profile with our intelligent
                  matching system
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="fas fa-clock"></i>
                </div>
                <h4>Quick Application</h4>
                <p>
                  Apply to multiple scholarships with a single form and save
                  time
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="fas fa-shield-alt"></i>
                </div>
                <h4>Secure & Reliable</h4>
                <p>
                  Your data is protected with industry-standard security
                  measures
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 text-center">
              <h2 className="cta-title">
                Ready to Start Your Scholarship Journey?
              </h2>
              <p className="cta-subtitle">
                Join thousands of students who have already discovered their
                path to success
              </p>
              <button
                className="btn btn-primary btn-lg"
                onClick={() => navigate("/scdetails")}
              >
                Get Started Now
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Scholarship;
