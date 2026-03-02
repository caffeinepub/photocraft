import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ImageOff, Search } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { EditingStyle, type PublicPhoto } from "../backend.d";
import { PhotoDetailModal } from "../components/PhotoDetailModal";
import { PhotoImage } from "../components/PhotoImage";
import { PhotoGridSkeleton } from "../components/PhotoSkeleton";
import { StyleBadge } from "../components/StyleBadge";
import { usePublicPhotos } from "../hooks/useQueries";
import { formatDate } from "../lib/photoUtils";

const STYLE_FILTERS: Array<{ id: EditingStyle | "all"; label: string }> = [
  { id: "all", label: "All Styles" },
  { id: EditingStyle.Vintage, label: "Vintage" },
  { id: EditingStyle.Vivid, label: "Vivid" },
  { id: EditingStyle.SoftGlow, label: "Soft Glow" },
  { id: EditingStyle.BlackAndWhite, label: "B&W" },
  { id: EditingStyle.WarmTone, label: "Warm" },
  { id: EditingStyle.CoolTone, label: "Cool" },
];

function GalleryPhotoCard({
  photo,
  onClick,
}: {
  photo: PublicPhoto;
  onClick: () => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.92 }}
      transition={{ duration: 0.3 }}
      className="group relative cursor-pointer rounded-2xl overflow-hidden bg-card shadow-card hover:shadow-card-hover transition-all duration-300"
      onClick={onClick}
    >
      <div className="aspect-[4/3] overflow-hidden">
        <PhotoImage
          blobId={photo.blobId}
          alt={photo.title}
          className="w-full h-full transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-white font-display font-semibold text-sm truncate">
            {photo.title}
          </h3>
          <p className="text-white/70 text-xs mt-0.5">
            {formatDate(photo.uploadedAt)}
          </p>
        </div>
      </div>

      {/* Style badge */}
      <div className="absolute top-3 left-3">
        <StyleBadge style={photo.editingStyle} size="sm" />
      </div>
    </motion.div>
  );
}

export function GalleryPage() {
  const { data: photos, isLoading } = usePublicPhotos();
  const [selectedPhoto, setSelectedPhoto] = useState<PublicPhoto | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<EditingStyle | "all">("all");

  const filteredPhotos = photos?.filter((photo) => {
    const matchesSearch =
      searchQuery === "" ||
      photo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      photo.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      activeFilter === "all" || photo.editingStyle === activeFilter;

    return matchesSearch && matchesFilter;
  });

  return (
    <main className="container mx-auto px-4 py-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <h1 className="font-display font-bold text-3xl text-foreground mb-1">
          Community Gallery
        </h1>
        <p className="text-muted-foreground">
          {photos
            ? `${photos.length} photo${photos.length !== 1 ? "s" : ""} from our community`
            : "Discover beautiful photos from our community"}
        </p>
      </motion.div>

      {/* Search & Filter */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="space-y-4 mb-8"
      >
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search photos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 rounded-xl"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {STYLE_FILTERS.map((filter) => (
            <Button
              key={filter.id}
              variant={activeFilter === filter.id ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter(filter.id)}
              className={cn(
                "rounded-full text-xs transition-all",
                activeFilter === filter.id
                  ? "shadow-sm"
                  : "hover:border-primary/40",
              )}
            >
              {filter.label}
            </Button>
          ))}
        </div>
      </motion.div>

      {/* Loading */}
      {isLoading && <PhotoGridSkeleton count={8} />}

      {/* Empty states */}
      {!isLoading && (!filteredPhotos || filteredPhotos.length === 0) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center py-24 text-center"
        >
          <div className="bg-secondary rounded-3xl p-8 mb-6">
            <ImageOff className="w-14 h-14 text-muted-foreground mx-auto" />
          </div>
          <h3 className="font-display font-semibold text-xl text-foreground mb-2">
            {searchQuery || activeFilter !== "all"
              ? "No matching photos"
              : "No photos yet"}
          </h3>
          <p className="text-muted-foreground max-w-sm">
            {searchQuery || activeFilter !== "all"
              ? "Try adjusting your search or filter"
              : "Be the first to share a photo to the community gallery!"}
          </p>
          {(searchQuery || activeFilter !== "all") && (
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => {
                setSearchQuery("");
                setActiveFilter("all");
              }}
            >
              Clear filters
            </Button>
          )}
        </motion.div>
      )}

      {/* Grid */}
      {!isLoading && filteredPhotos && filteredPhotos.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredPhotos.map((photo) => (
            <GalleryPhotoCard
              key={photo.id}
              photo={photo}
              onClick={() => setSelectedPhoto(photo)}
            />
          ))}
        </div>
      )}

      {/* Photo detail modal */}
      <PhotoDetailModal
        photo={selectedPhoto}
        isOpen={!!selectedPhoto}
        onClose={() => setSelectedPhoto(null)}
      />
    </main>
  );
}
