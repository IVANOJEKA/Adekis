// Simple script to create initial hospital and user using raw SQL
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function createData() {
    try {
        console.log('Creating hospital...');

        // Use raw SQL to insert hospital
        const hospital = await prisma.$queryRaw`
            INSERT INTO "Hospital" (id, name, subdomain, address, phone, email, status, "createdAt", "updatedAt")
            VALUES (
                gen_random_uuid(),
                'Adekis Plus Medical Center',
                'adekis-demo',
                '123 Healthcare Ave, Nairobi',
                '+254700000000',
                'info@adekisplus.com',
                'active',
                CURRENT_TIMESTAMP,
                CURRENT_TIMESTAMP
            )
            ON CONFLICT (subdomain) DO NOTHING
            RETURNING id, name
        `;

        console.log('Hospital created or exists');

        // Get hospital ID
        const hospitals = await prisma.$queryRaw`
            SELECT id FROM "Hospital" WHERE subdomain = 'adekis-demo'
        `;

        const hospitalId = hospitals[0].id;
        console.log('Hospital ID:', hospitalId);

        // Create admin user
        console.log('\nCreating admin user...');
        const passwordHash = await bcrypt.hash('admin123', 10);

        await prisma.$queryRaw`
            INSERT INTO "User" (id, "hospitalId", email, "passwordHash", name, role, department, permissions, status, "createdAt", "updatedAt")
            VALUES (
                gen_random_uuid(),
                ${hospitalId}::uuid,
                'admin@adekisplus.com',
                ${passwordHash},
                'System Administrator',
                'Administrator',
                'Administration',
                ARRAY['*']::text[],
                'active',
                CURRENT_TIMESTAMP,
                CURRENT_TIMESTAMP
            )
            ON CONFLICT (email) DO NOTHING
        `;

        console.log('✅ Admin user created!');
        console.log('\nLogin credentials:');
        console.log('Email: admin@adekisplus.com');
        console.log('Password: admin123');

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

createData();
