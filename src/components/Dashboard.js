import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "../assets/Dashboard.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaUser, FaCar, FaPhone, FaNotesMedical, FaLock, FaSignOutAlt, FaQrcode, FaExclamationTriangle, FaPrint } from "react-icons/fa";

function Dashboard() {
  const [username, setUsername] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [qrCode, setQrCode] = useState(null);
  const [loading, setLoading] = useState(false); // Added loading state
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
    setLoading(true); // Show loader
    const token = localStorage.getItem("token");
    const storedUserDetails = JSON.parse(localStorage.getItem("userDetails")) || {};

    const isInformationSufficient = () => {
      const user = storedUserDetails.userDetails || storedUserDetails;
      const hasPersonalDetails = Boolean(user.name) || Boolean(user.email) || Boolean(user.phone) || Boolean(user.aadharCard) || Boolean(user.address?.street) || Boolean(user.address?.city) || Boolean(user.address?.state) || Boolean(user.address?.country) || Boolean(user.address?.postalCode) || Boolean(user.profileImage);
      const hasVehicleDetails = Boolean(user.vehicleDetails?.basicVehicleDetails?.vehicleRegistrationNumber) || Boolean(user.vehicleDetails?.basicVehicleDetails?.vehicleMakeAndModel) || Boolean(user.vehicleDetails?.basicVehicleDetails?.vehicleColor) || Boolean(user.vehicleDetails?.basicVehicleDetails?.vehicleType) || Boolean(user.vehicleDetails?.basicVehicleDetails?.chassisNumber) || Boolean(user.vehicleDetails?.basicVehicleDetails?.engineNumber) || Boolean(user.vehicleDetails?.basicVehicleDetails?.fuelType) || Boolean(user.vehicleDetails?.ownerDetails?.ownerName) || Boolean(user.vehicleDetails?.ownerDetails?.ownerContactNumber) || Boolean(user.vehicleDetails?.ownerDetails?.ownerEmailId) || Boolean(user.vehicleDetails?.ownerDetails?.ownerAddress?.street) || Boolean(user.vehicleDetails?.ownerDetails?.alternativeContactNumber) || Boolean(user.vehicleDetails?.insuranceAndLegalInfo?.insuranceCompanyName) || Boolean(user.vehicleDetails?.insuranceAndLegalInfo?.insurancePolicyNumber) || Boolean(user.vehicleDetails?.insuranceAndLegalInfo?.insuranceExpiryDate) || Boolean(user.vehicleDetails?.insuranceAndLegalInfo?.pucValidity) || Boolean(user.vehicleDetails?.insuranceAndLegalInfo?.rcExpiryDate) || Boolean(user.vehicleDetails?.insuranceAndLegalInfo?.drivingLicenseNumber);
      const hasEmergencyDetails = Boolean(user.emergencyDetails?.primaryEmergencyContact?.name) || Boolean(user.emergencyDetails?.primaryEmergencyContact?.contactNumber) || Boolean(user.emergencyDetails?.primaryEmergencyContact?.relationshipWithOwner) || Boolean(user.emergencyDetails?.secondaryEmergencyContact?.name) || Boolean(user.emergencyDetails?.secondaryEmergencyContact?.contactNumber) || Boolean(user.emergencyDetails?.secondaryEmergencyContact?.relationshipWithOwner);
      const hasMedicalHistory = Boolean(user.medicalHistory?.ownerBloodGroup) || Boolean(user.medicalHistory?.knownAllergies) || Boolean(user.medicalHistory?.chronicMedicalConditions) || Boolean(user.medicalHistory?.medications) || Boolean(user.medicalHistory?.emergencyMedicalInstructions);
      return hasPersonalDetails && hasVehicleDetails && hasEmergencyDetails && hasMedicalHistory;
    };

    if (storedUserDetails.qrCode && isInformationSufficient()) {
      setQrCode(storedUserDetails.qrCode);
      setLoading(false);
      return;
    }

    if (!isInformationSufficient()) {
      toast.warn("Please add at least one field in each section before generating a QR code.");
      setLoading(false);
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
    } finally {
      setLoading(false); // Hide loader
    }
  };

  const handlePrintQR = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Print QR Code</title>
          <style>
            @media print {
              .qr-print-container {
                position: absolute;
                top: 10mm;
                left: 10mm;
              }
              .qr-print-image {
                width: 50mm; /* Small size for print */
                height: 50mm;
              }
            }
          </style>
        </head>
        <body>
          <div class="qr-print-container">
            <img src="${qrCode}" alt="QR Code" class="qr-print-image" />
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
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
            <li onClick={() => handleNavigation("/dashboard")} className={location.pathname === "/dashboard" ? "active" : ""}>
              <FaUser /> Dashboard
            </li>
            <li onClick={() => handleNavigation("/personal-details")} className={location.pathname === "/personal-details" ? "active" : ""}>
              <FaUser /> Personal Details
            </li>
            <li onClick={() => handleNavigation("/vehicle-details")} className={location.pathname === "/vehicle-details" ? "active" : ""}>
              <FaCar /> Vehicle Details
            </li>
            <li onClick={() => handleNavigation("/emergency-details")} className={location.pathname === "/emergency-details" ? "active" : ""}>
              <FaPhone /> Emergency Details
            </li>
            <li onClick={() => handleNavigation("/medical-history")} className={location.pathname === "/medical-history" ? "active" : ""}>
              <FaNotesMedical /> Medical History
            </li>
            <li onClick={() => handleNavigation("/allow-access")} className={location.pathname === "/allow-access" ? "active" : ""}>
              <FaLock /> Allow Access
            </li>
            <li onClick={handleLogout} className={`logout-btn ${location.pathname === "/logout" ? "active" : ""}`}>
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
          <button onClick={handleGenerateQR} className="submit-btn emergency-btn" disabled={loading}>
            <FaQrcode /> {loading ? "Generating..." : "Get QR Code"}
          </button>
          {qrCode && (
            <div className="qr-code-container">
              <h3>Your Emergency QR Code:</h3>
              <img src={qrCode} alt="User QR Code" className="qr-image" style={{ maxWidth: "200px" }} /> {/* Small size for display */}
              <p className="qr-info">Scan this QR code to share your emergency information instantly.</p>
              <button onClick={handlePrintQR} className="submit-btn print-btn">
                <FaPrint /> Print QR Code
              </button>
            </div>
          )}
          {loading && (
            <div className="loader" style={{
              border: "4px solid #f3f3f3",
              borderTop: "4px solid #3498db",
              borderRadius: "50%",
              width: "30px",
              height: "30px",
              animation: "spin 1s linear infinite",
              margin: "20px auto"
            }}></div>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Dashboard;