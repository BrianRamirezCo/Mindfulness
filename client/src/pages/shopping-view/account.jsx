import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Address from "@/components/shopping-view/address";
import ShoppingOrders from "@/components/shopping-view/orders";
import { Eye, EyeOff, Bell, User, Shield, PackageOpen } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { API_URL } from "@/lib/api";
import { setUser } from "@/store/auth-slice";
import { subscribeNewsletter } from "@/store/reflection-slice";

function ProfileTab() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [userName, setUserName] = useState(user?.userName || "");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const response = await axios.put(
        `${API_URL}/api/auth/update-profile`,
        { userName },
        { withCredentials: true },
      );
      if (response.data?.success) {
        setSuccess("Perfil actualizado correctamente.");
        dispatch(setUser(response.data.user));
      } else {
        setError(response.data?.message || "Hubo un error.");
      }
    } catch {
      setError("Hubo un error. Intentá de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md">
      <h2 className="font-serif text-xl text-foreground mb-6 tracking-wide">
        Mi perfil
      </h2>
      {error && (
        <p className="text-sm text-destructive font-sans bg-destructive/5 border border-destructive/20 rounded-lg py-2 px-4 mb-4">
          {error}
        </p>
      )}
      {success && (
        <p className="text-sm text-primary font-sans bg-primary/5 border border-primary/20 rounded-lg py-2 px-4 mb-4">
          {success}
        </p>
      )}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid gap-1.5">
          <Label className="text-sm text-foreground/70 font-sans">Email</Label>
          <Input
            value={user?.email}
            disabled
            className="border-border/50 bg-muted/30 text-foreground/50"
          />
          <p className="text-xs text-foreground/40 font-sans">
            El email no se puede cambiar por ahora.
          </p>
        </div>
        <div className="grid gap-1.5">
          <Label className="text-sm text-foreground/70 font-sans">
            Nombre de usuario
          </Label>
          <Input
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Tu nombre de usuario"
            required
            className="border-border/50 focus:border-primary/50"
          />
        </div>
        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground tracking-widest uppercase text-sm mt-2"
        >
          {loading ? "Guardando..." : "Guardar cambios"}
        </Button>
      </form>
    </div>
  );
}

