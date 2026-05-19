import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { API_URL } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  async function onSubmit(e) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/api/auth/reset-password`, {
        token,
        password,
      });
      if (response.data?.success) {
        navigate("/auth/login");
      } else {
        setError(response.data?.message || "Hubo un error, intentá de nuevo.");
      }
    } catch (e) {
      setError("Hubo un error, intentá de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <div className="text-center space-y-4">
        <h1 className="font-serif text-2xl text-foreground tracking-wide">
          Link inválido
        </h1>
        <p className="text-sm text-foreground/50 font-sans">
          El link de recuperación no es válido o expiró.
        </p>
        <a
          href="/auth/forgot-password"
          className="text-primary hover:underline text-sm font-sans"
        >
          Solicitar uno nuevo
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <h1 className="font-serif text-3xl text-foreground tracking-wide">
          Nueva contraseña
        </h1>
        <p className="text-sm text-foreground/50 font-sans">
          Ingresá tu nueva contraseña
        </p>
      </div>

      {error && (
        <p className="text-sm text-destructive font-sans text-center bg-destructive/5 border border-destructive/20 rounded-lg py-2 px-4">
          {error}
        </p>
      )}

      <form onSubmit={onSubmit} className="flex flex-col gap-3">
        <div className="grid gap-1.5">
          <Label className="text-sm text-foreground/70 font-sans">
            Nueva contraseña
          </Label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Ingresá tu nueva contraseña"
            required
            className="border-border/50 focus:border-primary/50 font-sans text-sm"
          />
        </div>
        <div className="grid gap-1.5">
          <Label className="text-sm text-foreground/70 font-sans">
            Confirmar contraseña
          </Label>
          <Input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repetí tu nueva contraseña"
            required
            className="border-border/50 focus:border-primary/50 font-sans text-sm"
          />
        </div>
        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground tracking-widest uppercase text-sm mt-2"
        >
          {loading ? "Guardando..." : "Guardar contraseña"}
        </Button>
      </form>
    </div>
  );
}

export default ResetPassword;
