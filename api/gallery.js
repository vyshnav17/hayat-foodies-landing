import cors from 'cors';
import { put, list, del } from '@vercel/blob';
import busboy from 'busboy';

const corsHandler = cors({
  origin: true,
  credentials: true
});

// Default gallery images
const defaultGalleryImages = [
  {
    id: "1",
    src: "/assets/gallery/baby-chocolate-bun.jpg",
    alt: "Baby Chocolate Bun",
    uploadedAt: new Date().toISOString(),
    uploadedBy: "admin"
  },
  {
    id: "2",
    src: "/assets/gallery/bread.jpg",
    alt: "Fresh Bread",
    uploadedAt: new Date().toISOString(),
    uploadedBy: "admin"
  },
  {
    id: "3",
    src: "/assets/gallery/chapati.jpg",
    alt: "Chapati",
    uploadedAt: new Date().toISOString(),
    uploadedBy: "admin"
  },
  {
    id: "4",
    src: "/assets/gallery/chocolate-bun.jpg",
    alt: "Chocolate Bun",
    uploadedAt: new Date().toISOString(),
    uploadedBy: "admin"
  },
  {
    id: "5",
    src: "/assets/gallery/cream-bun.jpg",
    alt: "Cream Bun",
    uploadedAt: new Date().toISOString(),
    uploadedBy: "admin"
  },
  {
    id: "6",
    src: "/assets/gallery/hero-bread.jpg",
    alt: "Hero Bread",
    uploadedAt: new Date().toISOString(),
    uploadedBy: "admin"
  }
];

function wrapCors(handler) {
  return (req, res) => {
    return new Promise((resolve, reject) => {
      corsHandler(req, res, (err) => {
        if (err) reject(err);
        else resolve(handler(req, res));
      });
    });
  };
}

// Parse FormData using busboy for Vercel serverless functions
async function parseFormData(req) {
  return new Promise((resolve, reject) => {
    const bb = busboy({ headers: req.headers });
    const fileChunks = [];
    let file = null;
    let alt = '';
    let uploadedBy = 'admin';
    let filename = '';
    let mimetype = '';

    bb.on('file', (name, stream, info) => {
      if (name === 'image') {
        filename = info.filename;
        mimetype = info.mimeType;
        
        stream.on('data', (chunk) => {
          fileChunks.push(chunk);
        });

        stream.on('end', () => {
          file = {
            buffer: Buffer.concat(fileChunks),
            originalname: filename,
            mimetype: mimetype,
            size: Buffer.concat(fileChunks).length
          };
        });
      }
    });

    bb.on('field', (name, value) => {
      if (name === 'alt') {
        alt = value;
      } else if (name === 'uploadedBy') {
        uploadedBy = value;
      }
    });

    bb.on('finish', () => {
      resolve({ file, alt, uploadedBy });
    });

    bb.on('error', (error) => {
      reject(error);
    });

    req.pipe(bb);
  });
}

