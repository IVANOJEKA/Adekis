const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
dotenv.config({ path: path.join(__dirname, '.env') });

const prisma = new PrismaClient();

async function checkAdmin() {
    console.log('Checking admin user...');
    try {
        const email = 'admin@adekisplus.com';
        const password = 'admin123';

        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            console.log('❌ Admin user NOT FOUND in database.');
            return;
        }

        console.log('✅ Admin user FOUND:', {
            id: user.id,
            email: user.email,
            role: user.role,
            status: user.status
        });

        const isMatch = await bcrypt.compare(password, user.passwordHash);

        if (isMatch) {
            console.log('✅ Password "admin123" MATCHES the stored hash.');
        } else {
            console.log('❌ Password "admin123" does NOT match the stored hash.');
            console.log('Stored hash:', user.passwordHash);
        }

    } catch (error) {
        console.error('Error checking admin:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkAdmin();
