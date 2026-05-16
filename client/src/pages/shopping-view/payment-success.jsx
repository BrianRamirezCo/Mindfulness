import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { capturePayment } from "@/store/shop/order-slice";

function PaymentSuccessPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const paymentId = searchParams.get("payment_id");
    const orderId = JSON.parse(sessionStorage.getItem("currentOrderId"));

    if (paymentId && orderId) {
      dispatch(capturePayment({ paymentId, orderId })).then(() => {
        sessionStorage.removeItem("currentOrderId");
      });
    }
  }, []);

  return (
    <Card className="p-10">
      <CardHeader className="p-0">
        <CardTitle className="text-4xl">¡Pago realizado con éxito!</CardTitle>
      </CardHeader>
      <Button className="mt-5" onClick={() => navigate("/shop/account")}>
        Ver mis órdenes
      </Button>
    </Card>
  );
}

export default PaymentSuccessPage;
