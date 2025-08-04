import React from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "./navbar.css";
import "./about.css";

const About = () => {
  return (
    <div>
      <Navbar />
      <div className="container mt-5">
        <div className="row">
          <div className="col-12">
            <div className="text-center mb-5">
              <h1 className="display-4 fw-bold text-primary">About Destiny Dive</h1>
              <p className="lead text-muted">
                Your Gateway to Global Education Opportunities
              </p>
            </div>

            <div className="row mb-5">
              <div className="col-lg-8 mx-auto">
                <div className="card shadow-sm">
                  <div className="card-body p-5">
                    <h2 className="card-title text-primary mb-4">Our Mission</h2>
                    <p className="card-text fs-5">
                      Destiny Dive is dedicated to connecting ambitious students with 
                      world-class educational opportunities. We believe that every student 
                      deserves access to quality education, regardless of their background 
                      or location. Our platform serves as a comprehensive bridge between 
                      students and universities worldwide.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="row mb-5">
              <div className="col-md-6 mb-4">
                <div className="card h-100 shadow-sm">
                  <div className="card-body text-center p-4">
                    <div className="mb-3">
                      <i className="fas fa-university fa-3x text-primary"></i>
                    </div>
                    <h4 className="card-title">University Connections</h4>
                    <p className="card-text">
                      We partner with prestigious universities and colleges globally, 
                      offering students access to diverse academic programs and 
                      international learning experiences.
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-md-6 mb-4">
                <div className="card h-100 shadow-sm">
                  <div className="card-body text-center p-4">
                    <div className="mb-3">
                      <i className="fas fa-graduation-cap fa-3x text-primary"></i>
                    </div>
                    <h4 className="card-title">Scholarship Opportunities</h4>
                    <p className="card-text">
                      Discover and apply for scholarships that can make your 
                      educational dreams a reality. We provide comprehensive 
                      information about various funding opportunities.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="row mb-5">
              <div className="col-md-6 mb-4">
                <div className="card h-100 shadow-sm">
                  <div className="card-body text-center p-4">
                    <div className="mb-3">
                      <i className="fas fa-home fa-3x text-primary"></i>
                    </div>
                    <h4 className="card-title">Accommodation Support</h4>
                    <p className="card-text">
                      Find suitable accommodation options near your chosen 
                      university. We help you secure comfortable and 
                      affordable housing solutions.
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-md-6 mb-4">
                <div className="card h-100 shadow-sm">
                  <div className="card-body text-center p-4">
                    <div className="mb-3">
                      <i className="fas fa-users fa-3x text-primary"></i>
                    </div>
                    <h4 className="card-title">Personalized Guidance</h4>
                    <p className="card-text">
                      Receive personalized guidance throughout your application 
                      process. Our platform helps you make informed decisions 
                      about your educational journey.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="row mb-5">
              <div className="col-lg-8 mx-auto">
                <div className="card shadow-sm">
                  <div className="card-body p-5">
                    <h3 className="card-title text-primary mb-4">What We Offer</h3>
                    <ul className="list-unstyled">
                      <li className="mb-3">
                        <i className="fas fa-check-circle text-success me-2"></i>
                        <strong>Comprehensive University Database:</strong> Access to hundreds of universities worldwide
                      </li>
                      <li className="mb-3">
                        <i className="fas fa-check-circle text-success me-2"></i>
                        <strong>Streamlined Application Process:</strong> Easy-to-use application forms and tracking
                      </li>
                      <li className="mb-3">
                        <i className="fas fa-check-circle text-success me-2"></i>
                        <strong>Scholarship Information:</strong> Detailed information about available scholarships
                      </li>
                      <li className="mb-3">
                        <i className="fas fa-check-circle text-success me-2"></i>
                        <strong>Accommodation Services:</strong> Housing solutions for international students
                      </li>
                      <li className="mb-3">
                        <i className="fas fa-check-circle text-success me-2"></i>
                        <strong>Application Tracking:</strong> Monitor your application status in real-time
                      </li>
                      <li className="mb-3">
                        <i className="fas fa-check-circle text-success me-2"></i>
                        <strong>24/7 Support:</strong> Round-the-clock assistance for your queries
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="row mb-5">
              <div className="col-lg-8 mx-auto">
                <div className="card shadow-sm">
                  <div className="card-body p-5">
                    <h3 className="card-title text-primary mb-4">Our Values</h3>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <h5 className="text-primary">Excellence</h5>
                        <p>We strive for excellence in everything we do, ensuring the highest quality service.</p>
                      </div>
                      <div className="col-md-6 mb-3">
                        <h5 className="text-primary">Accessibility</h5>
                        <p>Making quality education accessible to students from all backgrounds.</p>
                      </div>
                      <div className="col-md-6 mb-3">
                        <h5 className="text-primary">Innovation</h5>
                        <p>Continuously innovating to provide better educational opportunities.</p>
                      </div>
                      <div className="col-md-6 mb-3">
                        <h5 className="text-primary">Integrity</h5>
                        <p>Maintaining the highest standards of integrity and transparency.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center mb-5">
              <h3 className="text-primary mb-4">Ready to Start Your Journey?</h3>
              <p className="lead mb-4">
                Join thousands of students who have already discovered their path to success through Destiny Dive.
              </p>
              <div className="d-flex justify-content-center gap-3">
                <Link to="/colleges" className="btn btn-primary btn-lg">
                  Explore Universities
                </Link>
                <Link to="/signup" className="btn btn-outline-primary btn-lg">
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default About; 