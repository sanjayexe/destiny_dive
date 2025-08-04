import React from "react";
import { About } from "./About";
import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";
import "./footer.css";
const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark text-white text-center py-4">
      <div className="container">
        {/* Divider */}
        <hr className="border-secondary mb-4" />

        {/* Social Media Icons */}
        <div className="mb-3">
          <a href="#" className="text-white mx-4" aria-label="Facebook">
            <FaFacebook size={24} />
          </a>
          <a href="#" className="text-white mx-4" aria-label="Instagram">
            <FaInstagram size={24} />
          </a>
          <a href="#" className="text-white mx-4" aria-label="Twitter">
            <FaTwitter size={24} />
          </a>
          <a href="#" className="text-white mx-4" aria-label="LinkedIn">
            <FaLinkedin size={24} />
          </a>
        </div>

        {/* Links */}
        <div className="mb-4 d-flex justify-content-center flex-wrap gap-5">
          <Link to="/about" className="text-white">
            About Us
          </Link>
          <a href="#" className="text-white">
            Contact Us
          </a>
          <a href="#" className="text-white">
            FAQs
          </a>
          <a href="#" className="text-white">
            Terms and Conditions
          </a>
          <a href="#" className="text-white">
            Cookie Policy
          </a>
          <a href="#" className="text-white">
            Privacy
          </a>
        </div>

        {/* Copyright */}
        <p className="mb-0">© {currentYear} - DESTINY DIVE</p>
      </div>
    </footer>
  );
};

export default Footer;
