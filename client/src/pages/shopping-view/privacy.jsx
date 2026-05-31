function PrivacyPage() {
  const sections = [
    {
      title: "1. Información que recopilamos",
      content:
        "Recopilamos información que nos proporcionás directamente, como nombre, email y dirección al realizar una compra o registrarte. También recopilamos datos de navegación de forma anónima para mejorar la experiencia del sitio.",
    },
    {
      title: "2. Uso de la información",
      content:
        "Utilizamos tu información para procesar pedidos, enviarte confirmaciones de compra, enviarte reflexiones y novedades si te suscribiste al newsletter, y mejorar nuestros servicios.",
    },
    {
      title: "3. Cookies",
      content:
        "Utilizamos cookies para mejorar tu experiencia de navegación. Podés configurar tu navegador para rechazar cookies, aunque esto puede afectar algunas funcionalidades del sitio.",
    },
    {
      title: "4. Compartir información",
      content:
        "No vendemos ni compartimos tu información personal con terceros, excepto con los proveedores de servicios necesarios para operar el sitio (procesamiento de pagos, envíos). Estos terceros están obligados a mantener la confidencialidad de tu información.",
    },
    {
      title: "5. Seguridad",
      content:
        "Implementamos medidas de seguridad técnicas y organizativas para proteger tu información personal contra acceso no autorizado, pérdida o alteración.",
    },
    {
      title: "6. Tus derechos",
      content:
        "Tenés derecho a acceder, rectificar o eliminar tu información personal. Para ejercer estos derechos, podés contactarnos a través del formulario de contacto o por email.",
    },
    {
      title: "7. Contacto",
      content:
        "Si tenés preguntas sobre nuestra política de privacidad, podés escribirnos a contacto@valeriasarmiento.com.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <div className="bg-primary/5 border-b border-border/40 py-10 text-center">
        <h1 className="font-serif text-3xl text-foreground tracking-wide">
          Política de privacidad
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

export default PrivacyPage;
