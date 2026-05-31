import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Instagram, Facebook } from "lucide-react";

function ContactPage() {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    mensaje: "",
  });
  const [sent, setSent] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="bg-primary/5 border-b border-border/40 py-10 text-center">
        <h1 className="font-serif text-3xl text-foreground tracking-wide">
          Contacto
        </h1>
        <p className="text-sm text-foreground/50 font-sans mt-2 tracking-widest uppercase">
          Escribime, con gusto te respondo
        </p>
      </div>
      <div className="max-w-4xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 gap-12 w-full">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h2 className="font-serif text-xl text-foreground tracking-wide">
              Hablemos
            </h2>
            <p className="text-sm text-foreground/60 font-sans leading-relaxed">
              Si tenés preguntas sobre mis libros, talleres o simplemente querés
              conectar, podés escribirme por acá o por redes sociales.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <a
              href="mailto:contacto@valeriasarmiento.com"
              className="flex items-center gap-3 text-sm text-foreground/60 hover:text-primary font-sans transition-colors"
            >
              <Mail className="w-4 h-4 text-primary/60" />
              contacto@valeriasarmiento.com
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-sm text-foreground/60 hover:text-primary font-sans transition-colors"
            >
              <Instagram className="w-4 h-4 text-primary/60" />
              @valeriasarmiento
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-sm text-foreground/60 hover:text-primary font-sans transition-colors"
            >
              <Facebook className="w-4 h-4 text-primary/60" />
              Valeria Sarmiento
            </a>
          </div>
        </div>
        <div>
          {sent ? (
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 text-center">
              <p className="font-serif text-lg text-foreground mb-2">
                ¡Mensaje enviado!
              </p>
              <p className="text-sm text-foreground/50 font-sans">
                Te responderé a la brevedad.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid gap-1.5">
                <Label className="text-sm text-foreground/70 font-sans">
                  Nombre
                </Label>
                <Input
                  value={formData.nombre}
                  onChange={(e) =>
                    setFormData({ ...formData, nombre: e.target.value })
                  }
                  placeholder="Tu nombre"
                  required
                  className="border-border/50 focus:border-primary/50"
                />
              </div>
              <div className="grid gap-1.5">
                <Label className="text-sm text-foreground/70 font-sans">
                  Email
                </Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="Tu email"
                  required
                  className="border-border/50 focus:border-primary/50"
                />
              </div>
              <div className="grid gap-1.5">
                <Label className="text-sm text-foreground/70 font-sans">
                  Mensaje
                </Label>
                <Textarea
                  value={formData.mensaje}
                  onChange={(e) =>
                    setFormData({ ...formData, mensaje: e.target.value })
                  }
                  placeholder="Tu mensaje..."
                  required
                  rows={5}
                  className="border-border/50 focus:border-primary/50 font-sans text-sm"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground tracking-widest uppercase text-sm"
              >
                Enviar mensaje
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default ContactPage;
