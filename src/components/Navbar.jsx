import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { auth } from "../firebase"; // Make sure to import your Firebase configuration
import { onAuthStateChanged, signOut } from "firebase/auth";
import "../App.css";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // Set the user when the auth state changes
    });

    return () => unsubscribe(); // Clean up the listener on unmount
  }, []);

  const handleLogout = () => {
    auth.signOut();
    alert("Logged out!");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <ul className="nav-list">
        <li><Link to="/" className="nav-link green-hover">About</Link></li>
        <li><Link to="/services" className="nav-link green-hover">Services</Link></li>
        <li><Link to="/contact" className="nav-link green-hover">Contact</Link></li>
        {user ? (
          <>
            <li><Link to="/dashboard" className="nav-link green-hover">Dashboard</Link></li>
            <li><button className="nav-link green-hover login-btn" onClick={handleLogout}>Logout</button></li>
          </>
        ) : (
          <>
            <li><Link to="/register" className="nav-link green-hover">Register</Link></li>
            <li><Link to="/login" className="nav-link green-hover">Login</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;

