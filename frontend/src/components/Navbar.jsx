import { NavLink, useNavigate } from "react-router-dom";

export default function Navbar() {
  const nav = useNavigate();

  const handleLogout = () => {
    localStorage.clear();   
    nav("/");             
  };

  return (
    <nav className="nav">
      <div className="nav-brand">
        TRAFFICAI · SYS
      </div>

      <div className="nav-links">
        <NavLink to="/home">Home</NavLink>
        <NavLink to="/model">Detect</NavLink>
        <NavLink to="/about">About</NavLink>

        <button onClick={handleLogout}>
          ⏻ Logout
        </button>
      </div>
    </nav>
  );
}