import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import user from "./admin_images/users.png";
import college from "./admin_images/colleges.png";
import application from "./admin_images/Applications.png";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [applications, setApplications] = useState([]);
  const [activeSection, setActiveSection] = useState("users"); // Default: show Users section
  const [collegeInfos, setCollegeInfos] = useState([]);
  const [allApplications, setAllApplications] = useState([]);

  // Fetch data on component mount
  useEffect(() => {
    fetchUsers();
    fetchUniversities();
    fetchApplications();
    fetchCollegeInfos();
    fetchAllApplications();
  }, []);

  // API Call for Users
  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        "https://destiny-dive.onrender.com/users"
      );
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // API Call for Universities
  const fetchUniversities = async () => {
    try {
      const response = await axios.get(
        "https://destiny-dive.onrender.com/colleges"
      );
      setUniversities(response.data);
    } catch (error) {
      console.error("Error fetching universities:", error);
    }
  };

  // API Call for Applications
  const fetchApplications = async () => {
    try {
      const response = await axios.get(
        "https://destiny-dive.onrender.com/scholarships"
      );
      setApplications(response.data);
    } catch (error) {
      console.error("Error fetching applications:", error);
    }
  };

  const fetchCollegeInfos = async () => {
    try {
      const response = await axios.get(
        "https://destiny-dive.onrender.com/collegeinfos"
      );
      setCollegeInfos(response.data);
    } catch (error) {
      console.error("Error fetching college infos:", error);
    }
  };

  // Fetch all application forms (not just scholarships)
  const fetchAllApplications = async () => {
    try {
      const response = await axios.get(
        "https://destiny-dive.onrender.com/applications"
      );
      setAllApplications(response.data);
    } catch (error) {
      console.error("Error fetching all applications:", error);
    }
  };

  // Divide applications by status
  const pendingApplications = applications.filter(
    (app) => app.status === "Pending"
  );
  const acceptedApplications = applications.filter(
    (app) => app.status === "Accepted"
  );
  const rejectedApplications = applications.filter(
    (app) => app.status === "Rejected"
  );

  return (
    <div className="container mt-4">
      {/* Top Section */}
      <div className="row text-center mb-4">
        <div className="col-md-4" onClick={() => setActiveSection("users")}>
          <div
            className={`p-3 border rounded ${
              activeSection === "users" ? " text-white" : ""
            }`}
            style={{ cursor: "pointer" }}
          >
            <img src={user} alt="Users" />
            <h4>{users.length} USERS</h4>
          </div>
        </div>
        <div
          className="col-md-4"
          onClick={() => setActiveSection("universities")}
        >
          <div
            className={`p-3 border rounded ${
              activeSection === "universities" ? " text-white" : ""
            }`}
            style={{ cursor: "pointer" }}
          >
            <img src={college} alt="Colleges" />
            <h4>{universities.length} Colleges</h4>
          </div>
        </div>
        <div
          className="col-md-4"
          onClick={() => setActiveSection("applications")}
        >
          <div
            className={`p-3 border rounded ${
              activeSection === "applications" ? " text-white" : ""
            }`}
            style={{ cursor: "pointer" }}
          >
            <img src={application} alt="Scholarship Forms" />
            <h4>{applications.length} Scholarship Forms</h4>
          </div>
        </div>
        <div
          className="col-md-4"
          onClick={() => setActiveSection("allApplications")}
        >
          <div
            className={`p-3 border rounded ${
              activeSection === "allApplications" ? " text-white" : ""
            }`}
            style={{ cursor: "pointer" }}
          >
            <img src={application} alt="Applications" />
            <h4>{allApplications.length} Applications</h4>
          </div>
        </div>
        <div
          className="col-md-4"
          onClick={() => setActiveSection("collegeinfos")}
        >
          <div
            className={`p-3 border rounded ${
              activeSection === "collegeinfos" ? " text-white" : ""
            }`}
            style={{ cursor: "pointer" }}
          >
            <img src={college} alt="College Info" />
            <h4>{collegeInfos.length} College Infos</h4>
          </div>
        </div>
      </div>

      {/* Dynamic Content Display */}
      <div>
        {activeSection === "users" && (
          <>
            <h5 className="mb-3">User Info</h5>
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>USER NAME</th>
                  <th>EMAIL</th>
                  <th>PHONE NUMBER</th>
                  <th>ABOUT</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.phoneNumber}</td>
                    <td>{user.about}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {activeSection === "universities" && (
          <>
            <h5 className="mb-3">Indian Colleges Info</h5>
            <div className="row">
              {universities.map((college) => (
                <div key={college.id} className="col-md-4 mb-4">
                  <div className="card">
                    <img
                      src={college.image}
                      className="card-img-top"
                      alt={college.name}
                    />
                    <div className="card-body">
                      <h5 className="card-title">{college.name}</h5>
                      <a href="#" className="btn btn-link">
                        SEE UNIVERSITY →
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {activeSection === "applications" && (
          <>
            <h5 className="mb-3">Scholarship Forms</h5>
            <div className="mb-4 d-flex justify-content-center">
              <button
                className="btn btn-warning me-2"
                onClick={() => setActiveSection("pendingApplications")}
              >
                Pending ({pendingApplications.length})
              </button>
              <button
                className="btn btn-success me-2"
                onClick={() => setActiveSection("acceptedApplications")}
              >
                Accepted ({acceptedApplications.length})
              </button>
              <button
                className="btn btn-danger"
                onClick={() => setActiveSection("rejectedApplications")}
              >
                Rejected ({rejectedApplications.length})
              </button>
            </div>
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Applicant Name</th>
                  <th>Email</th>
                  <th>Mobile</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {applications.map((app) => (
                  <tr key={app._id}>
                    <td>{app.fullName || app.userName}</td>
                    <td>{app.userEmail || app.email}</td>
                    <td>{app.mobileNumber}</td>
                    <td>{app.status}</td>

                    <td className="d-flex justify-content-center">
                      {app.status === "Pending" && (
                        <>
                          <button
                            className="btn btn-success btn-sm me-2"
                            onClick={async () => {
                              await axios.patch(
                                `https://destiny-dive.onrender.com/scholarships/${app._id}/accept`
                              );
                              fetchApplications();
                            }}
                          >
                            Accept
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={async () => {
                              await axios.patch(
                                `https://destiny-dive.onrender.com/scholarships/${app._id}/reject`
                              );
                              fetchApplications();
                            }}
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
        {activeSection === "pendingApplications" && (
          <>
            <h5 className="mb-3">Pending Scholarship Forms</h5>
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Applicant Name</th>
                  <th>Email</th>
                  <th>Mobile</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {pendingApplications.map((app) => (
                  <tr key={app._id}>
                    <td>{app.fullName || app.userName}</td>
                    <td>{app.userEmail || app.email}</td>
                    <td>{app.mobileNumber}</td>
                    <td>{app.status}</td>
                    <td>
                      <button
                        className="btn btn-success btn-sm me-2"
                        onClick={async () => {
                          await axios.patch(
                            `https://destiny-dive.onrender.com/scholarships/${app._id}/accept`
                          );
                          fetchApplications();
                        }}
                      >
                        Accept
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={async () => {
                          await axios.patch(
                            `https://destiny-dive.onrender.com/scholarships/${app._id}/reject`
                          );
                          fetchApplications();
                        }}
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
        {activeSection === "acceptedApplications" && (
          <>
            <h5 className="mb-3">Accepted Scholarship Forms</h5>
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Applicant Name</th>
                  <th>Email</th>
                  <th>Mobile</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {acceptedApplications.map((app) => (
                  <tr key={app._id}>
                    <td>{app.fullName || app.userName}</td>
                    <td>{app.userEmail || app.email}</td>
                    <td>{app.mobileNumber}</td>
                    <td>{app.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
        {activeSection === "rejectedApplications" && (
          <>
            <h5 className="mb-3">Rejected Scholarship Forms</h5>
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Applicant Name</th>
                  <th>Email</th>
                  <th>Mobile</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {rejectedApplications.map((app) => (
                  <tr key={app._id}>
                    <td>{app.fullName || app.userName}</td>
                    <td>{app.userEmail || app.email}</td>
                    <td>{app.mobileNumber}</td>
                    <td>{app.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {activeSection === "allApplications" && (
          <>
            <h5 className="mb-3">All College Applications</h5>
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Applicant Name</th>
                  <th>Email</th>
                  <th>College</th>
                  <th>Type</th>
                  <th>Submission Date</th>
                </tr>
              </thead>
              <tbody>
                {allApplications.map((app) => (
                  <tr key={app._id}>
                    <td>{app.fullName}</td>
                    <td>{app.email}</td>
                    <td>{app.collegeName}</td>
                    <td>{app.Type}</td>
                    <td>{app.submissionDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {activeSection === "collegeinfos" && (
          <>
            <h5 className="mb-3">College Info (from DB)</h5>
            <div className="row">
              {collegeInfos.map((info) => (
                <div key={info._id} className="col-md-6 mb-4">
                  <div className="card">
                    <img
                      src={info.image}
                      className="card-img-top"
                      alt={info.name}
                      style={{ maxHeight: "200px", objectFit: "cover" }}
                    />
                    <div className="card-body">
                      <h5 className="card-title">{info.name}</h5>
                      <p className="card-text">{info.about}</p>
                      <ul>
                        {info.courses &&
                          info.courses.map((course, idx) => (
                            <li key={idx}>
                              <strong>{course.category}:</strong>{" "}
                              {course.popularCourses} ({course.fees})
                            </li>
                          ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
