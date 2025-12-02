const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authMiddleware, attachHospitalId } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// All routes require authentication
router.use(authMiddleware); router.use(attachHospitalId);

// ==================== BLOOD INVENTORY ====================

// Get all blood inventory for hospital
router.get('/inventory', async (req, res) => {
    try {
        const { hospitalId } = req.user;
        const inventory = await prisma.bloodInventory.findMany({
            where: { hospitalId },
            orderBy: { bloodGroup: 'asc' }
        });
        res.json(inventory);
    } catch (error) {
        console.error('Error fetching blood inventory:', error);
        res.status(500).json({ error: 'Failed to fetch blood inventory' });
    }
});

// Update blood inventory
router.put('/inventory/:id', async (req, res) => {
    try {
        const { hospitalId } = req.user;
        const { id } = req.params;
        const { units, status } = req.body;

        const updated = await prisma.bloodInventory.update({
            where: { id, hospitalId },
            data: { units, status }
        });
        res.json(updated);
    } catch (error) {
        console.error('Error updating blood inventory:', error);
        res.status(500).json({ error: 'Failed to update blood inventory' });
    }
});

// Initialize blood inventory (call once per hospital to create groups)
router.post('/inventory/initialize', async (req, res) => {
    try {
        const { hospitalId } = req.user;
        const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

        const inventory = await Promise.all(
            bloodGroups.map(group =>
                prisma.bloodInventory.upsert({
                    where: { hospitalId_bloodGroup: { hospitalId, bloodGroup: group } },
                    update: {},
                    create: { hospitalId, bloodGroup: group, units: 0, status: 'Critical' }
                })
            )
        );
        res.json(inventory);
    } catch (error) {
        console.error('Error initializing blood inventory:', error);
        res.status(500).json({ error: 'Failed to initialize blood inventory' });
    }
});

// ==================== BLOOD DONORS ====================

// Get all donors
router.get('/donors', async (req, res) => {
    try {
        const { hospitalId } = req.user;
        const donors = await prisma.bloodDonor.findMany({
            where: { hospitalId },
            orderBy: { createdAt: 'desc' }
        });
        res.json(donors);
    } catch (error) {
        console.error('Error fetching donors:', error);
        res.status(500).json({ error: 'Failed to fetch donors' });
    }
});

// Add new donor
router.post('/donors', async (req, res) => {
    try {
        const { hospitalId } = req.user;
        const { name, bloodGroup, age, gender, contact } = req.body;

        // Generate donor ID
        const count = await prisma.bloodDonor.count({ where: { hospitalId } });
        const donorId = `D-${String(1000 + count + 1)}`;

        const donor = await prisma.bloodDonor.create({
            data: {
                hospitalId,
                donorId,
                name,
                bloodGroup,
                age: parseInt(age),
                gender,
                contact,
                status: 'Eligible'
            }
        });
        res.json(donor);
    } catch (error) {
        console.error('Error adding donor:', error);
        res.status(500).json({ error: 'Failed to add donor' });
    }
});

// Record donation
router.post('/donors/:id/donate', async (req, res) => {
    try {
        const { hospitalId } = req.user;
        const { id } = req.params;

        // Update donor's last donation date
        const donor = await prisma.bloodDonor.update({
            where: { id, hospitalId },
            data: { lastDonation: new Date() }
        });

        // Update inventory
        await prisma.bloodInventory.update({
            where: { hospitalId_bloodGroup: { hospitalId, bloodGroup: donor.bloodGroup } },
            data: { units: { increment: 1 } }
        });

        res.json(donor);
    } catch (error) {
        console.error('Error recording donation:', error);
        res.status(500).json({ error: 'Failed to record donation' });
    }
});

// ==================== BLOOD REQUESTS ====================

// Get all requests
router.get('/requests', async (req, res) => {
    try {
        const { hospitalId } = req.user;
        const requests = await prisma.bloodRequest.findMany({
            where: { hospitalId },
            orderBy: { requestDate: 'desc' }
        });
        res.json(requests);
    } catch (error) {
        console.error('Error fetching requests:', error);
        res.status(500).json({ error: 'Failed to fetch requests' });
    }
});

// Create new request
router.post('/requests', async (req, res) => {
    try {
        const { hospitalId } = req.user;
        const { patientId, patientName, bloodGroup, units, urgency, doctorName } = req.body;

        const count = await prisma.bloodRequest.count({ where: { hospitalId } });
        const requestId = `BR-${String(count + 1).padStart(3, '0')}`;

        const request = await prisma.bloodRequest.create({
            data: {
                hospitalId,
                requestId,
                patientId,
                patientName,
                bloodGroup,
                units: parseInt(units),
                urgency,
                doctorName,
                status: 'Pending'
            }
        });
        res.json(request);
    } catch (error) {
        console.error('Error creating request:', error);
        res.status(500).json({ error: 'Failed to create request' });
    }
});

// Approve request (deduct from inventory)
router.post('/requests/:id/approve', async (req, res) => {
    try {
        const { hospitalId } = req.user;
        const { id } = req.params;

        const request = await prisma.bloodRequest.findUnique({
            where: { id, hospitalId }
        });

        if (!request) {
            return res.status(404).json({ error: 'Request not found' });
        }

        // Check inventory
        const inventory = await prisma.bloodInventory.findUnique({
            where: { hospitalId_bloodGroup: { hospitalId, bloodGroup: request.bloodGroup } }
        });

        if (inventory.units < request.units) {
            return res.status(400).json({ error: 'Insufficient stock' });
        }

        // Deduct from inventory
        await prisma.bloodInventory.update({
            where: { hospitalId_bloodGroup: { hospitalId, bloodGroup: request.bloodGroup } },
            data: { units: { decrement: request.units } }
        });

        // Update request status
        const updated = await prisma.bloodRequest.update({
            where: { id },
            data: { status: 'Approved' }
        });

        res.json(updated);
    } catch (error) {
        console.error('Error approving request:', error);
        res.status(500).json({ error: 'Failed to approve request' });
    }
});

// Reject request
router.post('/requests/:id/reject', async (req, res) => {
    try {
        const { hospitalId } = req.user;
        const { id } = req.params;

        const updated = await prisma.bloodRequest.update({
            where: { id, hospitalId },
            data: { status: 'Rejected' }
        });

        res.json(updated);
    } catch (error) {
        console.error('Error rejecting request:', error);
        res.status(500).json({ error: 'Failed to reject request' });
    }
});

module.exports = router;
