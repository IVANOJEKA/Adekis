const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken, attachHospitalId } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Apply authentication and hospital ID middleware to all routes
router.use(authenticateToken);
router.use(attachHospitalId);

// GET /api/wallet - Get all wallets (admin/staff view)
router.get('/', async (req, res) => {
    try {
        const { hospitalId } = req;
        const { search, status } = req.query;

        const where = { hospitalId };

        if (search) {
            where.OR = [
                { patient: { name: { contains: search, mode: 'insensitive' } } },
                { patient: { patientId: { contains: search, mode: 'insensitive' } } }
            ];
        }

        if (status) {
            where.status = status;
        }

        const wallets = await prisma.wallet.findMany({
            where,
            include: {
                patient: {
                    select: {
                        id: true,
                        patientId: true,
                        name: true,
                        phone: true,
                        gender: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json({ wallets });
    } catch (error) {
        console.error('Get wallets error:', error);
        res.status(500).json({ error: 'Failed to fetch wallets' });
    }
});

// GET /api/wallet/:id - Get specific wallet details
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { hospitalId } = req;

        const wallet = await prisma.wallet.findFirst({
            where: { id, hospitalId },
            include: {
                patient: true,
                transactions: {
                    orderBy: { createdAt: 'desc' },
                    take: 50 // Last 50 transactions
                }
            }
        });

        if (!wallet) {
            return res.status(404).json({ error: 'Wallet not found' });
        }

        res.json({ wallet });
    } catch (error) {
        console.error('Get wallet error:', error);
        res.status(500).json({ error: 'Failed to fetch wallet' });
    }
});

// POST /api/wallet - Create a new wallet
router.post('/', async (req, res) => {
    try {
        const { patientId, initialBalance = 0 } = req.body;
        const { hospitalId, userId } = req;

        // Check if wallet already exists for this patient
        const existingWallet = await prisma.wallet.findFirst({
            where: { patientId, hospitalId }
        });

        if (existingWallet) {
            return res.status(400).json({ error: 'Wallet already exists for this patient' });
        }

        // Check if patient exists
        const patient = await prisma.patient.findFirst({
            where: { id: patientId, hospitalId }
        });

        if (!patient) {
            return res.status(404).json({ error: 'Patient not found' });
        }

        // Create wallet
        const wallet = await prisma.wallet.create({
            data: {
                hospitalId,
                patientId,
                balance: initialBalance,
                currency: 'KES',
                status: 'active'
            },
            include: {
                patient: true
            }
        });

        // If initial balance, create a transaction record
        if (initialBalance > 0) {
            await prisma.walletTransaction.create({
                data: {
                    hospitalId,
                    walletId: wallet.id,
                    type: 'credit',
                    amount: initialBalance,
                    description: 'Initial wallet balance',
                    performedBy: userId
                }
            });
        }

        res.status(201).json({ wallet, message: 'Wallet created successfully' });
    } catch (error) {
        console.error('Create wallet error:', error);
        res.status(500).json({ error: 'Failed to create wallet' });
    }
});

// POST /api/wallet/:id/topup - Top up wallet balance
router.post('/:id/topup', async (req, res) => {
    try {
        const { id } = req.params;
        const { amount, description, reference } = req.body;
        const { hospitalId, userId } = req;

        if (!amount || amount <= 0) {
            return res.status(400).json({ error: 'Invalid amount' });
        }

        // Get wallet
        const wallet = await prisma.wallet.findFirst({
            where: { id, hospitalId }
        });

        if (!wallet) {
            return res.status(404).json({ error: 'Wallet not found' });
        }

        if (wallet.status !== 'active') {
            return res.status(400).json({ error: 'Wallet is not active' });
        }

        // Update wallet balance and create transaction
        const [updatedWallet, transaction] = await prisma.$transaction([
            prisma.wallet.update({
                where: { id },
                data: { balance: { increment: parseFloat(amount) } },
                include: { patient: true }
            }),
            prisma.walletTransaction.create({
                data: {
                    hospitalId,
                    walletId: id,
                    type: 'credit',
                    amount: parseFloat(amount),
                    description: description || 'Wallet top-up',
                    reference,
                    performedBy: userId
                }
            })
        ]);

        res.json({
            wallet: updatedWallet,
            transaction,
            message: 'Wallet topped up successfully'
        });
    } catch (error) {
        console.error('Top-up wallet error:', error);
        res.status(500).json({ error: 'Failed to top up wallet' });
    }
});

// POST /api/wallet/:id/deduct - Deduct from wallet (for payments)
router.post('/:id/deduct', async (req, res) => {
    try {
        const { id } = req.params;
        const { amount, description, reference } = req.body;
        const { hospitalId, userId } = req;

        if (!amount || amount <= 0) {
            return res.status(400).json({ error: 'Invalid amount' });
        }

        // Get wallet
        const wallet = await prisma.wallet.findFirst({
            where: { id, hospitalId }
        });

        if (!wallet) {
            return res.status(404).json({ error: 'Wallet not found' });
        }

        if (wallet.status !== 'active') {
            return res.status(400).json({ error: 'Wallet is not active' });
        }

        if (wallet.balance < parseFloat(amount)) {
            return res.status(400).json({ error: 'Insufficient wallet balance' });
        }

        // Update wallet balance and create transaction
        const [updatedWallet, transaction] = await prisma.$transaction([
            prisma.wallet.update({
                where: { id },
                data: { balance: { decrement: parseFloat(amount) } },
                include: { patient: true }
            }),
            prisma.walletTransaction.create({
                data: {
                    hospitalId,
                    walletId: id,
                    type: 'debit',
                    amount: parseFloat(amount),
                    description: description || 'Payment',
                    reference,
                    performedBy: userId
                }
            })
        ]);

        res.json({
            wallet: updatedWallet,
            transaction,
            message: 'Payment successful'
        });
    } catch (error) {
        console.error('Deduct from wallet error:', error);
        res.status(500).json({ error: 'Failed to process payment' });
    }
});

// GET /api/wallet/:id/transactions - Get wallet transaction history
router.get('/:id/transactions', async (req, res) => {
    try {
        const { id } = req.params;
        const { hospitalId } = req;
        const { limit = 50, offset = 0 } = req.query;

        // Verify wallet belongs to hospital
        const wallet = await prisma.wallet.findFirst({
            where: { id, hospitalId }
        });

        if (!wallet) {
            return res.status(404).json({ error: 'Wallet not found' });
        }

        const transactions = await prisma.walletTransaction.findMany({
            where: { walletId: id, hospitalId },
            orderBy: { createdAt: 'desc' },
            take: parseInt(limit),
            skip: parseInt(offset)
        });

        res.json({ transactions });
    } catch (error) {
        console.error('Get transactions error:', error);
        res.status(500).json({ error: 'Failed to fetch transactions' });
    }
});

// PATCH /api/wallet/:id/status - Update wallet status (activate/suspend)
router.patch('/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const { hospitalId } = req;

        if (!['active', 'suspended'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        const wallet = await prisma.wallet.findFirst({
            where: { id, hospitalId }
        });

        if (!wallet) {
            return res.status(404).json({ error: 'Wallet not found' });
        }

        const updatedWallet = await prisma.wallet.update({
            where: { id },
            data: { status },
            include: { patient: true }
        });

        res.json({ wallet: updatedWallet, message: 'Wallet status updated' });
    } catch (error) {
        console.error('Update wallet status error:', error);
        res.status(500).json({ error: 'Failed to update wallet status' });
    }
});

module.exports = router;
