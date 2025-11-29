const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authMiddleware, attachHospitalId } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

router.use(authMiddleware);
router.use(attachHospitalId);

// GET /api/queue
router.get('/', async (req, res) => {
    try {
        const { department, status } = req.query;
        const hospitalId = req.hospitalId;

        const where = { hospitalId };
        if (department) where.department = department;
        if (status) where.status = status;

        const queue = await prisma.queueEntry.findMany({
            where,
            orderBy: [
                { priority: 'asc' },
                { checkInTime: 'asc' }
            ]
        });

        res.json({ queue });
    } catch (error) {
        console.error('Get queue error:', error);
        res.status(500).json({ error: 'Failed to fetch queue' });
    }
});

// POST /api/queue
router.post('/', async (req, res) => {
    try {
        const {
            queueNumber,
            patientId,
            patientName,
            department,
            service,
            priority,
            notes
        } = req.body;

        const hospitalId = req.hospitalId;

        if (!queueNumber || !patientId || !patientName || !department || !service) {
            return res.status(400).json({
                error: 'Queue number, patient, department, and service are required'
            });
        }

        const entry = await prisma.queueEntry.create({
            data: {
                hospitalId,
                queueNumber,
                patientId,
                patientName,
                department,
                service,
                priority: priority || 'Normal',
                notes,
                status: 'Waiting'
            }
        });

        res.status(201).json({
            message: 'Queue entry created successfully',
            entry
        });
    } catch (error) {
        console.error('Create queue entry error:', error);
        res.status(500).json({ error: 'Failed to create queue entry' });
    }
});

// PUT /api/queue/:id
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const hospitalId = req.hospitalId;

        const existing = await prisma.queueEntry.findFirst({
            where: { id, hospitalId }
        });

        if (!existing) {
            return res.status(404).json({ error: 'Queue entry not found' });
        }

        // Handle status transitions
        const updateData = { ...req.body };
        if (req.body.status === 'InService' && !existing.serviceStartTime) {
            updateData.serviceStartTime = new Date();
        }
        if (req.body.status === 'Completed' && !existing.serviceEndTime) {
            updateData.serviceEndTime = new Date();
        }

        const entry = await prisma.queueEntry.update({
            where: { id },
            data: updateData
        });

        res.json({
            message: 'Queue entry updated successfully',
            entry
        });
    } catch (error) {
        console.error('Update queue entry error:', error);
        res.status(500).json({ error: 'Failed to update queue entry' });
    }
});

module.exports = router;
