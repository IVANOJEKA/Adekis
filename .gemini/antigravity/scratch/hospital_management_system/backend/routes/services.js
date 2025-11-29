const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authMiddleware, attachHospitalId } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

router.use(authMiddleware);
router.use(attachHospitalId);

// GET /api/services
router.get('/', async (req, res) => {
    try {
        const { category, isActive } = req.query;
        const hospitalId = req.hospitalId;

        const where = { hospitalId };
        if (category) where.category = category;
        if (isActive !== undefined) where.isActive = isActive === 'true';

        const services = await prisma.service.findMany({
            where,
            orderBy: { name: 'asc' }
        });

        res.json({ services });
    } catch (error) {
        console.error('Get services error:', error);
        res.status(500).json({ error: 'Failed to fetch services' });
    }
});

// POST /api/services
router.post('/', async (req, res) => {
    try {
        const {
            name,
            category,
            description,
            price,
            duration,
            department
        } = req.body;

        const hospitalId = req.hospitalId;

        if (!name || !category || price === undefined) {
            return res.status(400).json({
                error: 'Name, category, and price are required'
            });
        }

        // Generate service ID
        const count = await prisma.service.count({ where: { hospitalId } });
        const serviceId = `SRV-${String(count + 1).padStart(3, '0')}`;

        const service = await prisma.service.create({
            data: {
                hospitalId,
                serviceId,
                name,
                category,
                description,
                price: parseFloat(price),
                duration: duration ? parseInt(duration) : null,
                department,
                isActive: true
            }
        });

        res.status(201).json({
            message: 'Service created successfully',
            service
        });
    } catch (error) {
        console.error('Create service error:', error);
        res.status(500).json({ error: 'Failed to create service' });
    }
});

// PUT /api/services/:id
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const hospitalId = req.hospitalId;

        const existing = await prisma.service.findFirst({
            where: { id, hospitalId }
        });

        if (!existing) {
            return res.status(404).json({ error: 'Service not found' });
        }

        const service = await prisma.service.update({
            where: { id },
            data: {
                ...req.body,
                price: req.body.price ? parseFloat(req.body.price) : undefined,
                duration: req.body.duration ? parseInt(req.body.duration) : undefined
            }
        });

        res.json({
            message: 'Service updated successfully',
            service
        });
    } catch (error) {
        console.error('Update service error:', error);
        res.status(500).json({ error: 'Failed to update service' });
    }
});

module.exports = router;
