import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "../assets/Dashboard.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FaUser,
  FaCar,
  FaPhone,
  FaNotesMedical,
  FaLock,
  FaSignOutAlt,
} from "react-icons/fa";

function EmergencyDetails() {
  const [username, setUsername] = useState("");
  const [formData, setFormData] = useState({
    emergencyDetails: {
      primaryEmergencyContact: {
        name: "",
        contactNumber: "",
        relationshipWithOwner: "",
      },
      secondaryEmergencyContact: {
        name: "",
        contactNumber: "",
        relationshipWithOwner: "",
      },
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
    const storedUserDetails =
      JSON.parse(localStorage.getItem("userDetails")) || {};

    setUsername(storedUsername);
    setFormData({
      emergencyDetails: {
        primaryEmergencyContact: {
          name:
            storedUserDetails.emergencyDetails?.primaryEmergencyContact?.name ||
            "",
          contactNumber:
            storedUserDetails.emergencyDetails?.primaryEmergencyContact
              ?.contactNumber || "",
          relationshipWithOwner:
            storedUserDetails.emergencyDetails?.primaryEmergencyContact
              ?.relationshipWithOwner || "",
        },
        secondaryEmergencyContact: {
          name:
            storedUserDetails.emergencyDetails?.secondaryEmergencyContact
              ?.name || "",
          contactNumber:
            storedUserDetails.emergencyDetails?.secondaryEmergencyContact
              ?.contactNumber || "",
          relationshipWithOwner:
            storedUserDetails.emergencyDetails?.secondaryEmergencyContact
              ?.relationshipWithOwner || "",
        },
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
    const { name, value } = e.target;
    const [section, subSection, field] = name.split(".");

    if (section === "emergencyDetails") {
      setFormData({
        ...formData,
        emergencyDetails: {
          ...formData.emergencyDetails,
          [subSection]: {
            ...formData.emergencyDetails[subSection],
            [field]: value,
          },
        },
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const dataToSend = {
      primaryEmergencyContact:
        formData.emergencyDetails.primaryEmergencyContact,
      secondaryEmergencyContact:
        formData.emergencyDetails.secondaryEmergencyContact,
    };

    try {
      const response = await axios.put(
        `https://qr-code-based-emergency-information.onrender.com/api/users/emergency-details`,
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
        emergencyDetails: {
          primaryEmergencyContact: {
            ...formData.emergencyDetails.primaryEmergencyContact,
            ...userDetails.emergencyDetails.primaryEmergencyContact,
          },
          secondaryEmergencyContact: {
            ...formData.emergencyDetails.secondaryEmergencyContact,
            ...userDetails.emergencyDetails.secondaryEmergencyContact,
          },
        },
      });

      toast.success("Emergency details updated successfully!");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to update emergency details."
      );
    }
  };

  const storedUserDetails =
    JSON.parse(localStorage.getItem("userDetails")) || {};
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
              className={
                location.pathname === "/personal-details" ? "active" : ""
              }
            >
              <FaUser /> Personal Details
            </li>
            <li
              onClick={() => handleNavigation("/vehicle-details")}
              className={
                location.pathname === "/vehicle-details" ? "active" : ""
              }
            >
              <FaCar /> Vehicle Details
            </li>
            <li
              onClick={() => handleNavigation("/emergency-details")}
              className={
                location.pathname === "/emergency-details" ? "active" : ""
              }
            >
              <FaPhone /> Emergency Details
            </li>
            <li
              onClick={() => handleNavigation("/medical-history")}
              className={
                location.pathname === "/medical-history" ? "active" : ""
              }
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
              className={`logout-btn ${
                location.pathname === "/logout" ? "active" : ""
              }`}
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
          Emergency Details
        </h1>
        <form className="personal-details-form" onSubmit={handleSubmit}>
          {/* Primary Emergency Contact */}
          <h2
            style={{ fontSize: "1.2rem", color: "#2c3e50", marginTop: "20px" }}
          >
            Primary Emergency Contact
          </h2>
          <div className="form-group">
            <input
              type="text"
              id="primaryEmergencyContact-name"
              name="emergencyDetails.primaryEmergencyContact.name"
              value={formData.emergencyDetails.primaryEmergencyContact.name}
              onChange={handleChange}
              placeholder=" "
            />
            <label htmlFor="primaryEmergencyContact-name">Name</label>
          </div>
          <div className="form-group">
            <input
              type="tel"
              id="primaryEmergencyContact-contactNumber"
              name="emergencyDetails.primaryEmergencyContact.contactNumber"
              value={
                formData.emergencyDetails.primaryEmergencyContact.contactNumber
              }
              onChange={handleChange}
              placeholder=" "
            />
            <label htmlFor="primaryEmergencyContact-contactNumber">
              Contact Number
            </label>
          </div>
          <div className="form-group">
            <input
              type="text"
              id="primaryEmergencyContact-relationshipWithOwner"
              name="emergencyDetails.primaryEmergencyContact.relationshipWithOwner"
              value={
                formData.emergencyDetails.primaryEmergencyContact
                  .relationshipWithOwner
              }
              onChange={handleChange}
              placeholder=" "
            />
            <label htmlFor="primaryEmergencyContact-relationshipWithOwner">
              Relationship with Owner
            </label>
          </div>

          {/* Secondary Emergency Contact */}
          <h2
            style={{ fontSize: "1.2rem", color: "#2c3e50", marginTop: "20px" }}
          >
            Secondary Emergency Contact
          </h2>
          <div className="form-group">
            <input
              type="text"
              id="secondaryEmergencyContact-name"
              name="emergencyDetails.secondaryEmergencyContact.name"
              value={formData.emergencyDetails.secondaryEmergencyContact.name}
              onChange={handleChange}
              placeholder=" "
            />
            <label htmlFor="secondaryEmergencyContact-name">Name</label>
          </div>
          <div className="form-group">
            <input
              type="tel"
              id="secondaryEmergencyContact-contactNumber"
              name="emergencyDetails.secondaryEmergencyContact.contactNumber"
              value={
                formData.emergencyDetails.secondaryEmergencyContact
                  .contactNumber
              }
              onChange={handleChange}
              placeholder=" "
            />
            <label htmlFor="secondaryEmergencyContact-contactNumber">
              Contact Number
            </label>
          </div>
          <div className="form-group">
            <input
              type="text"
              id="secondaryEmergencyContact-relationshipWithOwner"
              name="emergencyDetails.secondaryEmergencyContact.relationshipWithOwner"
              value={
                formData.emergencyDetails.secondaryEmergencyContact
                  .relationshipWithOwner
              }
              onChange={handleChange}
              placeholder=" "
            />
            <label htmlFor="secondaryEmergencyContact-relationshipWithOwner">
              Relationship with Owner
            </label>
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

export default EmergencyDetails;
