import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
    console.log('Starting migration from JSON to SQLite...');

    // Migrate Users
    const usersPath = path.join(process.cwd(), 'users.json');
    if (fs.existsSync(usersPath)) {
        try {
            const users = JSON.parse(fs.readFileSync(usersPath, 'utf8'));
            console.log(`Found ${users.length} users to migrate.`);

            for (const user of users) {
                if (!user.email) continue;

                await prisma.user.upsert({
                    where: { email: user.email },
                    update: {
                        // Update lastLogin if newer? assume current is truth
                    },
                    create: {
                        email: user.email,
                        data: JSON.stringify(user),
                        lastLogin: user.lastLogin ? new Date(user.lastLogin) : new Date(),
                    }
                });
            }
            console.log('Users migration completed.');
        } catch (e) {
            console.error('Error migrating users:', e);
        }
    }

    // Migrate Reviews
    const reviewsPath = path.join(process.cwd(), 'reviews.json');
    if (fs.existsSync(reviewsPath)) {
        try {
            const reviews = JSON.parse(fs.readFileSync(reviewsPath, 'utf8'));
            console.log(`Found ${reviews.length} reviews to migrate.`);

            for (const review of reviews) {
                // Check if review has required fields
                if (!review.name || !review.rating || !review.review) continue;

                // Try to find if exists? No easy unique ID other than generated one. 
                // We'll insert if not handled carefully.
                // But since reviews table is empty initially, just create.
                await prisma.review.create({
                    data: {
                        id: review.id || undefined, // use existing ID if compatible
                        name: review.name,
                        email: review.email || "anonymous@example.com",
                        rating: parseInt(review.rating),
                        review: review.review,
                        verified: review.verified || false,
                        createdAt: review.timestamp ? new Date(review.timestamp) : new Date()
                    }
                });
            }
            console.log('Reviews migration completed.');
        } catch (e) {
            console.error('Error migrating reviews:', e);
        }
    }

    // Migrate Products
    // Check if products already seeded by API logic (likely empty now)
    const productsCount = await prisma.product.count();
    if (productsCount === 0) {
        const productsPath = path.join(process.cwd(), 'products.json');
        if (fs.existsSync(productsPath)) {
            try {
                const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
                console.log(`Found ${products.length} products to migrate.`);

                for (const p of products) {
                    await prisma.product.create({
                        data: {
                            id: p.id,
                            name: p.name,
                            description: p.description,
                            price: parseFloat(p.price),
                            gst: p.gst ? parseFloat(p.gst) : null,
                            weight: p.weight ? parseFloat(p.weight) : null,
                            quantity: p.quantity ? parseInt(p.quantity) : null,
                            images: JSON.stringify(p.images || []),
                            ingredients: JSON.stringify(p.ingredients || [])
                        }
                    });
                }
                console.log('Products migration completed.');
            } catch (e) {
                console.error('Error migrating products:', e);
            }
        }
    } else {
        console.log('Products already populated, skipping migration.');
    }

    console.log('Migration finished.');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
