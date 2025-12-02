const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { authMiddleware, attachHospitalId } = require('../middleware/auth');

const prisma = new PrismaClient();

// Middleware to ensure authentication
router.use(authMiddleware); router.use(attachHospitalId);

// ==================== WARDS ====================

// Get all wards
router.get('/wards', async (req, res) => {
    try {
        const wards = await prisma.ward.findMany({
            where: { hospitalId: req.user.hospitalId },
            include: { beds: true }
        });
        res.json(wards);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching wards' });
    }
});

// Create new ward
router.post('/wards', async (req, res) => {
    try {
        const { name, type, floor, totalBeds } = req.body;

        const ward = await prisma.ward.create({
            data: {
                name,
                wardId: `WARD-${Date.now()}`, // Simple ID generation
                type,
                floor,
                totalBeds: parseInt(totalBeds),
                hospitalId: req.user.hospitalId
            }
        });

        res.status(201).json(ward);
    } catch (error) {
        res.status(500).json({ error: 'Error creating ward' });
    }
});

// ==================== BEDS ====================

// Get all beds
router.get('/beds', async (req, res) => {
    try {
        const beds = await prisma.bed.findMany({
            where: { hospitalId: req.user.hospitalId },
            include: { ward: true }
        });
        res.json(beds);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching beds' });
    }
});

// Add new bed
router.post('/beds', async (req, res) => {
    try {
        const { wardId, bedNumber } = req.body;

        const bed = await prisma.bed.create({
            data: {
                wardId,
                bedNumber,
                status: 'Available',
                hospitalId: req.user.hospitalId
            }
        });

        res.status(201).json(bed);
    } catch (error) {
        res.status(500).json({ error: 'Error adding bed' });
    }
});

// ==================== ADMISSIONS ====================

// Admit patient
router.post('/admit', async (req, res) => {
    try {
        const { patientId, bedId, diagnosis, doctorId } = req.body;

        // Start transaction
        const result = await prisma.$transaction(async (prisma) => {
            // Create admission record
            const admission = await prisma.admission.create({
                data: {
                    patientId,
                    bedId,
                    diagnosis,
                    doctorId,
                    status: 'Admitted',
                    hospitalId: req.user.hospitalId
                }
            });

            // Update bed status
            await prisma.bed.update({
                where: { id: bedId },
                data: {
                    status: 'Occupied',
                    patientId: patientId
                }
            });

            return admission;
        });

        res.status(201).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error admitting patient' });
    }
});

// Discharge patient
router.post('/discharge', async (req, res) => {
    try {
        const { admissionId, dischargeNotes } = req.body;

        const admission = await prisma.admission.findUnique({
            where: { id: admissionId }
        });

        if (!admission) return res.status(404).json({ error: 'Admission not found' });

        // Start transaction
        const result = await prisma.$transaction(async (prisma) => {
            // Update admission record
            const updatedAdmission = await prisma.admission.update({
                where: { id: admissionId },
                data: {
                    status: 'Discharged',
                    dischargeDate: new Date()
                }
            });

            // Update bed status
            await prisma.bed.update({
                where: { id: admission.bedId },
                data: {
                    status: 'Available',
                    patientId: null,
                    patientName: null
                }
            });

            return updatedAdmission;
        });

        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Error discharging patient' });
    }
});

module.exports = router;
