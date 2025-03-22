import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import PersonalDetails from './components/PersonalDetails';
import VehicleDetails from './components/VehicalDetails';
import EmergencyDetails from './components/EmergencyDetails';
import MedicalHistory from './components/MedicalHistory';
import AllowAccess from './components/AllowAccess';
import PublicUserDetails from './components/PublicUserDetails';


import "./App.css";


function App() {
  return (
    <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />      
          <Route path="/personal-details" element={<PersonalDetails />} />  
          <Route path="/vehicle-details" element={<VehicleDetails />} />
          <Route path="/emergency-details" element={<EmergencyDetails />} />
          <Route path="/medical-history" element={<MedicalHistory />} />
          <Route path="/allow-access" element={<AllowAccess />} />
          <Route path="/public/:id" element={<PublicUserDetails />} />

          
          <Route path="/" element={<Login />} />
        </Routes>
    </Router>
  );
}

export default App;
