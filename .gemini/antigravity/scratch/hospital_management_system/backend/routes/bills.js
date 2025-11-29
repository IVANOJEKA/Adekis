const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authMiddleware, attachHospitalId } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

router.use(authMiddleware);
router.use(attachHospitalId);

// GET /api/bills
router.get('/', async (req, res) => {
    try {
        const { patientId, status, type } = req.query;
        const hospitalId = req.hospitalId;

        const where = { hospitalId };
        if (patientId) where.patientId = patientId;
        if (status) where.status = status;
        if (type) where.type = type;

        const bills = await prisma.bill.findMany({
            where,
            orderBy: { createdAt: 'desc' }
        });

        res.json({ bills });
    } catch (error) {
        console.error('Get bills error:', error);
        res.status(500).json({ error: 'Failed to fetch bills' });
    }
});

// POST /api/bills
router.post('/', async (req, res) => {
    try {
        const {
            patientId,
            patientName,
            type,
            category,
            description,
            amount,
            paymentMethod,
            receiptId,
            paidAt
        } = req.body;

        const hospitalId = req.hospitalId;

        if (!patientId || !patientName || !type || !amount) {
            return res.status(400).json({
                error: 'Patient, type, and amount are required'
            });
        }

        // Generate bill ID
        const count = await prisma.bill.count({ where: { hospitalId } });
        const billId = `BILL-${String(count + 1).padStart(5, '0')}`;

        const bill = await prisma.bill.create({
            data: {
                hospitalId,
                billId,
                patientId,
                patientName,
                type,
                category,
                description,
                amount: parseFloat(amount),
                paymentMethod,
                receiptId,
                paidAt,
                status: paymentMethod ? 'paid' : 'pending',
                paymentDate: paymentMethod ? new Date() : null
            }
        });

        res.status(201).json({
            message: 'Bill created successfully',
            bill
        });
    } catch (error) {
        console.error('Create bill error:', error);
        res.status(500).json({ error: 'Failed to create bill' });
    }
});

// PUT /api/bills/:id
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const hospitalId = req.hospitalId;

        const existing = await prisma.bill.findFirst({
            where: { id, hospitalId }
        });

        if (!existing) {
            return res.status(404).json({ error: 'Bill not found' });
        }

        const bill = await prisma.bill.update({
            where: { id },
            data: {
                ...req.body,
                amount: req.body.amount ? parseFloat(req.body.amount) : undefined,
                paymentDate: req.body.status === 'paid' && !existing.paymentDate
                    ? new Date()
                    : undefined
            }
        });

        res.json({
            message: 'Bill updated successfully',
            bill
        });
    } catch (error) {
        console.error('Update bill error:', error);
        res.status(500).json({ error: 'Failed to update bill' });
    }
});

module.exports = router;
