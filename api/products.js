import cors from 'cors';
import fs from 'fs';
import path from 'path';

// Try to import Vercel KV, fallback to file system if not available
let kv = null;
try {
  // Dynamic import to avoid build errors if package is missing or env vars are missing
  const kvModule = await import('@vercel/kv');
  // Check if KV is actually configured by checking for one of the required env vars
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
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  });

  // Default products data to seed if DB is empty
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

  // Fallback storage using file system for local development
  // Note: In Vercel serverless functions, the filesystem is read-only except for /tmp
  // But for local dev, we can write to a file.
  const productsFilePath = path.join(process.cwd(), 'products.json');

  const localStorageFallback = {
    get: async (key) => {
      try {
        if (fs.existsSync(productsFilePath)) {
          const data = fs.readFileSync(productsFilePath, 'utf8');
          console.log('Using file fallback - loaded products from file');
          return JSON.parse(data);
        }
      } catch (error) {
        console.error('Error reading products file:', error);
      }
      console.log('Using file fallback - no products file found');
      return null;
    },
    set: async (key, value) => {
      try {
        // value is already a string (JSON.stringify called by caller)
        fs.writeFileSync(productsFilePath, value, 'utf8');
        console.log('Using file fallback - saved products to file');
      } catch (error) {
        console.error('Error writing products file:', error);
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
    // Add debug header to indicate storage type
    res.setHeader('X-Storage-Type', kv ? 'Vercel-KV' : 'File-System-Fallback');

    try {
      switch (req.method) {
        case 'GET':
          try {
            let productsData = await storage.get('products');
            let products = [];

            if (productsData) {
              if (typeof productsData === 'string') {
                try {
                  products = JSON.parse(productsData);
                } catch (e) {
                  console.error('Error parsing products JSON:', e);
                  products = [];
                }
              } else {
                products = productsData;
              }
            }

            if (!products || products.length === 0) {
              // Seed with default products if empty
              products = defaultProducts;
              await storage.set('products', JSON.stringify(products));
            }

            res.status(200).json(products);
          } catch (error) {
            console.error('Error fetching products:', error);
            // Fallback to default products on error
            res.status(200).json(defaultProducts);
          }
          break;

        case 'POST':
          try {
            const newProduct = req.body;
            if (!newProduct.name || !newProduct.price) {
              return res.status(400).json({ error: 'Name and price are required' });
            }

            // Generate ID if not present
            if (!newProduct.id) {
              newProduct.id = Date.now().toString();
            }

            let productsData = await storage.get('products');
            let products = [];
            if (productsData) {
              if (typeof productsData === 'string') {
                try { products = JSON.parse(productsData); } catch (e) { products = []; }
              } else {
                products = productsData;
              }
            }

            // If no products found, start with defaults
            if (products.length === 0) {
              products = [...defaultProducts];
            }

            products.push(newProduct);
            await storage.set('products', JSON.stringify(products));

            res.status(201).json(newProduct);
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

            let productsData = await storage.get('products');
            let products = [];
            if (productsData) {
              if (typeof productsData === 'string') {
                try { products = JSON.parse(productsData); } catch (e) { products = []; }
              } else {
                products = productsData;
              }
            }

            // If no products found, start with defaults
            if (products.length === 0) {
              products = [...defaultProducts];
            }

            const index = products.findIndex(p => p.id === updatedProduct.id);

            if (index !== -1) {
              products[index] = { ...products[index], ...updatedProduct };
              await storage.set('products', JSON.stringify(products));
              res.status(200).json(products[index]);
            } else {
              res.status(404).json({ error: 'Product not found' });
            }
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

            let productsData = await storage.get('products');
            let products = [];
            if (productsData) {
              if (typeof productsData === 'string') {
                try { products = JSON.parse(productsData); } catch (e) { products = []; }
              } else {
                products = productsData;
              }
            }

            // CRITICAL FIX: If products is empty (e.g. first run or read error), use defaultProducts as base
            if (products.length === 0) {
              console.log('DELETE: Products list empty, seeding with defaults before delete');
              products = [...defaultProducts];
            }

            const initialLength = products.length;
            const filteredProducts = products.filter(p => p.id !== id);

            if (filteredProducts.length === initialLength) {
              console.log(`DELETE: Product with ID ${id} not found in list of ${initialLength} products`);
            } else {
              console.log(`DELETE: Removed product ${id}. Count: ${initialLength} -> ${filteredProducts.length}`);
            }

            await storage.set('products', JSON.stringify(filteredProducts));

            res.status(200).json({
              message: 'Product deleted successfully',
              debug: {
                deletedId: id,
                previousCount: initialLength,
                newCount: filteredProducts.length,
                storageType: kv ? 'KV' : 'File'
              }
            });
          } catch (error) {
            console.error('Error deleting product:', error);
            res.status(500).json({ error: 'Failed to delete product', details: error.message });
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
