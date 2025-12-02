const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function checkAdmin() {
    console.log('🔍 Checking for admin user...');

    try {
        const email = 'admin@adekisplus.com';
        const password = 'admin123';

        const user = await prisma.user.findUnique({
            where: { email },
            include: { hospital: true }
        });

        if (!user) {
            console.log('❌ Admin user NOT FOUND in database.');
            return;
        }

        console.log('✅ Admin user FOUND:');
        console.log(`   ID: ${user.id}`);
        console.log(`   Name: ${user.name}`);
        console.log(`   Role: ${user.role}`);
        console.log(`   Status: ${user.status}`);
        console.log(`   Hospital: ${user.hospital?.name || 'None'}`);

        const isMatch = await bcrypt.compare(password, user.passwordHash);

        if (isMatch) {
            console.log('✅ Password MATCHES.');
        } else {
            console.log('❌ Password DOES NOT MATCH.');
            console.log('   Resetting password to "admin123"...');

            const newHash = await bcrypt.hash(password, 10);
            await prisma.user.update({
                where: { id: user.id },
                data: { passwordHash: newHash }
            });
            console.log('✅ Password reset successfully.');
        }

    } catch (error) {
        console.error('❌ Error checking admin:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkAdmin();
