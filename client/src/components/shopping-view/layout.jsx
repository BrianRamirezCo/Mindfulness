import { Outlet, Link } from "react-router-dom";
import ShoppingHeader from "./header";
import logo from "../../assets/logo.png";
import { FaInstagram, FaFacebook } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

function ShoppingFooter() {
  return (
    <footer className="border-t border-border/40 bg-background mt-auto">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2 flex flex-col gap-4">
            <img
              src={logo}
              alt="Valeria Sarmiento"
              className="w-48 h-auto opacity-90 object-contain"
            />
            <p className="text-sm text-foreground/55 font-sans leading-relaxed max-w-xs">
              Acompañando a personas en su camino hacia el bienestar y la
              conciencia plena a través de la escritura y el mindfulness.
            </p>
            <div className="flex items-center gap-3 mt-1">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full border border-border/40 flex items-center justify-center hover:border-primary/40 hover:bg-primary/5 transition-colors"
              >
                <FaInstagram size={14} className="text-foreground/50" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full border border-border/40 flex items-center justify-center hover:border-primary/40 hover:bg-primary/5 transition-colors"
              >
                <FaFacebook size={14} className="text-foreground/50" />
              </a>
              <a
                href="mailto:contacto@valeriasarmiento.com"
                className="w-8 h-8 rounded-full border border-border/40 flex items-center justify-center hover:border-primary/40 hover:bg-primary/5 transition-colors"
              >
                <MdEmail size={16} className="text-foreground/50" />
              </a>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-xs uppercase tracking-widest text-foreground/40 font-sans mb-1">
              Navegación
            </p>
            <Link
              to="/shop/home"
              className="text-sm text-foreground/55 hover:text-primary font-sans transition-colors"
            >
              Inicio
            </Link>
            <Link
              to="/shop/listing"
              className="text-sm text-foreground/55 hover:text-primary font-sans transition-colors"
            >
              Todos los libros
            </Link>
            <Link
              to="/shop/home#sobre-mi"
              className="text-sm text-foreground/55 hover:text-primary font-sans transition-colors"
            >
              Sobre mí
            </Link>
            <Link
              to="/shop/home#contacto"
              className="text-sm text-foreground/55 hover:text-primary font-sans transition-colors"
            >
              Contacto
            </Link>
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-xs uppercase tracking-widest text-foreground/40 font-sans mb-1">
              Legal
            </p>
            <Link
              to="#"
              className="text-sm text-foreground/55 hover:text-primary font-sans transition-colors"
            >
              Términos y condiciones
            </Link>
            <Link
              to="#"
              className="text-sm text-foreground/55 hover:text-primary font-sans transition-colors"
            >
              Política de privacidad
            </Link>
            <Link
              to="#"
              className="text-sm text-foreground/55 hover:text-primary font-sans transition-colors"
            >
              Política de devoluciones
            </Link>
            <Link
              to="#"
              className="text-sm text-foreground/55 hover:text-primary font-sans transition-colors"
            >
              Preguntas frecuentes
            </Link>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border/30 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-foreground/30 font-sans">
            © {new Date().getFullYear()} Valeria Sarmiento · Todos los derechos
            reservados
          </p>
          <div className="flex items-center gap-4">
            <p className="text-xs text-foreground/30 font-sans">
              Pagos procesados por MercadoPago
            </p>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-secondary/60" />
              <p className="text-xs text-foreground/30 font-sans">
                Sitio seguro
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function ShoppingLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-background overflow-x-hidden">
      <ShoppingHeader />
      <main className="flex flex-col w-full flex-1">
        <Outlet />
      </main>
      <ShoppingFooter />
    </div>
  );
}

export default ShoppingLayout;
