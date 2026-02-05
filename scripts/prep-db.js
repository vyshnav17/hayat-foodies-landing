import fs from 'fs';
import path from 'path';

const schemaPath = path.join(process.cwd(), 'prisma', 'schema.prisma');
let schema = fs.readFileSync(schemaPath, 'utf8');

if (process.env.VERCEL) {
    console.log('Detected Vercel environment. Switching Prisma provider to postgresql...');
    // Replace provider with optional space support
    schema = schema.replace(/provider\s*=\s*"sqlite"/, 'provider = "postgresql"');

    // Debug: List all available hayat_ or POSTGRES vars
    console.log('Searching for database environment variables...');
    Object.keys(process.env).forEach(key => {
        if (key.includes('hayat_') || key.includes('POSTGRES_')) {
            console.log(`Found candidate: ${key} (length: ${process.env[key].length})`);
        }
    });

    // Dynamically detect which database variable is set in this project
    const possibleVars = [
        'hayat_POSTGRES_PRISMA_URL',
        'hayat_DATABASE_URL',
        'POSTGRES_PRISMA_URL',
        'POSTGRES_URL',
        'DATABASE_URL'
    ];
    const dbVar = possibleVars.find(v => process.env[v]);

    if (dbVar) {
        console.log(`Found database variable: ${dbVar}`);
        // Replace whatever is inside env() with the detected variable
        schema = schema.replace(/env\s*\(\s*".*"\s*\)/, `env("${dbVar}")`);
        console.log(`Production settings applied (PostgreSQL + ${dbVar})`);
    } else {
        console.warn('WARNING: No database environment variables detected! Falling back to "DATABASE_URL"');
    }
} else {
    console.log('Detected local environment. Ensuring Prisma provider is sqlite...');
    schema = schema.replace(/provider\s*=\s*"postgresql"/, 'provider = "sqlite"');
    // Ensure local schema uses standard DATABASE_URL
    schema = schema.replace(/env\s*\(\s*".*"\s*\)/, 'env("DATABASE_URL")');
    console.log('Local settings applied (SQLite + DATABASE_URL)');
}

fs.writeFileSync(schemaPath, schema);
console.log('Prisma schema updated successfully.');
console.log('--- SCHEMA PREVIEW ---');
console.log(schema.split('\n').slice(0, 15).join('\n'));
console.log('--- END PREVIEW ---');
