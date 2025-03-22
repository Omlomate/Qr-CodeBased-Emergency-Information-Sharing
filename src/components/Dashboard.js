import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "../assets/Dashboard.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaUser, FaCar, FaPhone, FaNotesMedical, FaLock, FaSignOutAlt, FaQrcode, FaExclamationTriangle } from "react-icons/fa";

function Dashboard() {
  const [username, setUsername] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [qrCode, setQrCode] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
    const storedUsername = localStorage.getItem("username") || "Guest";
    const storedUserDetails = JSON.parse(localStorage.getItem("userDetails")) || {};
    console.log("Loaded userDetails:", storedUserDetails);
    setUsername(storedUsername);
    setProfileImage(storedUserDetails.profileImage || "");
    setQrCode(storedUserDetails.qrCode || null);
  }, [navigate]);

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.clear();
    toast.success("Logged out successfully!");
    navigate("/login");
  };

  const handleGenerateQR = async () => {
    const token = localStorage.getItem("token");
    const storedUserDetails = JSON.parse(localStorage.getItem("userDetails")) || {};

    console.log("storedUserDetails:", storedUserDetails);

    const isInformationSufficient = () => {
      const user = storedUserDetails.userDetails || storedUserDetails;
      console.log("Evaluating user:", user);

      const hasPersonalDetails = Boolean(user.name) || 
                                 Boolean(user.email) || 
                                 Boolean(user.phone) || 
                                 Boolean(user.aadharCard) || 
                                 Boolean(user.address?.street) || 
                                 Boolean(user.address?.city) || 
                                 Boolean(user.address?.state) || 
                                 Boolean(user.address?.country) || 
                                 Boolean(user.address?.postalCode) || 
                                 Boolean(user.profileImage);
      console.log("hasPersonalDetails:", hasPersonalDetails);

      const hasVehicleDetails = Boolean(user.vehicleDetails?.basicVehicleDetails?.vehicleRegistrationNumber) ||
                                Boolean(user.vehicleDetails?.basicVehicleDetails?.vehicleMakeAndModel) ||
                                Boolean(user.vehicleDetails?.basicVehicleDetails?.vehicleColor) ||
                                Boolean(user.vehicleDetails?.basicVehicleDetails?.vehicleType) ||
                                Boolean(user.vehicleDetails?.basicVehicleDetails?.chassisNumber) ||
                                Boolean(user.vehicleDetails?.basicVehicleDetails?.engineNumber) ||
                                Boolean(user.vehicleDetails?.basicVehicleDetails?.fuelType) ||
                                Boolean(user.vehicleDetails?.ownerDetails?.ownerName) ||
                                Boolean(user.vehicleDetails?.ownerDetails?.ownerContactNumber) ||
                                Boolean(user.vehicleDetails?.ownerDetails?.ownerEmailId) ||
                                Boolean(user.vehicleDetails?.ownerDetails?.ownerAddress?.street) ||
                                Boolean(user.vehicleDetails?.ownerDetails?.alternativeContactNumber) ||
                                Boolean(user.vehicleDetails?.insuranceAndLegalInfo?.insuranceCompanyName) ||
                                Boolean(user.vehicleDetails?.insuranceAndLegalInfo?.insurancePolicyNumber) ||
                                Boolean(user.vehicleDetails?.insuranceAndLegalInfo?.insuranceExpiryDate) ||
                                Boolean(user.vehicleDetails?.insuranceAndLegalInfo?.pucValidity) ||
                                Boolean(user.vehicleDetails?.insuranceAndLegalInfo?.rcExpiryDate) ||
                                Boolean(user.vehicleDetails?.insuranceAndLegalInfo?.drivingLicenseNumber);
      console.log("hasVehicleDetails:", hasVehicleDetails);

      const hasEmergencyDetails = Boolean(user.emergencyDetails?.primaryEmergencyContact?.name) ||
                                  Boolean(user.emergencyDetails?.primaryEmergencyContact?.contactNumber) ||
                                  Boolean(user.emergencyDetails?.primaryEmergencyContact?.relationshipWithOwner) ||
                                  Boolean(user.emergencyDetails?.secondaryEmergencyContact?.name) ||
                                  Boolean(user.emergencyDetails?.secondaryEmergencyContact?.contactNumber) ||
                                  Boolean(user.emergencyDetails?.secondaryEmergencyContact?.relationshipWithOwner);
      console.log("hasEmergencyDetails:", hasEmergencyDetails);

      const hasMedicalHistory = Boolean(user.medicalHistory?.ownerBloodGroup) ||
                                Boolean(user.medicalHistory?.knownAllergies) ||
                                Boolean(user.medicalHistory?.chronicMedicalConditions) ||
                                Boolean(user.medicalHistory?.medications) ||
                                Boolean(user.medicalHistory?.emergencyMedicalInstructions);
      console.log("hasMedicalHistory:", hasMedicalHistory);

      const result = hasPersonalDetails && hasVehicleDetails && hasEmergencyDetails && hasMedicalHistory;
      console.log("Is sufficient?", result);
      return result;
    };

    if (storedUserDetails.qrCode && isInformationSufficient()) {
      setQrCode(storedUserDetails.qrCode);
      console.log("Using existing QR code, no generation needed.");
      return;
    }

    if (!isInformationSufficient()) {
      toast.warn("Please add at least one field in each section (personal, vehicle, emergency, and medical details) before generating a QR code.");
      return;
    }

    try {
      const response = await axios.get(`https://qr-code-based-emergency-information.onrender.com/api/users/generate-qr`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setQrCode(response.data.qrCode);
      storedUserDetails.qrCode = response.data.qrCode;
      localStorage.setItem("userDetails", JSON.stringify(storedUserDetails));
      toast.success("QR Code generated successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to generate QR code.");
    }
  };

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <div className="profile-section">
          <img
            src={
              profileImage instanceof File
                ? URL.createObjectURL(profileImage)
                : `https://qr-code-based-emergency-information.onrender.com${profileImage}` || "https://via.placeholder.com/100"
            }
            alt="Profile"
            className="profile-image"
          />
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
        <div className="dashboard-header">
          <h1>Hello, {username}</h1>
          <p className="emergency-text">
            <FaExclamationTriangle className="emergency-icon" />
            This tool enables quick sharing of critical information in emergencies. Add your details and generate a QR code for instant access by responders.
          </p>
        </div>
        <div className="qr-section">
          <button
            onClick={handleGenerateQR}
            className="submit-btn emergency-btn"
          >
            <FaQrcode /> Get QR Code
          </button>
          {qrCode && (
            <div className="qr-code-container">
              <h3>Your Emergency QR Code:</h3>
              <img src={qrCode} alt="User QR Code" className="qr-image" />
              <p className="qr-info">Scan this QR code to share your emergency information instantly.</p>
            </div>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Dashboard;