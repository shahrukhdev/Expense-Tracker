import { Link } from "react-router-dom";
import logo from "../../assets/react.svg";

import {
  FaHome,
  FaWallet,
  FaList,
  FaMoneyBill,
  FaChartLine,
  FaSync,
  FaUser,
  FaUsers,
} from "react-icons/fa";

export default function Sidebar() {
  const menuItems = [
    { name: "Dashboard", icon: <FaHome />, path: "/dashboard" },
    { name: "Budget", icon: <FaWallet />, path: "/budget"  },
    { name: "Category", icon: <FaList />, path: "/category"  },
    { name: "Expense", icon: <FaMoneyBill />, path: "/expenses"  },
    { name: "Income", icon: <FaChartLine />, path: "/incomes"  },
    { name: "Recurring Expense", icon: <FaSync />, path: "/recurring-expenses"  },
    { name: "Profile", icon: <FaUser />, path: "/profile"  },
    { name: "Users", icon: <FaUsers />, path: "/dashboard"  },
  ];

  return (
    <div
      className="text-white d-flex flex-column p-3"
      style={{
        width: "260px",
        background: "linear-gradient(180deg, #1f2937, #111827)",
      }}
    >
      {/* Logo */}
      <Link
        to="/dashboard"
        className="d-flex align-items-center gap-2 mb-4 text-white text-decoration-none"
      >
        <img src={logo} alt="Logo" height={35} />
        <h5 className="mb-0">Expense Tracker</h5>
      </Link>

      {/* Menu */}
      <ul className="nav flex-column gap-2">
        {menuItems.map((item, index) => (
        <Link
          to={item.path}
          key={index}
          className="text-white text-decoration-none"
        >
          <li
            className="d-flex align-items-center gap-3 px-3 py-2 rounded"
            style={{ cursor: "pointer", transition: "0.25s" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.08)";
              e.currentTarget.style.transform = "translateX(4px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.transform = "translateX(0)";
            }}
          >
            <span style={{ fontSize: "18px" }}>{item.icon}</span>
            <span>{item.name}</span>
          </li>
        </Link>
        ))}
      </ul>
    </div>
  );
}