import fs from 'fs';
fs.writeFileSync('.env', 'DATABASE_URL="file:./dev.db"');
console.log('.env file written');
