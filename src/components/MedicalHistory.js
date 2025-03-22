import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "../assets/Dashboard.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaUser, FaCar, FaPhone, FaNotesMedical, FaLock, FaSignOutAlt } from "react-icons/fa";

function MedicalHistory() {
  const [username, setUsername] = useState("");
  const [formData, setFormData] = useState({
    medicalHistory: {
      ownerBloodGroup: "",
      knownAllergies: "",
      chronicMedicalConditions: "",
      medications: "",
      emergencyMedicalInstructions: "",
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
      medicalHistory: {
        ownerBloodGroup: storedUserDetails.medicalHistory?.ownerBloodGroup || "",
        knownAllergies: storedUserDetails.medicalHistory?.knownAllergies || "",
        chronicMedicalConditions: storedUserDetails.medicalHistory?.chronicMedicalConditions || "",
        medications: storedUserDetails.medicalHistory?.medications || "",
        emergencyMedicalInstructions: storedUserDetails.medicalHistory?.emergencyMedicalInstructions || "",
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
    const [section, field] = name.split(".");

    if (section === "medicalHistory") {
      setFormData({
        ...formData,
        medicalHistory: {
          ...formData.medicalHistory,
          [field]: value,
        },
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const dataToSend = {
      medicalHistory: formData.medicalHistory,
    };

    try {
      const response = await axios.put(
        `https://qr-code-based-emergency-information.onrender.com/api/users/medical-history`,
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
        medicalHistory: {
          ...formData.medicalHistory,
          ...userDetails.medicalHistory,
        },
      });

      toast.success("Medical history updated successfully!");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to update medical history."
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
          Medical History
        </h1>
        <form className="personal-details-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <select
              id="ownerBloodGroup"
              name="medicalHistory.ownerBloodGroup"
              value={formData.medicalHistory.ownerBloodGroup}
              onChange={handleChange}
            >
              <option value="">Select Blood Group</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
            <label htmlFor="ownerBloodGroup">Owner’s Blood Group</label>
          </div>
          <div className="form-group">
            <input
              type="text"
              id="knownAllergies"
              name="medicalHistory.knownAllergies"
              value={formData.medicalHistory.knownAllergies}
              onChange={handleChange}
              placeholder=" "
            />
            <label htmlFor="knownAllergies">Known Allergies</label>
          </div>
          <div className="form-group">
            <input
              type="text"
              id="chronicMedicalConditions"
              name="medicalHistory.chronicMedicalConditions"
              value={formData.medicalHistory.chronicMedicalConditions}
              onChange={handleChange}
              placeholder=" "
            />
            <label htmlFor="chronicMedicalConditions">Chronic Medical Conditions</label>
          </div>
          <div className="form-group">
            <input
              type="text"
              id="medications"
              name="medicalHistory.medications"
              value={formData.medicalHistory.medications}
              onChange={handleChange}
              placeholder=" "
            />
            <label htmlFor="medications">Medications</label>
          </div>
          <div className="form-group">
            <input
              type="text"
              id="emergencyMedicalInstructions"
              name="medicalHistory.emergencyMedicalInstructions"
              value={formData.medicalHistory.emergencyMedicalInstructions}
              onChange={handleChange}
              placeholder=" "
            />
            <label htmlFor="emergencyMedicalInstructions">Emergency Medical Instructions</label>
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

export default MedicalHistory;