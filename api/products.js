import cors from 'cors';

const corsHandler = cors({
  origin: true,
  credentials: true
});

// Default products data (same as in AdminPanel.tsx)
const defaultProducts = [
  {
    id: "1",
    name: "Chapati",
    description: "Soft, fresh chapati made daily with premium ingredients",
    images: ["/src/assets/chapati.jpg", "/src/assets/bread.jpg", "/src/assets/rusk.jpg"],
    ingredients: ["Whole wheat flour", "Water", "Salt", "Oil"],
    calories: 150,
    price: 20,
    gst: 2,
  },
  {
    id: "2",
    name: "Cream Bun",
    description: "Delicious cream-filled buns with smooth vanilla cream",
    images: ["/src/assets/cream-bun.jpg", "/src/assets/chocolate-bun.jpg", "/src/assets/baby-chocolate-bun.jpg"],
    ingredients: ["Flour", "Cream", "Sugar", "Yeast", "Vanilla"],
    calories: 250,
    price: 30,
    gst: 3,
  },
  {
    id: "3",
    name: "Normal Buns",
    description: "Freshly baked, delightfully soft—your perfect companion for any meal",
    images: ["/src/assets/chocolate-bun.jpg", "/src/assets/cream-bun.jpg", "/src/assets/baby-chocolate-bun.jpg"],
    ingredients: ["Flour", "Sugar", "Yeast", "Milk", "Butter"],
    calories: 200,
    price: 25,
    gst: 2.5,
  },
  {
    id: "4",
    name: "Baby Chocolate Bun",
    description: "Soft, rich, and perfectly sized for a satisfying chocolate treat.",
    images: ["/src/assets/baby-chocolate-bun.jpg", "/src/assets/chocolate-bun.jpg", "/src/assets/cream-bun.jpg"],
    ingredients: ["Flour", "Chocolate", "Sugar", "Yeast", "Butter"],
    calories: 180,
    price: 15,
    gst: 1.5,
  },
  {
    id: "5",
    name: "Bread",
    description: "Fresh, soft bread baked to perfection every day",
    images: ["/src/assets/bread.jpg", "/src/assets/chapati.jpg", "/src/assets/rusk.jpg"],
    ingredients: ["Flour", "Water", "Yeast", "Salt", "Sugar"],
    calories: 120,
    price: 40,
    gst: 4,
  },
  {
    id: "6",
    name: "Rusk",
    description: "Crispy, golden rusk perfect for tea time",
    images: ["/src/assets/rusk.jpg", "/src/assets/bread.jpg", "/src/assets/chapati.jpg"],
    ingredients: ["Flour", "Sugar", "Butter", "Eggs", "Yeast"],
    calories: 100,
    price: 35,
    gst: 3.5,
  },
];

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
        // Return default products since Firebase is removed
        res.status(200).json(defaultProducts);
        break;

      case 'POST':
        // No-op since Firebase is removed
        res.status(201).json({ message: 'Product added (not stored - Firebase removed)' });
        break;

      case 'PUT':
        // No-op since Firebase is removed
        res.status(200).json({ message: 'Product update ignored (Firebase removed)' });
        break;

      case 'DELETE':
        // No-op since Firebase is removed
        res.status(200).json({ message: 'Product deletion ignored (Firebase removed)' });
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
