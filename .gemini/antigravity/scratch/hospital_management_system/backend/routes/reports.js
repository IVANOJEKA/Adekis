const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authMiddleware, attachHospitalId } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Apply authentication and hospital ID middleware to all routes
router.use(authMiddleware);
router.use(attachHospitalId);

// ==================== REPORTS GENERATION ====================

// GET /api/reports/patient-statistics - Patient statistics report
router.get('/patient-statistics', async (req, res) => {
    try {
        const { hospitalId } = req;
        const { startDate, endDate } = req.query;

        const where = { hospitalId };
        if (startDate && endDate) {
            where.createdAt = {
                gte: new Date(startDate),
                lte: new Date(endDate)
            };
        }

        const totalPatients = await prisma.patient.count({ where });
        const patientsByGender = await prisma.patient.groupBy({
            by: ['gender'],
            where,
            _count: true
        });

        const patientsByAge = await prisma.patient.findMany({
            where,
            select: { dateOfBirth: true }
        });

        // Calculate age groups
        const ageGroups = { '0-18': 0, '19-35': 0, '36-50': 0, '51-65': 0, '65+': 0 };
        patientsByAge.forEach(p => {
            const age = new Date().getFullYear() - new Date(p.dateOfBirth).getFullYear();
            if (age <= 18) ageGroups['0-18']++;
            else if (age <= 35) ageGroups['19-35']++;
            else if (age <= 50) ageGroups['36-50']++;
            else if (age <= 65) ageGroups['51-65']++;
            else ageGroups['65+']++;
        });

        res.json({
            report: {
                totalPatients,
                byGender: patientsByGender,
                byAge: ageGroups
            }
        });
    } catch (error) {
        console.error('Patient statistics error:', error);
        res.status(500).json({ error: 'Failed to generate patient statistics' });
    }
});

// GET /api/reports/revenue - Revenue report
router.get('/revenue', async (req, res) => {
    try {
        const { hospitalId } = req;
        const { startDate, endDate, groupBy = 'day' } = req.query;

        const where = {
            hospitalId,
            status: 'Paid'
        };

        if (startDate && endDate) {
            where.paidDate = {
                gte: new Date(startDate),
                lte: new Date(endDate)
            };
        }

        const bills = await prisma.bill.findMany({
            where,
            include: {
                billItems: true
            },
            orderBy: { paidDate: 'asc' }
        });

        // Group revenue by date
        const revenueByDate = {};
        bills.forEach(bill => {
            const date = new Date(bill.paidDate).toISOString().split('T')[0];
            revenueByDate[date] = (revenueByDate[date] || 0) + bill.totalAmount;
        });

        // Group by service category
        const revenueByCategory = {};
        bills.forEach(bill => {
            bill.billItems.forEach(item => {
                const category = item.category || 'Other';
                revenueByCategory[category] = (revenueByCategory[category] || 0) + item.amount;
            });
        });

        const totalRevenue = bills.reduce((sum, b) => sum + b.totalAmount, 0);

        res.json({
            report: {
                totalRevenue,
                revenueByDate,
                revenueByCategory,
                transactionCount: bills.length
            }
        });
    } catch (error) {
        console.error('Revenue report error:', error);
        res.status(500).json({ error: 'Failed to generate revenue report' });
    }
});

// GET /api/reports/appointments - Appointments report
router.get('/appointments', async (req, res) => {
    try {
        const { hospitalId } = req;
        const { startDate, endDate } = req.query;

        const where = { hospitalId };
        if (startDate && endDate) {
            where.appointmentDate = {
                gte: new Date(startDate),
                lte: new Date(endDate)
            };
        }

        const appointments = await prisma.appointment.groupBy({
            by: ['status'],
            where,
            _count: true
        });

        const total = await prisma.appointment.count({ where });

        res.json({
            report: {
                total,
                byStatus: appointments
            }
        });
    } catch (error) {
        console.error('Appointments report error:', error);
        res.status(500).json({ error: 'Failed to generate appointments report' });
    }
});

