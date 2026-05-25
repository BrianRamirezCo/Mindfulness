import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { categoryOptionsMap } from "@/config";
import { Badge } from "../ui/badge";
import { BookOpen, Download } from "lucide-react";

function ShoppingProductTile({ product, handleAddtoCart }) {
  const navigate = useNavigate();
  const isEbook = product?.type === "ebook";
  const isOutOfStock = !isEbook && product?.totalStock === 0;
  const isLowStock =
    !isEbook && product?.totalStock < 10 && product?.totalStock > 0;

  return (
    <Card className="w-full max-w-sm mx-auto border-border/50 hover:border-primary/30 hover:shadow-md transition-all duration-200 cursor-pointer group">
      <div onClick={() => navigate(`/shop/product/${product?._id}`)}>
        <div className="relative overflow-hidden rounded-t-lg bg-primary/5">
          {" "}
          {/* ← fondo neutro */}
          <img
            src={product?.image}
            alt={product?.title}
            className="w-full h-[320px] object-contain group-hover:scale-105 transition-transform duration-300" // ← object-contain + altura
          />
          {/* Badges */}
          {isOutOfStock ? (
            <Badge className="absolute top-2 left-2 bg-foreground/70 hover:bg-foreground/80 text-background text-xs">
              Sin stock
            </Badge>
          ) : isLowStock ? (
            <Badge className="absolute top-2 left-2 bg-primary/80 hover:bg-primary text-primary-foreground text-xs">
              Últimos {product.totalStock}
            </Badge>
          ) : product?.salePrice > 0 ? (
            <Badge className="absolute top-2 left-2 bg-secondary hover:bg-secondary/90 text-foreground text-xs tracking-wide">
              Oferta
            </Badge>
          ) : null}
          {/* Tipo de libro */}
          <div className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
            {isEbook ? (
              <Download className="w-3 h-3 text-primary" />
            ) : (
              <BookOpen className="w-3 h-3 text-primary" />
            )}
            <span className="text-[10px] text-foreground/70 tracking-wide">
              {isEbook ? "Ebook" : "Físico"}
            </span>
          </div>
        </div>

        <CardContent className="p-4">
          <h2 className="font-serif text-lg font-semibold text-foreground mb-1 line-clamp-2 leading-snug">
            {product?.title}
          </h2>
          {product?.author && (
            <p className="text-sm text-foreground/50 mb-2">{product.author}</p>
          )}
          <span className="text-xs text-foreground/40 tracking-wide uppercase">
            {categoryOptionsMap[product?.category]}
          </span>

          <div className="flex items-center gap-3 mt-3">
            <span
              className={`text-base font-semibold ${
                product?.salePrice > 0
                  ? "line-through text-foreground/30"
                  : "text-primary"
              }`}
            >
              ${product?.price}
            </span>
            {product?.salePrice > 0 && (
              <span className="text-base font-bold text-primary">
                ${product?.salePrice}
              </span>
            )}
          </div>
        </CardContent>
      </div>

      <CardFooter className="pt-0 px-4 pb-4">
        {isOutOfStock ? (
          <Button
            disabled
            className="w-full opacity-50 cursor-not-allowed"
            variant="outline"
          >
            Sin stock
          </Button>
        ) : (
          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleAddtoCart(product?._id, product?.totalStock);
            }}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground tracking-wide"
          >
            {isEbook ? "Comprar ebook" : "Agregar al carrito"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default ShoppingProductTile;
