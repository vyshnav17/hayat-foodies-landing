import fs from 'fs';
import path from 'path';

const schemaPath = path.join(process.cwd(), 'prisma', 'schema.prisma');
let schema = fs.readFileSync(schemaPath, 'utf8');

if (process.env.VERCEL) {
    console.log('Detected Vercel environment. Switching Prisma provider to postgresql...');
    // Replace provider and env variable with optional space support
    schema = schema.replace(/provider\s*=\s*"sqlite"/, 'provider = "postgresql"');
    schema = schema.replace(/env\s*\(\s*"DATABASE_URL"\s*\)/, 'env("hayat_DATABASE_URL")');
    console.log('Production settings applied (PostgreSQL + hayat_DATABASE_URL)');
} else {
    console.log('Detected local environment. Ensuring Prisma provider is sqlite...');
    schema = schema.replace(/provider\s*=\s*"postgresql"/, 'provider = "sqlite"');
    schema = schema.replace(/env\s*\(\s*"hayat_DATABASE_URL"\s*\)/, 'env("DATABASE_URL")');
    console.log('Local settings applied (SQLite + DATABASE_URL)');
}

fs.writeFileSync(schemaPath, schema);
console.log('Prisma schema updated successfully.');
console.log('Current schema preview (first 15 lines):');
console.log(schema.split('\n').slice(0, 15).join('\n'));