// GET /api/reports/lab - Laboratory report
router.get('/lab', async (req, res) => {
    try {
        const { hospitalId } = req;
        const { startDate, endDate } = req.query;

        const where = { hospitalId };
        if (startDate && endDate) {
            where.createdAt = {
                gte: new Date(startDate),
                lte: new Date(endDate)
            };
        }

        const testsByType = await prisma.labTest.groupBy({
            by: ['testType'],
            where,
            _count: true
        });

        const testsByStatus = await prisma.labTest.groupBy({
            by: ['status'],
            where,
            _count: true
        });

        const total = await prisma.labTest.count({ where });

        res.json({
            report: {
                total,
                byType: testsByType,
                byStatus: testsByStatus
            }
        });
    } catch (error) {
        console.error('Lab report error:', error);
        res.status(500).json({ error: 'Failed to generate lab report' });
    }
});

// GET /api/reports/inventory - Inventory report
router.get('/inventory', async (req, res) => {
    try {
        const { hospitalId } = req;

        const inventory = await prisma.inventory.findMany({
            where: { hospitalId },
            select: {
                id: true,
                name: true,
                category: true,
                quantity: true,
                reorderLevel: true,
                unitPrice: true
            }
        });

        const totalValue = inventory.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
        const lowStock = inventory.filter(item => item.quantity <= item.reorderLevel);

        res.json({
            report: {
                totalItems: inventory.length,
                totalValue,
                lowStockItems: lowStock.length,
                lowStock: lowStock.map(i => ({ name: i.name, quantity: i.quantity }))
            }
        });
    } catch (error) {
        console.error('Inventory report error:', error);
        res.status(500).json({ error: 'Failed to generate inventory report' });
    }
});

// GET /api/reports/bed-occupancy - Bed occupancy report
router.get('/bed-occupancy', async (req, res) => {
    try {
        const { hospitalId } = req;

        const wards = await prisma.ward.findMany({
            where: { hospitalId },
            include: {
                beds: {
                    select: {
                        status: true
                    }
                }
            }
        });

        const wardStats = wards.map(ward => {
            const totalBeds = ward.beds.length;
            const occupiedBeds = ward.beds.filter(b => b.status === 'Occupied').length;
            return {
                wardName: ward.name,
                totalBeds,
                occupiedBeds,
                availableBeds: totalBeds - occupiedBeds,
                occupancyRate: totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0
            };
        });

        const totals = wardStats.reduce((acc, ward) => ({
            totalBeds: acc.totalBeds + ward.totalBeds,
            occupiedBeds: acc.occupiedBeds + ward.occupiedBeds
        }), { totalBeds: 0, occupiedBeds: 0 });

        res.json({
            report: {
                overall: {
                    ...totals,
                    occupancyRate: totals.totalBeds > 0 ? Math.round((totals.occupiedBeds / totals.totalBeds) * 100) : 0
                },
                byWard: wardStats
            }
        });
    } catch (error) {
        console.error('Bed occupancy report error:', error);
        res.status(500).json({ error: 'Failed to generate bed occupancy report' });
    }
});

// GET /api/reports/dashboard-summary - Complete dashboard summary
router.get('/dashboard-summary', async (req, res) => {
    try {
        const { hospitalId } = req;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const [
            totalPatients,
            todayAppointments,
            pendingLab,
            activeBeds,
            totalBeds,
            todayRevenue
        ] = await Promise.all([
            prisma.patient.count({ where: { hospitalId } }),
            prisma.appointment.count({
                where: {
                    hospitalId,
                    appointmentDate: { gte: today }
                }
            }),
            prisma.labTest.count({
                where: {
                    hospitalId,
                    status: { in: ['Pending', 'In Progress'] }
                }
            }),
            prisma.bed.count({
                where: {
                    hospitalId,
                    status: 'Occupied'
                }
            }),
            prisma.bed.count({ where: { hospitalId } }),
            prisma.bill.aggregate({
                where: {
                    hospitalId,
                    paidDate: { gte: today },
                    status: 'Paid'
                },
                _sum: { totalAmount: true }
            })
        ]);

        res.json({
            summary: {
                totalPatients,
                todayAppointments,
                pendingLab,
                bedOccupancy: totalBeds > 0 ? Math.round((activeBeds / totalBeds) * 100) : 0,
                todayRevenue: todayRevenue._sum.totalAmount || 0
            }
        });
    } catch (error) {
        console.error('Dashboard summary error:', error);
        res.status(500).json({ error: 'Failed to generate dashboard summary' });
    }
});

module.exports = router;
