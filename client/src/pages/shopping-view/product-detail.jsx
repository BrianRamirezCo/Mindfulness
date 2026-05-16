import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { fetchProductDetails } from "@/store/shop/products-slice";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { getReviews, addReview } from "@/store/shop/review-slice";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import StarRatingComponent from "@/components/common/star-rating";
import { useState } from "react";
import { BookOpen, Download, ArrowLeft } from "lucide-react";

function ProductDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { productDetails } = useSelector((state) => state.shopProducts);
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { reviews } = useSelector((state) => state.shopReview);

  const [reviewMsg, setReviewMsg] = useState("");
  const [rating, setRating] = useState(0);

  const isEbook = productDetails?.type === "ebook";

  useEffect(() => {
    dispatch(fetchProductDetails(id));
  }, [id]);

  useEffect(() => {
    if (productDetails?._id) dispatch(getReviews(productDetails._id));
  }, [productDetails]);

  function handleAddToCart() {
    let getCartItems = cartItems.items || [];

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === id,
      );
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > productDetails?.totalStock) return;
      }
    }

    dispatch(
      addToCart({
        userId: user?.id,
        productId: id,
        quantity: 1,
      }),
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
      }
    });
  }

  function handleAddReview() {
    dispatch(
      addReview({
        productId: productDetails?._id,
        userId: user?.id,
        userName: user?.userName,
        reviewMessage: reviewMsg,
        reviewValue: rating,
      }),
    ).then((data) => {
      if (data?.payload?.success) {
        setRating(0);
        setReviewMsg("");
        dispatch(getReviews(productDetails?._id));
      }
    });
  }

  const averageReview =
    reviews && reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.reviewValue, 0) / reviews.length
      : 0;

  if (!productDetails) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-foreground/40 font-sans">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-8">
      {/* Volver */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-foreground/50 hover:text-primary font-sans transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Imagen */}
        <div className="relative rounded-xl overflow-hidden">
          <img
            src={productDetails?.image}
            alt={productDetails?.title}
            className="w-full object-cover rounded-xl"
            style={{ maxHeight: "500px" }}
          />
          <div className="absolute top-3 right-3 bg-background/85 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1.5">
            {isEbook ? (
              <Download className="w-3.5 h-3.5 text-primary" />
            ) : (
              <BookOpen className="w-3.5 h-3.5 text-primary" />
            )}
            <span className="text-xs text-foreground/70 tracking-wide font-sans">
              {isEbook ? "Ebook" : "Libro físico"}
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="font-serif text-3xl text-foreground tracking-wide leading-tight">
              {productDetails?.title}
            </h1>
            {productDetails?.author && (
              <p className="text-foreground/50 text-sm mt-1 font-sans">
                {productDetails.author}
              </p>
            )}
            {productDetails?.category && (
              <span className="text-xs text-foreground/40 uppercase tracking-widest font-sans mt-1 block">
                {productDetails.category}
              </span>
            )}
          </div>

          <p className="text-foreground/65 text-base leading-relaxed font-sans">
            {productDetails?.description}
          </p>

          <div className="flex items-center gap-4">
            <span
              className={`text-2xl font-bold font-sans ${
                productDetails?.salePrice > 0
                  ? "line-through text-foreground/30"
                  : "text-primary"
              }`}
            >
              ${productDetails?.price}
            </span>
            {productDetails?.salePrice > 0 && (
              <span className="text-2xl font-bold text-primary font-sans">
                ${productDetails?.salePrice}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <StarRatingComponent rating={averageReview} />
            <span className="text-sm text-foreground/40 font-sans">
              ({averageReview.toFixed(1)})
            </span>
          </div>

          {!isEbook && productDetails?.totalStock === 0 ? (
            <Button disabled variant="outline" className="w-full opacity-50">
              Sin stock
            </Button>
          ) : (
            <Button
              onClick={handleAddToCart}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground tracking-widest uppercase text-sm"
            >
              {isEbook ? "Comprar ebook" : "Agregar al carrito"}
            </Button>
          )}

          <Separator className="bg-border/40" />

          {/* Reseñas */}
          <div>
            <h2 className="font-serif text-lg text-foreground mb-4">Reseñas</h2>
            <div className="flex flex-col gap-4 max-h-64 overflow-auto pr-1">
              {reviews && reviews.length > 0 ? (
                reviews.map((reviewItem) => (
                  <div key={reviewItem._id} className="flex gap-3">
                    <Avatar className="w-8 h-8 border border-border/50">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                        {reviewItem?.userName[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-medium text-foreground font-sans">
                        {reviewItem?.userName}
                      </span>
                      <StarRatingComponent rating={reviewItem?.reviewValue} />
                      <p className="text-sm text-foreground/60 font-sans leading-relaxed">
                        {reviewItem.reviewMessage}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-foreground/40 font-sans">
                  Todavía no hay reseñas para este libro.
                </p>
              )}
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <Label className="text-sm text-foreground/70 font-sans tracking-wide">
                Escribí tu reseña
              </Label>
              <StarRatingComponent
                rating={rating}
                handleRatingChange={(r) => setRating(r)}
              />
              <Input
                value={reviewMsg}
                onChange={(e) => setReviewMsg(e.target.value)}
                placeholder="Contanos qué te pareció el libro..."
                className="border-border/50 focus:border-primary/50 font-sans text-sm"
              />
              <Button
                onClick={handleAddReview}
                disabled={reviewMsg.trim() === "" || rating === 0}
                className="bg-primary hover:bg-primary/90 text-primary-foreground tracking-wide"
              >
                Enviar reseña
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailPage;
