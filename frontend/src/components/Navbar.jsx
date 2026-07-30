import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">SMS</Link>
      </div>
      {user && (
        <div className="navbar-links">
          <Link to="/students">Students</Link>
          <Link to="/courses">Courses</Link>
          <span className="navbar-user">
            {user.name} ({user.role})
          </span>
          <button onClick={handleLogout} className="btn btn-outline">
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
