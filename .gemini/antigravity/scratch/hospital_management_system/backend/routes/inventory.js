const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { authMiddleware, attachHospitalId } = require('../middleware/auth');

const prisma = new PrismaClient();


// Apply authentication middleware
router.use(authMiddleware);
router.use(attachHospitalId);

// Get all inventory items
router.get('/', async (req, res) => {
    try {
        const items = await prisma.inventoryItem.findMany({
            where: { hospitalId: req.user.hospitalId },
            orderBy: { name: 'asc' }
        });
        res.json(items);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add new inventory item
router.post('/', async (req, res) => {
    try {
        const { name, category, stock, unit, minStock, price, supplier, expiryDate, batchNumber, location } = req.body;

        // Generate ID if not provided (though frontend might not send it)
        // We'll let backend generate it or use provided one if we want consistency with other modules
        // But Prisma model has String @id. Let's auto-generate if not present.

        const newItem = await prisma.inventoryItem.create({
            data: {
                id: `INV-${Date.now()}`, // Simple ID generation
                name,
                category,
                stock: parseInt(stock),
                unit,
                minStock: parseInt(minStock),
                price: parseFloat(price),
                supplier,
                expiryDate: expiryDate ? new Date(expiryDate) : null,
                batchNumber,
                location,
                hospitalId: req.user.hospitalId
            }
        });
        res.status(201).json(newItem);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update inventory item
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, category, stock, unit, minStock, price, supplier, expiryDate, batchNumber, location } = req.body;

        const updatedItem = await prisma.inventoryItem.updateMany({
            where: {
                id: id,
                hospitalId: req.user.hospitalId
            },
            data: {
                name,
                category,
                stock: parseInt(stock),
                unit,
                minStock: parseInt(minStock),
                price: parseFloat(price),
                supplier,
                expiryDate: expiryDate ? new Date(expiryDate) : null,
                batchNumber,
                location
            }
        });

        if (updatedItem.count === 0) {
            return res.status(404).json({ error: 'Item not found or access denied' });
        }

        // Fetch the updated item to return it
        const item = await prisma.inventoryItem.findUnique({
            where: { id: id }
        });

        res.json(item);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete inventory item
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await prisma.inventoryItem.deleteMany({
            where: {
                id: id,
                hospitalId: req.user.hospitalId
            }
        });

        if (deleted.count === 0) {
            return res.status(404).json({ error: 'Item not found or access denied' });
        }

        res.json({ message: 'Item deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
