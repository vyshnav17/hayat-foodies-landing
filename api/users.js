import cors from 'cors';
import fs from 'fs';
import path from 'path';

// Try to import Vercel KV, fallback to file system if not available
let kv = null;
try {
    const kvModule = await import('@vercel/kv');
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
const usersFilePath = path.join(process.cwd(), 'users.json');

const localStorageFallback = {
    get: async (key) => {
        try {
            if (fs.existsSync(usersFilePath)) {
                const data = fs.readFileSync(usersFilePath, 'utf8');
                const json = JSON.parse(data);
                return json[key] || [];
            }
        } catch (error) {
            console.error('Error reading users file:', error);
        }
        return [];
    },
    set: async (key, value) => {
        try {
            let allData = {};
            if (fs.existsSync(usersFilePath)) {
                try {
                    allData = JSON.parse(fs.readFileSync(usersFilePath, 'utf8'));
                } catch (e) {
                    allData = {};
                }
            }

            allData[key] = typeof value === 'string' ? JSON.parse(value) : value;
            fs.writeFileSync(usersFilePath, JSON.stringify(allData, null, 2), 'utf8');
        } catch (error) {
            console.error('Error writing users file:', error);
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

async function getLocationFromIP(ip) {
    try {
        // If running locally, IP might be ::1 or 127.0.0.1
        if (ip === '::1' || ip === '127.0.0.1') {
            return { city: 'Localhost', country: 'Dev', region: 'Local' };
        }

        const response = await fetch(`http://ip-api.com/json/${ip}`);
        const data = await response.json();
        if (data.status === 'success') {
            return {
                city: data.city,
                country: data.country,
                region: data.regionName,
                lat: data.lat,
                lon: data.lon
            };
        }
    } catch (error) {
        console.error('Error fetching location:', error);
    }
    return { city: 'Unknown', country: 'Unknown' };
}

async function handler(req, res) {
    res.setHeader('X-Storage-Type', kv ? 'Vercel-KV' : 'File-System-Fallback');

    try {
        switch (req.method) {
            case 'GET':
                try {
                    let users = [];
                    if (kv) {
                        const usersData = await kv.get('users');
                        users = usersData || [];
                    } else {
                        users = await localStorageFallback.get('users');
                    }
                    res.status(200).json(users);
                } catch (error) {
                    console.error('Error fetching users:', error);
                    res.status(500).json({ error: 'Failed to fetch users' });
                }
                break;

            case 'POST':
                try {
                    const user = req.body;
                    if (!user || !user.email) {
                        return res.status(400).json({ error: 'Invalid user data' });
                    }

                    // Get IP address
                    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

                    // Get Location
                    const location = await getLocationFromIP(ip);

                    const userData = {
                        ...user,
                        location,
                        lastLogin: new Date().toISOString(),
                        ip
                    };

                    // Fetch existing users
                    let users = [];
                    if (kv) {
                        const usersData = await kv.get('users');
                        users = usersData || [];
                    } else {
                        users = await localStorageFallback.get('users');
                    }

                    // Check if user exists
                    const existingIndex = users.findIndex(u => u.email === user.email);
                    if (existingIndex !== -1) {
                        // Update existing user
                        users[existingIndex] = { ...users[existingIndex], ...userData };
                    } else {
                        // Add new user
                        users.push({ ...userData, firstLogin: new Date().toISOString() });
                    }

                    // Save back
                    if (kv) {
                        await kv.set('users', users);
                    } else {
                        await localStorageFallback.set('users', users);
                    }

                    res.status(200).json({ success: true, user: userData });
                } catch (error) {
                    console.error('Error saving user:', error);
                    res.status(500).json({ error: 'Failed to save user' });
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
