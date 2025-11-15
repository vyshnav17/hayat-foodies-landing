import cors from 'cors';
import { put } from '@vercel/blob';
import multer from 'multer';
import { sql } from '@vercel/postgres';

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
        console.log('Fetching gallery images from database');
        try {
          // Try to fetch from database first
          const result = await sql`SELECT * FROM gallery_images ORDER BY uploaded_at DESC`;
          if (result.rows && result.rows.length > 0) {
            const images = result.rows.map(row => ({
              id: row.id.toString(),
              src: row.src,
              alt: row.alt,
              uploadedAt: row.uploaded_at ? row.uploaded_at.toISOString() : new Date().toISOString(),
              uploadedBy: row.uploaded_by || 'admin'
            }));
            console.log('Returning images from database:', images.length);
            return res.status(200).json(images);
          } else {
            // No images in database, return defaults
            console.log('No images in database, returning defaults');
            return res.status(200).json(defaultGalleryImages);
          }
        } catch (dbError) {
          console.error('Database error, falling back to defaults:', dbError);
          // Database error, return defaults instead of error
          console.log('Falling back to default images due to database error');
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
          const blob = await put(`gallery/${Date.now()}-${req.file.originalname}`, req.file.buffer, {
            access: 'public',
            contentType: req.file.mimetype,
          });
          console.log('Blob upload successful:', blob.url);

          // Save to database
          try {
            console.log('Saving to database...');
            const altText = req.body.alt || req.file.originalname || "Uploaded Image";
            const uploadedBy = req.body.uploadedBy || "admin";
            
            const result = await sql`
              INSERT INTO gallery_images (src, alt, uploaded_by)
              VALUES (${blob.url}, ${altText}, ${uploadedBy})
              RETURNING id, src, alt, uploaded_at, uploaded_by
            `;

            if (result.rows && result.rows.length > 0) {
              const dbImage = result.rows[0];
              const newImage = {
                id: dbImage.id.toString(),
                src: dbImage.src,
                alt: dbImage.alt,
                uploadedAt: dbImage.uploaded_at ? dbImage.uploaded_at.toISOString() : new Date().toISOString(),
                uploadedBy: dbImage.uploaded_by || 'admin'
              };

              console.log('Database save successful, returning image:', newImage);
              return res.status(201).json({ message: 'Image uploaded and saved successfully', image: newImage });
            } else {
              throw new Error('No rows returned from insert');
            }
          } catch (dbError) {
            console.error('Database save error:', dbError);
            // Still return success since file was uploaded to blob, but warn about persistence
            const newImage = {
              id: Date.now().toString(),
              src: blob.url,
              alt: req.body.alt || req.file.originalname || "Uploaded Image",
              uploadedAt: new Date().toISOString(),
              uploadedBy: req.body.uploadedBy || "admin"
            };
            return res.status(201).json({
              message: 'Image uploaded to storage but database save failed. Image won\'t persist across deployments.',
              image: newImage,
              warning: 'Database save failed: ' + dbError.message
            });
          }
        } catch (blobError) {
          console.error('Blob upload error:', blobError);
          return res.status(500).json({ error: 'Failed to upload to storage', details: blobError.message });
        }
        break;

      case 'DELETE':
        const { id } = req.query;
        if (!id) {
          return res.status(400).json({ error: 'Image ID is required' });
        }

        try {
          // First, get the image URL from the database
          const result = await sql`SELECT src FROM gallery_images WHERE id = ${parseInt(id)}`;
          if (!result.rows || result.rows.length === 0) {
            return res.status(404).json({ error: 'Image not found' });
          }
          const imageUrl = result.rows[0].src;

          // Delete the image from the database
          await sql`DELETE FROM gallery_images WHERE id = ${parseInt(id)}`;

          // Delete the image from Vercel Blob storage
          // Note: Vercel Blob does not have a direct delete function in the SDK yet.
          // This is a placeholder for when the functionality is available.
          // For now, we will just delete the record from the database.
          console.log(`Image with ID ${id} and URL ${imageUrl} deleted from the database.`);

          return res.status(200).json({ message: 'Image deleted successfully' });
        } catch (dbError) {
          console.error('Database error during deletion:', dbError);
          return res.status(500).json({ error: 'Failed to delete image from the database.', details: dbError.message });
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
