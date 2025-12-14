import express from 'express';
import cors from 'cors';
import productsHandler from './api/products.js';
import reviewsHandler from './api/reviews.js';
import analyticsHandler from './api/analytics.js';
import usersHandler from './api/users.js';

const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors());

// Helper to adapt Vercel-style handlers to Express
const adaptHandler = (handler) => async (req, res) => {
    try {
        await handler(req, res);
    } catch (error) {
        console.error('Handler Error:', error);
        if (!res.headersSent) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
};

// Routes
app.all('/api/products', adaptHandler(productsHandler));
app.all('/api/reviews', adaptHandler(reviewsHandler));
app.all('/api/analytics', adaptHandler(analyticsHandler));
app.all('/api/users', adaptHandler(usersHandler));

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('API Endpoints:');
    console.log(`- http://localhost:${PORT}/api/products`);
    console.log(`- http://localhost:${PORT}/api/reviews`);
    console.log(`- http://localhost:${PORT}/api/analytics`);
    console.log(`- http://localhost:${PORT}/api/users`);
});
