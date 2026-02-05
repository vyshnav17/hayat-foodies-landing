import fs from 'fs';
import path from 'path';

const schemaPath = path.join(process.cwd(), 'prisma', 'schema.prisma');
let schema = fs.readFileSync(schemaPath, 'utf8');

if (process.env.VERCEL) {
    console.log('Detected Vercel environment. Switching Prisma provider to postgresql...');
    schema = schema.replace(/provider = "sqlite"/, 'provider = "postgresql"');
    // Vercel created variables with the 'hayat_' prefix in this project
    schema = schema.replace(/env\("DATABASE_URL"\)/, 'env("hayat_DATABASE_URL")');
} else {
    console.log('Detected local environment. Ensuring Prisma provider is sqlite...');
    schema = schema.replace(/provider = "postgresql"/, 'provider = "sqlite"');
}

fs.writeFileSync(schemaPath, schema);
console.log('Prisma schema updated successfully.');
