import cors from 'cors';
import { put, list, del } from '@vercel/blob';
import multer from 'multer';

const corsHandler = cors({
  origin: true,
  credentials: true
});

// Configure multer for memory storage (for Vercel Blob)
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check if file is an image
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
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

// Middleware to handle file uploads
function uploadMiddleware(req, res) {
  return new Promise((resolve, reject) => {
    upload.single('image')(req, res, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
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
          const { blobs } = await list({ prefix: 'gallery/' });
          
          if (blobs && blobs.length > 0) {
            // Map blobs to image format
            const images = blobs
              .filter(blob => blob.contentType && blob.contentType.startsWith('image/'))
              .map(blob => ({
                id: blob.url, // Use URL as ID
                src: blob.url,
                alt: blob.metadata?.alt || blob.pathname.split('/').pop() || 'Gallery Image',
                uploadedAt: blob.uploadedAt ? new Date(blob.uploadedAt).toISOString() : new Date().toISOString(),
                uploadedBy: blob.metadata?.uploadedBy || 'admin'
              }))
              .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()); // Sort by newest first
            
            // Combine with default images
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
          // Blob error, return defaults instead of error
          console.log('Falling back to default images due to Blob storage error');
          return res.status(200).json(defaultGalleryImages);
        }

      case 'POST':
        console.log('Processing file upload');

        // Handle file upload
        try {
          await uploadMiddleware(req, res);
          console.log('Upload middleware passed');
        } catch (uploadError) {
          console.error('Upload middleware error:', uploadError);
          return res.status(400).json({ error: uploadError.message || 'File upload failed' });
        }

        // Check if file was uploaded
        if (!req.file) {
          console.error('No file provided');
          return res.status(400).json({ error: 'No image file provided' });
        }

        console.log('File received:', req.file.originalname, 'Size:', req.file.size);

        // Upload to Vercel Blob
        try {
          console.log('Uploading to Vercel Blob...');
          const altText = req.body.alt || req.file.originalname || "Uploaded Image";
          const uploadedBy = req.body.uploadedBy || "admin";
          
          const blob = await put(`gallery/${Date.now()}-${req.file.originalname}`, req.file.buffer, {
            access: 'public',
            contentType: req.file.mimetype,
            addRandomSuffix: false,
            // Store metadata in blob
            metadata: {
              alt: altText,
              uploadedBy: uploadedBy
            }
          });
          
          console.log('Blob upload successful:', blob.url);

          const newImage = {
            id: blob.url, // Use URL as ID
            src: blob.url,
            alt: altText,
            uploadedAt: blob.uploadedAt ? new Date(blob.uploadedAt).toISOString() : new Date().toISOString(),
            uploadedBy: uploadedBy
          };

          console.log('Image uploaded successfully, returning:', newImage);
          return res.status(201).json({ message: 'Image uploaded and saved successfully', image: newImage });
        } catch (blobError) {
          console.error('Blob upload error:', blobError);
          return res.status(500).json({ error: 'Failed to upload to storage', details: blobError.message });
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
