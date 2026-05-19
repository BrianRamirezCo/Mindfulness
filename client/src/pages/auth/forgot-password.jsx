import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_URL } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/api/auth/forgot-password`, {
        email,
      });
      if (response.data?.success) {
        setSuccess("Te enviamos un email con las instrucciones.");
        setEmail("");
      } else {
        setError(response.data?.message || "Hubo un error, intentá de nuevo.");
      }
    } catch (e) {
      setError("Hubo un error, intentá de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <h1 className="font-serif text-3xl text-foreground tracking-wide">
          Recuperar contraseña
        </h1>
        <p className="text-sm text-foreground/50 font-sans">
          Ingresá tu email y te enviamos un link para restablecer tu contraseña
        </p>
      </div>

      {error && (
        <p className="text-sm text-destructive font-sans text-center bg-destructive/5 border border-destructive/20 rounded-lg py-2 px-4">
          {error}
        </p>
      )}

      {success && (
        <p className="text-sm text-foreground font-sans text-center bg-secondary/20 border border-secondary/30 rounded-lg py-2 px-4">
          {success}
        </p>
      )}

      <form onSubmit={onSubmit} className="flex flex-col gap-3">
        <div className="grid gap-1.5">
          <Label className="text-sm text-foreground/70 font-sans">Email</Label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Ingresá tu email"
            required
            className="border-border/50 focus:border-primary/50 font-sans text-sm"
          />
        </div>
        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground tracking-widest uppercase text-sm mt-2"
        >
          {loading ? "Enviando..." : "Enviar link"}
        </Button>
      </form>

      <div className="text-center">
        <Link
          to="/auth/login"
          className="text-sm text-primary hover:underline font-sans"
        >
          Volver al login
        </Link>
      </div>
    </div>
  );
}

export default ForgotPassword;
