import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import { MapPin, Phone, FileText } from "lucide-react";

function AddressCard({
  addressInfo,
  handleDeleteAddress,
  handleEditAddress,
  setCurrentSelectedAddress,
  selectedId,
}) {
  const isSelected = selectedId?._id === addressInfo?._id;

  return (
    <Card
      onClick={
        setCurrentSelectedAddress
          ? () => setCurrentSelectedAddress(addressInfo)
          : null
      }
      className={`cursor-pointer transition-all duration-200 ${
        isSelected
          ? "border-primary border-2 bg-primary/5"
          : "border-border/50 hover:border-primary/40"
      }`}
    >
      <CardContent className="p-4 flex flex-col gap-2">
        <div className="flex items-start gap-2">
          <MapPin className="w-3.5 h-3.5 text-primary/60 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-foreground font-sans">
              {addressInfo?.address}
            </p>
            <p className="text-xs text-foreground/50 font-sans">
              {addressInfo?.city} — {addressInfo?.pincode}
            </p>
          </div>
        </div>

        {addressInfo?.phone && (
          <div className="flex items-center gap-2">
            <Phone className="w-3.5 h-3.5 text-primary/60 flex-shrink-0" />
            <p className="text-xs text-foreground/60 font-sans">
              {addressInfo.phone}
            </p>
          </div>
        )}

        {addressInfo?.notes && (
          <div className="flex items-start gap-2">
            <FileText className="w-3.5 h-3.5 text-primary/60 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-foreground/50 font-sans italic">
              {addressInfo.notes}
            </p>
          </div>
        )}

        {isSelected && (
          <span className="text-xs text-primary font-sans tracking-wide mt-1">
            ✓ Dirección seleccionada
          </span>
        )}
      </CardContent>

      <CardFooter className="px-4 pb-3 pt-0 flex justify-between gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 text-xs border-border/40 hover:border-primary/40 hover:bg-primary/5"
          onClick={(e) => {
            e.stopPropagation();
            handleEditAddress(addressInfo);
          }}
        >
          Editar
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex-1 text-xs border-border/40 hover:border-destructive/40 hover:bg-destructive/5 text-destructive"
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteAddress(addressInfo);
          }}
        >
          Eliminar
        </Button>
      </CardFooter>
    </Card>
  );
}

export default AddressCard;
