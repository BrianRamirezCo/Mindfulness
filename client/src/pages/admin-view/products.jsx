import ProductImageUpload from "@/components/admin-view/image-upload";
import AdminProductTile from "@/components/admin-view/product-tile";
import CommonForm from "@/components/common/form";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { addProductFormElements } from "@/config";
import {
  addNewProduct,
  deleteProduct,
  editProduct,
  fetchAllProducts,
} from "@/store/admin/products-slice";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const initialFormData = {
  image: null,
  title: "",
  author: "",
  description: "",
  category: "",
  type: "",
  price: "",
  salePrice: "",
  totalStock: "",
};

function AdminProducts() {
  const [openCreateProductsDialog, setOpenCreateProductsDialog] =
    useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const [ebookLink, setEbookLink] = useState("");

  const { productList } = useSelector((state) => state.adminProducts);
  const dispatch = useDispatch();

  function onSubmit(event) {
    event.preventDefault();

    const productData = {
      ...formData,
      image: uploadedImageUrl,
      ...(formData.type === "ebook" && ebookLink
        ? { ebookFile: ebookLink }
        : {}),
    };

    currentEditedId !== null
      ? dispatch(
          editProduct({ id: currentEditedId, formData: productData }),
        ).then((data) => {
          if (data?.payload?.success) {
            dispatch(fetchAllProducts());
            setFormData(initialFormData);
            setOpenCreateProductsDialog(false);
            setCurrentEditedId(null);
            setEbookLink("");
          }
        })
      : dispatch(addNewProduct(productData)).then((data) => {
          if (data?.payload?.success) {
            dispatch(fetchAllProducts());
            setOpenCreateProductsDialog(false);
            setImageFile(null);
            setFormData(initialFormData);
            setEbookLink("");
          }
        });
  }

  function handleDelete(getCurrentProductId) {
    dispatch(deleteProduct(getCurrentProductId)).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllProducts());
      }
    });
  }

  function isFormValid() {
    const baseValid = Object.keys(formData)
      .filter((key) => key !== "salePrice" && key !== "image")
      .map((key) => formData[key] !== "")
      .every((item) => item);

    if (formData.type === "ebook" && !currentEditedId) {
      return baseValid && ebookLink !== "";
    }

    return baseValid;
  }

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  return (
    <Fragment>
      <div className="mb-6 w-full flex justify-between items-center">
        <div>
          <h1 className="font-serif text-2xl text-foreground tracking-wide">
            Libros
          </h1>
          <p className="text-sm text-foreground/50 mt-1">
            {productList?.length || 0}{" "}
            {productList?.length === 1 ? "libro" : "libros"} cargados
          </p>
        </div>
        <Button
          onClick={() => setOpenCreateProductsDialog(true)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground tracking-wide"
        >
          Agregar libro
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {productList && productList.length > 0 ? (
          productList.map((productItem) => (
            <AdminProductTile
              key={productItem._id}
              setFormData={setFormData}
              setOpenCreateProductsDialog={setOpenCreateProductsDialog}
              setCurrentEditedId={setCurrentEditedId}
              product={productItem}
              handleDelete={handleDelete}
            />
          ))
        ) : (
          <div className="col-span-4 text-center py-16 text-foreground/40">
            <p className="font-serif text-lg">No hay libros cargados todavía</p>
            <p className="text-sm mt-1">
              Agregá el primero con el botón de arriba
            </p>
          </div>
        )}
      </div>

      <Sheet
        open={openCreateProductsDialog}
        onOpenChange={() => {
          setOpenCreateProductsDialog(false);
          setCurrentEditedId(null);
          setFormData(initialFormData);
          setEbookLink("");
        }}
      >
        <SheetContent side="right" className="overflow-auto">
          <SheetHeader>
            <SheetTitle className="font-serif text-xl trackingingwide">
              {currentEditedId !== null ? "Editar libro" : "Agregar libro"}
            </SheetTitle>
          </SheetHeader>

          <ProductImageUpload
            imageFile={imageFile}
            setImageFile={setImageFile}
            uploadedImageUrl={uploadedImageUrl}
            setUploadedImageUrl={setUploadedImageUrl}
            setImageLoadingState={setImageLoadingState}
            imageLoadingState={imageLoadingState}
            isEditMode={currentEditedId !== null}
          />

          {/* Link de Google Drive para ebook */}
          {formData.type === "ebook" && (
            <div className="mt-4 px-1">
              <p className="text-xs uppercase tracking-widest text-foreground/50 font-sans mb-2">
                Link de descarga (Google Drive)
              </p>
              <input
                type="url"
                value={ebookLink}
                onChange={(e) => setEbookLink(e.target.value)}
                placeholder="https://drive.google.com/..."
                className="w-full border border-border/50 rounded-lg px-4 py-2.5 text-sm font-sans bg-background focus:outline-none focus:border-primary/50"
              />
              <p className="text-xs text-foreground/40 font-sans mt-1">
                Compartí el archivo en Drive como "cualquiera con el link" y
                pegá la URL acá.
              </p>
            </div>
          )}

          <div className="py-6">
            <CommonForm
              onSubmit={onSubmit}
              formData={formData}
              setFormData={setFormData}
              buttonText={
                currentEditedId !== null ? "Guardar cambios" : "Agregar libro"
              }
              formControls={addProductFormElements}
              isBtnDisabled={!isFormValid()}
            />
          </div>
        </SheetContent>
      </Sheet>
    </Fragment>
  );
}

export default AdminProducts;
