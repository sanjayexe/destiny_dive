import React from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./Navbar";
import Footer from "./Footer";
import sc1 from "./images/scholarship1.png";
import sc2 from "./images/scholarship2.png";

const Scholarship = () => {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <div className="container text-center py-5">
        <h1>Scholarship</h1>
        <p>
          Scholarships are not just for the smartest, but for those who have the
          drive to succeed.
        </p>
        <div className="row">
          <div className="col-md-6 d-flex justify-content-center align-items-center mb-3">
            <img
              src={sc1}
              alt="Red Fort"
              className="img-fluid rounded"
              style={{ maxWidth: "550px", height: "500px" }}
            />
          </div>
          <div className="col-md-6 d-flex justify-content-center align-items-center mb-3">
            <img
              src={sc2}
              alt="Students"
              className="img-fluid rounded"
              style={{ maxWidth: "550px", height: "500px" }}
            />
          </div>
        </div>
        <div className="d-flex justify-content-center">
          <button
            className="btn btn-primary mt-4"
            onClick={() => navigate("/scForm")}
          >
            Visit
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Scholarship;
