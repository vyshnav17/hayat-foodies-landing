# TODO: Fix Gallery Alt Text Issue

## Current Status
- Image upload feature is working, but alt text is not visible in gallery
- Alt text falls back to filename because Vercel Blob metadata isn't returned in list API

## Tasks
- [x] Modify upload logic in api/gallery.js to encode alt text into blob path
- [x] Update retrieval logic in api/gallery.js to parse alt text from pathname
- [ ] Test upload and verify alt text displays correctly in gallery

## Implementation Details
- Encode alt text as slug (replace spaces with hyphens, remove special chars)
- Blob path format: `gallery/timestamp-altSlug-filename`
- Parse alt text by splitting pathname and decoding slug
