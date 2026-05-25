import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/auth-slice";
import axios from "axios";
import { API_URL } from "@/lib/api";

function GoogleSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const tempToken = searchParams.get("tempToken");

    if (!tempToken) {
      navigate("/auth/login");
      return;
    }

    axios
      .get(`${API_URL}/api/auth/google/session`, {
        headers: {
          Authorization: `Bearer ${tempToken}`,
        },
        withCredentials: true,
      })
      .then((res) => {
        if (res.data?.success) {
          dispatch(setUser(res.data.user));
          if (res.data.user.role === "admin") {
            navigate("/admin/dashboard", { replace: true });
          } else {
            navigate("/shop/home", { replace: true });
          }
        } else {
          navigate("/auth/login");
        }
      })
      .catch(() => {
        navigate("/auth/login");
      });
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-sm text-foreground/50 font-sans tracking-wide">
        Iniciando sesión con Google...
      </p>
    </div>
  );
}

export default GoogleSuccess;
