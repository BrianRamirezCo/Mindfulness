function ReturnsPage() {
  const sections = [
    {
      title: "Libros físicos",
      content:
        "Aceptamos devoluciones dentro de los 30 días posteriores a la recepción del producto, siempre que el libro esté en perfectas condiciones, sin uso y en su embalaje original. El costo de envío de devolución corre por cuenta del comprador.",
    },
    {
      title: "Ebooks",
      content:
        "Dado que los productos digitales son de entrega inmediata, no aceptamos devoluciones de ebooks una vez descargados. Si tuviste un problema técnico con la descarga, contactanos y lo solucionamos.",
    },
    {
      title: "Productos dañados o incorrectos",
      content:
        "Si recibiste un producto dañado o diferente al pedido, contactanos dentro de los 7 días de recibido con fotos del problema y lo resolvemos sin costo adicional.",
    },
    {
      title: "Proceso de devolución",
      content:
        "Para iniciar una devolución, escribinos a contacto@valeriasarmiento.com con tu número de pedido y el motivo. Te responderemos dentro de las 48 horas hábiles con las instrucciones para proceder.",
    },
    {
      title: "Reembolsos",
      content:
        "Una vez aprobada la devolución, el reembolso se procesa a través del mismo medio de pago utilizado en la compra, dentro de los 10 días hábiles.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <div className="bg-primary/5 border-b border-border/40 py-10 text-center">
        <h1 className="font-serif text-3xl text-foreground tracking-wide">
          Política de devoluciones
        </h1>
        <p className="text-sm text-foreground/50 font-sans mt-2 tracking-widest uppercase">
          Cambios y devoluciones
        </p>
      </div>
      <div className="max-w-3xl mx-auto px-4 py-12 flex flex-col gap-8">
        {sections.map((section) => (
          <div
            key={section.title}
            className="border border-border/40 rounded-xl p-6 flex flex-col gap-2"
          >
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

export default ReturnsPage;
