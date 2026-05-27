import { Navigate, useLocation } from "react-router-dom";

function CheckAuth({ isAuthenticated, user, children }) {
  const location = useLocation();

  const publicAuthRoutes = [
    "/auth/login",
    "/auth/register",
    "/auth/forgot-password",
    "/auth/reset-password",
  ];

  const publicShopRoutes = [
    "/shop/home",
    "/shop/listing",
    "/shop/product/",
    "/shop/search",
    "/shop/search",
    "/shop/reflections",
  ];

  const isPublicAuthRoute = publicAuthRoutes.some((route) =>
    location.pathname.includes(route),
  );

  const isPublicShopRoute = publicShopRoutes.some((route) =>
    location.pathname.startsWith(route),
  );

  if (location.pathname === "/") {
    if (!isAuthenticated) {
      return <Navigate to="/shop/home" />; // ← antes iba a /auth/login
    } else {
      if (user?.role === "admin") {
        return <Navigate to="/admin/dashboard" />;
      } else {
        return <Navigate to="/shop/home" />;
      }
    }
  }

  // Rutas públicas de la tienda — permitir sin login
  if (!isAuthenticated && isPublicShopRoute) {
    return <>{children}</>;
  }

  if (!isAuthenticated && !isPublicAuthRoute) {
    return <Navigate to="/auth/login" />;
  }

  if (isAuthenticated && isPublicAuthRoute) {
    if (user?.role === "admin") {
      return <Navigate to="/admin/dashboard" />;
    } else {
      return <Navigate to="/shop/home" />;
    }
  }

  if (
    isAuthenticated &&
    user?.role !== "admin" &&
    location.pathname.includes("admin")
  ) {
    return <Navigate to="/unauth-page" />;
  }

  return <>{children}</>;
}

export default CheckAuth;