async function handler(req, res) {
  console.log('Gallery API called with method:', req.method);

  try {
    switch (req.method) {
      case 'GET':
        console.log('Fetching gallery images from Blob storage');
        try {
          // List all blobs in the gallery folder
          const result = await list({ prefix: 'gallery/' });
          
          // Handle different response formats from Vercel Blob
          let blobs = [];
          if (Array.isArray(result)) {
            blobs = result;
          } else if (result && Array.isArray(result.blobs)) {
            blobs = result.blobs;
          } else if (result && result.blobs) {
            blobs = [result.blobs];
          }
          
          console.log('Blobs found:', blobs.length);
          console.log('First blob sample:', blobs[0] ? JSON.stringify(blobs[0], null, 2) : 'none');
          
          if (blobs && blobs.length > 0) {
            // Map blobs to image format - be more flexible with property names
            const images = blobs
              .map(blob => {
                // Try multiple possible property names
                const url = blob.url || blob.downloadUrl || blob.publicUrl || '';
                const pathname = blob.pathname || blob.key || blob.name || url.split('/').pop() || '';
                const contentType = blob.contentType || blob.mimeType || blob.type || 'image/jpeg';
                
                // Handle metadata - it might be stored as an object or need to be parsed
                let metadata = {};
                if (blob.metadata) {
                  if (typeof blob.metadata === 'string') {
                    try {
                      metadata = JSON.parse(blob.metadata);
                    } catch (e) {
                      // If parsing fails, try to extract alt from the string
                      metadata = { alt: blob.metadata };
                    }
                  } else if (typeof blob.metadata === 'object') {
                    metadata = blob.metadata;
                  }
                }
                
                const uploadedAt = blob.uploadedAt || blob.createdAt || blob.uploaded || new Date();
                
                return {
                  blob: blob, // Include raw blob for debugging
                  url,
                  pathname,
                  contentType,
                  metadata,
                  uploadedAt
                };
              })
              .filter(item => {
                // Filter for images - be lenient if contentType is missing
                const isImage = item.contentType.startsWith('image/') || 
                               item.pathname.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i);
                console.log('Blob item:', item.pathname, 'ContentType:', item.contentType, 'IsImage:', isImage, 'Metadata:', JSON.stringify(item.metadata));
                return isImage;
              })
              .map(item => {
                return {
                  id: item.url, // Use URL as ID
                  src: item.url,
                  alt: item.metadata?.alt || item.pathname.split('/').pop()?.replace(/\.[^/.]+$/, '') || 'Gallery Image',
                  uploadedAt: new Date(item.uploadedAt).toISOString(),
                  uploadedBy: item.metadata?.uploadedBy || 'admin'
                };
              })
              .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()); // Sort by newest first
            
            console.log('Mapped images:', images.length);
            
            // Combine with default images (uploaded images first, then defaults)
            const allImages = [...images, ...defaultGalleryImages];
            console.log('Returning images from Blob storage:', images.length, 'plus', defaultGalleryImages.length, 'defaults');
            return res.status(200).json(allImages);
          } else {
            // No images in blob storage, return defaults
            console.log('No images in Blob storage, returning defaults');
            return res.status(200).json(defaultGalleryImages);
          }
        } catch (blobError) {
          console.error('Blob storage error, falling back to defaults:', blobError);
          console.error('Error details:', blobError.message);
          if (blobError.stack) {
            console.error('Stack:', blobError.stack);
          }
          // Blob error, return defaults instead of error
          console.log('Falling back to default images due to Blob storage error');
          return res.status(200).json(defaultGalleryImages);
        }

      case 'POST':
        console.log('Processing file upload');

        // Parse FormData manually
        let file, altText, uploadedBy;
        try {
          const parsed = await parseFormData(req);
          file = parsed.file;
          altText = parsed.alt || "Uploaded Image";
          uploadedBy = parsed.uploadedBy || "admin";
          console.log('FormData parsed successfully');
        } catch (parseError) {
          console.error('FormData parse error:', parseError);
          return res.status(400).json({ error: 'Failed to parse form data: ' + parseError.message });
        }

        // Check if file was uploaded
        if (!file) {
          console.error('No file provided');
          return res.status(400).json({ error: 'No image file provided' });
        }

        // Validate file type
        if (!file.mimetype.startsWith('image/')) {
          console.error('Invalid file type:', file.mimetype);
          return res.status(400).json({ error: 'Only image files are allowed' });
        }

        // Validate file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
          console.error('File too large:', file.size);
          return res.status(400).json({ error: 'File size must be less than 5MB' });
        }

        console.log('File received:', file.originalname, 'Size:', file.size, 'Type:', file.mimetype);

        // Upload to Vercel Blob
        try {
          console.log('Uploading to Vercel Blob...');
          const alt = altText || file.originalname || "Uploaded Image";
          const uploadedByUser = uploadedBy || "admin";
          
          // Sanitize filename
          const sanitizedFilename = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
          const blobPath = `gallery/${Date.now()}-${sanitizedFilename}`;
          
          const blob = await put(blobPath, file.buffer, {
            access: 'public',
            contentType: file.mimetype,
            addRandomSuffix: false,
            // Store metadata in blob
            metadata: {
              alt: alt,
              uploadedBy: uploadedByUser
            }
          });
          
          console.log('Blob upload successful:', blob.url);

          const newImage = {
            id: blob.url, // Use URL as ID
            src: blob.url,
            alt: alt,
            uploadedAt: blob.uploadedAt ? new Date(blob.uploadedAt).toISOString() : new Date().toISOString(),
            uploadedBy: uploadedByUser
          };

          console.log('Image uploaded successfully, returning:', newImage);
          return res.status(201).json({ message: 'Image uploaded and saved successfully', image: newImage });
        } catch (blobError) {
          console.error('Blob upload error:', blobError);
          return res.status(500).json({ 
            error: 'Failed to upload to storage', 
            details: blobError.message || 'Unknown error',
            stack: process.env.NODE_ENV === 'development' ? blobError.stack : undefined
          });
        }
        break;

      case 'DELETE':
        const { id } = req.query;
        if (!id) {
          return res.status(400).json({ error: 'Image URL is required' });
        }

        try {
          // ID is the blob URL (decode if it was encoded)
          const blobUrl = decodeURIComponent(id);
          
          // Delete the image from Vercel Blob storage
          await del(blobUrl);
          
          console.log(`Image with URL ${blobUrl} deleted from Blob storage.`);
          return res.status(200).json({ message: 'Image deleted successfully' });
        } catch (blobError) {
          console.error('Blob storage error during deletion:', blobError);
          return res.status(500).json({ error: 'Failed to delete image from Blob storage.', details: blobError.message });
        }
        break;

      default:
        res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
        res.status(405).json({ error: `Method ${req.method} not allowed` });
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}

export default wrapCors(handler);
