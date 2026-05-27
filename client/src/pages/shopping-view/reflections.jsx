import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPublishedReflections } from "@/store/reflection-slice";
import { useNavigate } from "react-router-dom";
import { Feather } from "lucide-react";

function ReflectionsPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { reflectionList, isLoading } = useSelector(
    (state) => state.reflections,
  );

  useEffect(() => {
    dispatch(getPublishedReflections());
  }, [dispatch]);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="bg-primary/5 border-b border-border/40 py-10 text-center">
        <Feather className="w-7 h-7 text-primary mx-auto mb-4 opacity-70" />
        <h1 className="font-serif text-3xl text-foreground tracking-wide">
          Reflexiones
        </h1>
        <p className="text-sm text-foreground/50 font-sans mt-2 tracking-widest uppercase">
          Pensamientos para el camino
        </p>
      </div>

      <div className="container mx-auto px-4 py-10 max-w-3xl">
        {isLoading ? (
          <div className="flex justify-center py-16">
            <p className="text-sm text-foreground/40 font-sans">Cargando...</p>
          </div>
        ) : reflectionList && reflectionList.length > 0 ? (
          <div className="flex flex-col gap-6">
            {reflectionList.map((reflection) => (
              <div
                key={reflection._id}
                onClick={() => navigate(`/shop/reflections/${reflection._id}`)}
                className="bg-card border border-border/50 rounded-xl overflow-hidden cursor-pointer hover:border-primary/40 hover:shadow-md transition-all duration-200"
              >
                {reflection.image && (
                  <img
                    src={reflection.image}
                    alt={reflection.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-5 flex flex-col gap-2">
                  <h2 className="font-serif text-xl text-foreground tracking-wide">
                    {reflection.title}
                  </h2>
                  <p className="text-sm text-foreground/55 font-sans line-clamp-3 leading-relaxed">
                    {reflection.content}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-foreground/30 font-sans">
                      {new Date(reflection.createdAt).toLocaleDateString(
                        "es-AR",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        },
                      )}
                    </p>
                    <p className="text-xs text-primary font-sans tracking-wide">
                      Leer más →
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Feather className="w-10 h-10 text-foreground/20" />
            <p className="text-sm text-foreground/40 font-sans">
              No hay reflexiones publicadas todavía
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ReflectionsPage;
