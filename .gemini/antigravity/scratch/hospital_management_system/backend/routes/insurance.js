const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { authMiddleware, attachHospitalId } = require('../middleware/auth');

const prisma = new PrismaClient();

// Middleware to ensure authentication
router.use(authMiddleware); router.use(attachHospitalId);

// ==================== INSURANCE PROVIDERS ====================

// Get all insurance providers
router.get('/', async (req, res) => {
    try {
        const providers = await prisma.insuranceProvider.findMany({
            where: { hospitalId: req.user.hospitalId },
            orderBy: { name: 'asc' }
        });
        res.json(providers);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching insurance providers' });
    }
});

// Add new insurance provider
router.post('/', async (req, res) => {
    try {
        const { name, type, coverageTypes, email, phone, website, apiEnabled } = req.body;

        const provider = await prisma.insuranceProvider.create({
            data: {
                name,
                type,
                coverageTypes,
                email,
                phone,
                website,
                apiEnabled: apiEnabled || false,
                hospitalId: req.user.hospitalId
            }
        });

        res.status(201).json(provider);
    } catch (error) {
        res.status(500).json({ error: 'Error creating insurance provider' });
    }
});

// Verify patient coverage (Mock Endpoint)
router.post('/verify', async (req, res) => {
    try {
        const { providerId, memberNumber } = req.body;

        // In a real app, this would call the external insurance API
        // For now, we simulate a response based on the member number

        const isValid = memberNumber.length > 5; // Mock validation logic

        if (isValid) {
            res.json({
                isValid: true,
                status: 'Active',
                memberName: 'John Doe (Mock)', // In real app, fetch from API
                plan: 'Gold Comprehensive',
                limit: 5000000,
                message: 'Member verification successful'
            });
        } else {
            res.json({
                isValid: false,
                status: 'Invalid',
                message: 'Member not found or policy inactive'
            });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error verifying coverage' });
    }
});

// ==================== INSURANCE CLAIMS ====================

// Get all claims
router.get('/claims', async (req, res) => {
    try {
        const claims = await prisma.insuranceClaim.findMany({
            where: { hospitalId: req.user.hospitalId },
            include: { provider: true },
            orderBy: { submissionDate: 'desc' }
        });
        res.json(claims);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching claims' });
    }
});

// Submit a new claim
router.post('/claims', async (req, res) => {
    try {
        const { providerId, patientId, patientName, memberNumber, service, amount, notes } = req.body;

        const claim = await prisma.insuranceClaim.create({
            data: {
                providerId,
                patientId,
                patientName,
                memberNumber,
                service,
                amount: parseFloat(amount),
                status: 'Pending', // Default status
                notes,
                hospitalId: req.user.hospitalId
            }
        });

        res.status(201).json(claim);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error submitting claim' });
    }
});

// Update claim status
router.put('/claims/:id/status', async (req, res) => {
    try {
        const { status, notes } = req.body;
        const { id } = req.params;

        const claim = await prisma.insuranceClaim.update({
            where: {
                id,
                hospitalId: req.user.hospitalId
            },
            data: {
                status,
                notes: notes ? notes : undefined
            }
        });

        res.json(claim);
    } catch (error) {
        res.status(500).json({ error: 'Error updating claim status' });
    }
});

module.exports = router;
