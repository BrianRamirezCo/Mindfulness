import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { API_URL } from "@/lib/api";
import { Button } from "@/components/ui/button";

function VerifyEmail() {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const email = searchParams.get("email");

  function handleChange(value, index) {
    if (!/^\d*$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    if (value && index < 5) {
      document.getElementById(`code-${index + 1}`)?.focus();
    }
  }

  function handleKeyDown(e, index) {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      document.getElementById(`code-${index - 1}`)?.focus();
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    const fullCode = code.join("");
    if (fullCode.length < 6) {
      setError("Ingresá el código completo");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/auth/verify-email`, {
        email,
        code: fullCode,
      });
      if (response.data?.success) {
        navigate("/auth/login");
      } else {
        setError(response.data?.message || "Código inválido");
      }
    } catch {
      setError("Hubo un error. Intentá de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    setResendLoading(true);
    setResendSuccess(false);
    setError("");
    try {
      const response = await axios.post(
        `${API_URL}/api/auth/resend-verification`,
        { email },
      );
      if (response.data?.success) setResendSuccess(true);
    } catch {
      setError("No se pudo reenviar el código.");
    } finally {
      setResendLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <h1 className="font-serif text-3xl text-foreground tracking-wide">
          Verificá tu cuenta
        </h1>
        <p className="text-sm text-foreground/50 font-sans">
          Ingresá el código de 6 dígitos que enviamos a
        </p>
        <p className="text-sm text-primary font-sans font-medium">{email}</p>
      </div>

      {error && (
        <p className="text-sm text-destructive font-sans text-center bg-destructive/5 border border-destructive/20 rounded-lg py-2 px-4">
          {error}
        </p>
      )}

      {resendSuccess && (
        <p className="text-sm text-foreground font-sans text-center bg-secondary/20 border border-secondary/30 rounded-lg py-2 px-4">
          Código reenviado correctamente
        </p>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="flex justify-center gap-2">
          {code.map((digit, index) => (
            <input
              key={index}
              id={`code-${index}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-11 h-14 text-center text-xl font-bold border border-border/50 rounded-lg bg-background focus:outline-none focus:border-primary/60 text-foreground font-sans"
            />
          ))}
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground tracking-widest uppercase text-sm"
        >
          {loading ? "Verificando..." : "Verificar cuenta"}
        </Button>
      </form>

      <div className="text-center">
        <p className="text-sm text-foreground/50 font-sans">
          ¿No recibiste el código?{" "}
          <button
            onClick={handleResend}
            disabled={resendLoading}
            className="text-primary hover:underline font-medium"
          >
            {resendLoading ? "Enviando..." : "Reenviar"}
          </button>
        </p>
      </div>
    </div>
  );
}

export default VerifyEmail;
