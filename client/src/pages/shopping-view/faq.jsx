import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "¿Cómo descargo mi ebook?",
    answer:
      "Una vez confirmado el pago, entrás a 'Mis pedidos' en tu cuenta y encontrás el botón de descarga. El link es válido por tiempo ilimitado mientras tengas tu cuenta activa.",
  },
  {
    question: "¿Qué formatos tienen los ebooks?",
    answer:
      "Los ebooks están disponibles en formato PDF, compatible con cualquier dispositivo — computadora, tablet o celular.",
  },
  {
    question: "¿Puedo comprar sin crear una cuenta?",
    answer:
      "Por el momento es necesario crear una cuenta para poder realizar compras y acceder a tus pedidos. El registro es gratuito y toma solo un minuto.",
  },
  {
    question: "¿Hacen envíos a todo el país?",
    answer:
      "Sí, realizamos envíos a todo el territorio argentino a través de correo argentino y servicios de mensajería privada.",
  },
  {
    question: "¿Cuánto tarda en llegar un libro físico?",
    answer:
      "Los tiempos de entrega varían según la zona: Capital Federal y GBA 3-5 días hábiles, Interior del país 5-10 días hábiles.",
  },
  {
    question: "¿Qué medios de pago aceptan?",
    answer:
      "Aceptamos todos los medios de pago disponibles en MercadoPago: tarjetas de crédito y débito, transferencia bancaria y efectivo a través de Rapipago y Pagofácil.",
  },
  {
    question: "¿Puedo compartir el ebook con otra persona?",
    answer:
      "Los ebooks son de uso personal e intransferible. No está permitida su reproducción, distribución o venta.",
  },
  {
    question: "¿Tienen libros en inglés?",
    answer:
      "Por el momento todos los libros están disponibles únicamente en español.",
  },
];

function FaqItem({ faq }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-border/40 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-primary/5 transition-colors"
      >
        <span className="font-sans text-sm text-foreground/80 font-medium">
          {faq.question}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-primary/60 flex-shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="px-5 pb-4 border-t border-border/30">
          <p className="text-sm text-foreground/60 font-sans leading-relaxed pt-3">
            {faq.answer}
          </p>
        </div>
      )}
    </div>
  );
}

function FaqPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="bg-primary/5 border-b border-border/40 py-10 text-center">
        <h1 className="font-serif text-3xl text-foreground tracking-wide">
          Preguntas frecuentes
        </h1>
        <p className="text-sm text-foreground/50 font-sans mt-2 tracking-widest uppercase">
          Todo lo que necesitás saber
        </p>
      </div>
      <div className="max-w-3xl mx-auto px-4 py-12 flex flex-col gap-3 w-full">
        {faqs.map((faq) => (
          <FaqItem key={faq.question} faq={faq} />
        ))}
      </div>
    </div>
  );
}

export default FaqPage;
