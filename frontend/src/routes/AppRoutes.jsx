import React from 'react';
import { Routes, Route } from "react-router-dom";
import UserLogin from '../pages/UserLogin';
import UserRegister from '../pages/UserRegister';
import PartnerLogin from '../pages/PartnerLogin';
import PartnerRegister from '../pages/PartnerRegister';

function AppRoutes() {
  return (
    <Routes>
      <Route path='/user/register' element={<UserRegister />} />
      <Route path='/user/login' element={<UserLogin />} />
      <Route path='/food-partner/register' element={<PartnerRegister />} />
      <Route path='/food-partner/login' element={<PartnerLogin />} />
      <Route path='/' element={<div className="auth-page"><h1>Welcome to FlavorFeed</h1></div>} />
      <Route path='*' element={<div className="auth-page"><h1>404 - Not Found</h1></div>} />
    </Routes>
  );
}

export default AppRoutes;