import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  BrowserRouter,
  Outlet,
} from "react-router-dom";

import { UserProvider } from "./UserContext";
import SignupPage from "./SignupPage";
import LoginPage from "./LoginPage";
import Landing from "./Landing";
import Universities from "./Universities";
import CollegeList from "./CollegeList";
import CollegeDetails from "./CollegeDetails";
import CollegeApplicationForm from "./CollegeApplicationForm";
import ProfilePage from "./ProfilePage";
import AdminDashboard from "./AdminDashboard";
import AccommodationApp from "./AccommodationApp";
import Scholarship from "./Scholarship";
import ScholarShipForm from "./ScholarShipForm";
import ScholarshipDetails from "./ScholarshipDetails";
import Notification from "./Notification";
import About from "./About";
import { GoogleOAuthProvider } from "@react-oauth/google";
const App = () => {
  return (
    <BrowserRouter>
      <GoogleOAuthProvider clientId="704307002600-id0deoh3o9o6p42sip3s487rffk9sm7a.apps.googleusercontent.com">
        <UserProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/landing" element={<Landing />} />
            <Route path="/university" element={<Universities />} />
            <Route path="/colleges" element={<CollegeList />} />
            <Route path="/collegeInfo" element={<CollegeDetails />} />
            <Route path="/appform" element={<CollegeApplicationForm />} />
            <Route path="/ProfilePage" element={<ProfilePage />} />
            <Route path="/adminDashboard" element={<AdminDashboard />} />
            <Route path="/accommodation" element={<AccommodationApp />} />
            <Route path="/scholarship" element={<Scholarship />} />
            <Route path="/scForm" element={<ScholarShipForm />} />
            <Route path="/scdetails" element={<ScholarshipDetails />} />
            <Route path="/notifications" element={<Notification />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </UserProvider>
        <Outlet />
      </GoogleOAuthProvider>
    </BrowserRouter>
  );
};

export default App;
