import { Navigate, Outlet } from "react-router-dom";
import { getToken } from "../utils/auth";

export default function GuestRoute() {
  const token = getToken();

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

// export default function GuestRoute({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const token = getToken();

//   if (token) {
//     return <Navigate to="/dashboard" replace />;
//   }

//   return children;
  
// }