const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken, attachHospitalId } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Apply authentication and hospital ID middleware to all routes
router.use(authenticateToken);
router.use(attachHospitalId);

// ==================== PATHOLOGY ====================
// Note: Pathology is similar to Laboratory, so we'll use the Lab infrastructure

// GET /api/pathology/tests - List pathology tests (delegates to lab)
router.get('/tests', async (req, res) => {
    try {
        const { hospitalId } = req;
        const { status, testType, patientId } = req.query;

        const where = {
            hospitalId,
            testType: 'Pathology' // Filter specifically for pathology tests
        };
        if (status) where.status = status;
        if (patientId) where.patientId = patientId;

        const tests = await prisma.labTest.findMany({
            where,
            include: {
                patient: {
                    select: {
                        name: true,
                        patientId: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json({ tests });
    } catch (error) {
        console.error('Get pathology tests error:', error);
        res.status(500).json({ error: 'Failed to fetch pathology tests' });
    }
});

// POST /api/pathology/tests - Order pathology test
router.post('/tests', async (req, res) => {
    try {
        const { hospitalId, userId } = req;
        const { patientId, testName, sampleType, urgency, notes } = req.body;

        const test = await prisma.labTest.create({
            data: {
                hospitalId,
                patientId,
                testName,
                testType: 'Pathology',
                sampleType: sampleType || 'Tissue',
                urgency: urgency || 'Normal',
                status: 'Pending',
                orderedBy: userId,
                notes
            }
        });

        res.status(201).json({ test, message: 'Pathology test ordered successfully' });
    } catch (error) {
        console.error('Order pathology test error:', error);
        res.status(500).json({ error: 'Failed to order pathology test' });
    }
});

// PATCH /api/pathology/tests/:id/results - Update test results
router.patch('/tests/:id/results', async (req, res) => {
    try {
        const { id } = req.params;
        const { hospitalId, userId } = req;
        const { findings, diagnosis, recommendations } = req.body;

        const test = await prisma.labTest.update({
            where: { id, hospitalId },
            data: {
                results: JSON.stringify({ findings, diagnosis, recommendations }),
                status: 'Completed',
                completedDate: new Date(),
                performedBy: userId
            }
        });

        res.json({ test, message: 'Pathology results updated successfully' });
    } catch (error) {
        console.error('Update pathology results error:', error);
        res.status(500).json({ error: 'Failed to update pathology results' });
    }
});

// GET /api/pathology/tests/:id - Get specific pathology test
router.get('/tests/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { hospitalId } = req;

        const test = await prisma.labTest.findFirst({
            where: { id, hospitalId, testType: 'Pathology' },
            include: {
                patient: {
                    select: {
                        name: true,
                        patientId: true,
                        dateOfBirth: true,
                        gender: true
                    }
                }
            }
        });

        if (!test) {
            return res.status(404).json({ error: 'Pathology test not found' });
        }

        res.json({ test });
    } catch (error) {
        console.error('Get pathology test error:', error);
        res.status(500).json({ error: 'Failed to fetch pathology test' });
    }
});

module.exports = router;
