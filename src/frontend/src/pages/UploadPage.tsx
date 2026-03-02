import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useNavigate } from "@tanstack/react-router";
import { CheckCircle2, ImageIcon, Loader2, Upload, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";
import { EditingStyle } from "../backend.d";
import { useUploadPhoto } from "../hooks/useQueries";
import { useStorage } from "../hooks/useStorage";
import { EDITING_STYLES } from "../lib/photoUtils";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

function validateFile(file: File): string | null {
  if (!ACCEPTED_TYPES.includes(file.type)) {
    return "Please select a JPEG, PNG, WebP, or GIF image.";
  }
  if (file.size > MAX_FILE_SIZE) {
    return "File size must be under 10MB.";
  }
  return null;
}

export function UploadPage() {
  const navigate = useNavigate();
  const uploadPhotoMutation = useUploadPhoto();
  const { uploadFile, uploadProgress, isUploading } = useStorage();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedStyle, setSelectedStyle] = useState<EditingStyle>(
    EditingStyle.Vintage,
  );
  const [isPublic, setIsPublic] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadStep, setUploadStep] = useState<
    "idle" | "uploading-blob" | "saving" | "done"
  >("idle");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback((file: File) => {
    const error = validateFile(file);
    if (error) {
      toast.error(error);
      return;
    }

    setSelectedFile(file);
    setPreviewUrl((oldUrl) => {
      if (oldUrl) URL.revokeObjectURL(oldUrl);
      return URL.createObjectURL(file);
    });
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    // Reset input so the same file can be re-selected
    e.target.value = "";
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file) processFile(file);
    },
    [processFile],
  );

  const clearFile = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile) {
      toast.error("Please select a photo to upload");
      return;
    }
    if (!title.trim()) {
      toast.error("Please enter a title for your photo");
      return;
    }

    setIsSubmitting(true);
    setUploadStep("uploading-blob");

    try {
      // Step 1: Upload the file to blob storage
      const { blobId } = await uploadFile(selectedFile);

      setUploadStep("saving");

      // Step 2: Save photo metadata
      await uploadPhotoMutation.mutateAsync({
        title: title.trim(),
        description: description.trim(),
        blobId,
        editingStyle: selectedStyle,
        isPublic,
      });

      setUploadStep("done");
      toast.success("Photo uploaded successfully!");

      setTimeout(() => {
        navigate({ to: "/dashboard" });
      }, 800);
    } catch (err) {
      console.error("Upload failed:", err);
      toast.error("Upload failed. Please try again.");
      setUploadStep("idle");
      setIsSubmitting(false);
    }
  };

  const isLoading = isUploading || uploadPhotoMutation.isPending;

  return (
    <main className="container mx-auto px-4 py-10 max-w-3xl">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="mb-8">
          <h1 className="font-display font-bold text-3xl text-foreground">
            Upload Photo
          </h1>
          <p className="text-muted-foreground mt-1">
            Choose your editing style and share with the community
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Drop zone */}
          <div>
            <Label className="text-sm font-medium text-foreground mb-3 block">
              Photo <span className="text-destructive">*</span>
            </Label>

            <AnimatePresence mode="wait">
              {!selectedFile ? (
                <motion.div
                  key="dropzone"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={cn(
                    "relative border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-200",
                    isDragging
                      ? "border-primary bg-primary/5 scale-[1.01]"
                      : "border-border hover:border-primary/50 hover:bg-secondary/50",
                  )}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept={ACCEPTED_TYPES.join(",")}
                    onChange={handleFileInput}
                    className="sr-only"
                  />
                  <div className="flex flex-col items-center gap-3">
                    <div
                      className={cn(
                        "rounded-2xl p-4 transition-colors",
                        isDragging ? "bg-primary/20" : "bg-secondary",
                      )}
                    >
                      <ImageIcon
                        className={cn(
                          "w-8 h-8 transition-colors",
                          isDragging ? "text-primary" : "text-muted-foreground",
                        )}
                      />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        {isDragging
                          ? "Drop to upload"
                          : "Drag & drop your photo"}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        or{" "}
                        <span className="text-primary font-medium">browse</span>{" "}
                        to choose
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      JPEG, PNG, WebP, GIF · Max 10MB
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="preview"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="relative rounded-2xl overflow-hidden border border-border"
                >
                  {previewUrl && (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full max-h-72 object-cover"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                    <span className="bg-white/90 rounded-full px-3 py-1 text-xs font-medium text-foreground">
                      {selectedFile.name}
                    </span>
                    <button
                      type="button"
                      onClick={clearFile}
                      className="bg-white/90 hover:bg-white rounded-full p-1.5 shadow-sm transition-colors"
                    >
                      <X className="w-4 h-4 text-foreground" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Golden Hour at Santorini"
              maxLength={120}
              required
              className="rounded-xl"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Description{" "}
              <span className="text-muted-foreground font-normal">
                (optional)
              </span>
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell a story about this photo..."
              maxLength={500}
              rows={3}
              className="rounded-xl resize-none"
            />
          </div>

          {/* Editing Style */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">
              Editing Style <span className="text-destructive">*</span>
            </Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {EDITING_STYLES.map((style) => {
                const isSelected = selectedStyle === style.id;
                return (
                  <motion.button
                    key={style.id}
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedStyle(style.id)}
                    className={cn(
                      "relative text-left rounded-2xl p-0 border-2 transition-all duration-200 overflow-hidden",
                      isSelected
                        ? cn(
                            "border-transparent ring-2 shadow-md",
                            style.selectedRing,
                            style.selectedBg,
                          )
                        : "border-border bg-card hover:border-primary/40 hover:bg-secondary/30",
                    )}
                  >
                    {/* Emoji thumbnail area */}
                    <div
                      className={cn(
                        "flex items-center justify-center h-16 text-4xl transition-colors duration-200",
                        isSelected ? style.iconBg : "bg-muted/50",
                      )}
                    >
                      {style.icon}
                    </div>

                    {/* Info area */}
                    <div className="p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-display font-semibold text-sm text-foreground">
                          {style.label}
                        </span>
                        {isSelected && (
                          <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">
                        {style.description}
                      </p>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Public toggle */}
          <div className="flex items-center justify-between bg-secondary rounded-2xl px-5 py-4">
            <div>
              <p className="font-medium text-foreground text-sm">
                Share to Community Gallery
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Allow others to see this photo in the public gallery
              </p>
            </div>
            <Switch checked={isPublic} onCheckedChange={setIsPublic} />
          </div>

          {/* Upload progress */}
          <AnimatePresence>
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {uploadStep === "uploading-blob" && "Uploading image..."}
                    {uploadStep === "saving" && "Saving photo..."}
                    {uploadStep === "done" && "Done!"}
                  </span>
                  {uploadStep === "uploading-blob" && (
                    <span className="text-primary font-medium">
                      {uploadProgress}%
                    </span>
                  )}
                </div>
                <Progress
                  value={
                    uploadStep === "uploading-blob"
                      ? uploadProgress
                      : uploadStep === "saving"
                        ? 95
                        : 100
                  }
                  className="h-2"
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit */}
          <Button
            type="submit"
            disabled={!selectedFile || !title.trim() || isSubmitting}
            size="lg"
            className="w-full gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {uploadStep === "uploading-blob" && "Uploading image..."}
                {uploadStep === "saving" && "Saving photo..."}
                {uploadStep === "done" && "Redirecting..."}
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                Upload Photo
              </>
            )}
          </Button>
        </form>
      </motion.div>
    </main>
  );
}
