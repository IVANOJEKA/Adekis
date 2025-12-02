const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { authMiddleware, attachHospitalId } = require('../middleware/auth');


// Apply authentication middleware
router.use(authMiddleware);
router.use(attachHospitalId);

// Get all triage records (with filtering)
router.get('/', async (req, res) => {
    try {
        const { status, patientId } = req.query;
        const where = {
            hospitalId: req.user.hospitalId,
            ...(status && { status }),
            ...(patientId && { patientId })
        };

        const records = await prisma.triageRecord.findMany({
            where,
            include: {
                patient: {
                    select: { name: true, gender: true, dateOfBirth: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json(records);
    } catch (error) {
        console.error('Error fetching triage records:', error);
        res.status(500).json({ error: 'Failed to fetch triage records' });
    }
});

// Create new triage record
router.post('/', async (req, res) => {
    try {
        const { patientId, vitals, chiefComplaint, priority, notes } = req.body;

        const record = await prisma.triageRecord.create({
            data: {
                hospitalId: req.user.hospitalId,
                patientId,
                vitals,
                chiefComplaint,
                priority,
                notes,
                nurseId: req.user.id,
                nurseName: req.user.name,
                status: 'Completed'
            }
        });

        res.status(201).json(record);
    } catch (error) {
        console.error('Error creating triage record:', error);
        res.status(500).json({ error: 'Failed to create triage record' });
    }
});

// Get specific triage record
router.get('/:id', async (req, res) => {
    try {
        const record = await prisma.triageRecord.findUnique({
            where: {
                id: req.params.id,
                hospitalId: req.user.hospitalId
            },
            include: {
                patient: true
            }
        });

        if (!record) {
            return res.status(404).json({ error: 'Triage record not found' });
        }

        res.json(record);
    } catch (error) {
        console.error('Error fetching triage record:', error);
        res.status(500).json({ error: 'Failed to fetch triage record' });
    }
});

module.exports = router;
