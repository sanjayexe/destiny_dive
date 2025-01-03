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
const App = () => {
  return (
    <BrowserRouter>
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
        </Routes>
      </UserProvider>
      <Outlet />
    </BrowserRouter>
  );
};

export default App;
