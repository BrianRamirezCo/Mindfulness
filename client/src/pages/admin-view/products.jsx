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
import { API_URL } from "@/lib/api";
import axios from "axios";
import { Upload, FileText } from "lucide-react";

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

  // Ebook PDF upload
  const [ebookFile, setEbookFile] = useState(null);
  const [ebookPublicId, setEbookPublicId] = useState("");
  const [ebookLoading, setEbookLoading] = useState(false);
  const [ebookFileName, setEbookFileName] = useState("");

  const { productList } = useSelector((state) => state.adminProducts);
  const dispatch = useDispatch();

  async function handleEbookUpload(file) {
    if (!file) return;
    setEbookLoading(true);
    setEbookFileName(file.name);

    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const response = await axios.post(
          `${API_URL}/api/admin/products/upload-ebook`,
          { file: reader.result },
          { withCredentials: true },
        );
        if (response.data?.result?.public_id) {
          setEbookPublicId(response.data.result.public_id);
        }
      } catch (e) {
        console.log(e);
      } finally {
        setEbookLoading(false);
      }
    };
    reader.readAsDataURL(file);
  }

  function onSubmit(event) {
    event.preventDefault();

    const productData = {
      ...formData,
      image: uploadedImageUrl,
      ...(formData.type === "ebook" && ebookPublicId
        ? { ebookFile: ebookPublicId }
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
            setEbookPublicId("");
            setEbookFileName("");
          }
        })
      : dispatch(addNewProduct(productData)).then((data) => {
          if (data?.payload?.success) {
            dispatch(fetchAllProducts());
            setOpenCreateProductsDialog(false);
            setImageFile(null);
            setFormData(initialFormData);
            setEbookPublicId("");
            setEbookFileName("");
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
      return baseValid && ebookPublicId !== "";
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
          setEbookPublicId("");
          setEbookFileName("");
        }}
      >
        <SheetContent side="right" className="overflow-auto">
          <SheetHeader>
            <SheetTitle className="font-serif text-xl tracking-wide">
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

          {/* Upload PDF ebook — solo si tipo es ebook */}
          {formData.type === "ebook" && (
            <div className="mt-4 px-1">
              <p className="text-xs uppercase tracking-widest text-foreground/50 font-sans mb-2">
                Archivo PDF del ebook
              </p>
              <label className="flex flex-col items-center justify-center w-full border border-dashed border-border/50 rounded-xl p-6 cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-colors">
                <input
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    setEbookFile(file);
                    handleEbookUpload(file);
                  }}
                />
                {ebookLoading ? (
                  <p className="text-sm text-foreground/50 font-sans">
                    Subiendo PDF...
                  </p>
                ) : ebookPublicId ? (
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    <p className="text-sm text-foreground/70 font-sans">
                      {ebookFileName}
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="w-6 h-6 text-foreground/30" />
                    <p className="text-sm text-foreground/50 font-sans">
                      Clickeá para subir el PDF
                    </p>
                  </div>
                )}
              </label>
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
