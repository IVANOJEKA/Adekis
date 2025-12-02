const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { authMiddleware, attachHospitalId } = require('../middleware/auth');

const prisma = new PrismaClient();

// Middleware to ensure authentication
router.use(authMiddleware); router.use(attachHospitalId);

// ==================== WALLETS ====================

// Get all wallets
router.get('/', async (req, res) => {
    try {
        const wallets = await prisma.wallet.findMany({
            where: { hospitalId: req.user.hospitalId },
            include: { transactions: { take: 5, orderBy: { date: 'desc' } } },
            orderBy: { createdAt: 'desc' }
        });
        res.json(wallets);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching wallets' });
    }
});

// Create new wallet
router.post('/', async (req, res) => {
    try {
        const { cardholderName, packageType, initialBalance, members } = req.body;

        // Generate card number
        const generateCardNumber = () => {
            const part1 = Math.floor(1000 + Math.random() * 9000);
            const part2 = Math.floor(1000 + Math.random() * 9000);
            const part3 = Math.floor(1000 + Math.random() * 9000);
            const part4 = Math.floor(1000 + Math.random() * 9000);
            return `${part1}-${part2}-${part3}-${part4}`;
        };

        // Generate expiry date (3 years from now)
        const generateExpiryDate = () => {
            const now = new Date();
            const expiry = new Date(now.setFullYear(now.getFullYear() + 3));
            const month = String(expiry.getMonth() + 1).padStart(2, '0');
            const year = String(expiry.getFullYear()).slice(-2);
            return `${month}/${year}`;
        };

        const wallet = await prisma.wallet.create({
            data: {
                cardholderName,
                cardNumber: generateCardNumber(),
                packageType,
                balance: parseFloat(initialBalance) || 0,
                expiryDate: generateExpiryDate(),
                members: members || [],
                status: 'Active',
                hospitalId: req.user.hospitalId
            }
        });

        // Create initial transaction if balance > 0
        if (initialBalance > 0) {
            await prisma.walletTransaction.create({
                data: {
                    walletId: wallet.id,
                    type: 'Credit',
                    amount: parseFloat(initialBalance),
                    description: 'Initial Top-up',
                    balanceAfter: parseFloat(initialBalance),
                    hospitalId: req.user.hospitalId
                }
            });
        }

        res.status(201).json(wallet);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creating wallet' });
    }
});

// Top up wallet
router.post('/:id/topup', async (req, res) => {
    try {
        const { amount, paymentMethod } = req.body;
        const { id } = req.params;

        const wallet = await prisma.wallet.findUnique({
            where: { id, hospitalId: req.user.hospitalId }
        });

        if (!wallet) {
            return res.status(404).json({ error: 'Wallet not found' });
        }

        const newBalance = wallet.balance + parseFloat(amount);

        const updatedWallet = await prisma.wallet.update({
            where: { id },
            data: { balance: newBalance }
        });

        await prisma.walletTransaction.create({
            data: {
                walletId: id,
                type: 'Credit',
                amount: parseFloat(amount),
                description: `Top-up via ${paymentMethod}`,
                balanceAfter: newBalance,
                hospitalId: req.user.hospitalId
            }
        });

        res.json(updatedWallet);
    } catch (error) {
        res.status(500).json({ error: 'Error topping up wallet' });
    }
});

// Get wallet transactions
router.get('/:id/transactions', async (req, res) => {
    try {
        const { id } = req.params;
        const transactions = await prisma.walletTransaction.findMany({
            where: { walletId: id, hospitalId: req.user.hospitalId },
            orderBy: { date: 'desc' }
        });
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching transactions' });
    }
});

module.exports = router;
