import cors from 'cors';
import fs from 'fs';
import path from 'path';

// Try to import Vercel KV, fallback to file system if not available
let kv = null;
try {
  const kvModule = await import('@vercel/kv');
  kv = kvModule.kv;
} catch (error) {
  console.log('Vercel KV not available, using file system fallback');
}

const corsHandler = cors({
  origin: true,
  credentials: true
});

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

// Fallback storage using file system for local development

const reviewsFilePath = path.join(process.cwd(), 'reviews.json');

// Fallback storage functions for local development
const localStorageFallback = {
  get: async (key) => {
    try {
      if (fs.existsSync(reviewsFilePath)) {
        const data = fs.readFileSync(reviewsFilePath, 'utf8');
        console.log('Using file fallback - loaded reviews from file');
        return data;
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

async function handler(req, res) {
  console.log('Reviews API called with method:', req.method);

  try {
    switch (req.method) {
      case 'GET':
        // Get reviews from storage (KV or fallback)
        const reviewsData = await storage.get('customerReviews');
        let reviews = [];
        if (reviewsData) {
          try {
            reviews = JSON.parse(reviewsData);
          } catch (error) {
            console.error('Error parsing reviews data:', error);
            reviews = [];
          }
        }
        console.log(`Retrieved ${reviews.length} reviews from ${kv ? 'Vercel KV' : 'fallback storage'}`);
        res.status(200).json(reviews);
        break;

      case 'POST':
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
          try {
            existingReviews = JSON.parse(existingReviewsData);
          } catch (error) {
            console.error('Error parsing existing reviews data:', error);
            existingReviews = [];
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

        console.log(`Review submitted and saved to ${kv ? 'Vercel KV' : 'fallback storage'}:`, newReview);
        res.status(201).json({
          message: 'Review submitted successfully',
          review: newReview
        });
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
