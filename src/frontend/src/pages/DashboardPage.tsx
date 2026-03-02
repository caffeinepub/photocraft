import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { Camera, ImageOff, Upload } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { FullPhoto } from "../backend.d";
import { PhotoCard } from "../components/PhotoCard";
import { PhotoDetailModal } from "../components/PhotoDetailModal";
import { PhotoGridSkeleton } from "../components/PhotoSkeleton";
import {
  useDeletePhoto,
  useTogglePublic,
  useUserPhotos,
} from "../hooks/useQueries";

export function DashboardPage() {
  const { data: photos, isLoading } = useUserPhotos();
  const deleteMutation = useDeletePhoto();
  const toggleMutation = useTogglePublic();
  const [selectedPhoto, setSelectedPhoto] = useState<FullPhoto | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Photo deleted successfully");
    } catch {
      toast.error("Failed to delete photo");
    } finally {
      setDeletingId(null);
    }
  };

  const handleTogglePublic = async (id: string, isPublic: boolean) => {
    setTogglingId(id);
    try {
      await toggleMutation.mutateAsync({ photoId: id, isPublic });
      toast.success(isPublic ? "Photo is now public" : "Photo is now private");
    } catch {
      toast.error("Failed to update visibility");
    } finally {
      setTogglingId(null);
    }
  };

  const handleModalDelete = async (id: string) => {
    await handleDelete(id);
    setSelectedPhoto(null);
  };

  const handleModalTogglePublic = async (id: string, isPublic: boolean) => {
    await handleTogglePublic(id, isPublic);
    // Update the selected photo local state
    setSelectedPhoto((prev) => (prev ? { ...prev, isPublic } : null));
  };

  return (
    <main className="container mx-auto px-4 py-10">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10"
      >
        <div>
          <h1 className="font-display font-bold text-3xl text-foreground">
            My Photos
          </h1>
          <p className="text-muted-foreground mt-1">
            {photos
              ? `${photos.length} photo${photos.length !== 1 ? "s" : ""} in your collection`
              : "Your personal photo collection"}
          </p>
        </div>
        <Link to="/upload">
          <Button className="gap-2" size="sm">
            <Upload className="w-4 h-4" />
            Upload Photo
          </Button>
        </Link>
      </motion.div>

      {/* Loading state */}
      {isLoading && <PhotoGridSkeleton count={6} />}

      {/* Empty state */}
      {!isLoading && (!photos || photos.length === 0) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center py-24 text-center"
        >
          <div className="bg-primary/10 rounded-3xl p-8 mb-6">
            <Camera className="w-16 h-16 text-primary/60 mx-auto" />
          </div>
          <h3 className="font-display font-semibold text-2xl text-foreground mb-3">
            No photos yet
          </h3>
          <p className="text-muted-foreground max-w-sm mb-8 leading-relaxed">
            Upload your first photo and choose an editing style to get started.
          </p>
          <Link to="/upload">
            <Button size="lg" className="gap-2">
              <Upload className="w-5 h-5" />
              Upload Your First Photo
            </Button>
          </Link>
        </motion.div>
      )}

      {/* Photos grid */}
      {!isLoading && photos && photos.length > 0 && (
        <AnimatePresence mode="popLayout">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {photos.map((photo) => (
              <PhotoCard
                key={photo.id}
                photo={photo}
                isOwner
                onDelete={handleDelete}
                onTogglePublic={handleTogglePublic}
                onClick={() => setSelectedPhoto(photo)}
                isDeleting={deletingId === photo.id}
                isToggling={togglingId === photo.id}
              />
            ))}
          </div>
        </AnimatePresence>
      )}

      {/* Error state */}
      {!isLoading && !photos && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <ImageOff className="w-12 h-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Failed to load photos</p>
        </div>
      )}

      {/* Photo detail modal */}
      <PhotoDetailModal
        photo={selectedPhoto}
        isOpen={!!selectedPhoto}
        onClose={() => setSelectedPhoto(null)}
        onDelete={handleModalDelete}
        onTogglePublic={handleModalTogglePublic}
      />
    </main>
  );
}
