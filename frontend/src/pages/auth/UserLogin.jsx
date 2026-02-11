import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Combined imports
import "../../App.css";
import { useAuth } from '../../context/AuthContext'; // Import hook
// import axios from 'axios'; // Not needed if using context

const UserLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); // Use the hook

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      await login(email, password); // Use login from context
      navigate('/');
    } catch (err) {
      console.error("Login failed:", err.response?.data || err.message);
      alert("Invalid email or password");
    }
  };

  // Fix 2: Add 'return' keyword
  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>User Login</h2>
        <p>Welcome back to FlavorFeed</p>
        {/* Fix 3: Add onSubmit handler */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            {/* Fix 4: Add 'name' attribute so e.target.email works */}
            <input name="email" type="email" placeholder="Enter your email" required />
          </div>
          <div className="form-group">
            <label>Password</label>
            {/* Fix 5: Add 'name' attribute */}
            <input name="password" type="password" placeholder="••••••••" required />
          </div>
          {/* Fix 6: Change type to 'submit' */}
          <button type="submit" className="auth-btn">Sign In</button>
        </form>
        <div className="auth-footer">
          New here? <Link to="/user/register">Create account</Link>
        </div>
      </div>
    </div>
  );
}

export default UserLogin;