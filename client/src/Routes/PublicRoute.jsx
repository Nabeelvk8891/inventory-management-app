import { Navigate } from "react-router-dom";
import { isLoggedIn } from "../Utils/auth";

export default function PublicRoute({ children }) {
  if (isLoggedIn()) {
    return <Navigate to="/" replace />;
  }

  return children;
}