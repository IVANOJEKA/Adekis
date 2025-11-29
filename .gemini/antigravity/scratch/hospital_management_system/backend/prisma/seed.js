const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting database seed...');

    // Create test hospital
    const hospital = await prisma.hospital.upsert({
        where: { subdomain: 'adekis-demo' },
        update: {},
        create: {
            name: 'Adek is Plus Medical Center',
            subdomain: 'adekis-demo',
            address: '123 Healthcare Avenue, Nairobi, Kenya',
            phone: '+254700000000',
            email: 'info@adekis.com',
            status: 'active'
        }
    });

    console.log('✅ Hospital created:', hospital.name);

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@adekisplus.com' },
        update: {},
        create: {
            hospitalId: hospital.id,
            email: 'admin@adekisplus.com',
            passwordHash: adminPassword,
            name: 'System Administrator',
            role: 'Administrator',
            department: 'Administration',
            permissions: ['*'], // All permissions
            status: 'active'
        }
    });

    console.log('✅ Admin user created:', admin.email);

    // Create doctor user
    const doctorPassword = await bcrypt.hash('doctor123', 10);
    const doctor = await prisma.user.upsert({
        where: { email: 'doctor@adekisplus.com' },
        update: {},
        create: {
            hospitalId: hospital.id,
            email: 'doctor@adekisplus.com',
            passwordHash: doctorPassword,
            name: 'Dr. Sarah Johnson',
            role: 'Doctor',
            department: 'General Medicine',
            permissions: ['dashboard', 'doctor', 'emr', 'patients', 'prescriptions'],
            status: 'active'
        }
    });

    console.log('✅ Doctor user created:', doctor.email);

    // Create sample patient
    const patient = await prisma.patient.create({
        data: {
            hospitalId: hospital.id,
            patientId: 'PAT-00001',
            name: 'John Doe',
            dateOfBirth: new Date('1985-03-15'),
            gender: 'Male',
            phone: '+254712345678',
            email: 'john.doe@example.com',
            bloodGroup: 'O+',
            allergies: ['Penicillin'],
            emergencyContact: 'Jane Doe',
            emergencyPhone: '+254798765432',
            status: 'active'
        }
    });

    console.log('✅ Sample patient created:', patient.name);

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📋 Login Credentials:');
    console.log('  Administrator:');
    console.log('    Email: admin@adekisplus.com');
    console.log('    Password: admin123');
    console.log('\n  Doctor:');
    console.log('    Email: doctor@adekisplus.com');
    console.log('    Password: doctor123');
}

main()
    .catch((e) => {
        console.error('❌ Seed failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
