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
                    // Fetch analytics data
                    // We'll fetch the last 1000 page views and events for visualization
                    const pageViews = await prisma.analyticsEvent.findMany({
                        where: { type: 'pageview' },
                        orderBy: { timestamp: 'desc' },
                        take: 1000
                    });

                    const events = await prisma.analyticsEvent.findMany({
                        where: { type: 'event' },
                        orderBy: { timestamp: 'desc' },
                        take: 1000
                    });

                    // Parse JSON data fields
                    const parseData = (list) => list.map(item => ({
                        ...item,
                        ...JSON.parse(item.data),
                        data: undefined
                    }));

                    res.status(200).json({
                        pageViews: parseData(pageViews),
                        events: parseData(events)
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

                    const payload = { ...data };

                    await prisma.analyticsEvent.create({
                        data: {
                            type,
                            data: JSON.stringify(payload),
                            timestamp: new Date()
                        }
                    });

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
