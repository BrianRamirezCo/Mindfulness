import { LogOut, Menu, ShoppingCart, UserCog } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { logoutUser } from "@/store/auth-slice";
import UserCartWrapper from "./cart-wrapper";
import { useEffect, useState } from "react";
import { fetchCartItems } from "@/store/shop/cart-slice";
import logo from "../../assets/logo.png";

const mainMenuItems = [
  { id: "home", label: "Inicio", path: "/shop/home" },
  { id: "products", label: "Libros", path: "/shop/listing" },
  { id: "sobre-mi", label: "Sobre mí", path: "/shop/home#sobre-mi" },
  { id: "contacto", label: "Contacto", path: "/shop/home#contacto" },
];

function MenuItems({ onClose }) {
  const navigate = useNavigate();
  const [, setSearchParams] = useSearchParams();

  function handleNavigate(item) {
    if (item.id === "products") {
      sessionStorage.removeItem("filters");
      navigate(item.path);
    } else {
      navigate(item.path);
    }
    onClose?.();
  }

  return (
    <nav className="flex flex-col mb-3 lg:mb-0 lg:items-center gap-5 lg:flex-row">
      {mainMenuItems.map((item) => (
        <button
          key={item.id}
          onClick={() => handleNavigate(item)}
          className="text-xs tracking-widest uppercase cursor-pointer text-foreground/60 hover:text-primary transition-colors duration-200 font-sans text-left"
        >
          {item.label}
        </button>
      ))}
    </nav>
  );
}

function HeaderRightContent() {
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const [openCartSheet, setOpenCartSheet] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function handleLogout() {
    dispatch(logoutUser()).then(() => {
      navigate("/auth/login", { replace: true });
    });
  }

  useEffect(() => {
    dispatch(fetchCartItems(user?.id));
  }, [dispatch]);

  return (
    <div className="flex lg:items-center lg:flex-row flex-col gap-3">
      <Sheet open={openCartSheet} onOpenChange={() => setOpenCartSheet(false)}>
        <Button
          onClick={() => setOpenCartSheet(true)}
          variant="outline"
          size="icon"
          className="relative border-primary/30 hover:bg-primary/10 hover:border-primary transition-colors w-8 h-8"
        >
          <ShoppingCart className="w-4 h-4 text-primary" />
          {cartItems?.items?.length > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
              {cartItems.items.length}
            </span>
          )}
          <span className="sr-only">Carrito</span>
        </Button>
        <UserCartWrapper
          setOpenCartSheet={setOpenCartSheet}
          cartItems={
            cartItems && cartItems.items && cartItems.items.length > 0
              ? cartItems.items
              : []
          }
        />
      </Sheet>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="rounded-full outline-none">
            <Avatar className="cursor-pointer border border-primary/30 hover:border-primary transition-colors w-8 h-8">
              <AvatarFallback className="bg-primary text-primary-foreground font-semibold text-xs">
                {user?.userName[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" className="w-56">
          <DropdownMenuLabel className="text-foreground/70 font-normal text-sm">
            Hola, {user?.userName}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate("/shop/account")}>
            <UserCog className="mr-2 h-4 w-4" />
            Mi cuenta
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Cerrar sesión
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function ShoppingHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/50 bg-background/95 backdrop-blur-sm">
      <div className="flex h-14 items-center justify-between px-4 md:px-8 max-w-6xl mx-auto">
        {/* Logo */}
        <Link to="/shop/home" className="flex items-center group flex-shrink-0">
          <img
            src={logo}
            alt="Valeria Sarmiento"
            className="h-10 w-auto opacity-90 group-hover:opacity-100 transition-opacity"
          />
        </Link>

        {/* Mobile menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="lg:hidden border-primary/30 w-8 h-8"
            >
              <Menu className="h-4 w-4 text-primary" />
              <span className="sr-only">Menú</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full max-w-xs bg-background">
            <div className="mt-8 flex flex-col gap-6">
              <MenuItems />
              <HeaderRightContent />
            </div>
          </SheetContent>
        </Sheet>

        {/* Desktop nav */}
        <div className="hidden lg:block">
          <MenuItems />
        </div>

        <div className="hidden lg:block">
          <HeaderRightContent />
        </div>
      </div>
    </header>
  );
}

export default ShoppingHeader;
