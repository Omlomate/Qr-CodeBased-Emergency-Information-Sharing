import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../assets/PublicUserDetails.css"; // New CSS file for specific styling

function PublicUserDetails() {
  const { id } = useParams();
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPublicData = async () => {
      try {
        const response = await axios.get(`https://qr-code-based-emergency-information.onrender.com/api/users/public/${id}`);
        setUserData(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch public data.");
      }
    };
    fetchPublicData();
  }, [id]);

  if (error) {
    return (
      <div className="public-container">
        <div className="error-card">
          <h1>Error</h1>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="public-container">
        <div className="loading-card">
          <h1>Loading...</h1>
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="public-container">
      <div className="public-card">
        <h1 className="public-title">Public User Information</h1>
        {userData.profileImage && (
          <div className="profile-image-container">
            <img
              src={`https://qr-code-based-emergency-information.onrender.com${userData.profileImage}`}
              alt="Profile"
              className="profile-image"
            />
          </div>
        )}
        {userData.name && (
          <p className="public-info"><strong>Name:</strong> {userData.name}</p>
        )}
        {userData.email && (
          <p className="public-info"><strong>Email:</strong> {userData.email}</p>
        )}
        {userData.aadharCard && (
          <p className="public-info"><strong>Aadhar Card:</strong> {userData.aadharCard}</p>
        )}
        {userData.address && (
          <div className="public-section">
            <strong>Address:</strong>
            <p className="public-info">
              {userData.address.street}, {userData.address.city}, {userData.address.state}, {userData.address.country} - {userData.address.postalCode}
            </p>
          </div>
        )}
        {userData.phone && (
          <p className="public-info"><strong>Phone:</strong> {userData.phone}</p>
        )}
        {userData.vehicleDetails && (
          <div className="public-section">
            <h2 className="public-subtitle">Vehicle Details</h2>
            {userData.vehicleDetails.basicVehicleDetails && (
              <>
                <p className="public-info"><strong>Registration Number:</strong> {userData.vehicleDetails.basicVehicleDetails.vehicleRegistrationNumber}</p>
                <p className="public-info"><strong>Make & Model:</strong> {userData.vehicleDetails.basicVehicleDetails.vehicleMakeAndModel}</p>
                <p className="public-info"><strong>Color:</strong> {userData.vehicleDetails.basicVehicleDetails.vehicleColor}</p>
                <p className="public-info"><strong>Type:</strong> {userData.vehicleDetails.basicVehicleDetails.vehicleType}</p>
                <p className="public-info"><strong>Chassis Number:</strong> {userData.vehicleDetails.basicVehicleDetails.chassisNumber}</p>
                <p className="public-info"><strong>Engine Number:</strong> {userData.vehicleDetails.basicVehicleDetails.engineNumber}</p>
                <p className="public-info"><strong>Fuel Type:</strong> {userData.vehicleDetails.basicVehicleDetails.fuelType}</p>
              </>
            )}
            {userData.vehicleDetails.ownerDetails && (
              <>
                <p className="public-info"><strong>Owner Name:</strong> {userData.vehicleDetails.ownerDetails.ownerName}</p>
                <p className="public-info"><strong>Owner Contact:</strong> {userData.vehicleDetails.ownerDetails.ownerContactNumber}</p>
                <p className="public-info"><strong>Owner Email:</strong> {userData.vehicleDetails.ownerDetails.ownerEmailId}</p>
                {userData.vehicleDetails.ownerDetails.ownerAddress && (
                  <p className="public-info"><strong>Owner Address:</strong> {userData.vehicleDetails.ownerDetails.ownerAddress.street}, {userData.vehicleDetails.ownerDetails.ownerAddress.city}, {userData.vehicleDetails.ownerDetails.ownerAddress.state}, {userData.vehicleDetails.ownerDetails.ownerAddress.country} - {userData.vehicleDetails.ownerDetails.ownerAddress.postalCode}</p>
                )}
                <p className="public-info"><strong>Alternative Contact:</strong> {userData.vehicleDetails.ownerDetails.alternativeContactNumber}</p>
              </>
            )}
            {userData.vehicleDetails.insuranceAndLegalInfo && (
              <>
                <p className="public-info"><strong>Insurance Company:</strong> {userData.vehicleDetails.insuranceAndLegalInfo.insuranceCompanyName}</p>
                <p className="public-info"><strong>Policy Number:</strong> {userData.vehicleDetails.insuranceAndLegalInfo.insurancePolicyNumber}</p>
                <p className="public-info"><strong>Insurance Expiry:</strong> {new Date(userData.vehicleDetails.insuranceAndLegalInfo.insuranceExpiryDate).toLocaleDateString()}</p>
                <p className="public-info"><strong>PUC Validity:</strong> {new Date(userData.vehicleDetails.insuranceAndLegalInfo.pucValidity).toLocaleDateString()}</p>
                <p className="public-info"><strong>RC Expiry:</strong> {new Date(userData.vehicleDetails.insuranceAndLegalInfo.rcExpiryDate).toLocaleDateString()}</p>
                <p className="public-info"><strong>Driving License:</strong> {userData.vehicleDetails.insuranceAndLegalInfo.drivingLicenseNumber}</p>
              </>
            )}
          </div>
        )}
        {userData.emergencyDetails && (
          <div className="public-section">
            <h2 className="public-subtitle">Emergency Details</h2>
            {userData.emergencyDetails.primaryEmergencyContact && (
              <>
                <p className="public-info"><strong>Primary Contact Name:</strong> {userData.emergencyDetails.primaryEmergencyContact.name}</p>
                <p className="public-info"><strong>Contact Number:</strong> {userData.emergencyDetails.primaryEmergencyContact.contactNumber}</p>
                <p className="public-info"><strong>Relationship:</strong> {userData.emergencyDetails.primaryEmergencyContact.relationshipWithOwner}</p>
              </>
            )}
            {userData.emergencyDetails.secondaryEmergencyContact && (
              <>
                <p className="public-info"><strong>Secondary Contact Name:</strong> {userData.emergencyDetails.secondaryEmergencyContact.name}</p>
                <p className="public-info"><strong>Contact Number:</strong> {userData.emergencyDetails.secondaryEmergencyContact.contactNumber}</p>
                <p className="public-info"><strong>Relationship:</strong> {userData.emergencyDetails.secondaryEmergencyContact.relationshipWithOwner}</p>
              </>
            )}
          </div>
        )}
        {userData.medicalHistory && (
          <div className="public-section">
            <h2 className="public-subtitle">Medical History</h2>
            <p className="public-info"><strong>Blood Group:</strong> {userData.medicalHistory.ownerBloodGroup}</p>
            <p className="public-info"><strong>Known Allergies:</strong> {userData.medicalHistory.knownAllergies}</p>
            <p className="public-info"><strong>Chronic Conditions:</strong> {userData.medicalHistory.chronicMedicalConditions}</p>
            <p className="public-info"><strong>Medications:</strong> {userData.medicalHistory.medications}</p>
            <p className="public-info"><strong>Emergency Instructions:</strong> {userData.medicalHistory.emergencyMedicalInstructions}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default PublicUserDetails;