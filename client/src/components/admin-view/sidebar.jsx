// sidebar.jsx
import { BookOpen, LayoutDashboard, PackageCheck } from "lucide-react";
import { Fragment } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";

const adminSidebarMenuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: <LayoutDashboard size={18} />,
  },
  {
    id: "products",
    label: "Libros",
    path: "/admin/products",
    icon: <BookOpen size={18} />,
  },
  {
    id: "orders",
    label: "Pedidos",
    path: "/admin/orders",
    icon: <PackageCheck size={18} />,
  },
];

function MenuItems({ setOpen }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="mt-6 flex flex-col gap-1">
      {adminSidebarMenuItems.map((menuItem) => {
        const isActive = location.pathname === menuItem.path;
        return (
          <div
            key={menuItem.id}
            onClick={() => {
              navigate(menuItem.path);
              setOpen ? setOpen(false) : null;
            }}
            className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 transition-colors duration-150 font-sans text-sm tracking-wide
              ${
                isActive
                  ? "bg-primary/15 text-primary font-medium"
                  : "text-foreground/60 hover:bg-primary/8 hover:text-foreground"
              }`}
          >
            <span className={isActive ? "text-primary" : "text-foreground/40"}>
              {menuItem.icon}
            </span>
            <span>{menuItem.label}</span>
          </div>
        );
      })}
    </nav>
  );
}

function AdminSideBar({ open, setOpen }) {
  const navigate = useNavigate();

  const Logo = () => (
    <div
      className="flex cursor-pointer items-center gap-3"
      onClick={() => navigate("/admin/dashboard")}
    >
      <div className="w-8 h-8 rounded-full border border-primary/40 flex items-center justify-center">
        <span className="text-primary font-serif text-xs font-bold tracking-tight">
          VS
        </span>
      </div>
      <div className="flex flex-col leading-none">
        <span className="font-serif text-sm text-foreground tracking-wide">
          Valeria Sarmiento
        </span>
        <span className="text-[10px] tracking-widest uppercase text-foreground/40">
          Admin
        </span>
      </div>
    </div>
  );

  return (
    <Fragment>
      {/* Mobile */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-64 bg-background">
          <div className="flex flex-col h-full">
            <SheetHeader className="border-b border-border/40 pb-4">
              <SheetTitle asChild>
                <Logo />
              </SheetTitle>
            </SheetHeader>
            <MenuItems setOpen={setOpen} />
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop */}
      <aside className="hidden w-64 flex-col border-r border-border/40 bg-background p-5 lg:flex">
        <Logo />
        <MenuItems />
        <div className="mt-auto pt-6 border-t border-border/30">
          <p className="text-xs text-foreground/30 font-sans tracking-widest uppercase">
            Panel de administración
          </p>
        </div>
      </aside>
    </Fragment>
  );
}

export default AdminSideBar;
