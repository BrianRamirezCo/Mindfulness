// cart-wrapper.jsx
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import UserCartItemsContent from "./cart-items-content";
import { ShoppingBag } from "lucide-react";

function UserCartWrapper({ cartItems, setOpenCartSheet }) {
  const navigate = useNavigate();

  const totalCartAmount =
    cartItems && cartItems.length > 0
      ? cartItems.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem?.salePrice > 0
              ? currentItem?.salePrice
              : currentItem?.price) *
              currentItem?.quantity,
          0,
        )
      : 0;

  return (
    <SheetContent className="sm:max-w-md flex flex-col">
      <SheetHeader>
        <SheetTitle className="font-serif text-xl tracking-wide">
          Tu carrito
        </SheetTitle>
      </SheetHeader>

      <div className="flex-1 mt-6 overflow-auto">
        {cartItems && cartItems.length > 0 ? (
          <div className="space-y-5">
            {cartItems.map((item) => (
              <UserCartItemsContent key={item.productId} cartItem={item} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-48 gap-3">
            <ShoppingBag className="w-10 h-10 text-foreground/20" />
            <p className="text-sm text-foreground/40 font-sans tracking-wide">
              Tu carrito está vacío
            </p>
          </div>
        )}
      </div>

      {cartItems && cartItems.length > 0 && (
        <div className="mt-6 pt-4 border-t border-border/50 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-foreground/60 font-sans tracking-wide uppercase">
              Total
            </span>
            <span className="text-xl font-bold font-sans text-primary">
              ${totalCartAmount.toFixed(2)}
            </span>
          </div>
          <Button
            onClick={() => {
              navigate("/shop/checkout");
              setOpenCartSheet(false);
            }}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground tracking-widest uppercase text-sm"
          >
            Finalizar compra
          </Button>
        </div>
      )}
    </SheetContent>
  );
}

export default UserCartWrapper;
