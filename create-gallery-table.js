import { sql } from '@vercel/postgres';
import dotenv from 'dotenv';

dotenv.config();

async function createGalleryTable() {
  try {
    console.log('Creating gallery_images table...');
    
    // Create table with proper schema
    await sql`
      CREATE TABLE IF NOT EXISTS gallery_images (
        id SERIAL PRIMARY KEY,
        src TEXT NOT NULL,
        alt TEXT NOT NULL,
        uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        uploaded_by TEXT DEFAULT 'admin'
      );
    `;
    
    console.log('Table "gallery_images" created successfully.');
    
    // Check if table exists and show structure
    const checkTable = await sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'gallery_images'
      ORDER BY ordinal_position;
    `;
    
    console.log('Table structure:');
    checkTable.rows.forEach(row => {
      console.log(`  - ${row.column_name}: ${row.data_type}`);
    });
    
  } catch (error) {
    console.error('Error creating table:', error);
    throw error;
  } finally {
    process.exit(0);
  }
}

createGalleryTable();
