import fs from 'fs';
import path from 'path';

const schemaPath = path.join(process.cwd(), 'prisma', 'schema.prisma');
let schema = fs.readFileSync(schemaPath, 'utf8');

if (process.env.VERCEL) {
    console.log('Detected Vercel environment. Switching Prisma provider to postgresql...');
    schema = schema.replace(/provider\s*=\s*"sqlite"/, 'provider = "postgresql"');

    const possibleVars = [
        'hayat_POSTGRES_PRISMA_URL',
        'hayat_DATABASE_URL',
        'POSTGRES_PRISMA_URL',
        'POSTGRES_URL',
        'DATABASE_URL',
        'POSTGRES_URL_NON_POOLING'
    ];

    // Find a variable that specifically starts with a postgres protocol
    const dbVar = possibleVars.find(v => {
        const val = process.env[v];
        if (!val) return false;
        const isPostgres = val.startsWith('postgres://') || val.startsWith('postgresql://');
        if (isPostgres) console.log(`Candidate found: ${v} (Valid Postgres URL)`);
        else if (v.includes('DATABASE')) console.log(`Candidate ignored: ${v} (Not a Postgres URL: ${val.substring(0, 10)}...)`);
        return isPostgres;
    });

    if (dbVar) {
        schema = schema.replace(/env\s*\(\s*".*"\s*\)/, `env("${dbVar}")`);
        console.log(`Production settings applied (PostgreSQL + ${dbVar})`);
    } else {
        console.error('CRITICAL ERROR: No PostgreSQL environment variables detected!');
        console.log('Available keys matching hayat/POSTGRES:');
        Object.keys(process.env).forEach(k => {
            if (k.includes('hayat') || k.includes('POSTGRES')) console.log(`- ${k}`);
        });
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
