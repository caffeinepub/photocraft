import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Save, User } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useSaveProfile,
  useUserPhotos,
  useUserProfile,
} from "../hooks/useQueries";
import { truncatePrincipal } from "../lib/photoUtils";

export function ProfilePage() {
  const { identity } = useInternetIdentity();
  const { data: profile, isLoading: isLoadingProfile } = useUserProfile();
  const { data: photos } = useUserPhotos();
  const saveProfileMutation = useSaveProfile();

  const [displayName, setDisplayName] = useState("");
  const [hasChanges, setHasChanges] = useState(false);

  const principal = identity?.getPrincipal().toString() ?? "";
  const initials = displayName
    ? displayName.slice(0, 2).toUpperCase()
    : principal
      ? principal.slice(0, 2).toUpperCase()
      : "PC";

  useEffect(() => {
    if (profile?.name) {
      setDisplayName(profile.name);
    }
  }, [profile]);

  const handleNameChange = (value: string) => {
    setDisplayName(value);
    setHasChanges(value !== (profile?.name ?? ""));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) {
      toast.error("Please enter a display name");
      return;
    }

    try {
      await saveProfileMutation.mutateAsync({ name: displayName.trim() });
      setHasChanges(false);
      toast.success("Profile updated successfully");
    } catch {
      toast.error("Failed to update profile");
    }
  };

  const publicPhotosCount = photos?.filter((p) => p.isPublic).length ?? 0;
  const privatePhotosCount = photos?.filter((p) => !p.isPublic).length ?? 0;

  return (
    <main className="container mx-auto px-4 py-10 max-w-2xl">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="font-display font-bold text-3xl text-foreground mb-8">
          Profile
        </h1>

        {/* Avatar & stats */}
        <div className="bg-card rounded-2xl shadow-card p-8 mb-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <Avatar className="h-20 w-20 border-4 border-primary/20">
              <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold font-display">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div className="text-center sm:text-left flex-1">
              <h2 className="font-display font-bold text-xl text-foreground">
                {isLoadingProfile ? (
                  <span className="inline-block h-6 w-32 bg-muted animate-pulse rounded" />
                ) : (
                  displayName || "Photography Enthusiast"
                )}
              </h2>
              <p className="text-muted-foreground text-sm mt-1 font-mono">
                {truncatePrincipal(principal)}
              </p>

              {/* Stats */}
              {photos && (
                <div className="flex items-center gap-6 mt-4 justify-center sm:justify-start">
                  <div className="text-center">
                    <p className="font-display font-bold text-2xl text-foreground">
                      {photos.length}
                    </p>
                    <p className="text-xs text-muted-foreground">Photos</p>
                  </div>
                  <div className="text-center">
                    <p className="font-display font-bold text-2xl text-foreground">
                      {publicPhotosCount}
                    </p>
                    <p className="text-xs text-muted-foreground">Public</p>
                  </div>
                  <div className="text-center">
                    <p className="font-display font-bold text-2xl text-foreground">
                      {privatePhotosCount}
                    </p>
                    <p className="text-xs text-muted-foreground">Private</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Edit form */}
        <div className="bg-card rounded-2xl shadow-card p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-primary/10 rounded-xl p-2">
              <User className="w-4 h-4 text-primary" />
            </div>
            <h3 className="font-display font-semibold text-foreground">
              Edit Profile
            </h3>
          </div>

          <form onSubmit={handleSave} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="displayName" className="text-sm font-medium">
                Display Name
              </Label>
              <Input
                id="displayName"
                value={displayName}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Amara Chen"
                maxLength={50}
                className="rounded-xl"
                disabled={isLoadingProfile}
              />
              <p className="text-xs text-muted-foreground">
                This name will be visible on your photos
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">
                Principal ID
              </Label>
              <div className="bg-secondary rounded-xl px-4 py-3 font-mono text-xs text-muted-foreground break-all">
                {principal || "Loading..."}
              </div>
              <p className="text-xs text-muted-foreground">
                Your unique blockchain identity. This cannot be changed.
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                disabled={
                  !hasChanges ||
                  saveProfileMutation.isPending ||
                  isLoadingProfile
                }
                className="gap-2"
              >
                {saveProfileMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </main>
  );
}
