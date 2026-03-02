import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  CreatePhoto,
  FullPhoto,
  PublicPhoto,
  UserProfile,
} from "../backend.d";
import { useActor } from "./useActor";

// ─── Photos ────────────────────────────────────────────────────────────────

export function useUserPhotos() {
  const { actor, isFetching } = useActor();
  return useQuery<FullPhoto[]>({
    queryKey: ["userPhotos"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getUserPhotos();
    },
    enabled: !!actor && !isFetching,
  });
}

export function usePublicPhotos() {
  const { actor, isFetching } = useActor();
  return useQuery<PublicPhoto[]>({
    queryKey: ["publicPhotos"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPublicPhotos();
    },
    enabled: !!actor && !isFetching,
  });
}

export function usePhoto(id: string | null) {
  const { actor, isFetching } = useActor();
  return useQuery<FullPhoto | null>({
    queryKey: ["photo", id],
    queryFn: async () => {
      if (!actor || !id) return null;
      return actor.getPhoto(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useUploadPhoto() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (createPhoto: CreatePhoto) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.uploadPhoto(createPhoto);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userPhotos"] });
      queryClient.invalidateQueries({ queryKey: ["publicPhotos"] });
    },
  });
}

export function useDeletePhoto() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (photoId: string) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.deletePhoto(photoId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userPhotos"] });
      queryClient.invalidateQueries({ queryKey: ["publicPhotos"] });
    },
  });
}

export function useTogglePublic() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      photoId,
      isPublic,
    }: {
      photoId: string;
      isPublic: boolean;
    }) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.togglePublic(photoId, isPublic);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userPhotos"] });
      queryClient.invalidateQueries({ queryKey: ["publicPhotos"] });
    },
  });
}

// ─── Profile ───────────────────────────────────────────────────────────────

export function useUserProfile() {
  const { actor, isFetching } = useActor();
  return useQuery<UserProfile | null>({
    queryKey: ["userProfile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });
}
