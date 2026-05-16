// cart-items-content.jsx
import { Minus, Plus, Trash2, BookOpen, Download } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { deleteCartItem, updateCartQuantity } from "@/store/shop/cart-slice";

function UserCartItemsContent({ cartItem }) {
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { productList } = useSelector((state) => state.shopProducts);
  const dispatch = useDispatch();

  const isEbook = cartItem?.type === "ebook";

  function handleUpdateQuantity(getCartItem, typeOfAction) {
    if (typeOfAction === "plus") {
      let getCartItems = cartItems.items || [];

      if (getCartItems.length) {
        const indexOfCurrentCartItem = getCartItems.findIndex(
          (item) => item.productId === getCartItem?.productId,
        );
        const getCurrentProductIndex = productList.findIndex(
          (product) => product._id === getCartItem?.productId,
        );
        const getTotalStock = productList[getCurrentProductIndex]?.totalStock;

        if (indexOfCurrentCartItem > -1) {
          const getQuantity = getCartItems[indexOfCurrentCartItem].quantity;
          if (getQuantity + 1 > getTotalStock) return;
        }
      }
    }

    dispatch(
      updateCartQuantity({
        userId: user?.id,
        productId: getCartItem?.productId,
        quantity:
          typeOfAction === "plus"
            ? getCartItem?.quantity + 1
            : getCartItem?.quantity - 1,
      }),
    );
  }

  function handleCartItemDelete(getCartItem) {
    dispatch(
      deleteCartItem({ userId: user?.id, productId: getCartItem?.productId }),
    );
  }

  return (
    <div className="flex items-start gap-3 py-3 border-b border-border/30 last:border-0">
      <div className="relative flex-shrink-0">
        <img
          src={cartItem?.image}
          alt={cartItem?.title}
          className="w-16 h-16 rounded-lg object-cover border border-border/30"
        />
        <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-0.5 border border-border/30">
          {isEbook ? (
            <Download className="w-3 h-3 text-primary" />
          ) : (
            <BookOpen className="w-3 h-3 text-primary" />
          )}
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-serif text-sm font-semibold text-foreground leading-snug truncate">
          {cartItem?.title}
        </h3>
        {cartItem?.author && (
          <p className="text-xs text-foreground/40 font-sans mt-0.5">
            {cartItem.author}
          </p>
        )}

        {!isEbook && (
          <div className="flex items-center gap-2 mt-2">
            <Button
              variant="outline"
              className="h-6 w-6 rounded-full p-0 border-border/40 hover:border-primary/40"
              size="icon"
              disabled={cartItem?.quantity === 1}
              onClick={() => handleUpdateQuantity(cartItem, "minus")}
            >
              <Minus className="w-3 h-3" />
            </Button>
            <span className="text-sm font-medium font-sans w-4 text-center">
              {cartItem?.quantity}
            </span>
            <Button
              variant="outline"
              className="h-6 w-6 rounded-full p-0 border-border/40 hover:border-primary/40"
              size="icon"
              onClick={() => handleUpdateQuantity(cartItem, "plus")}
            >
              <Plus className="w-3 h-3" />
            </Button>
          </div>
        )}

        {isEbook && (
          <span className="text-xs text-foreground/40 font-sans mt-1 block">
            Descarga inmediata
          </span>
        )}
      </div>

      <div className="flex flex-col items-end gap-2 flex-shrink-0">
        <p className="text-sm font-bold font-sans text-primary">
          $
          {(
            (cartItem?.salePrice > 0 ? cartItem?.salePrice : cartItem?.price) *
            cartItem?.quantity
          ).toFixed(2)}
        </p>
        <button
          onClick={() => handleCartItemDelete(cartItem)}
          className="text-foreground/30 hover:text-destructive transition-colors"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
}

export default UserCartItemsContent;
