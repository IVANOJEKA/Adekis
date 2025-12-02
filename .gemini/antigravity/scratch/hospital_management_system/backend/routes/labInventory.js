const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { authMiddleware, attachHospitalId } = require('../middleware/auth');

// Apply authentication middleware
router.use(authMiddleware);
router.use(attachHospitalId);

// ==================== INVENTORY MANAGEMENT ====================

// Get all inventory items
router.get('/', async (req, res) => {
    try {
        const { category, lowStock } = req.query;
        const where = {
            hospitalId: req.user.hospitalId
        };

        if (category) {
            where.category = category;
        }

        const items = await prisma.labInventory.findMany({
            where,
            include: {
                transactions: {
                    take: 5,
                    orderBy: { createdAt: 'desc' }
                }
            },
            orderBy: { itemName: 'asc' }
        });

        // Filter for low stock if requested
        let filteredItems = items;
        if (lowStock === 'true') {
            filteredItems = items.filter(item => item.quantity <= item.minimumLevel);
        }

        res.json(filteredItems);
    } catch (error) {
        console.error('Error fetching lab inventory:', error);
        res.status(500).json({ error: 'Failed to fetch lab inventory' });
    }
});

// Add new inventory item
router.post('/', async (req, res) => {
    try {
        const {
            itemName,
            itemCode,
            category,
            unit,
            quantity,
            minimumLevel,
            supplier,
            expiryDate,
            costPerUnit
        } = req.body;

        const item = await prisma.labInventory.create({
            data: {
                hospitalId: req.user.hospitalId,
                itemName,
                itemCode,
                category,
                unit,
                quantity: parseInt(quantity),
                minimumLevel: parseInt(minimumLevel),
                supplier,
                expiryDate: expiryDate ? new Date(expiryDate) : null,
                costPerUnit: parseFloat(costPerUnit)
            }
        });

        // Log initial stock transaction
        await prisma.labInventoryTransaction.create({
            data: {
                hospitalId: req.user.hospitalId,
                inventoryId: item.id,
                type: 'In',
                quantity: parseInt(quantity),
                reason: 'Initial stock',
                performedBy: req.user.name
            }
        });

        res.status(201).json(item);
    } catch (error) {
        console.error('Error adding inventory item:', error);
        res.status(500).json({ error: 'Failed to add inventory item' });
    }
});

// Update inventory item
router.put('/:id', async (req, res) => {
    try {
        const {
            itemName,
            category,
            unit,
            minimumLevel,
            supplier,
            expiryDate,
            costPerUnit
        } = req.body;

        const item = await prisma.labInventory.update({
            where: {
                id: req.params.id,
                hospitalId: req.user.hospitalId
            },
            data: {
                ...(itemName && { itemName }),
                ...(category && { category }),
                ...(unit && { unit }),
                ...(minimumLevel && { minimumLevel: parseInt(minimumLevel) }),
                ...(supplier && { supplier }),
                ...(expiryDate && { expiryDate: new Date(expiryDate) }),
                ...(costPerUnit && { costPerUnit: parseFloat(costPerUnit) })
            }
        });

        res.json(item);
    } catch (error) {
        console.error('Error updating inventory item:', error);
        res.status(500).json({ error: 'Failed to update inventory item' });
    }
});

// Record inventory transaction (In/Out/Adjusted)
router.post('/transaction', async (req, res) => {
    try {
        const { inventoryId, type, quantity, reason } = req.body;

        // Get current inventory
        const inventory = await prisma.labInventory.findUnique({
            where: {
                id: inventoryId,
                hospitalId: req.user.hospitalId
            }
        });

        if (!inventory) {
            return res.status(404).json({ error: 'Inventory item not found' });
        }

        // Calculate new quantity
        let newQuantity = inventory.quantity;
        const qty = parseInt(quantity);

        if (type === 'In') {
            newQuantity += qty;
        } else if (type === 'Out') {
            newQuantity -= qty;
            if (newQuantity < 0) {
                return res.status(400).json({ error: 'Insufficient stock' });
            }
        } else if (type === 'Adjusted') {
            newQuantity = qty;
        }

        // Update inventory quantity
        await prisma.labInventory.update({
            where: { id: inventoryId },
            data: { quantity: newQuantity }
        });

        // Create transaction record
        const transaction = await prisma.labInventoryTransaction.create({
            data: {
                hospitalId: req.user.hospitalId,
                inventoryId,
                type,
                quantity: qty,
                reason,
                performedBy: req.user.name
            }
        });

        res.status(201).json(transaction);
    } catch (error) {
        console.error('Error recording transaction:', error);
        res.status(500).json({ error: 'Failed to record transaction' });
    }
});

// Get transactions for an item
router.get('/:id/transactions', async (req, res) => {
    try {
        const transactions = await prisma.labInventoryTransaction.findMany({
            where: {
                hospitalId: req.user.hospitalId,
                inventoryId: req.params.id
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json(transactions);
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({ error: 'Failed to fetch transactions' });
    }
});

// Get low stock items
router.get('/alerts/low-stock', async (req, res) => {
    try {
        const items = await prisma.labInventory.findMany({
            where: {
                hospitalId: req.user.hospitalId
            }
        });

        const lowStockItems = items.filter(item => item.quantity <= item.minimumLevel);

        res.json(lowStockItems);
    } catch (error) {
        console.error('Error fetching low stock items:', error);
        res.status(500).json({ error: 'Failed to fetch low stock items' });
    }
});

// Delete inventory item
router.delete('/:id', async (req, res) => {
    try {
        // Delete all transactions first
        await prisma.labInventoryTransaction.deleteMany({
            where: {
                inventoryId: req.params.id,
                hospitalId: req.user.hospitalId
            }
        });

        // Delete the inventory item
        await prisma.labInventory.delete({
            where: {
                id: req.params.id,
                hospitalId: req.user.hospitalId
            }
        });

        res.json({ message: 'Inventory item deleted successfully' });
    } catch (error) {
        console.error('Error deleting inventory item:', error);
        res.status(500).json({ error: 'Failed to delete inventory item' });
    }
});

module.exports = router;
