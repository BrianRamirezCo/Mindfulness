import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllReflections,
  createReflection,
  editReflection,
  deleteReflection,
  publishReflection,
} from "@/store/reflection-slice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Feather, Trash2, Edit, Send, Plus } from "lucide-react";
import ProductImageUpload from "@/components/admin-view/image-upload";

const initialForm = { title: "", content: "", image: "" };

function AdminReflections() {
  const dispatch = useDispatch();
  const { reflectionList, isLoading } = useSelector(
    (state) => state.reflections,
  );
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(initialForm);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);

  useEffect(() => {
    dispatch(getAllReflections());
  }, [dispatch]);

  function handleSubmit(e) {
    e.preventDefault();
    const data = { ...formData, image: uploadedImageUrl || formData.image };

    if (currentEditedId) {
      dispatch(editReflection({ id: currentEditedId, formData: data })).then(
        () => {
          dispatch(getAllReflections());
          resetForm();
        },
      );
    } else {
      dispatch(createReflection(data)).then(() => {
        dispatch(getAllReflections());
        resetForm();
      });
    }
  }

  function handleEdit(reflection) {
    setCurrentEditedId(reflection._id);
    setFormData({
      title: reflection.title,
      content: reflection.content,
      image: reflection.image || "",
    });
    setUploadedImageUrl(reflection.image || "");
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleDelete(id) {
    dispatch(deleteReflection(id)).then(() => dispatch(getAllReflections()));
  }

  function handlePublish(id) {
    dispatch(publishReflection(id)).then(() => dispatch(getAllReflections()));
  }

  function resetForm() {
    setFormData(initialForm);
    setCurrentEditedId(null);
    setShowForm(false);
    setUploadedImageUrl("");
    setImageFile(null);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl text-foreground tracking-wide">
            Reflexiones
          </h1>
          <p className="text-sm text-foreground/50 mt-1">
            {reflectionList?.length || 0} reflexiones
          </p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="bg-primary hover:bg-primary/90 text-primary-foreground tracking-wide gap-2"
        >
          <Plus size={16} />
          Nueva reflexión
        </Button>
      </div>

      {/* Formulario */}
      {showForm && (
        <div className="bg-card border border-border/50 rounded-xl p-6 flex flex-col gap-4">
          <h2 className="font-serif text-lg text-foreground tracking-wide">
            {currentEditedId ? "Editar reflexión" : "Nueva reflexión"}
          </h2>

          <ProductImageUpload
            imageFile={imageFile}
            setImageFile={setImageFile}
            uploadedImageUrl={uploadedImageUrl}
            setUploadedImageUrl={setUploadedImageUrl}
            setImageLoadingState={setImageLoadingState}
            imageLoadingState={imageLoadingState}
            isEditMode={!!currentEditedId}
            isCustomStyling={true}
          />

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid gap-1.5">
              <Label className="text-sm text-foreground/70 font-sans">
                Título
              </Label>
              <Input
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Título de la reflexión"
                required
                className="border-border/50 focus:border-primary/50"
              />
            </div>
            <div className="grid gap-1.5">
              <Label className="text-sm text-foreground/70 font-sans">
                Contenido
              </Label>
              <Textarea
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                placeholder="Escribí la reflexión..."
                required
                rows={8}
                className="border-border/50 focus:border-primary/50 font-sans text-sm"
              />
            </div>
            <div className="flex gap-3">
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-primary hover:bg-primary/90 text-primary-foreground tracking-wide"
              >
                {currentEditedId ? "Guardar cambios" : "Guardar borrador"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={resetForm}
                className="border-border/40"
              >
                Cancelar
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Lista */}
      <div className="flex flex-col gap-4">
        {reflectionList && reflectionList.length > 0 ? (
          reflectionList.map((reflection) => (
            <div
              key={reflection._id}
              className="bg-card border border-border/50 rounded-xl p-5 flex flex-col gap-3"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex flex-col gap-1 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif text-lg text-foreground">
                      {reflection.title}
                    </h3>
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        reflection.published
                          ? "bg-secondary/30 text-foreground border-secondary/50"
                          : "bg-muted text-foreground/50 border-border/40"
                      }`}
                    >
                      {reflection.published ? "Publicado" : "Borrador"}
                    </Badge>
                  </div>
                  <p className="text-sm text-foreground/50 font-sans line-clamp-2">
                    {reflection.content}
                  </p>
                  <p className="text-xs text-foreground/30 font-sans mt-1">
                    {new Date(reflection.createdAt).toLocaleDateString("es-AR")}{" "}
                    · {reflection.comments?.length || 0} comentarios
                  </p>
                </div>
                {reflection.image && (
                  <img
                    src={reflection.image}
                    alt={reflection.title}
                    className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                  />
                )}
              </div>

              <div className="flex gap-2 flex-wrap">
                {!reflection.published && (
                  <Button
                    size="sm"
                    onClick={() => handlePublish(reflection._id)}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs gap-1.5"
                  >
                    <Send size={13} />
                    Publicar y enviar
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(reflection)}
                  className="text-xs border-border/40 hover:border-primary/40 gap-1.5"
                >
                  <Edit size={13} />
                  Editar
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDelete(reflection._id)}
                  className="text-xs border-destructive/30 hover:bg-destructive/5 text-destructive gap-1.5"
                >
                  <Trash2 size={13} />
                  Eliminar
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Feather className="w-10 h-10 text-foreground/20" />
            <p className="text-sm text-foreground/40 font-sans">
              No hay reflexiones todavía
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminReflections;
