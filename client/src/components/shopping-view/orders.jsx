import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Dialog } from "../ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import ShoppingOrderDetailsView from "./order-details";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersByUserId,
  getOrderDetails,
  resetOrderDetails,
} from "@/store/shop/order-slice";
import { Badge } from "../ui/badge";
import { PackageOpen, Download } from "lucide-react";
import axios from "axios";
import { API_URL } from "@/lib/api";

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

function ShoppingOrders() {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [downloadingId, setDownloadingId] = useState(null);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { orderList, orderDetails } = useSelector((state) => state.shopOrder);

  function handleFetchOrderDetails(getId) {
    dispatch(getOrderDetails(getId));
  }

  async function handleDownloadEbook(orderId, productId) {
    setDownloadingId(productId);
    try {
      const response = await axios.get(
        `${API_URL}/api/shop/order/download/${orderId}/${productId}`,
        { withCredentials: true },
      );
      if (response.data?.success) {
        window.open(response.data.url, "_blank");
      }
    } catch (e) {
      console.log(e);
    } finally {
      setDownloadingId(null);
    }
  }

  useEffect(() => {
    dispatch(getAllOrdersByUserId(user?.id));
  }, [dispatch]);

  useEffect(() => {
    if (orderDetails !== null) setOpenDetailsDialog(true);
  }, [orderDetails]);

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="font-serif text-xl tracking-wide font-normal">
          Historial de pedidos
        </CardTitle>
      </CardHeader>
      <CardContent>
        {orderList && orderList.length > 0 ? (
          <div className="flex flex-col gap-4">
            {orderList.map((orderItem) => {
              const status = statusMap[orderItem?.orderStatus] || {
                label: orderItem?.orderStatus,
                class: "bg-muted text-foreground/60 border-border/40",
              };

              const ebookItems = orderItem?.cartItems?.filter(
                (item) => item.type === "ebook",
              );

              return (
                <div
                  key={orderItem?._id}
                  className="border border-border/40 rounded-xl p-4 flex flex-col gap-3"
                >
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-foreground/40 font-mono">
                        ...{orderItem?._id?.slice(-8)}
                      </span>
                      <span className="text-sm text-foreground/60 font-sans">
                        {orderItem?.orderDate.split("T")[0]}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge
                        variant="outline"
                        className={`text-xs px-2 py-0.5 font-sans tracking-wide border ${status.class}`}
                      >
                        {status.label}
                      </Badge>
                      <span className="text-sm font-bold text-primary font-sans">
                        ${orderItem?.totalAmount}
                      </span>
                    </div>
                  </div>

                  {/* Ebooks disponibles para descargar */}
                  {orderItem?.paymentStatus === "paid" &&
                    ebookItems?.length > 0 && (
                      <div className="flex flex-col gap-2 pt-2 border-t border-border/30">
                        <p className="text-xs uppercase tracking-widest text-foreground/40 font-sans">
                          Tus ebooks
                        </p>
                        {ebookItems.map((item) => (
                          <div
                            key={item.productId}
                            className="flex items-center justify-between"
                          >
                            <span className="text-sm text-foreground/70 font-sans">
                              {item.title}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleDownloadEbook(
                                  orderItem._id,
                                  item.productId,
                                )
                              }
                              disabled={downloadingId === item.productId}
                              className="text-xs border-primary/30 hover:border-primary hover:bg-primary/5 gap-1.5"
                            >
                              <Download className="w-3.5 h-3.5" />
                              {downloadingId === item.productId
                                ? "Generando..."
                                : "Descargar"}
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}

                  <div className="flex justify-end">
                    <Dialog
                      open={openDetailsDialog}
                      onOpenChange={() => {
                        setOpenDetailsDialog(false);
                        dispatch(resetOrderDetails());
                      }}
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs border-border/40 hover:border-primary/40 hover:bg-primary/5 font-sans tracking-wide"
                        onClick={() => handleFetchOrderDetails(orderItem?._id)}
                      >
                        Ver detalle
                      </Button>
                      <ShoppingOrderDetailsView orderDetails={orderDetails} />
                    </Dialog>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <PackageOpen className="w-10 h-10 text-foreground/20" />
            <p className="text-sm text-foreground/40 font-sans tracking-wide">
              Todavía no tenés pedidos
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default ShoppingOrders;
