import { useNavigate } from "react-router-dom";
import { removeToken } from "../../utils/auth";
import { useAuth } from "../../context/AuthContext";
import avatar from "../../assets/avatar-placeholder.webp";

export default function Header() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { setUser } = useAuth();

  const handleLogout = () => {
    setUser(null);
    removeToken();

    navigate("/login", {
      state: { message: "Logged out successfully" },
    });
  };

  return (
    <div className="d-flex justify-content-between align-items-center p-3 bg-white shadow-sm">
      
      <h5 className="mb-0"></h5>

      <div className="dropdown">
        <div
          className="d-flex align-items-center gap-2"
          style={{ cursor: "pointer" }}
          data-bs-toggle="dropdown"
        >
          <img
            src={avatar}
            alt="Profile"
            className="rounded-circle"
            width={45}
            height={45}
          />
          <span className="fw-semibold">{ user?.name || "User" }</span>
        </div>

        <ul className="dropdown-menu dropdown-menu-end">
          <li>
            <button className="dropdown-item" onClick={handleLogout}>
              Logout
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}