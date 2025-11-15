// Script to set up Vercel KV for reviews storage
// Run this once to initialize the database

import { kv } from '@vercel/kv';

async function setupDatabase() {
  try {
    console.log('Setting up Vercel KV for reviews...');

    // Initialize empty reviews array
    await kv.set('customerReviews', JSON.stringify([]));

    console.log('Database setup complete!');
  } catch (error) {
    console.error('Error setting up database:', error);
  }
}

setupDatabase();
