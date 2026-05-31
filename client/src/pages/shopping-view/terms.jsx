function TermsPage() {
  const sections = [
    {
      title: "1. Aceptación de los términos",
      content:
        "Al acceder y utilizar este sitio web, aceptás cumplir y estar sujeto a estos Términos y Condiciones. Si no estás de acuerdo con alguna parte de estos términos, no podés acceder al servicio.",
    },
    {
      title: "2. Productos y servicios",
      content:
        "Ofrecemos libros físicos y ebooks sobre mindfulness y bienestar. Los precios están expresados en pesos argentinos (ARS) e incluyen IVA. Nos reservamos el derecho de modificar precios en cualquier momento.",
    },
    {
      title: "3. Compras y pagos",
      content:
        "Los pagos se procesan a través de MercadoPago. Al realizar una compra, garantizás que la información de pago proporcionada es verídica y que estás autorizado a utilizar el método de pago seleccionado.",
    },
    {
      title: "4. Entrega de productos digitales",
      content:
        "Los ebooks están disponibles para descarga inmediata tras la confirmación del pago. El link de descarga es personal e intransferible. Queda prohibida la distribución, reproducción o comercialización del contenido.",
    },
    {
      title: "5. Envíos de libros físicos",
      content:
        "Los envíos se realizan a través de correo argentino u otros servicios de mensajería. Los tiempos de entrega varían según la zona. El costo de envío se calcula al momento del checkout.",
    },
    {
      title: "6. Propiedad intelectual",
      content:
        "Todo el contenido de este sitio — incluyendo textos, imágenes, diseños y productos — es propiedad de Valeria Sarmiento y está protegido por las leyes de propiedad intelectual vigentes.",
    },
    {
      title: "7. Modificaciones",
      content:
        "Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios entrarán en vigencia inmediatamente después de su publicación en el sitio.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <div className="bg-primary/5 border-b border-border/40 py-10 text-center">
        <h1 className="font-serif text-3xl text-foreground tracking-wide">
          Términos y condiciones
        </h1>
        <p className="text-sm text-foreground/50 font-sans mt-2 tracking-widest uppercase">
          Última actualización: {new Date().getFullYear()}
        </p>
      </div>
      <div className="max-w-3xl mx-auto px-4 py-12 flex flex-col gap-8">
        {sections.map((section) => (
          <div key={section.title} className="flex flex-col gap-2">
            <h2 className="font-serif text-lg text-foreground tracking-wide">
              {section.title}
            </h2>
            <p className="text-foreground/65 font-sans text-sm leading-relaxed">
              {section.content}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TermsPage;
