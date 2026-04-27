// ===============================
// src/pages/Login.jsx
// ===============================

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

export default function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setMsg("Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      setMsg("");

      const res = await axios.post(
        "http://localhost:5000/login",
        {
          username,
          password
        }
      );

      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );

      setMsg("Login Success");

      setTimeout(() => {
        navigate("/home");
      }, 1000);

    } catch (err) {
      setMsg(
        err?.response?.data?.message ||
        "Invalid Login"
      );
    }

    setLoading(false);
  };

  return (
    <div className="center">
      <motion.div
        className="card card-br card-tr"
        style={{ width: 420 }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="scan-line" />

        <h2>ACCESS TERMINAL</h2>

        <form onSubmit={handleLogin}>

          <input
            type="text"
            placeholder="Enter Username"
            value={username}
            onChange={(e) =>
              setUsername(e.target.value)
            }
          />

          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />

          <button type="submit">
            {loading
              ? "Checking..."
              : "LOGIN ›"}
          </button>

        </form>

        {msg && (
          <p style={{ marginTop: 15 }}>
            {msg}
          </p>
        )}

        <p style={{ marginTop: 20 }}>
          New User?{" "}
          <Link to="/register">
            Register Here
          </Link>
        </p>

      </motion.div>
    </div>
  );
}