const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authMiddleware, attachHospitalId } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

router.use(authMiddleware);
router.use(attachHospitalId);

// GET /api/prescriptions
router.get('/', async (req, res) => {
    try {
        const { patientId, status } = req.query;
        const hospitalId = req.hospitalId;

        const where = { hospitalId };
        if (patientId) where.patientId = patientId;
        if (status) where.status = status;

        const prescriptions = await prisma.prescription.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            include: {
                patient: {
                    select: {
                        patientId: true,
                        name: true
                    }
                }
            }
        });

        res.json({ prescriptions });
    } catch (error) {
        console.error('Get prescriptions error:', error);
        res.status(500).json({ error: 'Failed to fetch prescriptions' });
    }
});

// POST /api/prescriptions
router.post('/', async (req, res) => {
    try {
        const {
            patientId,
            doctorId,
            medications,
            diagnosis,
            instructions
        } = req.body;

        const hospitalId = req.hospitalId;

        if (!patientId || !doctorId || !medications) {
            return res.status(400).json({
                error: 'Patient, doctor, and medications are required'
            });
        }

        // Generate prescription ID
        const count = await prisma.prescription.count({ where: { hospitalId } });
        const prescriptionId = `RX-${String(count + 1).padStart(5, '0')}`;

        const prescription = await prisma.prescription.create({
            data: {
                hospitalId,
                patientId,
                doctorId,
                prescriptionId,
                medications,
                diagnosis,
                instructions,
                status: 'pending'
            }
        });

        res.status(201).json({
            message: 'Prescription created successfully',
            prescription
        });
    } catch (error) {
        console.error('Create prescription error:', error);
        res.status(500).json({ error: 'Failed to create prescription' });
    }
});

// PUT /api/prescriptions/:id
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const hospitalId = req.hospitalId;

        const existing = await prisma.prescription.findFirst({
            where: { id, hospitalId }
        });

        if (!existing) {
            return res.status(404).json({ error: 'Prescription not found' });
        }

        const prescription = await prisma.prescription.update({
            where: { id },
            data: req.body
        });

        res.json({
            message: 'Prescription updated successfully',
            prescription
        });
    } catch (error) {
        console.error('Update prescription error:', error);
        res.status(500).json({ error: 'Failed to update prescription' });
    }
});

module.exports = router;
