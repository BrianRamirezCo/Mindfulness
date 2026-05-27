import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { getReflectionById, addComment } from "@/store/reflection-slice";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft, Feather } from "lucide-react";

function ReflectionDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentReflection, isLoading } = useSelector(
    (state) => state.reflections,
  );
  const { user } = useSelector((state) => state.auth);
  const [commentText, setCommentText] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    dispatch(getReflectionById(id));
  }, [id]);

  function handleAddComment(e) {
    e.preventDefault();
    setError("");

    if (!user) {
      setError("Tenés que iniciar sesión para comentar");
      return;
    }

    if (!commentText.trim()) return;

    dispatch(
      addComment({
        id,
        userId: user.id,
        userName: user.userName,
        text: commentText,
      }),
    ).then(() => {
      setCommentText("");
    });
  }

  if (isLoading || !currentReflection) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-sm text-foreground/40 font-sans">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate("/shop/reflections")}
        className="flex items-center gap-2 text-sm text-foreground/50 hover:text-primary font-sans transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver a reflexiones
      </button>

      {currentReflection.image && (
        <img
          src={currentReflection.image}
          alt={currentReflection.title}
          className="w-full h-64 object-cover rounded-xl mb-8"
        />
      )}

      <div className="flex flex-col gap-4 mb-10">
        <p className="text-xs text-foreground/30 font-sans tracking-widest uppercase">
          {new Date(currentReflection.createdAt).toLocaleDateString("es-AR", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
        <h1 className="font-serif text-3xl text-foreground tracking-wide leading-snug">
          {currentReflection.title}
        </h1>
        <div className="w-10 h-px bg-primary/40" />
        <p className="text-foreground/70 font-sans text-base leading-relaxed whitespace-pre-line">
          {currentReflection.content}
        </p>
        <p className="text-sm text-foreground/40 font-sans italic mt-2">
          — Valeria Sarmiento
        </p>
      </div>

      <div className="border-t border-border/40 pt-8">
        <h2 className="font-serif text-xl text-foreground mb-6 tracking-wide">
          Comentarios ({currentReflection.comments?.length || 0})
        </h2>

        {currentReflection.comments && currentReflection.comments.length > 0 ? (
          <div className="flex flex-col gap-5 mb-8">
            {currentReflection.comments.map((comment, i) => (
              <div key={i} className="flex gap-3">
                <Avatar className="w-8 h-8 border border-border/50 flex-shrink-0">
                  <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                    {comment.userName[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-foreground font-sans">
                    {comment.userName}
                  </span>
                  <p className="text-sm text-foreground/60 font-sans leading-relaxed">
                    {comment.text}
                  </p>
                  <p className="text-xs text-foreground/30 font-sans">
                    {new Date(comment.createdAt).toLocaleDateString("es-AR")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-foreground/40 font-sans mb-8">
            Sé el primero en comentar.
          </p>
        )}

        <form onSubmit={handleAddComment} className="flex flex-col gap-3">
          <Textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder={
              user ? "Escribí tu comentario..." : "Iniciá sesión para comentar"
            }
            disabled={!user}
            rows={3}
            className="border-border/50 focus:border-primary/50 font-sans text-sm"
          />
          {error && (
            <p className="text-sm text-destructive font-sans">{error}</p>
          )}
          <Button
            type="submit"
            disabled={!user || !commentText.trim()}
            className="self-end bg-primary hover:bg-primary/90 text-primary-foreground tracking-wide"
          >
            Comentar
          </Button>
        </form>
      </div>
    </div>
  );
}

export default ReflectionDetailPage;
