// Script to check Vercel KV reviews data
// Run this to verify database contents

import { kv } from '@vercel/kv';

async function checkDatabase() {
  try {
    console.log('Checking Vercel KV reviews data...');

    const reviews = await kv.get('customerReviews');
    console.log('Current reviews:', JSON.parse(reviews || '[]'));

    const count = JSON.parse(reviews || '[]').length;
    console.log(`Total reviews: ${count}`);

  } catch (error) {
    console.error('Error checking database:', error);
  }
}

checkDatabase();
