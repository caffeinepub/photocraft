import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import Order "mo:core/Order";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import MixinStorage "blob-storage/Mixin";
import AccessControl "authorization/access-control";
import Storage "blob-storage/Storage";

actor {
  // Components
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  type EditingStyle = {
    #Vintage;
    #Vivid;
    #SoftGlow;
    #BlackAndWhite;
    #WarmTone;
    #CoolTone;
  };

  // Photo type definitions
  type FullPhoto = {
    id : Text;
    owner : Principal;
    title : Text;
    description : Text;
    blobId : Text;
    editingStyle : EditingStyle;
    uploadedAt : Int;
    isPublic : Bool;
  };

  module FullPhoto {
    public func compareByUploadedAt(photo1 : FullPhoto, photo2 : FullPhoto) : Order.Order {
      Int.compare(photo1.uploadedAt, photo2.uploadedAt);
    };
  };

  type CreatePhoto = {
    blobId : Text;
    title : Text;
    description : Text;
    editingStyle : EditingStyle;
    isPublic : Bool;
  };

  type PublicPhoto = FullPhoto;

  // User profile type
  public type UserProfile = {
    name : Text;
  };

  // Storage
  let photos = Map.empty<Text, FullPhoto>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // User profile functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Photo functions
  public shared ({ caller }) func uploadPhoto(createPhoto : CreatePhoto) : async Text {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: You must be authenticated to upload a photo");
    };

    let id = createPhoto.blobId;
    let fullPhoto : FullPhoto = {
      id;
      owner = caller;
      title = createPhoto.title;
      description = createPhoto.description;
      blobId = createPhoto.blobId;
      editingStyle = createPhoto.editingStyle;
      uploadedAt = Time.now();
      isPublic = createPhoto.isPublic;
    };

    photos.add(id, fullPhoto);
    id;
  };

  public query ({ caller }) func getUserPhotos() : async [FullPhoto] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: You must be authenticated to view your photos");
    };

    let userPhotos = photos.values().toArray().filter(
      func(photo) {
        photo.owner == caller;
      }
    );
    userPhotos.sort(FullPhoto.compareByUploadedAt);
  };

  public query ({ caller }) func getPhoto(id : Text) : async FullPhoto {
    switch (photos.get(id)) {
      case (null) { Runtime.trap("Photo not found") };
      case (?photo) {
        // Public photos can be viewed by anyone (including guests)
        if (photo.isPublic) {
          return photo;
        };
        
        // Private photos require authentication and ownership
        if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
          Runtime.trap("Unauthorized: You must be authenticated to view private photos");
        };
        
        if (photo.owner != caller) {
          Runtime.trap("Unauthorized: Not authorized to view this photo");
        };
        
        photo;
      };
    };
  };

  public query ({ caller }) func getPublicPhotos() : async [PublicPhoto] {
    let publicPhotos = photos.values().toArray().filter(
      func(photo) {
        photo.isPublic;
      }
    );
    publicPhotos.sort(FullPhoto.compareByUploadedAt);
  };

  public shared ({ caller }) func deletePhoto(photoId : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: You must be authenticated to delete photos");
    };

    let photo = switch (photos.get(photoId)) {
      case (null) { Runtime.trap("Photo not found") };
      case (?p) { p };
    };

    if (photo.owner != caller) {
      Runtime.trap("Unauthorized: Not authorized to delete this photo");
    };

    photos.remove(photoId);
  };

  public shared ({ caller }) func togglePublic(photoId : Text, isPublic : Bool) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: You must be authenticated to update photos");
    };

    let photo = switch (photos.get(photoId)) {
      case (null) { Runtime.trap("Photo not found") };
      case (?p) { p };
    };

    if (photo.owner != caller) {
      Runtime.trap("Unauthorized: Not authorized to update this photo");
    };

    let updatedPhoto = {
      photo with
      isPublic
    };

    photos.add(photoId, updatedPhoto);
  };
};
