// auth/register.jsx
import CommonForm from "@/components/common/form";
import { registerFormControls } from "@/config";
import { registerUser } from "@/store/auth-slice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const initialState = {
  userName: "",
  email: "",
  password: "",
};

function AuthRegister() {
  const [formData, setFormData] = useState(initialState);
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function onSubmit(event) {
    event.preventDefault();
    setError("");

    dispatch(registerUser(formData)).then((data) => {
      if (data?.payload?.success) {
        navigate(
          `/auth/verify-email?email=${encodeURIComponent(formData.email)}`,
        );
      } else {
        setError(
          data?.payload?.message ||
            "Hubo un error al registrarte. Intentá de nuevo.",
        );
      }
    });
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

      {error && (
        <p className="text-sm text-destructive font-sans text-center bg-destructive/5 border border-destructive/20 rounded-lg py-2 px-4">
          {error}
        </p>
      )}

      <CommonForm
        formControls={registerFormControls}
        buttonText="Registrarse"
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
      />

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
        <div className="flex items-center justify-center gap-3">
          <div className="h-px w-16 bg-border/40" />
          <span className="text-xs text-foreground/30 font-sans tracking-widest uppercase">
            o
          </span>
          <div className="h-px w-16 bg-border/40" />
        </div>
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
