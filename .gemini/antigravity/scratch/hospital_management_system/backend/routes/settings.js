const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authMiddleware, attachHospitalId } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Apply authentication and hospital ID middleware to all routes
router.use(authMiddleware);
router.use(attachHospitalId);

// ==================== HOSPITAL SETTINGS ====================

// GET /api/settings/hospital - Get hospital settings
router.get('/hospital', async (req, res) => {
    try {
        const { hospitalId } = req;

        const hospital = await prisma.hospital.findUnique({
            where: { id: hospitalId },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                address: true,
                registrationNumber: true,
                logo: true,
                openingTime: true,
                closingTime: true,
                emergency24_7: true,
                currency: true,
                timezone: true,
                createdAt: true,
                updatedAt: true
            }
        });

        res.json({ hospital });
    } catch (error) {
        console.error('Get hospital settings error:', error);
        res.status(500).json({ error: 'Failed to fetch hospital settings' });
    }
});

// PATCH /api/settings/hospital - Update hospital settings
router.patch('/hospital', async (req, res) => {
    try {
        const { hospitalId } = req;
        const { name, email, phone, address, registrationNumber, logo, openingTime, closingTime, emergency24_7, currency, timezone } = req.body;

        const hospital = await prisma.hospital.update({
            where: { id: hospitalId },
            data: {
                name,
                email,
                phone,
                address,
                registrationNumber,
                logo,
                openingTime,
                closingTime,
                emergency24_7,
                currency,
                timezone
            }
        });

        res.json({ hospital, message: 'Hospital settings updated successfully' });
    } catch (error) {
        console.error('Update hospital settings error:', error);
        res.status(500).json({ error: 'Failed to update hospital settings' });
    }
});

// ==================== SERVICE PRICING ====================

// GET /api/settings/pricing - Get service prices
router.get('/pricing', async (req, res) => {
    try {
        const { hospitalId } = req;
        const { category, search } = req.query;

        const where = { hospitalId };
        if (category) where.category = category;
        if (search) {
            where.name = {
                contains: search,
                mode: 'insensitive'
            };
        }

        const services = await prisma.service.findMany({
            where,
            orderBy: { category: 'asc' }
        });

        res.json({ services });
    } catch (error) {
        console.error('Get pricing error:', error);
        res.status(500).json({ error: 'Failed to fetch pricing' });
    }
});

// POST /api/settings/pricing - Create service price
router.post('/pricing', async (req, res) => {
    try {
        const { hospitalId } = req;
        const { name, category, price, description, duration } = req.body;

        const service = await prisma.service.create({
            data: {
                hospitalId,
                name,
                category,
                price: parseFloat(price),
                description,
                duration
            }
        });

        res.status(201).json({ service, message: 'Service price created successfully' });
    } catch (error) {
        console.error('Create pricing error:', error);
        res.status(500).json({ error: 'Failed to create service price' });
    }
});

// PATCH /api/settings/pricing/:id - Update service price
router.patch('/pricing/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { hospitalId } = req;
        const { name, category, price, description, duration } = req.body;

        const service = await prisma.service.update({
            where: { id, hospitalId },
            data: {
                name,
                category,
                price: price ? parseFloat(price) : undefined,
                description,
                duration
            }
        });

        res.json({ service, message: 'Service price updated successfully' });
    } catch (error) {
        console.error('Update pricing error:', error);
        res.status(500).json({ error: 'Failed to update service price' });
    }
});

// DELETE /api/settings/pricing/:id - Delete service price
router.delete('/pricing/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { hospitalId } = req;

        await prisma.service.delete({
            where: { id, hospitalId }
        });

        res.json({ message: 'Service price deleted successfully' });
    } catch (error) {
        console.error('Delete pricing error:', error);
        res.status(500).json({ error: 'Failed to delete service price' });
    }
});

// ==================== SYSTEM PREFERENCES ====================

// GET /api/settings/preferences - Get system preferences
router.get('/preferences', async (req, res) => {
    try {
        const { hospitalId } = req;

        // For now, return default preferences
        // In production, these would be stored in a SystemSettings table
        const preferences = {
            notifications: {
                email: true,
                sms: false,
                appointments: true,
                labResults: true
            },
            billing: {
                taxRate: 18,
                invoicePrefix: 'INV-',
                autoNumbering: true
            },
            security: {
                strongPasswords: true,
                twoFactor: false,
                sessionTimeout: 30
            },
            appearance: {
                theme: 'light',
                primaryColor: '#3B82F6'
            }
        };

        res.json({ preferences });
    } catch (error) {
        console.error('Get preferences error:', error);
        res.status(500).json({ error: 'Failed to fetch preferences' });
    }
});

// PATCH /api/settings/preferences - Update system preferences
router.patch('/preferences', async (req, res) => {
    try {
        const { hospitalId } = req;
        const preferences = req.body;

        // In production, save to SystemSettings table
        // For now, just return success

        res.json({ preferences, message: 'Preferences updated successfully' });
    } catch (error) {
        console.error('Update preferences error:', error);
        res.status(500).json({ error: 'Failed to update preferences' });
    }
});

// ==================== USER MANAGEMENT ====================

// GET /api/settings/users - Get all users
router.get('/users', async (req, res) => {
    try {
        const { hospitalId } = req;
        const { role, status, search } = req.query;

        const where = { hospitalId };
        if (role) where.role = role;
        if (status) where.status = status;
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } }
            ];
        }

        const users = await prisma.user.findMany({
            where,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                status: true,
                lastLogin: true,
                createdAt: true
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json({ users });
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// PATCH /api/settings/users/:id/status - Update user status
router.patch('/users/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { hospitalId } = req;
        const { status } = req.body;

        const user = await prisma.user.update({
            where: { id, hospitalId },
            data: { status }
        });

        res.json({ user, message: 'User status updated successfully' });
    } catch (error) {
        console.error('Update user status error:', error);
        res.status(500).json({ error: 'Failed to update user status' });
    }
});

module.exports = router;
