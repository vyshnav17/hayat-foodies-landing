import cors from 'cors';
import fs from 'fs';
import path from 'path';

// Try to import Vercel KV, fallback to file system if not available
let kv = null;
try {
  console.log('Attempting to import @vercel/kv...');
  const kvModule = await import('@vercel/kv');
  console.log('@vercel/kv imported successfully.');

  // Log env var presence (masked)
  console.log('KV_REST_API_URL present:', !!process.env.KV_REST_API_URL);
  console.log('KV_REST_API_TOKEN present:', !!process.env.KV_REST_API_TOKEN);

  // Check if KV is actually configured
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    kv = kvModule.kv;
    console.log('Vercel KV configured and ready.');
  } else {
    console.log('Vercel KV environment variables missing, using file system fallback.');
  }
} catch (error) {
  console.error('Error initializing Vercel KV:', error);
  if (error.code === 'MODULE_NOT_FOUND') {
    console.log('Module @vercel/kv not found. Ensure it is in dependencies.');
  }
}

const corsHandler = cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
});

// Fallback storage using file system for local development
const reviewsFilePath = path.join(process.cwd(), 'reviews.json');

const localStorageFallback = {
  get: async (key) => {
    try {
      if (fs.existsSync(reviewsFilePath)) {
        const data = fs.readFileSync(reviewsFilePath, 'utf8');
        console.log('Using file fallback - loaded reviews from file');
        return JSON.parse(data);
      }
    } catch (error) {
      console.error('Error reading reviews file:', error);
    }
    console.log('Using file fallback - no reviews file found');
    return null;
  },
  set: async (key, value) => {
    try {
      fs.writeFileSync(reviewsFilePath, value, 'utf8');
      console.log('Using file fallback - saved reviews to file');
    } catch (error) {
      console.error('Error writing reviews file:', error);
    }
  }
};

const storage = kv || localStorageFallback;

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

async function handler(req, res) {
  // Add debug header to indicate storage type
  const storageType = kv ? 'Vercel-KV' : 'File-System-Fallback';
  res.setHeader('X-Storage-Type', storageType);
  console.log(`Reviews API called: ${req.method} | Storage: ${storageType}`);

  try {
    switch (req.method) {
      case 'GET':
        try {
          // Get reviews from storage (KV or fallback)
          const reviewsData = await storage.get('customerReviews');
          let reviews = [];

          if (reviewsData) {
            if (typeof reviewsData === 'string') {
              try {
                reviews = JSON.parse(reviewsData);
              } catch (error) {
                console.error('Error parsing reviews data:', error);
                reviews = [];
              }
            } else {
              reviews = reviewsData;
            }
          }

          console.log(`Retrieved ${reviews.length} reviews`);
          res.status(200).json(reviews);
        } catch (error) {
          console.error('Error fetching reviews:', error);
          res.status(200).json([]); // Return empty list on error
        }
        break;

      case 'POST':
        try {
          const { name, email, rating, review } = req.body;

          // Validate required fields
          if (!name || !email || !rating || !review) {
            return res.status(400).json({ error: 'All fields are required' });
          }

          // Validate rating
          if (rating < 1 || rating > 5) {
            return res.status(400).json({ error: 'Rating must be between 1 and 5' });
          }

          // Get existing reviews
          const existingReviewsData = await storage.get('customerReviews');
          let existingReviews = [];
          if (existingReviewsData) {
            if (typeof existingReviewsData === 'string') {
              try {
                existingReviews = JSON.parse(existingReviewsData);
              } catch (error) {
                console.error('Error parsing existing reviews data:', error);
                existingReviews = [];
              }
            } else {
              existingReviews = existingReviewsData;
            }
          }

          // Create new review
          const newReview = {
            id: Date.now().toString(),
            name,
            email,
            rating: parseInt(rating),
            review,
            timestamp: new Date().toISOString(),
            verified: false
          };

          // Add to existing reviews (newest first)
          const updatedReviews = [newReview, ...existingReviews];

          // Save to storage
          await storage.set('customerReviews', JSON.stringify(updatedReviews));

          console.log(`Review submitted and saved. New count: ${updatedReviews.length}`);
          res.status(201).json({
            message: 'Review submitted successfully',
            review: newReview,
            debug: { storageType }
          });
        } catch (error) {
          console.error('Error submitting review:', error);
          res.status(500).json({ error: 'Failed to submit review' });
        }
        break;

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).json({ error: `Method ${req.method} not allowed` });
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}

export default wrapCors(handler);
