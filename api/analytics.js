import cors from 'cors';
import fs from 'fs';
import path from 'path';

// Try to import Vercel KV, fallback to file system if not available
let kv = null;
try {
    // Dynamic import to avoid build errors if package is missing or env vars are missing
    const kvModule = await import('@vercel/kv');
    // Check if KV is actually configured by checking for one of the required env vars
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
        kv = kvModule.kv;
    } else {
        console.log('Vercel KV environment variables missing, using file system fallback');
    }
} catch (error) {
    console.log('Vercel KV package not available or error importing, using file system fallback');
}

const corsHandler = cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
});

// Fallback storage using file system for local development
const analyticsFilePath = path.join(process.cwd(), 'analytics.json');

const localStorageFallback = {
    get: async (key) => {
        try {
            if (fs.existsSync(analyticsFilePath)) {
                const data = fs.readFileSync(analyticsFilePath, 'utf8');
                const json = JSON.parse(data);
                return json[key] || [];
            }
        } catch (error) {
            console.error('Error reading analytics file:', error);
        }
        return [];
    },
    set: async (key, value) => {
        try {
            let allData = {};
            if (fs.existsSync(analyticsFilePath)) {
                try {
                    allData = JSON.parse(fs.readFileSync(analyticsFilePath, 'utf8'));
                } catch (e) {
                    allData = {};
                }
            }

            // Value comes in as a stringified JSON if it's from the main logic, 
            // but for our file fallback we want to store the object structure
            // However, the kv interface expects set(key, value).
            // If we are mimicking KV, we should store what is passed.
            // But for simplicity in this specific fallback implementation:
            allData[key] = typeof value === 'string' ? JSON.parse(value) : value;

            fs.writeFileSync(analyticsFilePath, JSON.stringify(allData, null, 2), 'utf8');
        } catch (error) {
            console.error('Error writing analytics file:', error);
        }
    },
    // Helper to push to a list (simulating lpush/rpush)
    lpush: async (key, value) => {
        try {
            let allData = {};
            if (fs.existsSync(analyticsFilePath)) {
                try {
                    allData = JSON.parse(fs.readFileSync(analyticsFilePath, 'utf8'));
                } catch (e) {
                    allData = {};
                }
            }

            if (!allData[key]) allData[key] = [];
            // value might be an object or string
            allData[key].unshift(value);

            fs.writeFileSync(analyticsFilePath, JSON.stringify(allData, null, 2), 'utf8');
            return allData[key].length;
        } catch (error) {
            console.error('Error writing analytics file:', error);
            return 0;
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
    res.setHeader('X-Storage-Type', kv ? 'Vercel-KV' : 'File-System-Fallback');

    try {
        switch (req.method) {
            case 'GET':
                try {
                    // Fetch analytics data
                    // We'll fetch the last 1000 page views and events for visualization
                    let pageViews = [];
                    let events = [];

                    if (kv) {
                        // Vercel KV specific commands
                        pageViews = await kv.lrange('analytics:pageviews', 0, 999);
                        events = await kv.lrange('analytics:events', 0, 999);
                    } else {
                        // Local fallback
                        pageViews = await localStorageFallback.get('analytics:pageviews');
                        events = await localStorageFallback.get('analytics:events');
                        // Limit to 1000
                        if (pageViews.length > 1000) pageViews = pageViews.slice(0, 1000);
                        if (events.length > 1000) events = events.slice(0, 1000);
                    }

                    res.status(200).json({
                        pageViews,
                        events
                    });
                } catch (error) {
                    console.error('Error fetching analytics:', error);
                    res.status(500).json({ error: 'Failed to fetch analytics' });
                }
                break;

            case 'POST':
                try {
                    const { type, data } = req.body;

                    if (!type || !data) {
                        return res.status(400).json({ error: 'Type and data are required' });
                    }

                    const timestamp = new Date().toISOString();
                    const payload = { ...data, timestamp };

                    if (type === 'pageview') {
                        if (kv) {
                            await kv.lpush('analytics:pageviews', payload);
                        } else {
                            await localStorageFallback.lpush('analytics:pageviews', payload);
                        }
                    } else if (type === 'event') {
                        if (kv) {
                            await kv.lpush('analytics:events', payload);
                        } else {
                            await localStorageFallback.lpush('analytics:events', payload);
                        }
                    } else {
                        return res.status(400).json({ error: 'Invalid analytics type' });
                    }

                    res.status(201).json({ success: true });
                } catch (error) {
                    console.error('Error tracking analytics:', error);
                    res.status(500).json({ error: 'Failed to track analytics' });
                }
                break;

            default:
                res.setHeader('Allow', ['GET', 'POST']);
                res.status(405).json({ error: `Method ${req.method} not allowed` });
        }
    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export default wrapCors(handler);
