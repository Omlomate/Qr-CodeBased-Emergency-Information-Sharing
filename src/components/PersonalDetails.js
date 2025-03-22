import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // Add useLocation
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

function PersonalDetails() {
  const [username, setUsername] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    aadharCard: "",
    address: {
      street: "",
      city: "",
      state: "",
      country: "",
      postalCode: "",
    },
    phone: "",
    profileImage: "",
  });
  const navigate = useNavigate();
  const location = useLocation(); // Get current route

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
      name: storedUsername,
      email: storedUserDetails.email || "",
      aadharCard: storedUserDetails.aadharCard || "",
      address: {
        street: storedUserDetails.address?.street || "",
        city: storedUserDetails.address?.city || "",
        state: storedUserDetails.address?.state || "",
        country: storedUserDetails.address?.country || "",
        postalCode: storedUserDetails.address?.postalCode || "",
      },
      phone: storedUserDetails.phone || "",
      profileImage: storedUserDetails.profileImage || "", // Ensure this is set
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
    if (name.includes("address.")) {
      const addressField = name.split(".")[1];
      setFormData({
        ...formData,
        address: { ...formData.address, [addressField]: value },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    // Prepare FormData for multipart upload (for profileImage file)
    const dataToSend = new FormData();
    dataToSend.append("name", formData.name);
    dataToSend.append("email", formData.email);
    dataToSend.append("aadharCard", formData.aadharCard);
    dataToSend.append("address", JSON.stringify(formData.address)); // Stringify address object
    dataToSend.append("phone", formData.phone);
    if (formData.profileImage instanceof File) {
      dataToSend.append("profileImage", formData.profileImage); // Add file if it’s a new upload
    } else if (formData.profileImage) {
      dataToSend.append("profileImage", formData.profileImage); // Add existing URL if no new file
    }

    try {
      const response = await axios.put(
        `https://qr-code-based-emergency-information.onrender.com/api/users/profile`,
        dataToSend,
        {
          headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data", // Required for file uploads
          },
        }
      );

      // Update localStorage with new data
      const { name, userDetails } = response.data;
      localStorage.setItem("username", name);
      localStorage.setItem("userDetails", JSON.stringify(userDetails));

      // Update state with new data
      setUsername(name);
      setFormData({
        ...formData,
        name: name,
        email: userDetails.email,
        aadharCard: userDetails.aadharCard,
        address: userDetails.address,
        phone: userDetails.phone,
        profileImage: userDetails.profileImage,
      });

      toast.success("Personal details updated successfully!");
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Failed to update details. Please try again."
      );
    }
  };

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <div className="profile-section">
          <img
            src={
              formData.profileImage instanceof File
                ? URL.createObjectURL(formData.profileImage)
                : `https://qr-code-based-emergency-information.onrender.com${formData.profileImage}` ||
                  "https://via.placeholder.com/100"
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
          Personal Details
        </h1>
        <form className="personal-details-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder=" "
              required
            />
            <label htmlFor="name">Name *</label>
          </div>

          <div className="form-group">
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder=" "
              required
            />
            <label htmlFor="email">Email *</label>
          </div>

          <div className="form-group">
            <input
              type="text"
              id="aadharCard"
              name="aadharCard"
              value={formData.aadharCard}
              onChange={handleChange}
              placeholder=" "
            />
            <label htmlFor="aadharCard">Aadhar Card</label>
          </div>

          <div className="form-group">
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder=" "
            />
            <label htmlFor="phone">Phone</label>
          </div>

          {/* Address Fields as Individual form-group */}
          <div className="form-group">
            <input
              type="text"
              id="address-street"
              name="address.street"
              value={formData.address.street}
              onChange={handleChange}
              placeholder=" "
            />
            <label htmlFor="address-street">Street</label>
          </div>

          <div className="form-group">
            <input
              type="text"
              id="address-city"
              name="address.city"
              value={formData.address.city}
              onChange={handleChange}
              placeholder=" "
            />
            <label htmlFor="address-city">City</label>
          </div>

          <div className="form-group">
            <input
              type="text"
              id="address-state"
              name="address.state"
              value={formData.address.state}
              onChange={handleChange}
              placeholder=" "
            />
            <label htmlFor="address-state">State</label>
          </div>

          <div className="form-group">
            <input
              type="text"
              id="address-country"
              name="address.country"
              value={formData.address.country}
              onChange={handleChange}
              placeholder=" "
            />
            <label htmlFor="address-country">Country</label>
          </div>

          <div className="form-group">
            <input
              type="text"
              id="address-postalCode"
              name="address.postalCode"
              value={formData.address.postalCode}
              onChange={handleChange}
              placeholder=" "
            />
            <label htmlFor="address-postalCode">Postal Code</label>
          </div>

          <div className="form-group">
            <label htmlFor="profileImage">Profile Image (Max 5MB)</label>
            <input
              type="file"
              id="profileImage"
              name="profileImage"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const maxSize = 5 * 1024 * 1024; // 5MB in bytes
                  if (file.size > maxSize) {
                    toast.error("File size exceeds 5MB limit!");
                    e.target.value = "";
                    setFormData({ ...formData, profileImage: "" });
                  } else {
                    setFormData({ ...formData, profileImage: file });
                  }
                }
              }}
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

export default PersonalDetails;
