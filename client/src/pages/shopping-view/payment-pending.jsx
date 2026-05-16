// payment-pending.jsx
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Clock } from "lucide-react";

function PaymentPendingPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Clock className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-serif text-3xl text-foreground tracking-wide">
            Pago pendiente
          </h1>
          <p className="text-foreground/60 font-sans text-sm leading-relaxed">
            Tu pago está siendo procesado. Te notificaremos cuando se confirme.
          </p>
        </div>

        <div className="bg-primary/5 border border-border/40 rounded-xl p-4">
          <p className="text-sm font-sans text-foreground/60 leading-relaxed">
            Esto puede tardar unos minutos. Podés revisar el estado de tu pedido
            en "Mis pedidos".
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Button
            onClick={() => navigate("/shop/account")}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground tracking-widest uppercase text-sm"
          >
            Ver mis pedidos
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

export default PaymentPendingPage;
