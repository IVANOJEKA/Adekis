const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createDefaultAdminUser() {
    try {
        console.log('Creating default hospital and admin user...');

        // Create default hospital
        const hospital = await prisma.hospital.upsert({
            where: { id: 'default-hospital' },
            update: {},
            create: {
                id: 'default-hospital',
                name: 'Shand Pharmacy & Hospital',
                address: 'Nairobi, Kenya',
                phone: '+254700000000',
                email: 'info@shandhospital.com',
                subdomain: 'default'
            }
        });

        console.log('✅ Hospital created:', hospital.name);

        // Hash password
        const hashedPassword = await bcrypt.hash('admin123', 10);

        // Create admin user
        const admin = await prisma.user.upsert({
            where: { email: 'admin@hospital.com' },
            update: {
                passwordHash: hashedPassword // Update password if user exists
            },
            create: {
                email: 'admin@hospital.com',
                passwordHash: hashedPassword,
                name: 'System Administrator',
                role: 'admin',
                hospitalId: hospital.id,
                permissions: ['*']
            }
        });

        console.log('✅ Admin user created/updated successfully!');
        console.log('\n========================================');
        console.log('LOGIN CREDENTIALS:');
        console.log('Email: admin@hospital.com');
        console.log('Password: admin123');
        console.log('========================================\n');

        await prisma.$disconnect();
    } catch (error) {
        console.error('❌ Error creating admin user:', error);
        await prisma.$disconnect();
        process.exit(1);
    }
}

createDefaultAdminUser();
