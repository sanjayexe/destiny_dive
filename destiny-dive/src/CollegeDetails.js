import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import Footer from "./Footer";
import Navbar from "./Navbar";
import { MdKeyboardArrowRight } from "react-icons/md";

const CollegeDetails = () => {
  const location = useLocation();
  const [college, setCollege] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const collegeName = location.state?.college;
  const collegeType = location.state?.type;

  useEffect(() => {
    console.log("College Name:", collegeName);
    console.log("College Type:", collegeType);

    if (collegeName) {
      setLoading(true);
      setError(null);

      axios
        .get(
          `http://localhost:4503/collegeinfos?name=${encodeURIComponent(
            collegeName
          )}`
        )
        .then((response) => {
          console.log("API Response:", response.data);
          if (response.data.length > 0) {
            setCollege(response.data[0]);
            console.log("Selected College:", response.data[0]);
          } else {
            // Try a broader search without the query parameter
            return axios.get(`http://localhost:4503/collegeinfos`);
          }
        })
        .then((response) => {
          if (response && response.data) {
            console.log("Fallback API Response:", response.data);
            // Find the college by name in the full list
            const foundCollege = response.data.find(
              (col) =>
                col.name.toLowerCase().includes(collegeName.toLowerCase()) ||
                collegeName.toLowerCase().includes(col.name.toLowerCase())
            );

            if (foundCollege) {
              setCollege(foundCollege);
              console.log("Found College (fallback):", foundCollege);
            } else {
              setError(`No college found with name: ${collegeName}`);
            }
          }
        })
        .catch((error) => {
          console.error("Error fetching college details:", error);
          setError("Failed to fetch college details");
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setError("No college name provided");
      setLoading(false);
    }
  }, [collegeName]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container mt-5 text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading college details...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="container mt-5 text-center">
          <div className="alert alert-danger" role="alert">
            <h4 className="alert-heading">Error!</h4>
            <p>{error}</p>
            <hr />
            <button className="btn btn-primary" onClick={() => navigate(-1)}>
              Go Back
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!college) {
    return (
      <>
        <Navbar />
        <div className="container mt-5 text-center">
          <div className="alert alert-warning" role="alert">
            <h4 className="alert-heading">No College Found</h4>
            <p>Could not find details for the selected college.</p>
            <hr />
            <button className="btn btn-primary" onClick={() => navigate(-1)}>
              Go Back
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }
  const handleNavigate = () => {
    navigate("/appform", { state: { collegeName, collegeType } });
  };
  return (
    <>
      <Navbar />
      <div className="mt-4 container">
        {/* College Name */}
        <div
          className="my-4"
          style={{
            width: "fit-content",
          }}
        >
          <h4 className=" text-dark  fw-semibold">{college.name}</h4>
          <img src="" alt="" srcset="" />
          <div
            className="mx-auto"
            style={{
              width: "35%",
              height: "2px",
              backgroundColor: "blue",
            }}
          ></div>
        </div>
        {/* Image and About Section */}
        <div className="row my-5 ">
          {/* College Image */}
          <div className="col-md-6">
            <img
              src={college.image}
              alt={college.name}
              className="img-fluid rounded"
              style={{
                maxHeight: "250px",
                objectFit: "cover",
                width: "100%",
              }}
            />
          </div>

          {/* About College */}
          <div className="col-md-6 ms-auto my-3">
            <div
              className="mx-auto mb-3"
              style={{
                width: "fit-content",
              }}
            >
              {" "}
              <h4 className="text-dark fw-semibold">About College</h4>
              <div
                className="mx-auto"
                style={{
                  width: "35%",
                  height: "2px",
                  backgroundColor: "blue",
                }}
              ></div>
            </div>

            <p className="mt-3 fs-5">{college.about}</p>
          </div>
        </div>
        {/* Courses and Fees Section */}
        <div className="my-4">
          <div
            className="my-4"
            style={{
              width: "fit-content",
            }}
          >
            <h4 className=" text-dark  fw-semibold">
              About Courses and Fees Structure
            </h4>
            <div
              className="mx-auto"
              style={{
                width: "35%",
                height: "2px",
                backgroundColor: "blue",
              }}
            ></div>
          </div>
          <table className="table table-striped table-bordered table-hover">
            <thead>
              <tr>
                <th>Category</th>
                <th>Popular Courses</th>
                <th>Government Universities (INR)</th>
              </tr>
            </thead>
            <tbody>
              {college.courses.map((course, index) => (
                <tr key={index}>
                  <td>{course.category}</td>
                  <td>{course.popularCourses}</td>
                  <td>{course.fees}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Apply Now Button */}
          <div className="text-center my-4">
            <button
              className="btn btn-primary mx-auto px-3 py-2 rounded-5 fs-6 text-dark fw-semibold"
              onClick={handleNavigate}
            >
              Apply Now <MdKeyboardArrowRight />
            </button>
          </div>
        </div>{" "}
      </div>

      <Footer />
    </>
  );
};

export default CollegeDetails;
