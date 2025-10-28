import 'dotenv/config';
import admin from 'firebase-admin';
import cors from 'cors';

const corsHandler = cors({
  origin: true,
  credentials: true
});

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY || '{}');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL
  });
}

const db = admin.firestore();
const COLLECTION_NAME = 'contact-submissions';

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
    switch (req.method) {
      case 'GET':
        const submissionsSnapshot = await db.collection(COLLECTION_NAME).orderBy('timestamp', 'desc').get();
        const submissions = submissionsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        res.status(200).json(submissions);
        break;

      case 'POST':
        const newSubmission = {
          ...req.body,
          timestamp: new Date().toISOString(),
          resolved: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        const docRef = await db.collection(COLLECTION_NAME).add(newSubmission);
        res.status(201).json({ id: docRef.id, ...newSubmission });
        break;

      case 'PUT':
        const { id, ...updateData } = req.body;
        if (!id) {
          return res.status(400).json({ error: 'Submission ID is required' });
        }
        const updateDataWithTimestamp = {
          ...updateData,
          updatedAt: new Date().toISOString()
        };
        await db.collection(COLLECTION_NAME).doc(id).update(updateDataWithTimestamp);
        res.status(200).json({ message: 'Submission updated successfully' });
        break;

      case 'DELETE':
        const deleteId = req.query.id;
        if (!deleteId) {
          return res.status(400).json({ error: 'Submission ID is required' });
        }
        await db.collection(COLLECTION_NAME).doc(deleteId).delete();
        res.status(200).json({ message: 'Submission deleted successfully' });
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
