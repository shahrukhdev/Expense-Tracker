import { Navigate, Outlet } from "react-router-dom";
import { getToken } from "../utils/auth";

export default function ProtectedRoute() {
  const token = getToken();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

// export default function ProtectedRoute({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const token = getToken();

//   if (!token) {
//     return <Navigate to="/login" replace />;
//   }

//   return children;
// }