import { registerUser } from "@/store/auth-slice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";

const initialState = { userName: "", email: "", password: "" };

function AuthRegister() {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function validate() {
    const newErrors = {};
    if (!formData.userName)
      newErrors.userName = "El nombre de usuario es obligatorio";
    else if (formData.userName.length < 3)
      newErrors.userName = "El nombre debe tener al menos 3 caracteres";
    if (!formData.email) newErrors.email = "El email es obligatorio";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "El email no es válido";
    if (!formData.password) newErrors.password = "La contraseña es obligatoria";
    else if (formData.password.length < 6)
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
    return newErrors;
  }

  async function onSubmit(e) {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setLoading(true);
    const data = await dispatch(registerUser(formData));
    setLoading(false);
    if (data?.payload?.success) {
      navigate(
        `/auth/verify-email?email=${encodeURIComponent(formData.email)}`,
      );
    } else {
      setErrors({
        general:
          data?.payload?.message ||
          "Hubo un error al registrarte. Intentá de nuevo.",
      });
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <h1 className="font-serif text-3xl text-foreground tracking-wide">
          Crear cuenta
        </h1>
        <p className="text-sm text-foreground/50 font-sans">
          Completá tus datos para registrarte
        </p>
      </div>

      {errors.general && (
        <p className="text-sm text-destructive font-sans text-center bg-destructive/5 border border-destructive/20 rounded-lg py-2 px-4">
          {errors.general}
        </p>
      )}

      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <div className="grid gap-1.5">
          <Label className="text-sm text-foreground/70 font-sans">
            Nombre de usuario
          </Label>
          <Input
            value={formData.userName}
            onChange={(e) =>
              setFormData({ ...formData, userName: e.target.value })
            }
            placeholder="Ingresá tu nombre de usuario"
            className={`border-border/50 focus:border-primary/50 ${errors.userName ? "border-destructive" : ""}`}
          />
          {errors.userName && (
            <p className="text-xs text-destructive font-sans">
              {errors.userName}
            </p>
          )}
        </div>

        <div className="grid gap-1.5">
          <Label className="text-sm text-foreground/70 font-sans">Email</Label>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            placeholder="Ingresá tu email"
            className={`border-border/50 focus:border-primary/50 ${errors.email ? "border-destructive" : ""}`}
          />
          {errors.email && (
            <p className="text-xs text-destructive font-sans">{errors.email}</p>
          )}
        </div>

        <div className="grid gap-1.5">
          <Label className="text-sm text-foreground/70 font-sans">
            Contraseña
          </Label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              placeholder="Mínimo 6 caracteres"
              className={`border-border/50 focus:border-primary/50 pr-10 ${errors.password ? "border-destructive" : ""}`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground/70"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-destructive font-sans">
              {errors.password}
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground tracking-widest uppercase text-sm mt-2"
        >
          {loading ? "Registrando..." : "Registrarse"}
        </Button>
      </form>

      <div className="text-center space-y-3 pt-2">
        <p className="text-sm text-foreground/50 font-sans">
          ¿Ya tenés cuenta?{" "}
          <Link
            className="text-primary hover:underline font-medium"
            to="/auth/login"
          >
            Ingresá
          </Link>
        </p>
        <p className="text-xs text-foreground/30 font-sans leading-relaxed">
          Al registrarte aceptás nuestros{" "}
          <span className="underline cursor-pointer hover:text-foreground/50">
            Términos y condiciones
          </span>{" "}
          y{" "}
          <span className="underline cursor-pointer hover:text-foreground/50">
            Política de privacidad
          </span>
        </p>
      </div>
    </div>
  );
}

export default AuthRegister;
