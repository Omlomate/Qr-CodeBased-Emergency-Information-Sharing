import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "../assets/Dashboard.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaUser, FaCar, FaPhone, FaNotesMedical, FaLock, FaSignOutAlt } from "react-icons/fa";

function AllowAccess() {
  const [username, setUsername] = useState("");
  const [formData, setFormData] = useState({
    allowAccess: {
      personalDetails: false,
      vehicleDetails: false,
      emergencyDetails: false,
      medicalHistory: false,
    },
  });
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }

    const storedUsername = localStorage.getItem("username") || "Guest";
    const storedUserDetails = JSON.parse(localStorage.getItem("userDetails")) || {};

    setUsername(storedUsername);
    setFormData({
      allowAccess: {
        personalDetails: storedUserDetails.allowAccess?.personalDetails || false,
        vehicleDetails: storedUserDetails.allowAccess?.vehicleDetails || false,
        emergencyDetails: storedUserDetails.allowAccess?.emergencyDetails || false,
        medicalHistory: storedUserDetails.allowAccess?.medicalHistory || false,
      },
    });
  }, [navigate]);

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.clear();
    toast.success("Logged out successfully!");
    navigate("/login");
  };

  const handleChange = (e) => {
    const { name, checked } = e.target;
    const [section, field] = name.split(".");

    if (section === "allowAccess") {
      setFormData({
        ...formData,
        allowAccess: {
          ...formData.allowAccess,
          [field]: checked,
        },
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const dataToSend = {
      allowAccess: formData.allowAccess,
    };

    try {
      const response = await axios.put(
        `https://qr-code-based-emergency-information.onrender.com/api/users/allow-access`,
        dataToSend,
        {
          headers: {
        Authorization: `Bearer ${token}`,
          },
        }
      );

      const { name, userDetails } = response.data;
      localStorage.setItem("username", name);
      localStorage.setItem("userDetails", JSON.stringify(userDetails));

      setUsername(name);
      setFormData({
        allowAccess: {
          ...formData.allowAccess,
          ...userDetails.allowAccess,
        },
      });

      toast.success("Access permissions updated successfully!");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to update access permissions."
      );
    }
  };

  const storedUserDetails = JSON.parse(localStorage.getItem("userDetails")) || {};
  const profileImageSrc = storedUserDetails.profileImage
    ? `https://qr-code-based-emergency-information.onrender.com${storedUserDetails.profileImage}`
    : "https://via.placeholder.com/100";

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <div className="profile-section">
          <img src={profileImageSrc} alt="Profile" className="profile-image" />
          <h3 className="profile-username">{username}</h3>
        </div>
        <nav className="sidebar-nav">
          <ul>
            <li
              onClick={() => handleNavigation("/dashboard")}
              className={location.pathname === "/dashboard" ? "active" : ""}
            >
              <FaUser /> Dashboard
            </li>
            <li
              onClick={() => handleNavigation("/personal-details")}
              className={location.pathname === "/personal-details" ? "active" : ""}
            >
              <FaUser /> Personal Details
            </li>
            <li
              onClick={() => handleNavigation("/vehicle-details")}
              className={location.pathname === "/vehicle-details" ? "active" : ""}
            >
              <FaCar /> Vehicle Details
            </li>
            <li
              onClick={() => handleNavigation("/emergency-details")}
              className={location.pathname === "/emergency-details" ? "active" : ""}
            >
              <FaPhone /> Emergency Details
            </li>
            <li
              onClick={() => handleNavigation("/medical-history")}
              className={location.pathname === "/medical-history" ? "active" : ""}
            >
              <FaNotesMedical /> Medical History
            </li>
            <li
              onClick={() => handleNavigation("/allow-access")}
              className={location.pathname === "/allow-access" ? "active" : ""}
            >
              <FaLock /> Allow Access
            </li>
            <li
              onClick={handleLogout}
              className={`logout-btn ${location.pathname === "/logout" ? "active" : ""}`}
            >
              <FaSignOutAlt /> Logout
            </li>
          </ul>
        </nav>
      </div>
      <div className="main-content">
        <h1
          style={{
            fontWeight: 600,
            color: "#2c3e50",
            borderBottom: "3px solid #e74c3c",
            display: "inline-block",
            paddingBottom: "5px",
          }}
        >
          Allow Access
        </h1>
        <form className="personal-details-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="personalDetails" style={{ display: "inline", marginRight: "10px" }}>
              Share Personal Details
            </label>
            <input
              type="checkbox"
              id="personalDetails"
              name="allowAccess.personalDetails"
              checked={formData.allowAccess.personalDetails}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="vehicleDetails" style={{ display: "inline", marginRight: "10px" }}>
              Share Vehicle Details
            </label>
            <input
              type="checkbox"
              id="vehicleDetails"
              name="allowAccess.vehicleDetails"
              checked={formData.allowAccess.vehicleDetails}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="emergencyDetails" style={{ display: "inline", marginRight: "10px" }}>
              Share Emergency Details
            </label>
            <input
              type="checkbox"
              id="emergencyDetails"
              name="allowAccess.emergencyDetails"
              checked={formData.allowAccess.emergencyDetails}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="medicalHistory" style={{ display: "inline", marginRight: "10px" }}>
              Share Medical History
            </label>
            <input
              type="checkbox"
              id="medicalHistory"
              name="allowAccess.medicalHistory"
              checked={formData.allowAccess.medicalHistory}
              onChange={handleChange}
            />
          </div>

          <div className="button-container">
            <button type="submit" className="submit-btn">
              Save Changes
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}

export default AllowAccess;