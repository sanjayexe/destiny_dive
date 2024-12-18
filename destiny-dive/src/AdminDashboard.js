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

  // Fetch data on component mount
  useEffect(() => {
    fetchUsers();
    fetchUniversities();
    fetchApplications();
  }, []);

  // API Call for Users
  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:4502/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // API Call for Universities
  const fetchUniversities = async () => {
    try {
      const response = await axios.get("http://localhost:4502/universities");
      setUniversities(response.data);
    } catch (error) {
      console.error("Error fetching universities:", error);
    }
  };

  // API Call for Applications
  const fetchApplications = async () => {
    try {
      const response = await axios.get("http://localhost:4502/applications");
      setApplications(response.data);
    } catch (error) {
      console.error("Error fetching applications:", error);
    }
  };

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
            <img src={application} alt="Applications" />
            <h4>{applications.length} Applications</h4>
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
                  <th>DOB</th>
                  <th>Phone Number</th>
                  <th>City</th>
                  <th>Field of Interest</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.dob}</td>
                    <td>{user.phone}</td>
                    <td>{user.city}</td>
                    <td>{user.fieldOfInterest}</td>
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
            <h5 className="mb-3">Applications</h5>
            <div className="d-grid gap-2 col-md-6 mx-auto">
              <button className="btn btn-secondary">Yet to see forms</button>
              <button className="btn btn-success">Approved Forms</button>
              <button className="btn btn-warning">Pending Forms</button>
              <button className="btn btn-danger">Rejected Forms</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
