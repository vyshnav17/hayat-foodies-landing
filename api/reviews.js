import cors from 'cors';

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

async function handler(req, res) {
  console.log('Reviews API called with method:', req.method);

  try {
    switch (req.method) {
      case 'GET':
        // Return reviews from localStorage (in production, this would be from a database)
        // Since this is a serverless function, we'll return empty array
        // Reviews are stored client-side in localStorage
        res.status(200).json([]);
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

        // In a real application, you would save to a database
        // For now, we'll just return success since reviews are stored client-side
        const newReview = {
          id: Date.now().toString(),
          name,
          email,
          rating: parseInt(rating),
          review,
          timestamp: new Date().toISOString(),
          verified: false
        };

        console.log('Review submitted:', newReview);
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
