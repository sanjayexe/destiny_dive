import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "./landing.css";
//images
import landing from "./images/landing.jpeg"; //bg image
//services
import indian from "./images/service1.jpeg";
import abroad from "./images/service2.jpeg";
import accomadation from "./images/service3.jpeg";
import scholarships from "./images/service4.png";
//icons
import t1 from "./images/t1.png";
import t2 from "./images/t2.png";
import t3 from "./images/t3.png";
//country images
import usa from "./images/c1.png";
import china from "./images/c2.png";
import aus from "./images/c3.png";
import uk from "./images/c4.png";
import japan from "./images/c5.png";
//university images
import Princeton from "./images/uni1.png";
import Massachusetts from "./images/uni2.png";
import Stanford from "./images/uni3.png";
import Yale from "./images/uni4.png";

const Landing = () => {
  const navigate = useNavigate();

  const services = [
    { title: "Indian Universities", image: indian },
    { title: "Abroad Institutions", image: abroad },
    { title: "Accommodations", image: accomadation },
    { title: "Scholarships", image: scholarships },
  ];
  const handleNavigation = (title) => {
    if (title == "Indian Universities") {
      navigate("/university", { state: { type: "Indian" } });
    }
    if (title == "Abroad Institutions") {
      navigate("/university", { state: { type: "Abroad" } });
    }
    if (title == "Accommodations") {
      navigate("/accommodation");
    }
    if (title == "Scholarships") {
      navigate("/scholarship");
    }
  };
  const headerItems = [
    {
      icon: t1,
      text: "The most Trusted\nGuidance website ever Created",
    },
    {
      icon: t2,
      text: "Well defined Details\nabout Scholarships",
    },
    {
      icon: t3,
      text: "Colleges and nearby\nAccommodations",
    },
  ];

  const countryFlags = [
    { src: usa, alt: "USA" },
    { src: china, alt: "China" },
    { src: aus, alt: "Australia" },
    { src: uk, alt: "UK" },
    { src: japan, alt: "Japan" },
  ];
  const universities = [
    {
      name: "Princeton University",
      location: "New Jersey",
      image: Princeton,
    },
    {
      name: "Massachusetts Institute of Technology",
      location: "Massachusetts",
      image: Massachusetts,
    },
    {
      name: "Stanford University",
      location: "California",
      image: Stanford,
    },
    {
      name: "Yale University",
      location: "Connecticut",
      image: Yale,
    },
  ];

  return (
    <>
      <Navbar />
      {/* Hero Section */}
      <div
        className="container hero-section text-center text-white d-flex flex-column justify-content-center align-items-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/images/hero-bg.jpg') ,url(${landing})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "100vh",
        }}
      >
        <div className="p-5 rounded">
          <h1 className="display-4 fw-bold">
            Find Your <span className="bg-warning">Future</span> Today!
          </h1>
          <p className="">The Ultimate Guide to Universities Worldwide</p>
        </div>
      </div>
      <div
        className="text-center p-5 m-5 text-muted d-flex justify-content-center align-items-center"
        // style={{ height: "100vh" }}
      >
        <div className="content-box " style={{ maxWidth: "800px" }}>
          <p className="fs-6 fw-medium">
            Explore your options and make informed decisions with our
            comprehensive guide to universities around the world. Discover
            top-ranked institutions, explore diverse programs, and connect with
            like-minded individuals to build your academic future. With
            easy-to-use search tools, in-depth profiles, and trusted ratings and
            reviews, we provide everything you need to make the right choice for
            your academic journey. Start your search today and find your perfect
            fit!
          </p>
        </div>
      </div>
      {/* Services Section */}
      <div className="services-section container  text-center py-3">
        <h2 className="mb-4 fw-bold">Service Tailored For You</h2>
        <div className="container">
          <div className="row">
            {services.map((service, index) => (
              <div
                key={index}
                className={`col-md-4 col-sm-6 mb-4 mx-auto`}
                onClick={() => handleNavigation(service.title)}
              >
                <div
                  className="service-card position-relative overflow-hidden"
                  style={{
                    position: "relative",
                  }}
                >
                  <div
                    className="service-image-wrapper position-relative"
                    style={{
                      height: index === 1 ? "550px" : "500px", // 2nd image a bit taller
                      overflow: "hidden",
                      transition: "height 0.3s ease-in-out", // Smooth transition for height on hover
                    }}
                  >
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-100 h-100 image-transition"
                      style={{
                        objectFit: "cover",
                        position: "relative",
                        transition: "transform 0.3s ease-in-out", // Smooth zoom effect
                      }}
                    />
                    <div
                      className="service-text position-absolute pt-5 pl-4 top-0 justify-content-center w-100 h-100 d-flex "
                      style={{
                        backgroundColor: "rgba(0, 0, 0, 0.3)",
                        color: "white",
                        fontWeight: "bold",
                        fontSize: "2rem",
                      }}
                    >
                      {service.title}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Header Section */}
      <div className="header-container text-center container p-5 my-5">
        <div className="d-flex justify-content-evenly align-items-center flex-wrap">
          {headerItems.map((item, index) => (
            <div
              key={index}
              className="d-flex align-items-center
             mb-3 mb-md-0"
            >
              <img
                src={item.icon}
                alt="Header Icon"
                className="header-icon"
                style={{
                  width: "6vw",
                  height: "auto",
                  marginRight: "30px",
                }}
              />
              <p className="mb-0 fs-6 fw-medium" style={{}}>
                {item.text}
              </p>{" "}
              {/* Removes bottom margin of text */}
            </div>
          ))}
        </div>
      </div>

      {/* Top Universities Section */}
      <div className="universities-section p-5">
        <div
          className="container p-4"
          style={{
            background:
              "linear-gradient(180deg, rgba(135, 243, 255, 0.4) 0%, rgba(190, 219, 223, 0.4) 20.6%, rgba(190, 219, 223, 0.4) 55.13%, rgba(0, 162, 180, 0.4) 100%)",
            borderRadius: "3%",
          }}
        >
          <h2 className="mb-4 fw-bold text-center">
            Top Universities in <span style={{ color: "blue" }}>Abroad</span>
          </h2>

          {/* Country Flags */}
          <div className="d-flex justify-content-center mx-0 flex-wrap my-3 gap-5">
            {countryFlags.map((flag, index) => (
              <div
                className="d-flex flex-column justify-content-center align-items-center text-center"
                key={index}
                style={{
                  minWidth: "100px", // Ensures a minimum size for smaller screens
                }}
              >
                <img
                  src={flag.src}
                  alt={flag.alt}
                  className="country-flag mb-2"
                  style={{
                    width: "70px",
                    height: "70px",
                    objectFit: "cover",
                    borderRadius: "50%",
                    border: "2px solid #ccc",
                  }}
                />
                <p className="fs-5 fw-medium m-0">{flag.alt}</p>
              </div>
            ))}
          </div>

          {/* Universities List */}
          <div className="row mt-4">
            {universities.map((university, index) => (
              <div
                className="col-12 col-md-6 col-lg-4 mb-4 d-flex justify-content-center"
                key={index}
              >
                <div
                  className="university-card p-3 d-flex align-items-center w-100"
                  style={{
                    maxWidth: "400px",
                    backgroundColor: "white",
                    borderRadius: "5px",
                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  {/* University Logo */}
                  <img
                    src={university.image}
                    alt={`${university.name} Logo`}
                    style={{
                      width: "50px",
                      height: "50px",
                      marginRight: "15px",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                  {/* University Details */}
                  <div>
                    <p className="fw-bold mb-1">{university.name}</p>
                    <p className="text-muted mb-0">{university.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Landing;
