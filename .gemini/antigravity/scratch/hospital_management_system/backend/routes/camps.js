const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authMiddleware, attachHospitalId } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Apply authentication and hospital ID middleware to all routes
router.use(authMiddleware);
router.use(attachHospitalId);

// ==================== MEDICAL CAMPS ====================

// GET /api/camps - List all medical camps
router.get('/', async (req, res) => {
    try {
        const { hospitalId } = req;
        const { status, startDate, endDate } = req.query;

        const where = { hospitalId };
        if (status) where.status = status;
        if (startDate && endDate) {
            where.startDate = {
                gte: new Date(startDate),
                lte: new Date(endDate)
            };
        }

        const camps = await prisma.medicalCamp.findMany({
            where,
            include: {
                _count: {
                    select: { patients: true }
                }
            },
            orderBy: { startDate: 'desc' }
        });

        res.json({ camps });
    } catch (error) {
        console.error('Get camps error:', error);
        res.status(500).json({ error: 'Failed to fetch medical camps' });
    }
});

// POST /api/camps - Create medical camp
router.post('/', async (req, res) => {
    try {
        const { hospitalId } = req;
        const { name, location, startDate, endDate, description, organizer, services } = req.body;

        const camp = await prisma.medicalCamp.create({
            data: {
                hospitalId,
                name,
                location,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                description,
                organizer,
                services: services || [],
                status: 'Scheduled'
            }
        });

        res.status(201).json({ camp, message: 'Medical camp created successfully' });
    } catch (error) {
        console.error('Create camp error:', error);
        res.status(500).json({ error: 'Failed to create medical camp' });
    }
});

// PATCH /api/camps/:id - Update camp
router.patch('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { hospitalId } = req;
        const { name, location, startDate, endDate, description, organizer, services, status } = req.body;

        const camp = await prisma.medicalCamp.update({
            where: { id, hospitalId },
            data: {
                name,
                location,
                startDate: startDate ? new Date(startDate) : undefined,
                endDate: endDate ? new Date(endDate) : undefined,
                description,
                organizer,
                services,
                status
            }
        });

        res.json({ camp, message: 'Medical camp updated successfully' });
    } catch (error) {
        console.error('Update camp error:', error);
        res.status(500).json({ error: 'Failed to update medical camp' });
    }
});

// POST /api/camps/:id/register-patient - Register patient to camp
router.post('/:id/register-patient', async (req, res) => {
    try {
        const { id } = req.params;
        const { hospitalId } = req;
        const { patientId, services } = req.body;

        const registration = await prisma.campPatient.create({
            data: {
                campId: id,
                patientId,
                servicesReceived: services || [],
                registeredAt: new Date()
            }
        });

        res.status(201).json({ registration, message: 'Patient registered to camp successfully' });
    } catch (error) {
        console.error('Register patient to camp error:', error);
        res.status(500).json({ error: 'Failed to register patient to camp' });
    }
});

// GET /api/camps/:id/patients - Get camp patients
router.get('/:id/patients', async (req, res) => {
    try {
        const { id } = req.params;
        const { hospitalId } = req;

        const patients = await prisma.campPatient.findMany({
            where: {
                campId: id,
                camp: { hospitalId }
            },
            include: {
                patient: {
                    select: {
                        name: true,
                        patientId: true,
                        gender: true,
                        phone: true
                    }
                }
            }
        });

        res.json({ patients });
    } catch (error) {
        console.error('Get camp patients error:', error);
        res.status(500).json({ error: 'Failed to fetch camp patients' });
    }
});

module.exports = router;
