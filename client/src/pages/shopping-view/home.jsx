import { Button } from "@/components/ui/button";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  BookOpen,
  Brain,
  Heart,
  Sunrise,
  Leaf,
  Sparkles,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllFilteredProducts } from "@/store/shop/products-slice";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { useNavigate } from "react-router-dom";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { getFeatureImages } from "@/store/common-slice";

const categoriesWithIcon = [
  { id: "meditacion", label: "Meditación", icon: Brain },
  { id: "ansiedad", label: "Ansiedad", icon: Heart },
  { id: "habitos", label: "Hábitos", icon: Sunrise },
  { id: "espiritualidad", label: "Espiritualidad", icon: Sparkles },
  { id: "bienestar", label: "Bienestar", icon: Leaf },
];

function ShoppingHome() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { productList } = useSelector((state) => state.shopProducts);
  const { featureImageList } = useSelector((state) => state.commonFeature);
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
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
      }
    });
  }

  useEffect(() => {
    if (!featureImageList || featureImageList.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featureImageList.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [featureImageList]);

  useEffect(() => {
    dispatch(
      fetchAllFilteredProducts({
        filterParams: {},
        sortParams: "price-lowtohigh",
      }),
    );
  }, [dispatch]);

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      {" "}
      {/* ← CAMBIO 1 */}
      {/* Hero / Banner */}
      <div
        className="relative w-full overflow-hidden"
        style={{ height: "clamp(220px, 50vw, 500px)" }}
      >
        {featureImageList && featureImageList.length > 0 ? (
          <>
            {featureImageList.map((slide, index) => (
              <img
                src={slide?.image}
                key={index}
                className={`${
                  index === currentSlide ? "opacity-100" : "opacity-0"
                } absolute top-0 left-0 w-full max-w-full h-full object-cover object-center transition-opacity duration-1000`} // ← CAMBIO 2
              />
            ))}
            {featureImageList.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {featureImageList.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentSlide(i)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      i === currentSlide
                        ? "bg-background w-4"
                        : "bg-background/50 w-2"
                    }`}
                  />
                ))}
              </div>
            )}
            <Button
              variant="outline"
              size="icon"
              onClick={() =>
                setCurrentSlide(
                  (prev) =>
                    (prev - 1 + featureImageList.length) %
                    featureImageList.length,
                )
              }
              className="absolute top-1/2 left-3 md:left-6 transform -translate-y-1/2 bg-background/80 border-primary/30 hover:bg-primary/10 w-8 h-8 md:w-10 md:h-10"
            >
              <ChevronLeftIcon className="w-3 h-3 md:w-4 md:h-4 text-primary" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() =>
                setCurrentSlide((prev) => (prev + 1) % featureImageList.length)
              }
              className="absolute top-1/2 right-3 md:right-6 transform -translate-y-1/2 bg-background/80 border-primary/30 hover:bg-primary/10 w-8 h-8 md:w-10 md:h-10"
            >
              <ChevronRightIcon className="w-3 h-3 md:w-4 md:h-4 text-primary" />
            </Button>
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-background via-primary/10 to-secondary/20 flex flex-col items-center justify-center text-center px-4">
            <div className="w-16 h-16 rounded-full border border-primary/40 flex items-center justify-center mb-6">
              <span className="text-primary font-serif text-2xl font-bold">
                VS
              </span>
            </div>
            <h1 className="font-serif text-3xl md:text-5xl text-foreground mb-4 tracking-wide">
              Valeria Sarmiento
            </h1>
            <p className="text-foreground/60 text-base tracking-widest uppercase mb-6">
              Mindfulness & Bienestar
            </p>
            <p className="text-foreground/70 max-w-md text-sm md:text-base mb-8 leading-relaxed">
              Descubrí los libros que van a transformar tu relación con el
              presente.
            </p>
            <Button
              onClick={() => navigate("/shop/listing")}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 tracking-widest uppercase text-sm"
            >
              Ver libros
            </Button>
          </div>
        )}
      </div>
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
