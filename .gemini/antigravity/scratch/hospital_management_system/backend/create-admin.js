const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');

    // Create default hospital
    const hospital = await prisma.hospital.upsert({
        where: { id: 'hosp-001' },
        update: {},
        create: {
            id: 'hosp-001',
            name: 'Adekis+ Hospital',
            subdomain: 'adekisplus',
            address: 'Kampala, Uganda',
            phone: '+256-700-000000',
            email: 'info@adekisplus.com'
        }
    });

    console.log('✅ Hospital created:', hospital.name);

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);

    const admin = await prisma.user.upsert({
        where: { email: 'admin@adekisplus.com' },
        update: {},
        create: {
            email: 'admin@adekisplus.com',
            passwordHash: hashedPassword,
            name: 'System Administrator',
            role: 'Admin',
            department: 'Administration',
            hospitalId: hospital.id
        }
    });

    console.log('✅ Admin user created');
    console.log('📧 Email:', admin.email);
    console.log('🔑 Password: admin123');
    console.log('\n🎉 Seeding complete! You can now login.');
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e);
        if (e.code) console.error('Error Code:', e.code);
        if (e.meta) console.error('Error Meta:', e.meta);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
