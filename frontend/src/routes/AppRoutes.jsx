import React from 'react';
import { Routes, Route } from "react-router-dom";
import UserLogin from '../pages/auth/UserLogin.jsx';
import UserRegister from '../pages/auth/UserRegister.jsx';
import PartnerLogin from '../pages/auth/PartnerLogin.jsx';
import PartnerRegister from '../pages/auth/PartnerRegister.jsx';
import Feed from '../components/Feed';
import Cart from '../pages/user/Cart.jsx';
import Checkout from '../pages/user/Checkout.jsx';
import UserProfile from '../pages/user/UserProfile.jsx';
import PartnerDashboard from '../pages/food-partner/PartnerDashboard.jsx';
import CreateFood from '../pages/food-partner/CreateFood.jsx';
import EditFood from '../pages/food-partner/EditFood.jsx';



function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Feed />} />
      <Route path="/user/login" element={<UserLogin />} />
      <Route path="/user/register" element={<UserRegister />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/profile" element={<UserProfile />} /> {/* Added Profile route */}

      {/* Food Partner Routes */}
      <Route path="/food-partner/login" element={<PartnerLogin />} />
      <Route path="/food-partner/register" element={<PartnerRegister />} />
      <Route path="/food-partner/dashboard" element={<PartnerDashboard />} />
      <Route path="/create-food" element={<CreateFood />} />
      <Route path="/partner/edit-food/:id" element={<EditFood />} />
    </Routes>
  );
}

export default AppRoutes;