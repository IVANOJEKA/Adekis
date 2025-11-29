const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// All routes require authentication
router.use(authenticateToken);

// ==================== AMBULANCE FLEET ====================

// Get all ambulances
router.get('/fleet', async (req, res) => {
    try {
        const { hospitalId } = req.user;
        const fleet = await prisma.ambulance.findMany({
            where: { hospitalId },
            orderBy: { vehicleNumber: 'asc' }
        });
        res.json(fleet);
    } catch (error) {
        console.error('Error fetching ambulances:', error);
        res.status(500).json({ error: 'Failed to fetch ambulances' });
    }
});

// Add new ambulance
router.post('/fleet', async (req, res) => {
    try {
        const { hospitalId } = req.user;
        const { vehicleNumber, type, assignedDriver, assignedParamedic } = req.body;

        const ambulance = await prisma.ambulance.create({
            data: {
                hospitalId,
                vehicleNumber,
                type,
                assignedDriver,
                assignedParamedic,
                status: 'Available',
                fuel: 100
            }
        });
        res.json(ambulance);
    } catch (error) {
        console.error('Error adding ambulance:', error);
        res.status(500).json({ error: 'Failed to add ambulance' });
    }
});

// Update ambulance status
router.put('/fleet/:id', async (req, res) => {
    try {
        const { hospitalId } = req.user;
        const { id } = req.params;
        const { status, location, fuel } = req.body;

        const updated = await prisma.ambulance.update({
            where: { id, hospitalId },
            data: { status, location, fuel }
        });
        res.json(updated);
    } catch (error) {
        console.error('Error updating ambulance:', error);
        res.status(500).json({ error: 'Failed to update ambulance' });
    }
});

// ==================== AMBULANCE REQUESTS ====================

// Get all requests
router.get('/requests', async (req, res) => {
    try {
        const { hospitalId } = req.user;
        const requests = await prisma.ambulanceRequest.findMany({
            where: { hospitalId },
            orderBy: { createdAt: 'desc' }
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
        const { patientName, pickupLocation, destination, priority, contactNumber } = req.body;

        const count = await prisma.ambulanceRequest.count({ where: { hospitalId } });
        const requestId = `AMB-REQ-${String(count + 1).padStart(3, '0')}`;

        const request = await prisma.ambulanceRequest.create({
            data: {
                hospitalId,
                requestId,
                patientName,
                pickupLocation,
                destination,
                priority,
                contactNumber,
                status: 'Pending'
            }
        });
        res.json(request);
    } catch (error) {
        console.error('Error creating request:', error);
        res.status(500).json({ error: 'Failed to create request' });
    }
});

// Dispatch ambulance to request
router.post('/requests/:id/dispatch', async (req, res) => {
    try {
        const { hospitalId } = req.user;
        const { id } = req.params;
        const { ambulanceId } = req.body;

        // Update request
        const request = await prisma.ambulanceRequest.update({
            where: { id, hospitalId },
            data: {
                status: 'Dispatched',
                assignedAmbulanceId: ambulanceId
            }
        });

        // Update ambulance status
        await prisma.ambulance.update({
            where: { id: ambulanceId },
            data: { status: 'On Mission' }
        });

        // Create trip record
        const tripCount = await prisma.ambulanceTrip.count({ where: { hospitalId } });
        const tripId = `TRIP-${String(tripCount + 1).padStart(3, '0')}`;

        const ambulance = await prisma.ambulance.findUnique({
            where: { id: ambulanceId }
        });

        const trip = await prisma.ambulanceTrip.create({
            data: {
                hospitalId,
                tripId,
                requestId: request.requestId,
                ambulanceId,
                driver: ambulance?.assignedDriver,
                paramedic: ambulance?.assignedParamedic,
                startTime: new Date(),
                status: 'In Progress'
            }
        });

        res.json({ request, trip });
    } catch (error) {
        console.error('Error dispatching ambulance:', error);
        res.status(500).json({ error: 'Failed to dispatch ambulance' });
    }
});

// ==================== AMBULANCE TRIPS ====================

// Get all trips
router.get('/trips', async (req, res) => {
    try {
        const { hospitalId } = req.user;
        const trips = await prisma.ambulanceTrip.findMany({
            where: { hospitalId },
            orderBy: { startTime: 'desc' }
        });
        res.json(trips);
    } catch (error) {
        console.error('Error fetching trips:', error);
        res.status(500).json({ error: 'Failed to fetch trips' });
    }
});

// Complete trip
router.put('/trips/:id/complete', async (req, res) => {
    try {
        const { hospitalId } = req.user;
        const { id } = req.params;
        const { distance, notes } = req.body;

        const trip = await prisma.ambulanceTrip.update({
            where: { id, hospitalId },
            data: {
                endTime: new Date(),
                distance: parseFloat(distance),
                notes,
                status: 'Completed'
            }
        });

        // Update ambulance status back to available
        await prisma.ambulance.update({
            where: { id: trip.ambulanceId },
            data: { status: 'Available' }
        });

        res.json(trip);
    } catch (error) {
        console.error('Error completing trip:', error);
        res.status(500).json({ error: 'Failed to complete trip' });
    }
});

module.exports = router;
