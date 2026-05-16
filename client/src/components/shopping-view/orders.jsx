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
import { PackageOpen } from "lucide-react";

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
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { orderList, orderDetails } = useSelector((state) => state.shopOrder);

  function handleFetchOrderDetails(getId) {
    dispatch(getOrderDetails(getId));
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
          <Table>
            <TableHeader>
              <TableRow className="border-border/40">
                <TableHead className="text-xs uppercase tracking-widest text-foreground/50 font-sans">
                  ID
                </TableHead>
                <TableHead className="text-xs uppercase tracking-widest text-foreground/50 font-sans">
                  Fecha
                </TableHead>
                <TableHead className="text-xs uppercase tracking-widest text-foreground/50 font-sans">
                  Estado
                </TableHead>
                <TableHead className="text-xs uppercase tracking-widest text-foreground/50 font-sans">
                  Total
                </TableHead>
                <TableHead>
                  <span className="sr-only">Detalles</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orderList.map((orderItem) => {
                const status = statusMap[orderItem?.orderStatus] || {
                  label: orderItem?.orderStatus,
                  class: "bg-muted text-foreground/60 border-border/40",
                };
                return (
                  <TableRow key={orderItem?._id} className="border-border/30">
                    <TableCell className="text-xs text-foreground/40 font-mono">
                      ...{orderItem?._id?.slice(-8)}
                    </TableCell>
                    <TableCell className="text-sm text-foreground/70 font-sans">
                      {orderItem?.orderDate.split("T")[0]}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`text-xs px-2 py-0.5 font-sans tracking-wide border ${status.class}`}
                      >
                        {status.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm font-semibold text-primary font-sans">
                      ${orderItem?.totalAmount}
                    </TableCell>
                    <TableCell>
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
                          onClick={() =>
                            handleFetchOrderDetails(orderItem?._id)
                          }
                        >
                          Ver detalle
                        </Button>
                        <ShoppingOrderDetailsView orderDetails={orderDetails} />
                      </Dialog>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
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
