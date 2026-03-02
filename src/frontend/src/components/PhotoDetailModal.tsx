import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Calendar,
  Download,
  Globe,
  Lock,
  Palette,
  Trash2,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { FullPhoto, PublicPhoto } from "../backend.d";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useStorage } from "../hooks/useStorage";
import { formatDate, truncatePrincipal } from "../lib/photoUtils";
import { StyleBadge } from "./StyleBadge";

type AnyPhoto = FullPhoto | PublicPhoto;

interface PhotoDetailModalProps {
  photo: AnyPhoto | null;
  isOpen: boolean;
  onClose: () => void;
  onDelete?: (id: string) => Promise<void>;
  onTogglePublic?: (id: string, isPublic: boolean) => Promise<void>;
}

export function PhotoDetailModal({
  photo,
  isOpen,
  onClose,
  onDelete,
  onTogglePublic,
}: PhotoDetailModalProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoadingImage, setIsLoadingImage] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const { getFileUrl } = useStorage();
  const { identity } = useInternetIdentity();

  const currentPrincipal = identity?.getPrincipal().toString();
  const isOwner =
    photo && currentPrincipal && photo.owner.toString() === currentPrincipal;

  useEffect(() => {
    if (!photo || !isOpen) return;

    let cancelled = false;
    setIsLoadingImage(true);
    const blobId = photo.blobId;

    getFileUrl(blobId)
      .then((url) => {
        if (!cancelled) {
          setImageUrl(url);
          setIsLoadingImage(false);
        }
      })
      .catch(() => {
        if (!cancelled) setIsLoadingImage(false);
      });

    return () => {
      cancelled = true;
    };
  }, [photo, isOpen, getFileUrl]);

  const handleDownload = async () => {
    if (!imageUrl || !photo) return;
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${photo.title.replace(/\s+/g, "-").toLowerCase()}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Photo downloaded!");
    } catch {
      toast.error("Download failed. Please try again.");
    }
  };

  const handleDelete = async () => {
    if (!photo || !onDelete) return;
    setIsDeleting(true);
    try {
      await onDelete(photo.id);
      onClose();
      toast.success("Photo deleted");
    } catch {
      toast.error("Failed to delete photo");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleTogglePublic = async (checked: boolean) => {
    if (!photo || !onTogglePublic) return;
    setIsToggling(true);
    try {
      await onTogglePublic(photo.id, checked);
      toast.success(checked ? "Photo is now public" : "Photo is now private");
    } catch {
      toast.error("Failed to update visibility");
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && photo && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-foreground/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-card rounded-2xl shadow-lg w-full max-w-4xl max-h-[90vh] overflow-hidden pointer-events-auto flex flex-col md:flex-row">
              {/* Image side */}
              <div className="relative flex-1 min-h-64 md:min-h-0 bg-muted">
                {isLoadingImage ? (
                  <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-secondary to-accent" />
                ) : imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={photo.title}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                    Unable to load image
                  </div>
                )}

                {/* Close button */}
                <button
                  type="button"
                  onClick={onClose}
                  className="absolute top-3 right-3 bg-white/90 hover:bg-white rounded-full p-1.5 shadow-sm transition-colors z-10"
                >
                  <X className="w-4 h-4 text-foreground" />
                </button>
              </div>

              {/* Info side */}
              <div className="w-full md:w-80 flex flex-col p-6 overflow-y-auto">
                <div className="flex-1 space-y-5">
                  <div>
                    <h2 className="font-display font-bold text-xl text-foreground leading-tight">
                      {photo.title}
                    </h2>
                    {photo.description && (
                      <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                        {photo.description}
                      </p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Palette className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <StyleBadge style={photo.editingStyle} size="md" />
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4 flex-shrink-0" />
                      <span>{formatDate(photo.uploadedAt)}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      {photo.isPublic ? (
                        <Globe className="w-4 h-4 flex-shrink-0 text-emerald-600" />
                      ) : (
                        <Lock className="w-4 h-4 flex-shrink-0" />
                      )}
                      <span>{photo.isPublic ? "Public" : "Private"}</span>
                    </div>

                    <div className="text-xs text-muted-foreground font-mono bg-muted px-2 py-1 rounded-md truncate">
                      {truncatePrincipal(photo.owner.toString())}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-3 mt-6 pt-5 border-t border-border">
                  <Button
                    onClick={handleDownload}
                    disabled={!imageUrl}
                    className="w-full"
                    size="sm"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Photo
                  </Button>

                  {isOwner && onTogglePublic && (
                    <div className="flex items-center justify-between bg-secondary rounded-xl px-4 py-3">
                      <div className="flex items-center gap-2">
                        {photo.isPublic ? (
                          <Globe className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Lock className="w-4 h-4 text-muted-foreground" />
                        )}
                        <span className="text-sm font-medium text-secondary-foreground">
                          {photo.isPublic ? "Public" : "Private"}
                        </span>
                      </div>
                      <Switch
                        checked={photo.isPublic}
                        onCheckedChange={handleTogglePublic}
                        disabled={isToggling}
                      />
                    </div>
                  )}

                  {isOwner && onDelete && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full text-destructive border-destructive/30 hover:bg-destructive/5"
                          disabled={isDeleting}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete Photo
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete photo?</AlertDialogTitle>
                          <AlertDialogDescription>
                            "{photo.title}" will be permanently deleted.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
