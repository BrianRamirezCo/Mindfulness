import ProductImageUpload from "@/components/admin-view/image-upload";
import { Button } from "@/components/ui/button";
import {
  addFeatureImage,
  getFeatureImages,
  deleteFeatureImage,
} from "@/store/common-slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Images, Trash2, Loader2 } from "lucide-react";

function AdminDashboard() {
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const dispatch = useDispatch();
  const { featureImageList } = useSelector((state) => state.commonFeature);

  function handleUploadFeatureImage() {
    if (!uploadedImageUrl) return;
    setIsUploading(true);
    dispatch(addFeatureImage(uploadedImageUrl)).then((data) => {
      if (data?.payload?.success) {
        dispatch(getFeatureImages());
        setImageFile(null);
        setUploadedImageUrl("");
      }
      setIsUploading(false);
    });
  }

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl text-foreground tracking-wide">
          Dashboard
        </h1>
        <p className="text-sm text-foreground/50 font-sans mt-1">
          Administrá los banners del homepage
        </p>
      </div>

      {/* Upload */}
      <div className="bg-card border border-border/50 rounded-xl p-6 flex flex-col gap-4">
        <div className="flex items-center gap-2 mb-2">
          <Images className="w-4 h-4 text-primary/60" />
          <h2 className="font-sans text-sm uppercase tracking-widest text-foreground/60">
            Agregar banner
          </h2>
        </div>

        <ProductImageUpload
          imageFile={imageFile}
          setImageFile={setImageFile}
          uploadedImageUrl={uploadedImageUrl}
          setUploadedImageUrl={setUploadedImageUrl}
          setImageLoadingState={setImageLoadingState}
          imageLoadingState={imageLoadingState}
          isCustomStyling={true}
        />

        <Button
          onClick={handleUploadFeatureImage}
          disabled={!uploadedImageUrl || isUploading || imageLoadingState}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground tracking-widest uppercase text-sm"
        >
          {isUploading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Subiendo...
            </span>
          ) : (
            "Agregar banner"
          )}
        </Button>
      </div>

      {/* Banners existentes */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <h2 className="font-sans text-sm uppercase tracking-widest text-foreground/60">
            Banners activos ({featureImageList?.length || 0})
          </h2>
        </div>

        {featureImageList && featureImageList.length > 0 ? (
          <div className="grid gap-4">
            {featureImageList.map((featureImgItem) => (
              <div
                key={featureImgItem._id}
                className="relative rounded-xl overflow-hidden border border-border/40 group"
              >
                <img
                  src={featureImgItem.image}
                  className="w-full h-[250px] object-cover"
                  alt="Banner"
                />
                <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/20 transition-colors duration-200" />
                <button
                  onClick={() => {
                    dispatch(deleteFeatureImage(featureImgItem._id)).then(
                      () => {
                        dispatch(getFeatureImages());
                      },
                    );
                  }}
                  className="absolute top-3 right-3 bg-background/80 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 hover:text-destructive text-foreground/60"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 gap-3 border border-dashed border-border/40 rounded-xl">
            <Images className="w-10 h-10 text-foreground/20" />
            <p className="text-sm text-foreground/40 font-sans tracking-wide">
              No hay banners cargados todavía
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