function ChangePasswordTab() {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (formData.newPassword !== formData.confirmPassword) {
      setError("Las contraseñas nuevas no coinciden.");
      return;
    }
    if (formData.newPassword.length < 6) {
      setError("La nueva contraseña debe tener al menos 6 caracteres.");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(
        `${API_URL}/api/auth/change-password`,
        {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        },
        { withCredentials: true },
      );
      if (response.data?.success) {
        setSuccess("Contraseña actualizada correctamente.");
        setFormData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        setError(response.data?.message || "Hubo un error. Intentá de nuevo.");
      }
    } catch {
      setError("Hubo un error. Intentá de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md flex flex-col gap-8">
      <div>
        <h2 className="font-serif text-xl text-foreground mb-6 tracking-wide">
          Cambiar contraseña
        </h2>
        {error && (
          <p className="text-sm text-destructive font-sans bg-destructive/5 border border-destructive/20 rounded-lg py-2 px-4 mb-4">
            {error}
          </p>
        )}
        {success && (
          <p className="text-sm text-primary font-sans bg-primary/5 border border-primary/20 rounded-lg py-2 px-4 mb-4">
            {success}
          </p>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {[
            {
              label: "Contraseña actual",
              field: "currentPassword",
              show: showCurrent,
              setShow: setShowCurrent,
            },
            {
              label: "Nueva contraseña",
              field: "newPassword",
              show: showNew,
              setShow: setShowNew,
            },
            {
              label: "Confirmar nueva contraseña",
              field: "confirmPassword",
              show: showConfirm,
              setShow: setShowConfirm,
            },
          ].map(({ label, field, show, setShow }) => (
            <div key={field} className="grid gap-1.5">
              <Label className="text-sm text-foreground/70 font-sans">
                {label}
              </Label>
              <div className="relative">
                <Input
                  type={show ? "text" : "password"}
                  value={formData[field]}
                  onChange={(e) =>
                    setFormData({ ...formData, [field]: e.target.value })
                  }
                  placeholder={label}
                  required
                  className="border-border/50 focus:border-primary/50 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground/70"
                >
                  {show ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          ))}
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground tracking-widest uppercase text-sm mt-2"
          >
            {loading ? "Guardando..." : "Cambiar contraseña"}
          </Button>
        </form>
      </div>
    </div>
  );
}

function NotificationsTab() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [email, setEmail] = useState(user?.email || "");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubscribe(e) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    const data = await dispatch(subscribeNewsletter(email));
    if (data?.payload?.success) {
      setStatus("success");
    } else {
      setStatus("error");
    }
    setLoading(false);
  }

  return (
    <div className="max-w-md">
      <h2 className="font-serif text-xl text-foreground mb-2 tracking-wide">
        Notificaciones
      </h2>
      <p className="text-sm text-foreground/50 font-sans mb-6">
        Suscribite al newsletter para recibir las reflexiones de Valeria en tu
        email.
      </p>

      {status === "success" && (
        <p className="text-sm text-primary font-sans bg-primary/5 border border-primary/20 rounded-lg py-2 px-4 mb-4">
          ¡Te suscribiste correctamente!
        </p>
      )}
      {status === "error" && (
        <p className="text-sm text-foreground/60 font-sans bg-secondary/10 border border-secondary/20 rounded-lg py-2 px-4 mb-4">
          Ya estás suscripto con ese email.
        </p>
      )}

      <form onSubmit={handleSubscribe} className="flex flex-col gap-4">
        <div className="grid gap-1.5">
          <Label className="text-sm text-foreground/70 font-sans">Email</Label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border-border/50 focus:border-primary/50"
          />
        </div>
        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground tracking-widest uppercase text-sm"
        >
          {loading ? "Suscribiendo..." : "Suscribirme al newsletter"}
        </Button>
      </form>
    </div>
  );
}

function ShoppingAccount() {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="bg-primary/5 border-b border-border/40 py-10 text-center">
        <div className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 font-serif text-2xl font-bold">
          {user?.userName?.[0]?.toUpperCase()}
        </div>
        <h1 className="font-serif text-3xl text-foreground tracking-wide">
          {user?.userName}
        </h1>
        <p className="text-sm text-foreground/40 font-sans mt-1">
          {user?.email}
        </p>
      </div>

      <div className="container mx-auto max-w-4xl py-8 px-4">
        <div className="rounded-xl border border-border/50 bg-card p-6">
          <Tabs defaultValue="orders">
            <TabsList className="bg-primary/5 border border-border/30 flex-wrap h-auto gap-1">
              <TabsTrigger
                value="orders"
                className="font-sans tracking-wide data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-1.5"
              >
                <PackageOpen className="w-3.5 h-3.5" /> Mis pedidos
              </TabsTrigger>
              <TabsTrigger
                value="address"
                className="font-sans tracking-wide data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Mis direcciones
              </TabsTrigger>
              <TabsTrigger
                value="profile"
                className="font-sans tracking-wide data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-1.5"
              >
                <User className="w-3.5 h-3.5" /> Perfil
              </TabsTrigger>
              <TabsTrigger
                value="security"
                className="font-sans tracking-wide data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-1.5"
              >
                <Shield className="w-3.5 h-3.5" /> Seguridad
              </TabsTrigger>
              <TabsTrigger
                value="notifications"
                className="font-sans tracking-wide data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-1.5"
              >
                <Bell className="w-3.5 h-3.5" /> Notificaciones
              </TabsTrigger>
            </TabsList>
            <TabsContent value="orders" className="mt-6">
              <ShoppingOrders />
            </TabsContent>
            <TabsContent value="address" className="mt-6">
              <Address />
            </TabsContent>
            <TabsContent value="profile" className="mt-6">
              <ProfileTab />
            </TabsContent>
            <TabsContent value="security" className="mt-6">
              <ChangePasswordTab />
            </TabsContent>
            <TabsContent value="notifications" className="mt-6">
              <NotificationsTab />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export default ShoppingAccount;
