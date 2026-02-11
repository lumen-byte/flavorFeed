import React from 'react';
import { Routes, Route } from "react-router-dom";
import UserLogin from '../pages/auth/UserLogin.jsx';
import UserRegister from '../pages/auth/UserRegister.jsx';
import PartnerLogin from '../pages/auth/PartnerLogin.jsx';
import PartnerRegister from '../pages/auth/PartnerRegister.jsx';
import Home from '../pages/general/Home.jsx';
import Cart from '../pages/user/Cart.jsx';
import Checkout from '../pages/user/Checkout.jsx';



function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/user/login" element={<UserLogin />} />
      <Route path="/user/register" element={<UserRegister />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/food-partner/login" element={<PartnerLogin />} />
      <Route path="/food-partner/register" element={<PartnerRegister />} />
      <Route path="/create-food" element={<div>CreateFood</div>} />
    </Routes>
  );
}

export default AppRoutes;