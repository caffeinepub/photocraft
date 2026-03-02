# PhotoCraft

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- User account creation and authentication (via Caffeine authorization component)
- Image upload with title, description, and editing style selection
- Gallery view showing the user's uploaded photos with style tags
- Individual photo detail page with full-size view and download button
- Editing style options: Vintage, Vivid, Soft Glow, Black & White, Warm Tone, Cool Tone
- Sample/demo content for new users to explore
- Mobile-friendly responsive layout with pastel-colored modern design

### Modify
- N/A (new project)

### Remove
- N/A (new project)

## Implementation Plan

### Backend (Motoko)
- User data model: principal-based identity via authorization component
- Photo record: id, owner (principal), title, description, blobId (from blob-storage), editingStyle, uploadedAt, status
- CRUD operations: uploadPhoto, getMyPhotos, getPhotoById, deletePhoto
- EditingStyle type: variant of Vintage | Vivid | SoftGlow | BlackAndWhite | WarmTone | CoolTone
- Query: getAllPublicPhotos for community gallery

### Frontend (React + TypeScript)
- Landing page with hero section and sample gallery
- Auth-gated upload flow: choose image, set title/description, pick editing style, submit
- Dashboard: "My Photos" grid with thumbnails, style badges, and delete option
- Community gallery: public grid of all uploaded photos
- Photo detail modal/page: full image, metadata, download button
- Responsive design: pastel color palette, clean card-based UI, mobile-first layout
