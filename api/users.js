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
    res.setHeader('X-Storage-Type', 'Prisma-SQLite');

    try {
        switch (req.method) {
            case 'GET':
                try {
                    const users = await prisma.user.findMany();
                    // Parse data field back to object if needed, or return as is?
                    // The client expects an array of user objects.
                    // Our schema stores dynamic data in 'data' string, but also has 'email', 'lastLogin'.
                    // We should merge them.
                    const mappedUsers = users.map(u => {
                        let parsedData = {};
                        try { parsedData = JSON.parse(u.data); } catch (e) { }
                        return {
                            ...parsedData,
                            ...u,
                            data: undefined // remove raw data field from response
                        };
                    });
                    res.status(200).json(mappedUsers);
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

                    // Check if user exists
                    const existingUser = await prisma.user.findUnique({
                        where: { email: user.email }
                    });

                    let savedUser;
                    if (existingUser) {
                        // Update
                        let currentData = {};
                        try { currentData = JSON.parse(existingUser.data); } catch (e) { }

                        const newData = { ...currentData, ...userData };

                        savedUser = await prisma.user.update({
                            where: { email: user.email },
                            data: {
                                lastLogin: new Date(),
                                data: JSON.stringify(newData)
                            }
                        });
                    } else {
                        // Create
                        const newData = { ...userData, firstLogin: new Date().toISOString() };
                        savedUser = await prisma.user.create({
                            data: {
                                email: user.email,
                                lastLogin: new Date(),
                                data: JSON.stringify(newData)
                            }
                        });
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
