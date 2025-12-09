import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, type }) {
  const userToken = localStorage.getItem("token");
  const adminToken = localStorage.getItem("adminToken");

  if (type === "user") {
    if (!userToken) {
      console.warn("🚫 Unauthorized: Redirecting to user login...");
      return <Navigate to="/login" replace />;
    }
    console.log("✅ User route authorized");
    return children;
  }

  if (type === "admin") {
    if (!adminToken) {
      console.warn("🚫 Unauthorized admin: Redirecting to dashboard login...");
      return <Navigate to="/dashboard/login" replace />;
    }
    console.log("✅ Admin route authorized");
    return children;
  }

  console.error(`⚠️ Invalid ProtectedRoute type: ${type}`);
  return <Navigate to="/login" replace />;
}
