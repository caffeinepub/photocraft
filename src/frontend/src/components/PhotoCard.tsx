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
import { cn } from "@/lib/utils";
import { Globe, Lock, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import type { FullPhoto } from "../backend.d";
import { formatDate } from "../lib/photoUtils";
import { PhotoImage } from "./PhotoImage";
import { StyleBadge } from "./StyleBadge";

interface PhotoCardProps {
  photo: FullPhoto;
  onDelete?: (id: string) => void;
  onTogglePublic?: (id: string, isPublic: boolean) => void;
  onClick?: () => void;
  isOwner?: boolean;
  isDeleting?: boolean;
  isToggling?: boolean;
}

export function PhotoCard({
  photo,
  onDelete,
  onTogglePublic,
  onClick,
  isOwner = false,
  isDeleting = false,
  isToggling = false,
}: PhotoCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn(
        "group relative rounded-2xl overflow-hidden bg-card",
        "shadow-card transition-all duration-300 ease-out hover:shadow-card-hover hover:-translate-y-0.5",
        isDeleting && "opacity-50 pointer-events-none",
      )}
    >
      {/* Image + hover caption in one tappable area */}
      <button
        type="button"
        className="relative block aspect-[4/3] overflow-hidden w-full"
        onClick={onClick}
      >
        <PhotoImage
          blobId={photo.blobId}
          alt={photo.title}
          className="w-full h-full transition-transform duration-500 group-hover:scale-105"
        />

        {/* Bottom gradient caption — slides up on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <p className="text-white font-display font-semibold text-sm truncate leading-tight">
            {photo.title}
          </p>
          <p className="text-white/70 text-xs mt-0.5">
            {formatDate(photo.uploadedAt)}
          </p>
        </div>

        {/* Style badge — top left, always visible */}
        <div className="absolute top-2.5 left-2.5">
          <StyleBadge style={photo.editingStyle} size="sm" />
        </div>
      </button>

      {/* Card footer */}
      <div className="px-3 py-2.5 flex items-center justify-between gap-2">
        {/* Title (static, visible when not hovering on mobile) */}
        <div className="min-w-0">
          <p className="text-xs font-semibold text-foreground truncate">
            {photo.title}
          </p>
          <p className="text-xs text-muted-foreground">
            {formatDate(photo.uploadedAt)}
          </p>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {/* Public/private pill */}
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium border",
              photo.isPublic
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-muted text-muted-foreground border-border",
            )}
          >
            {photo.isPublic ? (
              <Globe className="w-2.5 h-2.5" />
            ) : (
              <Lock className="w-2.5 h-2.5" />
            )}
            {photo.isPublic ? "Public" : "Private"}
          </span>

          {/* Owner quick-toggle */}
          {isOwner && onTogglePublic && (
            <Switch
              checked={photo.isPublic}
              onCheckedChange={(checked) => onTogglePublic(photo.id, checked)}
              disabled={isToggling}
              className="scale-[0.65] origin-right"
            />
          )}

          {/* Delete */}
          {isOwner && onDelete && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete photo?</AlertDialogTitle>
                  <AlertDialogDescription>
                    "{photo.title}" will be permanently deleted. This cannot be
                    undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => onDelete(photo.id)}
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
    </motion.div>
  );
}
