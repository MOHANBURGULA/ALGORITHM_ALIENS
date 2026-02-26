import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  // ❌ invalid or missing token → redirect
  if (!token || token === "null" || token === "undefined") {
    return <Navigate to="/login" replace />;
  }

  // ✅ valid token → allow
  return children;
};

export default ProtectedRoute;