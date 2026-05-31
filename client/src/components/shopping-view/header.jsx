import { LogOut, Menu, ShoppingCart, UserCog, Search, X } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Sheet, SheetContent } from "../ui/sheet";
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
  { id: "reflections", label: "Reflexiones", path: "/shop/reflections" },
  { id: "sobre-mi", label: "Sobre mí", path: "/shop/sobre-mi" },
  { id: "contacto", label: "Contacto", path: "/shop/contacto" },
  { id: "cursos", label: "Cursos", path: "/shop/cursos" },
];

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
    if (user?.id) dispatch(fetchCartItems(user?.id));
  }, [dispatch, user]);

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          onClick={() => navigate("/auth/login")}
          className="text-xs tracking-widest uppercase text-foreground/60 hover:text-primary font-sans"
        >
          Iniciá sesión
        </Button>
        <Button
          onClick={() => navigate("/auth/register")}
          className="text-xs tracking-widest uppercase bg-primary hover:bg-primary/90 text-primary-foreground px-4 font-sans"
        >
          Creá tu cuenta
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
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
  const [openMobileMenu, setOpenMobileMenu] = useState(false);
  const [openCartSheet, setOpenCartSheet] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [, setSearchParams] = useSearchParams();

  function handleNavigate(item) {
    if (item.id === "products") sessionStorage.removeItem("filters");
    navigate(item.path);
    setOpenMobileMenu(false);
  }

  function handleLogout() {
    dispatch(logoutUser()).then(() => {
      navigate("/auth/login", { replace: true });
    });
  }

  function handleSearch(e) {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/shop/search?keyword=${encodeURIComponent(searchQuery)}`);
    setSearchQuery("");
    setOpenSearch(false);
    setOpenMobileMenu(false);
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/50 bg-background/95 backdrop-blur-sm">
      {/* Barra de búsqueda expandida */}
      {openSearch && (
        <div className="fixed inset-x-0 top-0 z-50 h-14 bg-background border-b border-border/50 flex items-center px-4 md:px-8">
          <form
            onSubmit={handleSearch}
            className="flex items-center gap-3 w-full max-w-2xl mx-auto"
          >
            <Search className="w-4 h-4 text-primary/60 flex-shrink-0" />
            <input
              autoFocus
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar libros, temas..."
              className="flex-1 bg-transparent border-none outline-none text-sm font-sans text-foreground placeholder:text-foreground/40"
            />
            <button
              type="button"
              onClick={() => {
                setOpenSearch(false);
                setSearchQuery("");
              }}
            >
              <X className="w-4 h-4 text-foreground/40 hover:text-foreground" />
            </button>
          </form>
        </div>
      )}

      <div className="flex h-14 items-center justify-between px-4 md:px-8 max-w-6xl mx-auto">
        {/* Logo */}
        <Link to="/shop/home" className="flex items-center group flex-shrink-0">
          <img
            src={logo}
            alt="Valeria Sarmiento"
            className="h-10 w-auto opacity-90 group-hover:opacity-100 transition-opacity"
          />
        </Link>

        {/* Mobile — búsqueda + carrito + hamburguesa */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={() => setOpenSearch(true)}
            className="w-8 h-8 flex items-center justify-center border border-border/50 rounded-lg hover:bg-primary/5 transition-colors"
          >
            <Search className="w-4 h-4 text-foreground/50" />
          </button>

          {user && (
            <Sheet
              open={openCartSheet}
              onOpenChange={() => setOpenCartSheet(false)}
            >
              <Button
                onClick={() => setOpenCartSheet(true)}
                variant="outline"
                size="icon"
                className="relative border-primary/30 hover:bg-primary/10 w-8 h-8"
              >
                <ShoppingCart className="w-4 h-4 text-primary" />
                {cartItems?.items?.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {cartItems.items.length}
                  </span>
                )}
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
          )}

          <Button
            variant="outline"
            size="icon"
            className="border-primary/30 w-8 h-8"
            onClick={() => setOpenMobileMenu(true)}
          >
            <Menu className="h-4 w-4 text-primary" />
          </Button>
        </div>

        {/* Mobile sheet */}
        <Sheet open={openMobileMenu} onOpenChange={setOpenMobileMenu}>
          <SheetContent side="left" className="w-72 bg-background p-0">
            <div className="flex flex-col h-full pt-10">
              {user ? (
                <div className="flex items-center gap-3 px-5 py-4 border-b border-border/30">
                  <Avatar className="w-9 h-9 border border-primary/30">
                    <AvatarFallback className="bg-primary text-primary-foreground font-semibold text-sm">
                      {user?.userName[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-foreground font-sans">
                      {user?.userName}
                    </p>
                    <p className="text-xs text-foreground/40 font-sans">
                      {user?.email}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-2 px-5 py-4 border-b border-border/30">
                  <Button
                    onClick={() => {
                      navigate("/auth/login");
                      setOpenMobileMenu(false);
                    }}
                    variant="outline"
                    className="w-full text-xs tracking-widest uppercase border-primary/30 text-foreground/60"
                  >
                    Iniciá sesión
                  </Button>
                  <Button
                    onClick={() => {
                      navigate("/auth/register");
                      setOpenMobileMenu(false);
                    }}
                    className="w-full text-xs tracking-widest uppercase bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    Creá tu cuenta
                  </Button>
                </div>
              )}

              <nav className="flex flex-col px-5 py-4 gap-1 flex-1">
                {mainMenuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleNavigate(item)}
                    className="text-left text-sm tracking-widest uppercase font-sans text-foreground/60 hover:text-primary hover:bg-primary/5 rounded-lg px-3 py-2.5 transition-colors"
                  >
                    {item.label}
                  </button>
                ))}
              </nav>

              {user && (
                <div className="flex flex-col px-5 py-4 gap-2 border-t border-border/30">
                  <button
                    onClick={() => {
                      navigate("/shop/account");
                      setOpenMobileMenu(false);
                    }}
                    className="flex items-center gap-3 text-sm font-sans text-foreground/60 hover:text-primary hover:bg-primary/5 rounded-lg px-3 py-2.5 transition-colors"
                  >
                    <UserCog className="w-4 h-4" />
                    Mi cuenta
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 text-sm font-sans text-destructive/70 hover:text-destructive hover:bg-destructive/5 rounded-lg px-3 py-2.5 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>

        {/* Desktop nav */}
        <div className="hidden lg:block">
          <nav className="flex items-center gap-5">
            {mainMenuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigate(item)}
                className="text-xs tracking-widest uppercase cursor-pointer text-foreground/60 hover:text-primary transition-colors duration-200 font-sans"
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Desktop right — búsqueda + cuenta/carrito */}
        <div className="hidden lg:flex items-center gap-3">
          <button
            onClick={() => setOpenSearch(true)}
            className="w-8 h-8 flex items-center justify-center border border-border/50 rounded-lg hover:bg-primary/5 hover:border-primary/30 transition-colors"
          >
            <Search className="w-4 h-4 text-foreground/50" />
          </button>
          <HeaderRightContent />
        </div>
      </div>
    </header>
  );
}

export default ShoppingHeader;
