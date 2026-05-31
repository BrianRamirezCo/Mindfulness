function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="bg-primary/5 border-b border-border/40 py-10 text-center">
        <h1 className="font-serif text-3xl text-foreground tracking-wide">
          Sobre mí
        </h1>
        <p className="text-sm text-foreground/50 font-sans mt-2 tracking-widest uppercase">
          Mi historia y mi camino
        </p>
      </div>
      <div className="max-w-3xl mx-auto px-4 py-12 flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <h2 className="font-serif text-2xl text-foreground tracking-wide">
            Hola, soy Valeria
          </h2>
          <p className="text-foreground/65 font-sans text-base leading-relaxed">
            Soy escritora y facilitadora de mindfulness con más de una década
            acompañando personas en su camino hacia el bienestar. Mi trabajo
            nació de una búsqueda personal — la necesidad de encontrar calma en
            medio del ruido cotidiano.
          </p>
          <p className="text-foreground/65 font-sans text-base leading-relaxed">
            A través de mis libros y reflexiones, te invito a pausar, respirar y
            reconectar con lo que realmente importa. Cada página es una
            oportunidad de volver a vos misma/o.
          </p>
          <p className="text-foreground/65 font-sans text-base leading-relaxed">
            Creo profundamente en el poder de las pequeñas prácticas diarias
            para transformar la vida. No hace falta hacer grandes cambios — a
            veces basta con un momento de silencio, una respiración consciente,
            una palabra que llegue justo cuando la necesitás.
          </p>
        </div>
        <div className="border-t border-border/40 pt-8 flex flex-col gap-4">
          <h2 className="font-serif text-xl text-foreground tracking-wide">
            Mi camino
          </h2>
          <div className="flex flex-col gap-3">
            {[
              {
                year: "2010",
                text: "Comienzo mi práctica de meditación y mindfulness.",
              },
              {
                year: "2014",
                text: "Primer libro publicado sobre atención plena.",
              },
              {
                year: "2017",
                text: "Formación como facilitadora de mindfulness.",
              },
              { year: "2020", text: "Lanzamiento de mi plataforma digital." },
              { year: "2024", text: "Más de 10.000 lectores acompañados." },
            ].map((item) => (
              <div key={item.year} className="flex gap-4 items-start">
                <span className="text-xs font-sans text-primary/60 tracking-widest w-10 flex-shrink-0 mt-1">
                  {item.year}
                </span>
                <p className="text-sm text-foreground/60 font-sans leading-relaxed">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;
