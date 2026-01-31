import React from 'react';
import { Routes, Route } from "react-router-dom";
import UserLogin from '../pages/auth/UserLogin.jsx';
import UserRegister from '../pages/auth/UserRegister.jsx';
import PartnerLogin from '../pages/auth/PartnerLogin.jsx';
import PartnerRegister from '../pages/auth/PartnerRegister.jsx';
import Home from '../pages/general/Home.jsx';



function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} /> 
      <Route path="/user/login" element={<UserLogin />} />
      <Route path="/user/register" element={<UserRegister />} />
      <Route path="/food-partner/login" element={<PartnerLogin />} />
      <Route path="/food-partner/register" element={<PartnerRegister />} />
    </Routes>
  );
}

export default AppRoutes;