import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface CreatePhoto {
    title: string;
    editingStyle: EditingStyle;
    description: string;
    blobId: string;
    isPublic: boolean;
}
export interface FullPhoto {
    id: string;
    title: string;
    owner: Principal;
    editingStyle: EditingStyle;
    description: string;
    blobId: string;
    isPublic: boolean;
    uploadedAt: bigint;
}
export interface UserProfile {
    name: string;
}
export interface PublicPhoto {
    id: string;
    title: string;
    owner: Principal;
    editingStyle: EditingStyle;
    description: string;
    blobId: string;
    isPublic: boolean;
    uploadedAt: bigint;
}
export enum EditingStyle {
    SoftGlow = "SoftGlow",
    Vintage = "Vintage",
    WarmTone = "WarmTone",
    CoolTone = "CoolTone",
    Vivid = "Vivid",
    BlackAndWhite = "BlackAndWhite"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deletePhoto(photoId: string): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getPhoto(id: string): Promise<FullPhoto>;
    getPublicPhotos(): Promise<Array<PublicPhoto>>;
    getUserPhotos(): Promise<Array<FullPhoto>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    togglePublic(photoId: string, isPublic: boolean): Promise<void>;
    uploadPhoto(createPhoto: CreatePhoto): Promise<string>;
}
