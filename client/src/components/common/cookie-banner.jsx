import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Cookie } from "lucide-react";

function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem("cookiesAccepted");
    if (!accepted) setVisible(true);
  }, []);

  function handleAccept() {
    localStorage.setItem("cookiesAccepted", "true");
    setVisible(false);
  }

  function handleReject() {
    localStorage.setItem("cookiesAccepted", "false");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6">
      <div className="max-w-3xl mx-auto bg-background border border-border/50 rounded-xl shadow-lg p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex items-start gap-3 flex-1">
          <Cookie className="w-5 h-5 text-primary/60 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-foreground/60 font-sans leading-relaxed">
            Usamos cookies para mejorar tu experiencia. Al continuar navegando
            aceptás nuestra{" "}
            <Link
              to="/shop/privacidad"
              className="text-primary hover:underline"
            >
              Política de privacidad
            </Link>
            .
          </p>
        </div>
        <div className="flex gap-2 flex-shrink-0 w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={handleReject}
            className="flex-1 sm:flex-none border-border/40 text-foreground/50 hover:text-foreground font-sans text-xs tracking-wide"
          >
            Rechazar
          </Button>
          <Button
            size="sm"
            onClick={handleAccept}
            className="flex-1 sm:flex-none bg-primary hover:bg-primary/90 text-primary-foreground font-sans text-xs tracking-widest uppercase"
          >
            Aceptar
          </Button>
        </div>
      </div>
    </div>
  );
}

export default CookieBanner;
