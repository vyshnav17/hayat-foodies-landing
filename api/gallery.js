import cors from 'cors';
import { put } from '@vercel/blob';
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
        console.log('Returning default gallery images');
        // Return default gallery images since Firebase is removed
        res.status(200).json(defaultGalleryImages);
        break;

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
          const blob = await put(`gallery/${Date.now()}-${req.file.originalname}`, req.file.buffer, {
            access: 'public',
            contentType: req.file.mimetype,
          });
          console.log('Blob upload successful:', blob.url);

          // Create image metadata
          const newImage = {
            id: Date.now().toString(),
            src: blob.url,
            alt: req.body.alt || req.file.originalname || "Uploaded Image",
            uploadedAt: new Date().toISOString(),
            uploadedBy: req.body.uploadedBy || "admin"
          };

          console.log('Returning success response');
          res.status(201).json({ message: 'Image uploaded successfully', image: newImage });
        } catch (blobError) {
          console.error('Blob upload error:', blobError);
          return res.status(500).json({ error: 'Failed to upload to storage' });
        }
        break;

      case 'DELETE':
        // No-op since Firebase is removed
        res.status(200).json({ message: 'Image deletion ignored (Firebase removed)' });
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
