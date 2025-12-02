const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { authMiddleware, attachHospitalId } = require('../middleware/auth');

const prisma = new PrismaClient();

// Middleware
router.use(authMiddleware); router.use(attachHospitalId);

// ==================== MEDICAL RECORDS ====================

// Get all medical records (optionally filtered by patient)
router.get('/records', async (req, res) => {
    try {
        const { patientId } = req.query;

        const where = {
            hospitalId: req.user.hospitalId
        };

        if (patientId) {
            where.patientId = patientId;
        }

        const records = await prisma.medicalRecord.findMany({
            where,
            orderBy: { date: 'desc' }
        });

        res.json(records);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching medical records' });
    }
});

// Get medical records for specific patient
router.get('/records/:patientId', async (req, res) => {
    try {
        const { patientId } = req.params;

        const records = await prisma.medicalRecord.findMany({
            where: {
                hospitalId: req.user.hospitalId,
                patientId
            },
            orderBy: { date: 'desc' }
        });

        res.json(records);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching patient records' });
    }
});

// Create new medical record
router.post('/records', async (req, res) => {
    try {
        const {
            patientId,
            recordType,
            title,
            description,
            diagnosis,
            treatment,
            doctorId,
            doctorName,
            department,
            date,
            attachments, // Array of {filename, url, type, size}
            vitals // {bloodPressure, temperature, heartRate, etc}
        } = req.body;

        const record = await prisma.medicalRecord.create({
            data: {
                patientId,
                recordType,
                title,
                description,
                diagnosis,
                treatment,
                doctorId,
                doctorName,
                department,
                date: date ? new Date(date) : undefined,
                attachments: attachments || [],
                vitals: vitals || null,
                hospitalId: req.user.hospitalId
            }
        });

        res.status(201).json(record);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creating medical record' });
    }
});

// Update medical record
router.put('/records/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // Remove fields that shouldn't be updated
        delete updateData.id;
        delete updateData.hospitalId;
        delete updateData.createdAt;

        const record = await prisma.medicalRecord.update({
            where: {
                id,
                hospitalId: req.user.hospitalId
            },
            data: updateData
        });

        res.json(record);
    } catch (error) {
        res.status(500).json({ error: 'Error updating medical record' });
    }
});

// ==================== CLINICAL NOTES ====================

// Get clinical notes
router.get('/notes', async (req, res) => {
    try {
        const { patientId } = req.query;

        const where = {
            hospitalId: req.user.hospitalId
        };

        if (patientId) {
            where.patientId = patientId;
        }

        const notes = await prisma.clinicalNote.findMany({
            where,
            orderBy: { date: 'desc' }
        });

        res.json(notes);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching clinical notes' });
    }
});

// Create clinical note
router.post('/notes', async (req, res) => {
    try {
        const {
            patientId,
            noteType,
            content,
            authorId,
            authorName,
            authorRole,
            date
        } = req.body;

        const note = await prisma.clinicalNote.create({
            data: {
                patientId,
                noteType,
                content,
                authorId,
                authorName,
                authorRole,
                date: date ? new Date(date) : undefined,
                hospitalId: req.user.hospitalId
            }
        });

        res.status(201).json(note);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creating clinical note' });
    }
});

module.exports = router;
