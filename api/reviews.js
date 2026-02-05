import cors from 'cors';
import prisma from '../src/lib/prisma.js';

const corsHandler = cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
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

async function handler(req, res) {
  res.setHeader('X-Storage-Type', 'Prisma-SQLite');

  try {
    switch (req.method) {
      case 'GET':
        try {
          const reviews = await prisma.review.findMany({
            orderBy: { createdAt: 'desc' }
          });

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

          // Create new review
          const newReview = await prisma.review.create({
            data: {
              name,
              email,
              rating: parseInt(rating),
              review,
              verified: false
            }
          });

          console.log(`Review submitted and saved.`);
          res.status(201).json({
            message: 'Review submitted successfully',
            review: newReview
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
