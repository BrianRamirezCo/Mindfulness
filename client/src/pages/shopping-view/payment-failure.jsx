// payment-failure.jsx
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { XCircle } from "lucide-react";

function PaymentFailurePage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
            <XCircle className="w-8 h-8 text-destructive" />
          </div>
          <h1 className="font-serif text-3xl text-foreground tracking-wide">
            Pago fallido
          </h1>
          <p className="text-foreground/60 font-sans text-sm leading-relaxed">
            Hubo un problema al procesar tu pago. No se realizó ningún cobro.
          </p>
        </div>

        <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-4">
          <p className="text-sm font-sans text-foreground/60 leading-relaxed">
            Podés intentarlo de nuevo o usar otro método de pago. Si el problema
            persiste contactanos.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Button
            onClick={() => navigate("/shop/checkout")}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground tracking-widest uppercase text-sm"
          >
            Intentar de nuevo
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/shop/home")}
            className="w-full border-border/40 hover:border-primary/40 text-foreground/60 font-sans tracking-wide"
          >
            Volver al inicio
          </Button>
        </div>

        <p className="text-xs text-foreground/30 font-sans">
          © {new Date().getFullYear()} Valeria Sarmiento · Todos los derechos
          reservados
        </p>
      </div>
    </div>
  );
}

export default PaymentFailurePage;
