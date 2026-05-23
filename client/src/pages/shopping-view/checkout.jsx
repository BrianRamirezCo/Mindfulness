import Address from "@/components/shopping-view/address";
import { useDispatch, useSelector } from "react-redux";
import UserCartItemsContent from "@/components/shopping-view/cart-items-content";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { createNewOrder } from "@/store/shop/order-slice";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";

function ShoppingCheckout() {
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const { isLoading } = useSelector((state) => state.shopOrder);
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const [isPaymentStart, setIsPaymentStart] = useState(false);
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();

  const totalCartAmount =
    cartItems && cartItems.items && cartItems.items.length > 0
      ? cartItems.items.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem?.salePrice > 0
              ? currentItem?.salePrice
              : currentItem?.price) *
              currentItem?.quantity,
          0,
        )
      : 0;

  const hasOnlyEbooks = cartItems?.items?.every(
    (item) => item?.type === "ebook",
  );

  function handleInitiatePayment() {
    const newErrors = {};

    if (!cartItems?.items || cartItems.items.length === 0) {
      newErrors.cart = "Tu carrito está vacío";
    }

    if (!hasOnlyEbooks && currentSelectedAddress === null) {
      newErrors.address = "Seleccioná una dirección para continuar";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    const orderData = {
      userId: user?.id,
      cartId: cartItems?._id,
      cartItems: cartItems.items.map((singleCartItem) => ({
        productId: singleCartItem?.productId,
        title: singleCartItem?.title,
        image: singleCartItem?.image,
        type: singleCartItem?.type,
        price:
          singleCartItem?.salePrice > 0
            ? singleCartItem?.salePrice
            : singleCartItem?.price,
        quantity: singleCartItem?.quantity,
      })),
      addressInfo: hasOnlyEbooks
        ? null
        : {
            addressId: currentSelectedAddress?._id,
            address: currentSelectedAddress?.address,
            city: currentSelectedAddress?.city,
            pincode: currentSelectedAddress?.pincode,
            phone: currentSelectedAddress?.phone,
            notes: currentSelectedAddress?.notes,
          },
      orderStatus: "pending",
      paymentMethod: "mercadopago",
      paymentStatus: "pending",
      totalAmount: totalCartAmount,
      orderDate: new Date(),
      orderUpdateDate: new Date(),
      paymentId: "",
      payerId: "",
    };
    console.log("cartItems.items:", JSON.stringify(cartItems?.items));
    console.log("orderData cartItems:", JSON.stringify(orderData.cartItems));

    dispatch(createNewOrder(orderData)).then((data) => {
      if (data?.payload?.success) {
        setIsPaymentStart(true);
        window.location.href = data.payload.approvalURL;
      } else {
        setIsPaymentStart(false);
        setErrors({
          payment: "Hubo un error al iniciar el pago. Intentá de nuevo.",
        });
      }
    });
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="bg-primary/5 border-b border-border/40 py-10 text-center">
        <h1 className="font-serif text-3xl text-foreground tracking-wide">
          Finalizar compra
        </h1>
        <p className="text-sm text-foreground/50 font-sans mt-2 tracking-widest uppercase">
          Estás a un paso
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 p-6 max-w-5xl mx-auto w-full">
        {/* Dirección — solo si hay físicos */}
        {!hasOnlyEbooks && (
          <div className="flex flex-col gap-3">
            <h2 className="font-serif text-xl text-foreground tracking-wide">
              Dirección de envío
            </h2>
            <Address
              selectedId={currentSelectedAddress}
              setCurrentSelectedAddress={setCurrentSelectedAddress}
            />
            {errors.address && (
              <p className="text-sm text-destructive font-sans mt-1">
                {errors.address}
              </p>
            )}
          </div>
        )}

        {/* Resumen */}
        <div
          className={`flex flex-col gap-4 ${hasOnlyEbooks ? "sm:col-span-2 max-w-lg mx-auto w-full" : ""}`}
        >
          <h2 className="font-serif text-xl text-foreground tracking-wide">
            Resumen del pedido
          </h2>

          <div className="bg-card border border-border/40 rounded-xl p-4 flex flex-col gap-1">
            {cartItems && cartItems.items && cartItems.items.length > 0
              ? cartItems.items.map((item) => (
                  <UserCartItemsContent key={item.productId} cartItem={item} />
                ))
              : null}
          </div>

          {errors.cart && (
            <p className="text-sm text-destructive font-sans">{errors.cart}</p>
          )}

          <Separator className="bg-border/40" />

          <div className="flex justify-between items-center">
            <span className="text-sm text-foreground/60 font-sans tracking-widest uppercase">
              Total
            </span>
            <span className="text-2xl font-bold font-sans text-primary">
              ${totalCartAmount.toFixed(2)}
            </span>
          </div>

          {hasOnlyEbooks && (
            <p className="text-xs text-foreground/40 font-sans text-center">
              Ebooks — acceso inmediato tras el pago
            </p>
          )}

          {errors.payment && (
            <p className="text-sm text-destructive font-sans text-center">
              {errors.payment}
            </p>
          )}

          <Button
            onClick={handleInitiatePayment}
            disabled={isLoading || isPaymentStart}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground tracking-widest uppercase text-sm mt-2"
          >
            {isPaymentStart || isLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Redirigiendo a MercadoPago...
              </span>
            ) : (
              "Pagar con MercadoPago"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ShoppingCheckout;
