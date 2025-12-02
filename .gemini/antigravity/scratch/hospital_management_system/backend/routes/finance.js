const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken, attachHospitalId } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Apply authentication and hospital ID middleware to all routes
router.use(authenticateToken);
router.use(attachHospitalId);

// ==================== EXPENSES ====================

// GET /api/finance/expenses - List all expenses
router.get('/expenses', async (req, res) => {
    try {
        const { hospitalId } = req;
        const { status, category, startDate, endDate } = req.query;

        const where = { hospitalId };
        if (status) where.status = status;
        if (category) where.category = category;
        if (startDate && endDate) {
            where.date = {
                gte: new Date(startDate),
                lte: new Date(endDate)
            };
        }

        const expenses = await prisma.expense.findMany({
            where,
            orderBy: { date: 'desc' }
        });

        res.json({ expenses });
    } catch (error) {
        console.error('Get expenses error:', error);
        res.status(500).json({ error: 'Failed to fetch expenses' });
    }
});

// POST /api/finance/expenses - Create expense
router.post('/expenses', async (req, res) => {
    try {
        const { hospitalId, userId } = req;
        const { category, description, amount, date, notes } = req.body;

        const expense = await prisma.expense.create({
            data: {
                hospitalId,
                category,
                description,
                amount: parseFloat(amount),
                date: date || new Date(),
                notes,
                status: 'Pending',
                requestedBy: userId
            }
        });

        res.status(201).json({ expense, message: 'Expense created successfully' });
    } catch (error) {
        console.error('Create expense error:', error);
        res.status(500).json({ error: 'Failed to create expense' });
    }
});

// PATCH /api/finance/expenses/:id/approve - Approve expense
router.patch('/expenses/:id/approve', async (req, res) => {
    try {
        const { id } = req.params;
        const { hospitalId, userId } = req;

        const expense = await prisma.expense.update({
            where: { id, hospitalId },
            data: {
                status: 'Approved',
                approvedBy: userId,
                approvedDate: new Date()
            }
        });

        res.json({ expense, message: 'Expense approved' });
    } catch (error) {
        console.error('Approve expense error:', error);
        res.status(500).json({ error: 'Failed to approve expense' });
    }
});

// PATCH /api/finance/expenses/:id/pay - Mark expense as paid
router.patch('/expenses/:id/pay', async (req, res) => {
    try {
        const { id } = req.params;
        const { hospitalId } = req;
        const { paymentMethod, reference } = req.body;

        const expense = await prisma.expense.update({
            where: { id, hospitalId },
            data: {
                status: 'Paid',
                paidDate: new Date(),
                paymentMethod,
                reference
            }
        });

        res.json({ expense, message: 'Expense marked as paid' });
    } catch (error) {
        console.error('Pay expense error:', error);
        res.status(500).json({ error: 'Failed to mark expense as paid' });
    }
});

// ==================== FINANCIAL REPORTS ====================

// GET /api/finance/summary - Financial summary
router.get('/summary', async (req, res) => {
    try {
        const { hospitalId } = req;
        const { period = 'month' } = req.query;

        // Calculate date range
        const now = new Date();
        let startDate;
        switch (period) {
            case 'today':
                startDate = new Date(now.setHours(0, 0, 0, 0));
                break;
            case 'week':
                startDate = new Date(now.setDate(now.getDate() - 7));
                break;
            case 'month':
                startDate = new Date(now.setMonth(now.getMonth() - 1));
                break;
            case 'year':
                startDate = new Date(now.setFullYear(now.getFullYear() - 1));
                break;
            default:
                startDate = new Date(0);
        }

        // Get revenue (from bills)
        const bills = await prisma.bill.findMany({
            where: {
                hospitalId,
                createdAt: { gte: startDate },
                status: 'Paid'
            }
        });

        const totalRevenue = bills.reduce((sum, bill) => sum + (bill.totalAmount || 0), 0);

        // Get expenses
        const expenses = await prisma.expense.findMany({
            where: {
                hospitalId,
                date: { gte: startDate },
                status: 'Paid'
            }
        });

        const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

        // Get pending bills
        const pendingBills = await prisma.bill.findMany({
            where: {
                hospitalId,
                status: { in: ['Pending', 'Partial'] }
            }
        });

        const totalPending = pendingBills.reduce((sum, bill) => sum + (bill.totalAmount || 0), 0);

        res.json({
            summary: {
                totalRevenue,
                totalExpenses,
                netProfit: totalRevenue - totalExpenses,
                totalPending,
                revenueCount: bills.length,
                expenseCount: expenses.length,
                pendingCount: pendingBills.length,
                period
            }
        });
    } catch (error) {
        console.error('Get financial summary error:', error);
        res.status(500).json({ error: 'Failed to fetch financial summary' });
    }
});

// GET /api/finance/revenue-by-category - Revenue breakdown
router.get('/revenue-by-category', async (req, res) => {
    try {
        const { hospitalId } = req;
        const { startDate, endDate } = req.query;

        const where = { hospitalId, status: 'Paid' };
        if (startDate && endDate) {
            where.createdAt = {
                gte: new Date(startDate),
                lte: new Date(endDate)
            };
        }

        const bills = await prisma.bill.findMany({
            where,
            include: {
                billItems: true
            }
        });

        // Group by service category
        const revenueByCategory = {};
        bills.forEach(bill => {
            bill.billItems.forEach(item => {
                const category = item.category || 'Other';
                revenueByCategory[category] = (revenueByCategory[category] || 0) + item.amount;
            });
        });

        res.json({ revenueByCategory });
    } catch (error) {
        console.error('Get revenue by category error:', error);
        res.status(500).json({ error: 'Failed to fetch revenue breakdown' });
    }
});

// GET /api/finance/transactions - All financial transactions
router.get('/transactions', async (req, res) => {
    try {
        const { hospitalId } = req;
        const { startDate, endDate, type, search } = req.query;

        const where = { hospitalId };
        if (startDate && endDate) {
            where.createdAt = {
                gte: new Date(startDate),
                lte: new Date(endDate)
            };
        }

        // Get bills (revenue)
        const bills = await prisma.bill.findMany({
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

        // Get expenses
        const expenses = await prisma.expense.findMany({
            where: {
                hospitalId,
                date: startDate && endDate ? {
                    gte: new Date(startDate),
                    lte: new Date(endDate)
                } : undefined
            },
            orderBy: { date: 'desc' }
        });

        // Combine and format
        const transactions = [
            ...bills.map(b => ({
                id: b.id,
                type: 'Revenue',
                description: `Bill ${b.billNumber}`,
                amount: b.totalAmount,
                date: b.createdAt,
                status: b.status,
                patient: b.patient?.name,
                category: 'Patient Services'
            })),
            ...expenses.map(e => ({
                id: e.id,
                type: 'Expense',
                description: e.description,
                amount: e.amount,
                date: e.date,
                status: e.status,
                category: e.category
            }))
        ].sort((a, b) => new Date(b.date) - new Date(a.date));

        res.json({ transactions });
    } catch (error) {
        console.error('Get transactions error:', error);
        res.status(500).json({ error: 'Failed to fetch transactions' });
    }
});

module.exports = router;
