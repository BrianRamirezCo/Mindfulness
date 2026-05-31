import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { subscribeNewsletter } from "@/store/reflection-slice";
import { BookOpen, Headphones, Video, Sparkles } from "lucide-react";

function CoursesPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const data = await dispatch(subscribeNewsletter(email));
    if (data?.payload?.success) {
      setStatus("success");
      setEmail("");
    } else {
      setStatus("error");
    }
    setLoading(false);
  }

  const comingSoon = [
    {
      icon: Video,
      title: "Curso de Mindfulness",
      desc: "Un programa completo para incorporar la atención plena en tu vida cotidiana.",
    },
    {
      icon: Headphones,
      title: "Pack de Audios",
      desc: "10 audios guiados de 10 minutos para meditar en cualquier momento del día.",
    },
    {
      icon: BookOpen,
      title: "Programa de Bienestar",
      desc: "Un acompañamiento personalizado para transformar tu relación con el presente.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <div className="bg-primary/5 border-b border-border/40 py-12 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 mb-6">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-xs font-sans tracking-widest uppercase text-primary">
            Próximamente
          </span>
        </div>
        <h1 className="font-serif text-3xl md:text-4xl text-foreground tracking-wide mb-3">
          Cursos y programas
        </h1>
        <p className="text-sm text-foreground/50 font-sans max-w-md mx-auto leading-relaxed">
          Estamos preparando algo especial para acompañarte en tu camino hacia
          el bienestar.
        </p>
      </div>

      {/* Cards de lo que viene */}
      <section className="max-w-4xl mx-auto px-4 py-12 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {comingSoon.map((item) => (
            <div
              key={item.title}
              className="bg-card border border-border/40 rounded-xl p-6 flex flex-col gap-3 relative overflow-hidden"
            >
              <div className="absolute top-3 right-3">
                <span className="text-xs font-sans tracking-widest uppercase text-primary/40 bg-primary/5 px-2 py-1 rounded-full">
                  Próximamente
                </span>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <item.icon className="w-5 h-5 text-primary/70" />
              </div>
              <h3 className="font-serif text-lg text-foreground tracking-wide">
                {item.title}
              </h3>
              <p className="text-sm text-foreground/55 font-sans leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Form de aviso */}
        <div className="bg-primary/5 border border-border/40 rounded-xl p-8 text-center max-w-lg mx-auto">
          <h2 className="font-serif text-2xl text-foreground mb-2 tracking-wide">
            Avisame cuando esté listo
          </h2>
          <p className="text-sm text-foreground/55 font-sans mb-6 leading-relaxed">
            Dejá tu email y te escribo en cuanto lancemos el primer curso.
          </p>

          {status === "success" ? (
            <p className="text-sm text-primary font-sans bg-primary/10 border border-primary/20 rounded-lg py-3 px-4">
              ¡Listo! Te aviso cuando esté disponible.
            </p>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex gap-2 max-w-sm mx-auto"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Tu email"
                required
                className="flex-1 border border-border/50 rounded-lg px-4 py-2.5 text-sm font-sans bg-background focus:outline-none focus:border-primary/50"
              />
              <Button
                type="submit"
                disabled={loading}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-sans text-sm px-5"
              >
                {loading ? "..." : "Avisame"}
              </Button>
            </form>
          )}
          {status === "error" && (
            <p className="text-xs text-foreground/40 font-sans mt-2">
              Ya estás en la lista.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

export default CoursesPage;
