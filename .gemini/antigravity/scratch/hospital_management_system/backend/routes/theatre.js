const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { authMiddleware, attachHospitalId } = require('../middleware/auth');

const prisma = new PrismaClient();

// Middleware to ensure authentication
router.use(authMiddleware); router.use(attachHospitalId);

// ==================== OPERATING ROOMS ====================

// Get all operating rooms
router.get('/rooms', async (req, res) => {
    try {
        const rooms = await prisma.operatingRoom.findMany({
            where: { hospitalId: req.user.hospitalId },
            include: {
                surgeries: {
                    where: { status: { in: ['Scheduled', 'In Progress'] } },
                    orderBy: { date: 'asc' }
                }
            }
        });
        res.json(rooms);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching operating rooms' });
    }
});

// Add operating room
router.post('/rooms', async (req, res) => {
    try {
        const { name, type, equipment } = req.body;

        const room = await prisma.operatingRoom.create({
            data: {
                name,
                type,
                equipment: equipment || [],
                hospitalId: req.user.hospitalId
            }
        });

        res.status(201).json(room);
    } catch (error) {
        res.status(500).json({ error: 'Error creating operating room' });
    }
});

// ==================== SURGERIES ====================

// Get all surgeries
router.get('/surgeries', async (req, res) => {
    try {
        const surgeries = await prisma.surgery.findMany({
            where: { hospitalId: req.user.hospitalId },
            include: { room: true },
            orderBy: { date: 'desc' }
        });
        res.json(surgeries);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching surgeries' });
    }
});

// Schedule surgery
router.post('/surgeries', async (req, res) => {
    try {
        const { patientId, patientName, roomId, procedureName, surgeonId, surgeonName, date, startTime, notes } = req.body;

        const surgery = await prisma.surgery.create({
            data: {
                patientId,
                patientName,
                roomId,
                procedureName,
                surgeonId,
                surgeonName,
                date: new Date(date),
                startTime,
                notes,
                status: 'Scheduled',
                hospitalId: req.user.hospitalId
            }
        });

        res.status(201).json(surgery);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error scheduling surgery' });
    }
});

// Update surgery status
router.put('/surgeries/:id/status', async (req, res) => {
    try {
        const { status, endTime } = req.body;
        const { id } = req.params;

        const surgery = await prisma.surgery.update({
            where: { id, hospitalId: req.user.hospitalId },
            data: {
                status,
                endTime: endTime || undefined
            }
        });

        // If surgery started/ended, update room status
        if (status === 'In Progress') {
            await prisma.operatingRoom.update({
                where: { id: surgery.roomId },
                data: { status: 'In Use' }
            });
        } else if (status === 'Completed' || status === 'Cancelled') {
            await prisma.operatingRoom.update({
                where: { id: surgery.roomId },
                data: { status: 'Available' } // Or 'Cleaning' if preferred
            });
        }

        res.json(surgery);
    } catch (error) {
        res.status(500).json({ error: 'Error updating surgery status' });
    }
});

module.exports = router;
