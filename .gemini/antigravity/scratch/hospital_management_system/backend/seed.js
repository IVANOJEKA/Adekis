const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...\n');

    // Create hospital
    console.log('Creating hospital...');
    const hospital = await prisma.hospital.upsert({
        where: { subdomain: 'adekis-demo' },
        update: {},
        create: {
            name: 'Adekis Plus Medical Center',
            subdomain: 'adekis-demo',
            address: '123 Healthcare Ave, Nairobi, Kenya',
            phone: '+254700000000',
            email: 'info@adekisplus.com',
            status: 'active'
        }
    });
    console.log('✅ Hospital created:', hospital.name);

    // Create admin user
    console.log('\nCreating admin user...');
    const adminHash = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@adekisplus.com' },
        update: {},
        create: {
            hospitalId: hospital.id,
            email: 'admin@adekisplus.com',
            passwordHash: adminHash,
            name: 'System Administrator',
            role: 'Administrator',
            department: 'Administration',
            permissions: ['*'],
            status: 'active'
        }
    });
    console.log('✅ Admin created:', admin.email);

    // Create doctor user
    console.log('\nCreating doctor user...');
    const doctorHash = await bcrypt.hash('doctor123', 10);
    const doctor = await prisma.user.upsert({
        where: { email: 'doctor@adekisplus.com' },
        update: {},
        create: {
            hospitalId: hospital.id,
            email: 'doctor@adekisplus.com',
            passwordHash: doctorHash,
            name: 'Dr. Sarah Johnson',
            role: 'Doctor',
            department: 'General Medicine',
            permissions: ['dashboard', 'doctor', 'emr', 'patients', 'prescriptions'],
            status: 'active'
        }
    });
    console.log('✅ Doctor created:', doctor.email);

    // Create nurse user
    console.log('\nCreating nurse user...');
    const nurseHash = await bcrypt.hash('nurse123', 10);
    const nurse = await prisma.user.upsert({
        where: { email: 'nurse@adekisplus.com' },
        update: {},
        create: {
            hospitalId: hospital.id,
            email: 'nurse@adekisplus.com',
            passwordHash: nurseHash,
            name: 'Mary Williams',
            role: 'Nurse',
            department: 'General Ward',
            permissions: ['dashboard', 'nursing', 'bed-management', 'triage'],
            status: 'active'
        }
    });
    console.log('✅ Nurse created:', nurse.email);

    // Create sample patient
    console.log('\nCreating sample patient...');
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
    console.log('✅ Patient created:', patient.name);

    console.log('\n🎉 Seeding complete!\n');
    console.log('='.repeat(50));
    console.log('LOGIN CREDENTIALS:');
    console.log('='.repeat(50));
    console.log('\n👤 Administrator:');
    console.log('   Email: admin@adekisplus.com');
    console.log('   Password: admin123\n');
    console.log('👨‍⚕️ Doctor:');
    console.log('   Email: doctor@adekisplus.com');
    console.log('   Password: doctor123\n');
    console.log('👩‍⚕️ Nurse:');
    console.log('   Email: nurse@adekisplus.com');
    console.log('   Password: nurse123\n');
    console.log('='.repeat(50));
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
