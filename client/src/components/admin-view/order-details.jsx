import { useState } from "react";
import CommonForm from "@/components/common/form";
import {
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersForAdmin,
  getOrderDetailsForAdmin,
  updateOrderStatus,
} from "@/store/admin/order-slice";
import { MapPin, Phone, FileText, BookOpen, Download } from "lucide-react";

const statusMap = {
  pending: {
    label: "Pendiente",
    class: "bg-primary/20 text-primary border-primary/30",
  },
  confirmed: {
    label: "Confirmado",
    class: "bg-secondary/40 text-foreground border-secondary/50",
  },
  inProcess: {
    label: "En proceso",
    class: "bg-primary/30 text-primary border-primary/40",
  },
  inShipping: {
    label: "En camino",
    class: "bg-secondary/50 text-foreground border-secondary/60",
  },
  delivered: {
    label: "Entregado",
    class: "bg-secondary/60 text-foreground border-secondary/70",
  },
  rejected: {
    label: "Rechazado",
    class: "bg-destructive/20 text-destructive border-destructive/30",
  },
};

const initialFormData = { status: "" };

function AdminOrderDetailsView({ orderDetails }) {
  const [formData, setFormData] = useState(initialFormData);
  const [updateError, setUpdateError] = useState("");
  const [updateSuccess, setUpdateSuccess] = useState("");
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const status = statusMap[orderDetails?.orderStatus] || {
    label: orderDetails?.orderStatus,
    class: "bg-muted text-foreground/60 border-border/40",
  };

  const hasPhysical = orderDetails?.cartItems?.some(
    (item) => item?.type !== "ebook",
  );

  function handleUpdateStatus(event) {
    event.preventDefault();
    setUpdateError("");
    setUpdateSuccess("");

    if (!formData.status) {
      setUpdateError("Seleccioná un estado para actualizar.");
      return;
    }

    dispatch(
      updateOrderStatus({
        id: orderDetails?._id,
        orderStatus: formData.status,
      }),
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(getOrderDetailsForAdmin(orderDetails?._id));
        dispatch(getAllOrdersForAdmin());
        setFormData(initialFormData);
        setUpdateSuccess("Estado actualizado correctamente.");
      } else {
        setUpdateError("Hubo un error al actualizar el estado.");
      }
    });
  }

  return (
    <DialogContent className="sm:max-w-[600px] overflow-auto max-h-[90vh]">
      <DialogTitle className="font-serif text-xl text-foreground tracking-wide sr-only">
        Detalle del pedido
      </DialogTitle>
      <DialogDescription className="sr-only">
        Información detallada del pedido seleccionado
      </DialogDescription>
      <div className="grid gap-5 mt-2">
        {/* Header */}
        <div>
          <h2 className="font-serif text-xl text-foreground tracking-wide">
            Detalle del pedido
          </h2>
          <p className="text-xs text-foreground/40 font-mono mt-1">
            {orderDetails?._id}
          </p>
        </div>

        {/* Info general */}
        <div className="grid gap-2 bg-primary/5 rounded-lg p-4 border border-border/30">
          {[
            { label: "Fecha", value: orderDetails?.orderDate?.split("T")[0] },
            { label: "Total", value: `$${orderDetails?.totalAmount}` },
            { label: "Método de pago", value: orderDetails?.paymentMethod },
            { label: "Pago", value: orderDetails?.paymentStatus },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between">
              <span className="text-sm text-foreground/50 font-sans">
                {label}
              </span>
              <span className="text-sm text-foreground font-sans font-medium">
                {value}
              </span>
            </div>
          ))}
          <div className="flex items-center justify-between">
            <span className="text-sm text-foreground/50 font-sans">Estado</span>
            <Badge
              variant="outline"
              className={`text-xs px-2 py-0.5 font-sans tracking-wide border ${status.class}`}
            >
              {status.label}
            </Badge>
          </div>
        </div>

        <Separator className="bg-border/40" />

        {/* Items */}
        <div>
          <p className="text-sm font-sans text-foreground/60 uppercase tracking-widest mb-3">
            Libros
          </p>
          <ul className="grid gap-3">
            {orderDetails?.cartItems?.map((item, i) => (
              <li key={i} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  {item?.type === "ebook" ? (
                    <Download className="w-3.5 h-3.5 text-primary" />
                  ) : (
                    <BookOpen className="w-3.5 h-3.5 text-primary" />
                  )}
                </div>
                <span className="flex-1 text-sm font-sans text-foreground/80 truncate">
                  {item.title}
                </span>
                <span className="text-xs text-foreground/40 font-sans">
                  x{item.quantity}
                </span>
                <span className="text-sm font-semibold text-primary font-sans">
                  ${item.price}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Envío — solo si hay físicos */}
        {hasPhysical && orderDetails?.addressInfo?.address && (
          <>
            <Separator className="bg-border/40" />
            <div>
              <p className="text-sm font-sans text-foreground/60 uppercase tracking-widest mb-3">
                Envío
              </p>
              <div className="grid gap-2">
                <p className="text-sm font-medium text-foreground font-sans">
                  {user?.userName}
                </p>
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-primary/60 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-foreground/70 font-sans">
                      {orderDetails.addressInfo.address}
                    </p>
                    <p className="text-xs text-foreground/50 font-sans">
                      {orderDetails.addressInfo.city} —{" "}
                      {orderDetails.addressInfo.pincode}
                    </p>
                  </div>
                </div>
                {orderDetails.addressInfo.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-primary/60 flex-shrink-0" />
                    <p className="text-xs text-foreground/60 font-sans">
                      {orderDetails.addressInfo.phone}
                    </p>
                  </div>
                )}
                {orderDetails.addressInfo.notes && (
                  <div className="flex items-start gap-2">
                    <FileText className="w-3.5 h-3.5 text-primary/60 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-foreground/50 font-sans italic">
                      {orderDetails.addressInfo.notes}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        <Separator className="bg-border/40" />

        {/* Actualizar estado */}
        <div>
          <p className="text-sm font-sans text-foreground/60 uppercase tracking-widest mb-3">
            Actualizar estado
          </p>
          {updateError && (
            <p className="text-sm text-destructive font-sans mb-2">
              {updateError}
            </p>
          )}
          {updateSuccess && (
            <p className="text-sm text-secondary-foreground font-sans mb-2">
              {updateSuccess}
            </p>
          )}
          <CommonForm
            formControls={[
              {
                label: "Estado del pedido",
                name: "status",
                componentType: "select",
                options: [
                  { id: "pending", label: "Pendiente" },
                  { id: "inProcess", label: "En proceso" },
                  { id: "inShipping", label: "En camino" },
                  { id: "delivered", label: "Entregado" },
                  { id: "rejected", label: "Rechazado" },
                ],
              },
            ]}
            formData={formData}
            setFormData={setFormData}
            buttonText="Actualizar estado"
            onSubmit={handleUpdateStatus}
          />
        </div>
      </div>
    </DialogContent>
  );
}

export default AdminOrderDetailsView;
