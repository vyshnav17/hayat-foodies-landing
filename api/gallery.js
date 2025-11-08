import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const corsHandler = cors({
  origin: true,
  credentials: true
});

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), 'public', 'assets', 'gallery');
    // Ensure directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, 'uploaded-' + uniqueSuffix + extension);
  }
});

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
  try {
    switch (req.method) {
      case 'GET':
        // Return default gallery images since Firebase is removed
        res.status(200).json(defaultGalleryImages);
        break;

      case 'POST':
        // Handle file upload
        try {
          await uploadMiddleware(req, res);
        } catch (uploadError) {
          console.error('Upload error:', uploadError);
          return res.status(400).json({ error: uploadError.message || 'File upload failed' });
        }

        // Check if file was uploaded
        if (!req.file) {
          return res.status(400).json({ error: 'No image file provided' });
        }

        // Create image metadata
        const imagePath = `/assets/gallery/${req.file.filename}`;
        const newImage = {
          id: Date.now().toString(),
          src: imagePath,
          alt: req.body.alt || req.file.originalname || "Uploaded Image",
          uploadedAt: new Date().toISOString(),
          uploadedBy: req.body.uploadedBy || "admin"
        };

        res.status(201).json({ message: 'Image uploaded successfully', image: newImage });
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
    res.status(500).json({ error: 'Internal server error' });
  }
}

export default wrapCors(handler);
