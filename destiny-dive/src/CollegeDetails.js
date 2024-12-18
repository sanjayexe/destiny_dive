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
  const navigate = useNavigate();
  const collegeName = location.state?.college;
  const collegeType = location.state?.type;
  useEffect(() => {
    if (collegeName) {
      axios
        .get(`http://localhost:4501/collegeInfo?name=${collegeName}`)
        .then((response) => {
          if (response.data.length > 0) {
            setCollege(response.data[0]);
          }
        })
        .catch((error) =>
          console.error("Error fetching college details:", error)
        );
    }
  }, [collegeName]);

  if (!college) {
    return <div>Loading...</div>;
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
