import { useState } from "react";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import '../App.css'; // Ensure you import the CSS file

const Register = () => {
  const [fullname, setfullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      // Check if the user already exists
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      if (userCredential) {
        alert("User already exists. Redirecting to login.");
        navigate("/login");
      } else {
        // Create a new user if not found
        await createUserWithEmailAndPassword(auth, email, password);
        alert("Registration successful!");
        navigate("/login");
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="register-container">
      <h2 className="register-title">Register</h2>
      <div className="input-container">

      <input
          type="name"
          className="input-field"
          placeholder="Full Name"
          value={fullname}
          onChange={(e) => setfullname(e.target.value)}
        />

        <input
          type="email"
          className="input-field"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          className="input-field"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="number"
          className="input-field"
          placeholder="Age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />
        <select
          className="input-field"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        <textarea
          className="input-field"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>
      <button className="register-btn" onClick={handleRegister}>
        Register
      </button>
      <p>if already form   <Link to="/Login">Login</Link> </p>
    </div>
  );
};

export default Register;
