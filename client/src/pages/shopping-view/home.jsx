import { Button } from "@/components/ui/button";
import { BookOpen, Brain, Heart, Sunrise, Leaf, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllFilteredProducts } from "@/store/shop/products-slice";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { useNavigate } from "react-router-dom";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { subscribeNewsletter } from "@/store/reflection-slice";
import heroBook2 from "@/assets/hero-book2.png";
import heroGirl2 from "@/assets/hero-girl2.png";

function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null);
  const dispatch = useDispatch();

  async function handleSubscribe(e) {
    e.preventDefault();
    if (!email) return;
    const data = await dispatch(subscribeNewsletter(email));
    if (data?.payload?.success) {
      setStatus("success");
      setEmail("");
    } else {
      setStatus("error");
    }
  }

  return (
    <section className="py-12 md:py-16 bg-primary/5 border-t border-border/40">
      <div className="container mx-auto px-4 max-w-xl text-center">
        <Leaf className="w-7 h-7 text-primary mx-auto mb-4 opacity-70" />
        <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-2 tracking-wide">
          Reflexiones semanales
        </h2>
        <p className="text-foreground/55 text-sm md:text-base mb-8 leading-relaxed">
          Suscribite y recibí cada semana una reflexión de Valeria directamente
          en tu email.
        </p>
        {status === "success" ? (
          <p className="text-sm font-sans text-primary bg-primary/10 border border-primary/20 rounded-lg py-3 px-4">
            ¡Te suscribiste correctamente!
          </p>
        ) : (
          <form
            onSubmit={handleSubscribe}
            className="flex gap-2 max-w-sm mx-auto"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Tu email"
              required
              className="flex-1 border border-border/50 rounded-lg px-4 py-2.5 text-sm font-sans bg-background focus:outline-none focus:border-primary/50"
            />
            <Button
              type="submit"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-sans text-sm tracking-wide px-5"
            >
              Suscribirme
            </Button>
          </form>
        )}
        {status === "error" && (
          <p className="text-sm text-destructive font-sans mt-2">
            Ya estás suscripto con ese email.
          </p>
        )}
      </div>
    </section>
  );
}

const categoriesWithIcon = [
  { id: "meditacion", label: "Meditación", icon: Brain },
  { id: "ansiedad", label: "Ansiedad", icon: Heart },
  { id: "habitos", label: "Hábitos", icon: Sunrise },
  { id: "espiritualidad", label: "Espiritualidad", icon: Sparkles },
  { id: "bienestar", label: "Bienestar", icon: Leaf },
];

