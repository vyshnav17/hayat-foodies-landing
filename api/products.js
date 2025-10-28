import 'dotenv/config';
import { MongoClient } from 'mongodb';
import cors from 'cors';

const corsHandler = cors({
  origin: true,
  credentials: true
});

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = 'tc';
const COLLECTION_NAME = 'products';

let cachedClient = null;
let cachedDb = null;

async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI environment variable is not set');
  }

  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db(DB_NAME);

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

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
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection(COLLECTION_NAME);

    switch (req.method) {
      case 'GET':
        const products = await collection.find({}).toArray();
        res.status(200).json(products);
        break;

      case 'POST':
        const newProduct = {
          ...req.body,
          id: Date.now(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        const result = await collection.insertOne(newProduct);
        res.status(201).json({ ...newProduct, _id: result.insertedId });
        break;

      case 'PUT':
        const { id, ...updateData } = req.body;
        if (!id) {
          return res.status(400).json({ error: 'Product ID is required' });
        }
        const updateResult = await collection.updateOne(
          { id: parseInt(id) },
          {
            $set: {
              ...updateData,
              updatedAt: new Date().toISOString()
            }
          }
        );
        if (updateResult.matchedCount === 0) {
          return res.status(404).json({ error: 'Product not found' });
        }
        res.status(200).json({ message: 'Product updated successfully' });
        break;

      case 'DELETE':
        const deleteId = req.query.id;
        if (!deleteId) {
          return res.status(400).json({ error: 'Product ID is required' });
        }
        const deleteResult = await collection.deleteOne({ id: parseInt(deleteId) });
        if (deleteResult.deletedCount === 0) {
          return res.status(404).json({ error: 'Product not found' });
        }
        res.status(200).json({ message: 'Product deleted successfully' });
        break;

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        res.status(405).json({ error: `Method ${req.method} not allowed` });
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export default wrapCors(handler);
