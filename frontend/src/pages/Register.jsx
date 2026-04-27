import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Register() {
  const nav = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [msg, setMsg] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!username || !password || !confirm) {
      setMsg("Fill all fields");
      return;
    }

    if (password !== confirm) {
      setMsg("Passwords do not match");
      return;
    }

    try {
      await axios.post("http://localhost:5000/register", {
        username,
        password
      });

      setMsg("Registered Successfully");

      setTimeout(() => {
        nav("/");
      }, 1000);

    } catch {
      setMsg("Registration Failed");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Create Account</h1>

        <form onSubmit={handleRegister}>
          <input
            style={styles.input}
            placeholder="Username"
            value={username}
            onChange={(e)=>setUsername(e.target.value)}
          />

          <input
            style={styles.input}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
          />

          <input
            style={styles.input}
            type="password"
            placeholder="Confirm Password"
            value={confirm}
            onChange={(e)=>setConfirm(e.target.value)}
          />

          <button style={styles.button}>
            Register
          </button>
        </form>

        <p>{msg}</p>

        <p>
          Already have account?{" "}
          <Link to="/">Login</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#0f172a"
  },

  card: {
    width: "380px",
    background: "#111827",
    padding: "30px",
    borderRadius: "12px",
    color: "white",
    boxShadow: "0 0 20px cyan"
  },

  title: {
    textAlign: "center",
    marginBottom: "20px"
  },

  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "12px",
    borderRadius: "8px",
    border: "none"
  },

  button: {
    width: "100%",
    padding: "12px",
    background: "cyan",
    border: "none",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer"
  }
};