function ShoppingHome() {
  const { productList } = useSelector((state) => state.shopProducts);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function handleNavigateToListingPage(getCurrentItem, section) {
    sessionStorage.removeItem("filters");
    const currentFilter = { [section]: [getCurrentItem.id] };
    sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    navigate(`/shop/listing`);
  }

  function handleAddtoCart(getCurrentProductId) {
    if (!user) {
      navigate("/auth/login");
      return;
    }
    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      }),
    ).then((data) => {
      if (data?.payload?.success) dispatch(fetchCartItems(user?.id));
    });
  }

  useEffect(() => {
    dispatch(
      fetchAllFilteredProducts({
        filterParams: {},
        sortParams: "price-lowtohigh",
      }),
    );
  }, [dispatch]);

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#F5EFE8]">
        <div className="relative max-w-6xl mx-auto px-6 md:px-10 py-14 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 items-center md:items-center">
            {/* LEFT */}
            <div className="flex flex-col gap-6 order-2 md:order-1 z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 w-fit">
                <Leaf className="w-4 h-4 text-primary" />
                <span className="text-xs font-medium tracking-widest text-primary uppercase font-sans">
                  Nuevo libro
                </span>
              </div>

              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground leading-tight tracking-wide">
                Tu camino hacia
                <br />
                una vida <span className="text-primary italic">más plena</span>
                <span className="text-primary/30 ml-2">♡</span>
              </h1>

              <p className="text-foreground/60 font-sans text-sm md:text-base leading-relaxed max-w-md">
                Mi Diario de Prácticas Mindfulness es una guía práctica para
                cultivar calma, claridad y bienestar en tu día a día.
              </p>

              {/* Beneficios */}
              <div className="grid grid-cols-3 gap-4 mt-2">
                <div className="flex flex-col items-start gap-2">
                  <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center shadow-sm">
                    <Leaf className="w-4 h-4 text-primary" />
                  </div>
                  <p className="text-xs text-foreground/60 font-sans leading-relaxed">
                    Ejercicios simples para cada día
                  </p>
                </div>
                <div className="flex flex-col items-start gap-2">
                  <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center shadow-sm">
                    <Heart className="w-4 h-4 text-primary" />
                  </div>
                  <p className="text-xs text-foreground/60 font-sans leading-relaxed">
                    Más foco, calma y equilibrio
                  </p>
                </div>
                <div className="flex flex-col items-start gap-2">
                  <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center shadow-sm">
                    <Sparkles className="w-4 h-4 text-primary" />
                  </div>
                  <p className="text-xs text-foreground/60 font-sans leading-relaxed">
                    Ilustraciones que inspiran
                  </p>
                </div>
              </div>

              {/* CTA */}
              <div className="flex flex-wrap gap-3 mt-2 md:justify-start justify-center">
                <Button
                  onClick={() => navigate("/shop/listing")}
                  className="h-12 px-8 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground text-sm tracking-widest uppercase shadow-md"
                >
                  Comprar el libro
                </Button>
              </div>
            </div>

            {/* RIGHT */}
            <div className="relative flex items-center justify-center order-1 md:order-2 h-[260px] md:h-[500px]">
              <img
                src={heroBook2}
                alt="Libro mindfulness"
                className="relative z-20 w-[40%] md:absolute md:left-0 md:top-0 md:w-[52%] object-contain drop-shadow-2xl"
              />
              <img
                src={heroGirl2}
                alt="Meditación"
                className="relative z-10 w-[55%] md:absolute md:right-0 md:top-0 md:w-[58%] object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Sobre Valeria */}
      <section className="py-12 bg-primary/5 border-y border-border/40">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <BookOpen className="w-7 h-7 text-primary mx-auto mb-4 opacity-70" />
          <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-4 tracking-wide">
            Sobre Valeria
          </h2>
          <p className="text-foreground/65 leading-relaxed text-sm md:text-base">
            Escritora y facilitadora de mindfulness con más de una década
            acompañando personas en su camino hacia el bienestar. Sus libros son
            una invitación a pausar, respirar y reconectar con lo que realmente
            importa.
          </p>
        </div>
      </section>

      {/* Categorías */}
      <section className="py-10 md:py-14">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-2xl md:text-3xl text-center text-foreground mb-2 tracking-wide">
            Explorá por tema
          </h2>
          <p className="text-center text-foreground/50 text-xs tracking-widest uppercase mb-8">
            Encontrá lo que necesitás hoy
          </p>
          <div className="flex flex-wrap justify-center gap-3 md:gap-4">
            {categoriesWithIcon.map((categoryItem) => (
              <div
                key={categoryItem.id}
                onClick={() =>
                  handleNavigateToListingPage(categoryItem, "category")
                }
                className="cursor-pointer w-[calc(50%-6px)] sm:w-36 md:w-40 bg-card border border-border/50 rounded-xl hover:border-primary/40 hover:shadow-md transition-all duration-200"
                style={{ willChange: "transform", transform: "translateZ(0)" }}
              >
                <div className="flex flex-col items-center justify-center p-4 md:p-6 gap-2">
                  <categoryItem.icon className="w-6 h-6 md:w-8 md:h-8 text-primary/70" />
                  <span className="text-xs md:text-sm font-medium text-foreground/70 tracking-wide text-center">
                    {categoryItem.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Libros destacados */}
      <section className="py-10 md:py-14 bg-primary/5 border-t border-border/40">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-2xl md:text-3xl text-center text-foreground mb-2 tracking-wide">
            Libros destacados
          </h2>
          <p className="text-center text-foreground/50 text-xs tracking-widest uppercase mb-8">
            Los más elegidos
          </p>
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 max-w-5xl mx-auto">
            {productList && productList.length > 0
              ? productList.map((productItem) => (
                  <div key={productItem._id} className="w-full sm:w-[220px]">
                    <ShoppingProductTile
                      product={productItem}
                      handleAddtoCart={handleAddtoCart}
                    />
                  </div>
                ))
              : null}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <NewsletterSection />

      {/* CTA final */}
      <section className="py-12 md:py-16 text-center">
        <div className="container mx-auto px-4 max-w-xl">
          <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-4 tracking-wide">
            Empezá tu camino
          </h2>
          <p className="text-foreground/60 mb-8 leading-relaxed text-sm md:text-base">
            Cada libro es un paso hacia una versión más presente y consciente de
            vos misma.
          </p>
          <Button
            onClick={() => navigate("/shop/listing")}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-10 py-3 tracking-widest uppercase text-sm"
          >
            Ver todos los libros
          </Button>
        </div>
      </section>
    </div>
  );
}

export default ShoppingHome;
