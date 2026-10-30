import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../features/auth/store/auth.store";

export function ProtectedRoute() {
  const user = useAuthStore((state) => state.user);
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}
