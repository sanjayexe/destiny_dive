import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "./UserContext";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "./navbar.css";
import "./notification.css";

const Notification = () => {
  const { user } = useContext(UserContext);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log("Notification component - User data:", user);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        console.log("Fetching applications for user:", user?.email);

        // Use the backend endpoint with email filtering
        const response = await fetch(
          `http://localhost:4503/applications?email=${encodeURIComponent(
            user?.email
          )}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch applications");
        }
        const data = await response.json();

        console.log("Fetched applications:", data);
        console.log("User email:", user?.email);

        // Also filter on frontend as backup
        const userApplications = data.filter(
          (app) => app.email === user?.email
        );

        console.log("Filtered applications:", userApplications);
        setApplications(userApplications);
      } catch (err) {
        console.error("Error fetching applications:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchApplications();
    } else {
      setLoading(false);
    }
  }, [user]);

  if (!user) {
    console.log("Notification component - No user found");
    return (
      <div>
        <Navbar />
        <div className="container mt-5 text-center">
          <h2>Please login to view your applications</h2>
          <p className="text-muted">Debug: User context is null or undefined</p>
          <Link to="/login" className="btn btn-primary">
            Login
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="container mt-5">
          <div className="loading-spinner">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Navbar />
        <div className="container mt-5 text-center">
          <div className="alert alert-danger" role="alert">
            Error: {error}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="container mt-5">
        <div className="row">
          <div className="col-12">
            <h2 className="mb-4">My Applications</h2>

            {/* Debug section - remove in production */}
            <div className="mb-4 p-3 bg-light border rounded">
              <h6>Debug Information:</h6>
              <p>
                <strong>User Email:</strong> {user?.email || "Not logged in"}
              </p>
              <p>
                <strong>Applications Count:</strong> {applications.length}
              </p>
              <button
                className="btn btn-sm btn-outline-primary me-2"
                onClick={async () => {
                  try {
                    const response = await fetch(
                      "http://localhost:4503/applications"
                    );
                    const data = await response.json();
                    console.log("All applications:", data);
                    alert(`Found ${data.length} total applications`);
                  } catch (err) {
                    console.error("Error testing API:", err);
                    alert("Error testing API");
                  }
                }}
              >
                Test API (All Applications)
              </button>
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={async () => {
                  try {
                    const response = await fetch(
                      `http://localhost:4503/applications?email=${encodeURIComponent(
                        user?.email
                      )}`
                    );
                    const data = await response.json();
                    console.log("Filtered applications:", data);
                    alert(
                      `Found ${data.length} applications for ${user?.email}`
                    );
                  } catch (err) {
                    console.error("Error testing filtered API:", err);
                    alert("Error testing filtered API");
                  }
                }}
              >
                Test API (Filtered)
              </button>
              <button
                className="btn btn-sm btn-outline-success"
                onClick={async () => {
                  try {
                    const testApplication = {
                      fullName: "Test User",
                      email: user?.email,
                      collegeName: "Test College",
                      Type: "Indian",
                      submissionDate: new Date().toISOString().split("T")[0],
                      phoneNumber: "1234567890",
                    };
                    const response = await fetch(
                      "http://localhost:4503/applications",
                      {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify(testApplication),
                      }
                    );
                    const data = await response.json();
                    console.log("Test application created:", data);
                    alert("Test application created successfully!");
                    // Refresh the page to show the new application
                    window.location.reload();
                  } catch (err) {
                    console.error("Error creating test application:", err);
                    alert("Error creating test application");
                  }
                }}
              >
                Create Test Application
              </button>
            </div>

            {applications.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">
                  <i className="fas fa-file-alt"></i>
                </div>
                <h4 className="text-muted">No applications found</h4>
                <p className="text-muted">
                  You haven't applied to any colleges yet.
                </p>
                <Link to="/colleges" className="btn btn-primary">
                  Browse Colleges
                </Link>
              </div>
            ) : (
              <div className="row">
                {applications.map((application, index) => (
                  <div key={index} className="col-md-6 col-lg-4 mb-4">
                    <div className="card h-100 shadow-sm application-card">
                      <div className="card-body">
                        <h5 className="card-title text-primary">
                          {application.collegeName || "College Application"}
                        </h5>
                        <p className="card-text">
                          <strong>Type:</strong> {application.Type || "N/A"}
                        </p>
                        <p className="card-text">
                          <strong>Full Name:</strong> {application.fullName}
                        </p>
                        <p className="card-text">
                          <strong>Email:</strong> {application.email}
                        </p>
                        <p className="card-text">
                          <strong>Phone:</strong> {application.phoneNumber}
                        </p>
                        {application.submissionDate && (
                          <p className="card-text">
                            <strong>Submitted:</strong>{" "}
                            {application.submissionDate}
                          </p>
                        )}
                        {application.desiredMajor && (
                          <p className="card-text">
                            <strong>Desired Major:</strong>{" "}
                            {application.desiredMajor}
                          </p>
                        )}
                        <div className="mt-3">
                          <span className="badge bg-success application-status">
                            Submitted
                          </span>
                        </div>
                      </div>
                      <div className="card-footer bg-transparent">
                        <small className="text-muted">
                          Application ID:{" "}
                          <span className="application-id">
                            {application._id?.slice(-8) || "N/A"}
                          </span>
                        </small>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Notification;
