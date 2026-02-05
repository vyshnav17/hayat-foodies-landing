import cors from 'cors';
import prisma from '../src/lib/prisma.js';

const corsHandler = cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
});

const defaultProducts = [
  {
    id: "1",
    name: "Chapati",
    description: "Soft, fresh chapati made daily with premium ingredients",
    images: ["/assets/chapati.jpg", "/assets/bread.jpg", "/assets/rusk.jpg"],
    ingredients: ["Whole wheat flour", "Water", "Salt", "Oil"],
    weight: 450,
    price: 60,
    gst: 5,
  },
  {
    id: "2",
    name: "Cream Bun",
    description: "Delicious cream-filled buns with smooth vanilla cream",
    images: ["/assets/cream-bun.jpg", "/assets/chocolate-bun.jpg", "/assets/baby-chocolate-bun.jpg"],
    ingredients: ["Flour", "Cream", "Sugar", "Yeast", "Vanilla"],
    quantity: 4,
    price: 45,
    gst: 5,
  },
  {
    id: "3",
    name: "Normal Buns",
    description: "Freshly baked, delightfully soft—your perfect companion for any meal",
    images: ["/assets/chocolate-bun.jpg", "/assets/cream-bun.jpg", "/assets/baby-chocolate-bun.jpg"],
    ingredients: ["Flour", "Sugar", "Yeast", "Milk", "Butter"],
    quantity: 2,
    price: 20,
    gst: 5,
  },
  {
    id: "4",
    name: "Baby Chocolate Bun",
    description: "Soft, rich, and perfectly sized for a satisfying chocolate treat.",
    images: ["/assets/baby-chocolate-bun.jpg", "/assets/chocolate-bun.jpg", "/assets/cream-bun.jpg"],
    ingredients: ["Flour", "Chocolate", "Sugar", "Yeast", "Butter"],
    quantity: 5,
    price: 40,
    gst: 5,
  },
  {
    id: "5",
    name: "Bread",
    description: "Fresh, soft bread baked to perfection every day",
    images: ["/assets/bread.jpg", "/assets/chapati.jpg", "/assets/rusk.jpg"],
    ingredients: ["Flour", "Water", "Yeast", "Salt", "Sugar"],
    weight: 300,
    price: 40,
    gst: 5,
  },
  {
    id: "6",
    name: "Rusk",
    description: "Crispy, golden rusk perfect for tea time",
    images: ["/assets/rusk.jpg", "/assets/bread.jpg", "/assets/chapati.jpg"],
    ingredients: ["Flour", "Sugar", "Butter", "Eggs", "Yeast"],
    weight: 100,
    price: 35,
    gst: 5,
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
  res.setHeader('X-Storage-Type', 'Prisma-SQLite');

  try {
    switch (req.method) {
      case 'GET':
        try {
          let products = await prisma.product.findMany();

          if (products.length === 0) {
            // Seed defaults
            const seedOperations = defaultProducts.map(p =>
              prisma.product.create({
                data: {
                  ...p,
                  images: JSON.stringify(p.images),
                  ingredients: JSON.stringify(p.ingredients),
                  quantity: p.quantity || null,
                  weight: p.weight || null
                }
              })
            );
            await prisma.$transaction(seedOperations);
            products = await prisma.product.findMany();
          }

          // Parse JSON fields
          const parsedProducts = products.map(p => ({
            ...p,
            images: JSON.parse(p.images),
            ingredients: JSON.parse(p.ingredients)
          }));

          res.status(200).json(parsedProducts);
        } catch (error) {
          console.error('Error fetching products:', error);
          res.status(500).json({ error: 'Failed to fetch products' });
        }
        break;

      case 'POST':
        try {
          const newProduct = req.body;
          if (!newProduct.name || !newProduct.price) {
            return res.status(400).json({ error: 'Name and price are required' });
          }

          const product = await prisma.product.create({
            data: {
              ...newProduct,
              images: JSON.stringify(newProduct.images || []),
              ingredients: JSON.stringify(newProduct.ingredients || []),
              quantity: newProduct.quantity ? parseInt(newProduct.quantity) : null,
              weight: newProduct.weight ? parseFloat(newProduct.weight) : null,
              price: parseFloat(newProduct.price),
              gst: newProduct.gst ? parseFloat(newProduct.gst) : null
            }
          });

          res.status(201).json({
            ...product,
            images: JSON.parse(product.images),
            ingredients: JSON.parse(product.ingredients)
          });
        } catch (error) {
          console.error('Error adding product:', error);
          res.status(500).json({ error: 'Failed to add product' });
        }
        break;

      case 'PUT':
        try {
          const updatedProduct = req.body;
          if (!updatedProduct.id) {
            return res.status(400).json({ error: 'Product ID is required' });
          }

          const { id, ...data } = updatedProduct;

          // Handle special fields
          const updateData = { ...data };
          if (data.images) updateData.images = JSON.stringify(data.images);
          if (data.ingredients) updateData.ingredients = JSON.stringify(data.ingredients);
          if (data.quantity) updateData.quantity = parseInt(data.quantity);
          if (data.weight) updateData.weight = parseFloat(data.weight);
          if (data.price) updateData.price = parseFloat(data.price);
          if (data.gst) updateData.gst = parseFloat(data.gst);

          const product = await prisma.product.update({
            where: { id: id },
            data: updateData
          });

          res.status(200).json({
            ...product,
            images: JSON.parse(product.images),
            ingredients: JSON.parse(product.ingredients)
          });
        } catch (error) {
          console.error('Error updating product:', error);
          res.status(500).json({ error: 'Failed to update product' });
        }
        break;

      case 'DELETE':
        try {
          const { id } = req.query;
          if (!id) {
            return res.status(400).json({ error: 'Product ID is required' });
          }

          await prisma.product.delete({
            where: { id: id }
          });

          res.status(200).json({ message: 'Product deleted successfully' });
        } catch (error) {
          console.error('Error deleting product:', error);
          res.status(500).json({ error: 'Failed to delete product' });
        }
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
