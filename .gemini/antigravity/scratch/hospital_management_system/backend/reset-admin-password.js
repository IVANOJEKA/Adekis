const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
dotenv.config({ path: path.join(__dirname, '.env') });

const prisma = new PrismaClient();

async function resetPassword() {
    console.log('Resetting admin password...');
    try {
        const email = 'admin@adekisplus.com';
        const newPassword = 'admin123';
        const passwordHash = await bcrypt.hash(newPassword, 10);

        const user = await prisma.user.update({
            where: { email },
            data: { passwordHash }
        });

        console.log('✅ Password successfully reset for:', user.email);
        console.log('New password:', newPassword);

    } catch (error) {
        console.error('Error resetting password:', error);
    } finally {
        await prisma.$disconnect();
    }
}

resetPassword();
