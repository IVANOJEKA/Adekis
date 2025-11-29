const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authMiddleware, attachHospitalId } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

router.use(authMiddleware);
router.use(attachHospitalId);

// GET /api/cases
router.get('/', async (req, res) => {
    try {
        const { patientId, status } = req.query;
        const hospitalId = req.hospitalId;

        const where = { hospitalId };
        if (patientId) where.patientId = patientId;
        if (status) where.status = status;

        const cases = await prisma.case.findMany({
            where,
            orderBy: { createdAt: 'desc' }
        });

        res.json({ cases });
    } catch (error) {
        console.error('Get cases error:', error);
        res.status(500).json({ error: 'Failed to fetch cases' });
    }
});

// POST /api/cases
router.post('/', async (req, res) => {
    try {
        const {
            patientId,
            patientName,
            startDate,
            type,
            department,
            chiefComplaint,
            assignedDoctorId,
            assignedDoctorName
        } = req.body;

        const hospitalId = req.hospitalId;

        if (!patientId || !patientName || !type || !department) {
            return res.status(400).json({
                error: 'Patient, type, and department are required'
            });
        }

        // Generate case ID
        const year = new Date().getFullYear();
        const count = await prisma.case.count({
            where: {
                hospitalId,
                caseId: { startsWith: `CASE-${year}-` }
            }
        });
        const caseId = `CASE-${year}-${String(count + 1).padStart(4, '0')}`;

        const caseRecord = await prisma.case.create({
            data: {
                hospitalId,
                caseId,
                patientId,
                patientName,
                startDate: startDate || new Date().toISOString().split('T')[0],
                type,
                department,
                chiefComplaint,
                assignedDoctorId,
                assignedDoctorName,
                status: 'Open'
            }
        });

        res.status(201).json({
            message: 'Case created successfully',
            case: caseRecord
        });
    } catch (error) {
        console.error('Create case error:', error);
        res.status(500).json({ error: 'Failed to create case' });
    }
});

// PUT /api/cases/:id
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const hospitalId = req.hospitalId;

        const existing = await prisma.case.findFirst({
            where: { id, hospitalId }
        });

        if (!existing) {
            return res.status(404).json({ error: 'Case not found' });
        }

        const caseRecord = await prisma.case.update({
            where: { id },
            data: req.body
        });

        res.json({
            message: 'Case updated successfully',
            case: caseRecord
        });
    } catch (error) {
        console.error('Update case error:', error);
        res.status(500).json({ error: 'Failed to update case' });
    }
});

module.exports = router;
