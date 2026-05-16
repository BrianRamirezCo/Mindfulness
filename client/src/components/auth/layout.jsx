// auth/layout.jsx
import { Outlet } from "react-router-dom";
import logo from "../../assets/logo.png";

function AuthLayout() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <div className="flex flex-1 items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          {/* Logo centrado */}
          <div className="flex flex-col items-center gap-2">
            <img
              src={logo}
              alt="Valeria Sarmiento"
              className="w-36 opacity-90"
            />
          </div>
          <Outlet />
        </div>
      </div>

      {/* Footer */}
      <footer className="py-6 border-t border-border/30 text-center">
        <p className="text-xs text-foreground/30 font-sans tracking-wide">
          © {new Date().getFullYear()} Valeria Sarmiento · Todos los derechos
          reservados
        </p>
      </footer>
    </div>
  );
}

export default AuthLayout;
