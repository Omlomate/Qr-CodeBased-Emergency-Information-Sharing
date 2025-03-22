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

function VehicleDetails() {
  const [username, setUsername] = useState("");
  const [formData, setFormData] = useState({
    vehicleDetails: {
      basicVehicleDetails: {
        vehicleRegistrationNumber: "",
        vehicleMakeAndModel: "",
        vehicleColor: "",
        vehicleType: "",
        chassisNumber: "",
        engineNumber: "",
        fuelType: "",
      },
      ownerDetails: {
        ownerName: "",
        ownerContactNumber: "",
        ownerEmailId: "",
        ownerAddress: {
          street: "",
          city: "",
          state: "",
          country: "",
          postalCode: "",
        },
        alternativeContactNumber: "",
      },
      insuranceAndLegalInfo: {
        insuranceCompanyName: "",
        insurancePolicyNumber: "",
        insuranceExpiryDate: "",
        pucValidity: "",
        rcExpiryDate: "",
        drivingLicenseNumber: "",
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
    const storedUserDetails = JSON.parse(localStorage.getItem("userDetails")) || {};

    setUsername(storedUsername);
    setFormData({
      vehicleDetails: {
        basicVehicleDetails: {
          vehicleRegistrationNumber:
            storedUserDetails.vehicleDetails?.basicVehicleDetails?.vehicleRegistrationNumber || "",
          vehicleMakeAndModel:
            storedUserDetails.vehicleDetails?.basicVehicleDetails?.vehicleMakeAndModel || "",
          vehicleColor:
            storedUserDetails.vehicleDetails?.basicVehicleDetails?.vehicleColor || "",
          vehicleType:
            storedUserDetails.vehicleDetails?.basicVehicleDetails?.vehicleType || "",
          chassisNumber:
            storedUserDetails.vehicleDetails?.basicVehicleDetails?.chassisNumber || "",
          engineNumber:
            storedUserDetails.vehicleDetails?.basicVehicleDetails?.engineNumber || "",
          fuelType:
            storedUserDetails.vehicleDetails?.basicVehicleDetails?.fuelType || "",
        },
        ownerDetails: {
          ownerName:
            storedUserDetails.vehicleDetails?.ownerDetails?.ownerName || "",
          ownerContactNumber:
            storedUserDetails.vehicleDetails?.ownerDetails?.ownerContactNumber || "",
          ownerEmailId:
            storedUserDetails.vehicleDetails?.ownerDetails?.ownerEmailId || "",
          ownerAddress: {
            street:
              storedUserDetails.vehicleDetails?.ownerDetails?.ownerAddress?.street || "",
            city:
              storedUserDetails.vehicleDetails?.ownerDetails?.ownerAddress?.city || "",
            state:
              storedUserDetails.vehicleDetails?.ownerDetails?.ownerAddress?.state || "",
            country:
              storedUserDetails.vehicleDetails?.ownerDetails?.ownerAddress?.country || "",
            postalCode:
              storedUserDetails.vehicleDetails?.ownerDetails?.ownerAddress?.postalCode || "",
          },
          alternativeContactNumber:
            storedUserDetails.vehicleDetails?.ownerDetails?.alternativeContactNumber || "",
        },
        insuranceAndLegalInfo: {
          insuranceCompanyName:
            storedUserDetails.vehicleDetails?.insuranceAndLegalInfo?.insuranceCompanyName || "",
          insurancePolicyNumber:
            storedUserDetails.vehicleDetails?.insuranceAndLegalInfo?.insurancePolicyNumber || "",
          insuranceExpiryDate:
            storedUserDetails.vehicleDetails?.insuranceAndLegalInfo?.insuranceExpiryDate || "",
          pucValidity:
            storedUserDetails.vehicleDetails?.insuranceAndLegalInfo?.pucValidity || "",
          rcExpiryDate:
            storedUserDetails.vehicleDetails?.insuranceAndLegalInfo?.rcExpiryDate || "",
          drivingLicenseNumber:
            storedUserDetails.vehicleDetails?.insuranceAndLegalInfo?.drivingLicenseNumber || "",
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

    if (section === "vehicleDetails" && subSection === "basicVehicleDetails") {
      setFormData({
        ...formData,
        vehicleDetails: {
          ...formData.vehicleDetails,
          basicVehicleDetails: {
            ...formData.vehicleDetails.basicVehicleDetails,
            [field]: value,
          },
        },
      });
    } else if (
      section === "vehicleDetails" &&
      subSection === "ownerDetails" &&
      !field.includes("ownerAddress")
    ) {
      setFormData({
        ...formData,
        vehicleDetails: {
          ...formData.vehicleDetails,
          ownerDetails: {
            ...formData.vehicleDetails.ownerDetails,
            [field]: value,
          },
        },
      });
    } else if (field.includes("ownerAddress")) {
      const addressField = name.split(".")[3];
      setFormData({
        ...formData,
        vehicleDetails: {
          ...formData.vehicleDetails,
          ownerDetails: {
            ...formData.vehicleDetails.ownerDetails,
            ownerAddress: {
              ...formData.vehicleDetails.ownerDetails.ownerAddress,
              [addressField]: value,
            },
          },
        },
      });
    } else if (section === "vehicleDetails" && subSection === "insuranceAndLegalInfo") {
      setFormData({
        ...formData,
        vehicleDetails: {
          ...formData.vehicleDetails,
          insuranceAndLegalInfo: {
            ...formData.vehicleDetails.insuranceAndLegalInfo,
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
      basicVehicleDetails: formData.vehicleDetails.basicVehicleDetails,
      ownerDetails: formData.vehicleDetails.ownerDetails,
      insuranceAndLegalInfo: formData.vehicleDetails.insuranceAndLegalInfo,
    };

    try {
      const response = await axios.put(
        "https://qr-code-based-emergency-information.onrender.com/api/users/vehicle-details",
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
        vehicleDetails: {
          basicVehicleDetails: {
            ...formData.vehicleDetails.basicVehicleDetails,
            ...userDetails.vehicleDetails.basicVehicleDetails,
          },
          ownerDetails: {
            ...formData.vehicleDetails.ownerDetails,
            ...userDetails.vehicleDetails.ownerDetails,
          },
          insuranceAndLegalInfo: {
            ...formData.vehicleDetails.insuranceAndLegalInfo,
            ...userDetails.vehicleDetails.insuranceAndLegalInfo,
          },
        },
      });

      toast.success("Vehicle details updated successfully!");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to update vehicle details."
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
          Vehicle Details
        </h1>
        <form className="personal-details-form" onSubmit={handleSubmit}>
          {/* Basic Vehicle Details */}
          <h2 style={{ fontSize: "1.2rem", color: "#2c3e50", marginTop: "20px" }}>
            Basic Vehicle Details
          </h2>
          <div className="form-group">
            <input
              type="text"
              id="vehicleRegistrationNumber"
              name="vehicleDetails.basicVehicleDetails.vehicleRegistrationNumber"
              value={formData.vehicleDetails.basicVehicleDetails.vehicleRegistrationNumber}
              onChange={handleChange}
              placeholder=" "
            />
            <label htmlFor="vehicleRegistrationNumber">Vehicle Registration Number</label>
          </div>
          <div className="form-group">
            <input
              type="text"
              id="vehicleMakeAndModel"
              name="vehicleDetails.basicVehicleDetails.vehicleMakeAndModel"
              value={formData.vehicleDetails.basicVehicleDetails.vehicleMakeAndModel}
              onChange={handleChange}
              placeholder=" "
            />
            <label htmlFor="vehicleMakeAndModel">Vehicle Make & Model</label>
          </div>
          <div className="form-group">
            <input
              type="text"
              id="vehicleColor"
              name="vehicleDetails.basicVehicleDetails.vehicleColor"
              value={formData.vehicleDetails.basicVehicleDetails.vehicleColor}
              onChange={handleChange}
              placeholder=" "
            />
            <label htmlFor="vehicleColor">Vehicle Color</label>
          </div>
          <div className="form-group">
            <select
              id="vehicleType"
              name="vehicleDetails.basicVehicleDetails.vehicleType"
              value={formData.vehicleDetails.basicVehicleDetails.vehicleType}
              onChange={handleChange}
            >
              <option value="">Select Vehicle Type</option>
              <option value="Car">Car</option>
              <option value="Bike">Bike</option>
              <option value="Truck">Truck</option>
              <option value="Other">Other</option>
            </select>
            <label htmlFor="vehicleType">Vehicle Type</label>
          </div>
          <div className="form-group">
            <input
              type="text"
              id="chassisNumber"
              name="vehicleDetails.basicVehicleDetails.chassisNumber"
              value={formData.vehicleDetails.basicVehicleDetails.chassisNumber}
              onChange={handleChange}
              placeholder=" "
            />
            <label htmlFor="chassisNumber">Chassis Number</label>
          </div>
          <div className="form-group">
            <input
              type="text"
              id="engineNumber"
              name="vehicleDetails.basicVehicleDetails.engineNumber"
              value={formData.vehicleDetails.basicVehicleDetails.engineNumber}
              onChange={handleChange}
              placeholder=" "
            />
            <label htmlFor="engineNumber">Engine Number</label>
          </div>
          <div className="form-group">
            <select
              id="fuelType"
              name="vehicleDetails.basicVehicleDetails.fuelType"
              value={formData.vehicleDetails.basicVehicleDetails.fuelType}
              onChange={handleChange}
            >
              <option value="">Select Fuel Type</option>
              <option value="Petrol">Petrol</option>
              <option value="Diesel">Diesel</option>
              <option value="Electric">Electric</option>
              <option value="Hybrid">Hybrid</option>
            </select>
            <label htmlFor="fuelType">Fuel Type</label>
          </div>

          {/* Owner Details */}
          <h2 style={{ fontSize: "1.2rem", color: "#2c3e50", marginTop: "20px" }}>
            Owner Details
          </h2>
          <div className="form-group">
            <input
              type="text"
              id="ownerName"
              name="vehicleDetails.ownerDetails.ownerName"
              value={formData.vehicleDetails.ownerDetails.ownerName}
              onChange={handleChange}
              placeholder=" "
            />
            <label htmlFor="ownerName">Owner Name</label>
          </div>
          <div className="form-group">
            <input
              type="tel"
              id="ownerContactNumber"
              name="vehicleDetails.ownerDetails.ownerContactNumber"
              value={formData.vehicleDetails.ownerDetails.ownerContactNumber}
              onChange={handleChange}
              placeholder=" "
            />
            <label htmlFor="ownerContactNumber">Owner Contact Number</label>
          </div>
          <div className="form-group">
            <input
              type="email"
              id="ownerEmailId"
              name="vehicleDetails.ownerDetails.ownerEmailId"
              value={formData.vehicleDetails.ownerDetails.ownerEmailId}
              onChange={handleChange}
              placeholder=" "
            />
            <label htmlFor="ownerEmailId">Owner Email ID</label>
          </div>
          <div className="form-group">
            <input
              type="text"
              id="ownerAddress-street"
              name="vehicleDetails.ownerDetails.ownerAddress.street"
              value={formData.vehicleDetails.ownerDetails.ownerAddress.street}
              onChange={handleChange}
              placeholder=" "
            />
            <label htmlFor="ownerAddress-street">Street</label>
          </div>
          <div className="form-group">
            <input
              type="text"
              id="ownerAddress-city"
              name="vehicleDetails.ownerDetails.ownerAddress.city"
              value={formData.vehicleDetails.ownerDetails.ownerAddress.city}
              onChange={handleChange}
              placeholder=" "
            />
            <label htmlFor="ownerAddress-city">City</label>
          </div>
          <div className="form-group">
            <input
              type="text"
              id="ownerAddress-state"
              name="vehicleDetails.ownerDetails.ownerAddress.state"
              value={formData.vehicleDetails.ownerDetails.ownerAddress.state}
              onChange={handleChange}
              placeholder=" "
            />
            <label htmlFor="ownerAddress-state">State</label>
          </div>
          <div className="form-group">
            <input
              type="text"
              id="ownerAddress-country"
              name="vehicleDetails.ownerDetails.ownerAddress.country"
              value={formData.vehicleDetails.ownerDetails.ownerAddress.country}
              onChange={handleChange}
              placeholder=" "
            />
            <label htmlFor="ownerAddress-country">Country</label>
          </div>
          <div className="form-group">
            <input
              type="text"
              id="ownerAddress-postalCode"
              name="vehicleDetails.ownerDetails.ownerAddress.postalCode"
              value={formData.vehicleDetails.ownerDetails.ownerAddress.postalCode}
              onChange={handleChange}
              placeholder=" "
            />
            <label htmlFor="ownerAddress-postalCode">Postal Code</label>
          </div>
          <div className="form-group">
            <input
              type="tel"
              id="alternativeContactNumber"
              name="vehicleDetails.ownerDetails.alternativeContactNumber"
              value={formData.vehicleDetails.ownerDetails.alternativeContactNumber}
              onChange={handleChange}
              placeholder=" "
            />
            <label htmlFor="alternativeContactNumber">Alternative Contact Number</label>
          </div>

          {/* Insurance & Legal Information */}
          <h2 style={{ fontSize: "1.2rem", color: "#2c3e50", marginTop: "20px" }}>
            Insurance & Legal Information
          </h2>
          <div className="form-group">
            <input
              type="text"
              id="insuranceCompanyName"
              name="vehicleDetails.insuranceAndLegalInfo.insuranceCompanyName"
              value={formData.vehicleDetails.insuranceAndLegalInfo.insuranceCompanyName}
              onChange={handleChange}
              placeholder=" "
            />
            <label htmlFor="insuranceCompanyName">Insurance Company Name</label>
          </div>
          <div className="form-group">
            <input
              type="text"
              id="insurancePolicyNumber"
              name="vehicleDetails.insuranceAndLegalInfo.insurancePolicyNumber"
              value={formData.vehicleDetails.insuranceAndLegalInfo.insurancePolicyNumber}
              onChange={handleChange}
              placeholder=" "
            />
            <label htmlFor="insurancePolicyNumber">Insurance Policy Number</label>
          </div>
          <div className="form-group">
            <input
              type="date"
              id="insuranceExpiryDate"
              name="vehicleDetails.insuranceAndLegalInfo.insuranceExpiryDate"
              value={
                formData.vehicleDetails.insuranceAndLegalInfo.insuranceExpiryDate
                  ? formData.vehicleDetails.insuranceAndLegalInfo.insuranceExpiryDate.split("T")[0]
                  : ""
              }
              onChange={handleChange}
              placeholder=" "
            />
            <label htmlFor="insuranceExpiryDate">Insurance Expiry Date</label>
          </div>
          <div className="form-group">
            <input
              type="date"
              id="pucValidity"
              name="vehicleDetails.insuranceAndLegalInfo.pucValidity"
              value={
                formData.vehicleDetails.insuranceAndLegalInfo.pucValidity
                  ? formData.vehicleDetails.insuranceAndLegalInfo.pucValidity.split("T")[0]
                  : ""
              }
              onChange={handleChange}
              placeholder=" "
            />
            <label htmlFor="pucValidity">PUC Validity</label>
          </div>
          <div className="form-group">
            <input
              type="date"
              id="rcExpiryDate"
              name="vehicleDetails.insuranceAndLegalInfo.rcExpiryDate"
              value={
                formData.vehicleDetails.insuranceAndLegalInfo.rcExpiryDate
                  ? formData.vehicleDetails.insuranceAndLegalInfo.rcExpiryDate.split("T")[0]
                  : ""
              }
              onChange={handleChange}
              placeholder=" "
            />
            <label htmlFor="rcExpiryDate">RC Expiry Date</label>
          </div>
          <div className="form-group">
            <input
              type="text"
              id="drivingLicenseNumber"
              name="vehicleDetails.insuranceAndLegalInfo.drivingLicenseNumber"
              value={formData.vehicleDetails.insuranceAndLegalInfo.drivingLicenseNumber}
              onChange={handleChange}
              placeholder=" "
            />
            <label htmlFor="drivingLicenseNumber">Driving License Number</label>
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

export default VehicleDetails;