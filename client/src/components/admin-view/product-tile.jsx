import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Badge } from "../ui/badge";

function AdminProductTile({
  product,
  setFormData,
  setOpenCreateProductsDialog,
  setCurrentEditedId,
  handleDelete,
}) {
  return (
    <Card className="w-full max-w-sm mx-auto border-border/50 hover:border-primary/30 transition-colors">
      <div>
        <div className="relative">
          <img
            src={product?.image}
            alt={product?.title}
            className="w-full h-[250px] object-cover rounded-t-lg"
          />
          {product?.type && (
            <Badge className="absolute top-2 left-2 bg-primary/80 hover:bg-primary text-primary-foreground text-xs tracking-wide">
              {product.type === "ebook" ? "Ebook" : "Libro físico"}
            </Badge>
          )}
        </div>
        <CardContent className="pt-4">
          <h2 className="font-serif text-lg font-semibold text-foreground mb-1">
            {product?.title}
          </h2>
          {product?.author && (
            <p className="text-sm text-foreground/50 mb-3">{product.author}</p>
          )}
          <div className="flex justify-between items-center">
            <span
              className={`${
                product?.salePrice > 0
                  ? "line-through text-foreground/40"
                  : "text-primary"
              } text-base font-semibold`}
            >
              ${product?.price}
            </span>
            {product?.salePrice > 0 && (
              <span className="text-base font-bold text-primary">
                ${product?.salePrice}
              </span>
            )}
          </div>
          <p className="text-xs text-foreground/40 mt-2">
            Stock: {product?.totalStock}
          </p>
        </CardContent>
        <CardFooter className="flex justify-between items-center gap-2">
          <Button
            variant="outline"
            className="flex-1 border-primary/30 hover:bg-primary/10 hover:border-primary text-foreground"
            onClick={() => {
              setOpenCreateProductsDialog(true);
              setCurrentEditedId(product?._id);
              setFormData(product);
            }}
          >
            Editar
          </Button>
          <Button
            variant="outline"
            className="flex-1 border-destructive/30 hover:bg-destructive/10 hover:border-destructive text-destructive"
            onClick={() => handleDelete(product?._id)}
          >
            Eliminar
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
}

export default AdminProductTile;
