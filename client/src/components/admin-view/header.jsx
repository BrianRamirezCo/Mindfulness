import { AlignJustify, LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch } from "react-redux";
import { logoutUser } from "@/store/auth-slice";
import { useNavigate } from "react-router-dom";

function AdminHeader({ setOpen }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function handleLogout() {
    dispatch(logoutUser()).then(() => {
      navigate("/auth/login", { replace: true });
    });
  }

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-background border-b border-border/40">
      <Button
        onClick={() => setOpen(true)}
        variant="outline"
        size="icon"
        className="lg:hidden border-border/40 hover:border-primary/40 hover:bg-primary/5"
      >
        <AlignJustify className="h-5 w-5 text-foreground/60" />
        <span className="sr-only">Abrir menú</span>
      </Button>

      <div className="flex flex-1 justify-end">
        <Button
          onClick={handleLogout}
          variant="outline"
          className="inline-flex gap-2 items-center text-sm font-sans tracking-wide border-border/40 hover:border-destructive/40 hover:bg-destructive/5 text-foreground/60 hover:text-destructive"
        >
          <LogOut className="h-4 w-4" />
          Cerrar sesión
        </Button>
      </div>
    </header>
  );
}

export default AdminHeader;
