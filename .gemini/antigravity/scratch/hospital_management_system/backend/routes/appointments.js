const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authMiddleware, attachHospitalId } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Apply authentication middleware
router.use(authMiddleware);
router.use(attachHospitalId);

// GET /api/appointments - Get all appointments
router.get('/', async (req, res) => {
    try {
        const { date, status, patientId } = req.query;
        const hospitalId = req.hospitalId;

        const where = { hospitalId };
        if (date) where.appointmentDate = new Date(date);
        if (status) where.status = status;
        if (patientId) where.patientId = patientId;

        const appointments = await prisma.appointment.findMany({
            where,
            orderBy: [{ appointmentDate: 'desc' }, {
                appointmentTime: '

desc' }],
            include: {
                patient: {
                    select: {
                        patientId: true,
                        name: true,
                        phone: true
                    }
                }
            }
        });

        res.json({ appointments });
    } catch (error) {
        console.error('Get appointments error:', error);
        res.status(500).json({ error: 'Failed to fetch appointments' });
    }
});

// GET /api/appointments/:id - Get single appointment
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const hospitalId = req.hospitalId;

        const appointment = await prisma.appointment.findFirst({
            where: { id, hospitalId },
            include: {
                patient: true
            }
        });

        if (!appointment) {
            return res.status(404).json({ error: 'Appointment not found' });
        }

        res.json({ appointment });
    } catch (error) {
        console.error('Get appointment error:', error);
        res.status(500).json({ error: 'Failed to fetch appointment' });
    }
});

// POST /api/appointments - Create appointment
router.post('/', async (req, res) => {
    try {
        const {
            patientId,
            doctorId,
            appointmentDate,
            appointmentTime,
            type,
            reason,
            notes
        } = req.body;

        const hospitalId = req.hospitalId;

        if (!patientId || !doctorId || !appointmentDate || !appointmentTime) {
            return res.status(400).json({
                error: 'Patient, doctor, date and time are required'
            });
        }

        const appointment = await prisma.appointment.create({
            data: {
                hospitalId,
                patientId,
                doctorId,
                appointmentDate: new Date(appointmentDate),
                appointmentTime,
                type: type || 'Consultation',
                reason,
                notes,
                status: 'scheduled'
            }
        });

        res.status(201).json({
            message: 'Appointment created successfully',
            appointment
        });
    } catch (error) {
        console.error('Create appointment error:', error);
        res.status(500).json({ error: 'Failed to create appointment' });
    }
});

// PUT /api/appointments/:id - Update appointment
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const hospitalId = req.hospitalId;

        const existing = await prisma.appointment.findFirst({
            where: { id, hospitalId }
        });

        if (!existing) {
            return res.status(404).json({ error: 'Appointment not found' });
        }

        const appointment = await prisma.appointment.update({
            where: { id },
            data: {
                ...req.body,
                appointmentDate: req.body.appointmentDate
                    ? new Date(req.body.appointmentDate)
                    : undefined
            }
        });

        res.json({
            message: 'Appointment updated successfully',
            appointment
        });
    } catch (error) {
        console.error('Update appointment error:', error);
        res.status(500).json({ error: 'Failed to update appointment' });
    }
});

// DELETE /api/appointments/:id - Delete appointment
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const hospitalId = req.hospitalId;

        const existing = await prisma.appointment.findFirst({
            where: { id, hospitalId }
        });

        if (!existing) {
            return res.status(404).json({ error: 'Appointment not found' });
        }

        await prisma.appointment.delete({ where: { id } });

        res.json({ message: 'Appointment deleted successfully' });
    } catch (error) {
        console.error('Delete appointment error:', error);
        res.status(500).json({ error: 'Failed to delete appointment' });
    }
});

module.exports = router;
