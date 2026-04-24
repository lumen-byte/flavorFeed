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
import Search from '../pages/user/Search.jsx';
import RestaurantProfile from '../pages/user/RestaurantProfile.jsx';
import PartnerDashboard from '../pages/food-partner/PartnerDashboard.jsx';
import CreateFood from '../pages/food-partner/CreateFood.jsx';
import EditFood from '../pages/food-partner/EditFood.jsx';
import PrivateRoute from '../components/PrivateRoute.jsx';


function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Feed />} />
      <Route path="/user/login" element={<UserLogin />} />
      <Route path="/user/register" element={<UserRegister />} />
      <Route path="/search" element={<Search />} />
      <Route path="/restaurant/:id" element={<RestaurantProfile />} />

      {/* Protected User Routes */}
      <Route element={<PrivateRoute />}>
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/profile" element={<UserProfile />} /> {/* Added Profile route */}
      </Route>

      {/* Food Partner Routes (Basic implementation for now) */}
      <Route path="/food-partner/login" element={<PartnerLogin />} />
      <Route path="/food-partner/register" element={<PartnerRegister />} />
      <Route path="/food-partner/dashboard" element={<PartnerDashboard />} />
      <Route path="/create-food" element={<CreateFood />} />
      <Route path="/partner/edit-food/:id" element={<EditFood />} />

      {/* Fallback 404 Route */}
      <Route path="*" element={<div style={{ textAlign: "center", padding: "50px", color: "white" }}><h2>404 - Page Not Found</h2></div>} />
    </Routes>
  );
}

export default AppRoutes;
