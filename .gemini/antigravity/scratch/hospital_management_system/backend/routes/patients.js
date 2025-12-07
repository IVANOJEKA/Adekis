const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authMiddleware, attachHospitalId } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Apply authentication middleware to all routes
router.use(authMiddleware);
router.use(attachHospitalId);

// GET /api/patients - Get all patients for the hospital
router.get('/', async (req, res) => {
    try {
        const { search, page = 1, limit = 50 } = req.query;
        const hospitalId = req.hospitalId;

        const skip = (page - 1) * limit;

        // Build where clause
        const where = { hospitalId };

        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { patientId: { contains: search, mode: 'insensitive' } },
                { phone: { contains: search } }
            ];
        }

        // Get patients with pagination
        const [patients, total] = await Promise.all([
            prisma.patient.findMany({
                where,
                skip: parseInt(skip),
                take: parseInt(limit),
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    patientId: true,
                    name: true,
                    dateOfBirth: true,
                    gender: true,
                    phone: true,
                    email: true,
                    bloodGroup: true,
                    status: true,
                    createdAt: true
                }
            }),
            prisma.patient.count({ where })
        ]);

        res.json({
            patients,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                pages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        console.error('Get patients error:', error);
        res.status(500).json({ error: 'Failed to fetch patients' });
    }
});

// GET /api/patients/:id - Get single patient
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const hospitalId = req.hospitalId;

        const patient = await prisma.patient.findFirst({
            where: {
                id,
                hospitalId // Ensure patient belongs to user's hospital
            },
            include: {
                appointments: {
                    take: 10,
                    orderBy: { appointmentDate: 'desc' }
                },
                prescriptions: {
                    take: 10,
                    orderBy: { createdAt: 'desc' }
                },
                labTests: {
                    take: 10,
                    orderBy: { createdAt: 'desc' }
                },
                medicalRecords: {
                    take: 10,
                    orderBy: { recordDate: 'desc' }
                }
            }
        });

        if (!patient) {
            return res.status(404).json({ error: 'Patient not found' });
        }

        res.json({ patient });

    } catch (error) {
        console.error('Get patient error:', error);
        res.status(500).json({ error: 'Failed to fetch patient' });
    }
});

// POST /api/patients - Create new patient
router.post('/', async (req, res) => {
    try {
        const {
            name,
            dateOfBirth,
            gender,
            phone,
            email,
            address,
            bloodGroup,
            allergies,
            emergencyContact,
            emergencyPhone
        } = req.body;

        const hospitalId = req.hospitalId;

        // Validation
        if (!name || !dateOfBirth || !gender) {
            return res.status(400).json({ error: 'Name, date of birth, and gender are required' });
        }

        // Generate patient ID (P-XXX format for short readable IDs)
        const patientCount = await prisma.patient.count({ where: { hospitalId } });
        const patientId = `P-${String(patientCount + 1).padStart(3, '0')}`;


        // Create patient
        const patient = await prisma.patient.create({
            data: {
                hospitalId,
                patientId,
                name,
                dateOfBirth: new Date(dateOfBirth),
                gender,
                phone: phone || null,
                email: email || null,
                address: address || null,
                bloodGroup: bloodGroup || null,
                allergies: allergies || [],
                emergencyContact: emergencyContact || null,
                emergencyPhone: emergencyPhone || null,
                status: 'active'
            }
        });

        res.status(201).json({
            message: 'Patient created successfully',
            patient
        });

    } catch (error) {
        console.error('Create patient error:', error);
        res.status(500).json({ error: 'Failed to create patient' });
    }
});

// PUT /api/patients/:id - Update patient
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const hospitalId = req.hospitalId;

        // Check if patient exists and belongs to hospital
        const existingPatient = await prisma.patient.findFirst({
            where: { id, hospitalId }
        });

        if (!existingPatient) {
            return res.status(404).json({ error: 'Patient not found' });
        }

        // Update patient
        const patient = await prisma.patient.update({
            where: { id },
            data: {
                ...req.body,
                dateOfBirth: req.body.dateOfBirth ? new Date(req.body.dateOfBirth) : undefined
            }
        });

        res.json({
            message: 'Patient updated successfully',
            patient
        });

    } catch (error) {
        console.error('Update patient error:', error);
        res.status(500).json({ error: 'Failed to update patient' });
    }
});

// DELETE /api/patients/:id - Delete patient (soft delete)
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const hospitalId = req.hospitalId;

        // Check if patient exists and belongs to hospital
        const existingPatient = await prisma.patient.findFirst({
            where: { id, hospitalId }
        });

        if (!existingPatient) {
            return res.status(404).json({ error: 'Patient not found' });
        }

        // Soft delete (set status to inactive)
        await prisma.patient.update({
            where: { id },
            data: { status: 'inactive' }
        });

        res.json({ message: 'Patient deleted successfully' });

    } catch (error) {
        console.error('Delete patient error:', error);
        res.status(500).json({ error: 'Failed to delete patient' });
    }
});

module.exports = router;
