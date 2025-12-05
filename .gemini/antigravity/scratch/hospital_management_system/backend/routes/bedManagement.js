const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authMiddleware, attachHospitalId } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Apply authentication and hospital ID middleware to all routes
router.use(authMiddleware);
router.use(attachHospitalId);

// ==================== WARDS ====================

// GET /api/bed-management/wards - List all wards
router.get('/wards', async (req, res) => {
    try {
        const { hospitalId } = req;
        const { type, status } = req.query;

        const where = { hospitalId };
        if (type) where.type = type;
        if (status) where.status = status;

        const wards = await prisma.ward.findMany({
            where,
            include: {
                beds: {
                    select: {
                        id: true,
                        status: true
                    }
                }
            },
            orderBy: { name: 'asc' }
        });

        // Calculate occupancy stats
        const wardsWithStats = wards.map(ward => {
            const totalBeds = ward.beds.length;
            const occupiedBeds = ward.beds.filter(b => b.status === 'Occupied').length;
            const availableBeds = ward.beds.filter(b => b.status === 'Available').length;

            return {
                ...ward,
                stats: {
                    totalBeds,
                    occupiedBeds,
                    availableBeds,
                    occupancyRate: totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0
                }
            };
        });

        res.json({ wards: wardsWithStats });
    } catch (error) {
        console.error('Get wards error:', error);
        res.status(500).json({ error: 'Failed to fetch wards' });
    }
});

// POST /api/bed-management/wards - Create new ward
router.post('/wards', async (req, res) => {
    try {
        const { hospitalId } = req;
        const { name, type, gender, capacity, description } = req.body;

        if (!name || !type || !capacity) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const ward = await prisma.ward.create({
            data: {
                hospitalId,
                name,
                type,
                gender,
                capacity: parseInt(capacity),
                description,
                status: 'Active'
            }
        });

        res.status(201).json({ ward, message: 'Ward created successfully' });
    } catch (error) {
        console.error('Create ward error:', error);
        res.status(500).json({ error: 'Failed to create ward' });
    }
});

// ==================== BEDS ====================

// GET /api/bed-management/beds - List beds
router.get('/beds', async (req, res) => {
    try {
        const { hospitalId } = req;
        const { wardId, status, type } = req.query;

        const where = { hospitalId };
        if (wardId) where.wardId = wardId;
        if (status) where.status = status;
        if (type) where.type = type;

        const beds = await prisma.bed.findMany({
            where,
            include: {
                ward: {
                    select: {
                        name: true,
                        type: true,
                        gender: true
                    }
                },
                admissions: {
                    where: { status: 'Admitted' },
                    include: {
                        patient: {
                            select: {
                                name: true,
                                patientId: true,
                                gender: true,
                                dateOfBirth: true
                            }
                        }
                    },
                    take: 1
                }
            },
            orderBy: [
                { ward: { name: 'asc' } },
                { number: 'asc' }
            ]
        });

        // Flatten structure for easier frontend consumption
        const formattedBeds = beds.map(bed => ({
            ...bed,
            wardName: bed.ward.name,
            wardType: bed.ward.type,
            currentPatient: bed.admissions[0]?.patient || null,
            admissionId: bed.admissions[0]?.id || null
        }));

        res.json({ beds: formattedBeds });
    } catch (error) {
        console.error('Get beds error:', error);
        res.status(500).json({ error: 'Failed to fetch beds' });
    }
});

// POST /api/bed-management/beds - Add new bed
router.post('/beds', async (req, res) => {
    try {
        const { hospitalId } = req;
        const { wardId, number, type, price, features } = req.body;

        if (!wardId || !number || !type) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Check if bed number already exists in ward
        const existingBed = await prisma.bed.findFirst({
            where: { hospitalId, wardId, number }
        });

        if (existingBed) {
            return res.status(400).json({ error: 'Bed number already exists in this ward' });
        }

        const bed = await prisma.bed.create({
            data: {
                hospitalId,
                wardId,
                number,
                type,
                price: parseFloat(price || 0),
                features: features || [],
                status: 'Available'
            },
            include: {
                ward: true
            }
        });

        res.status(201).json({ bed, message: 'Bed added successfully' });
    } catch (error) {
        console.error('Create bed error:', error);
        res.status(500).json({ error: 'Failed to add bed' });
    }
});

// PATCH /api/bed-management/beds/:id - Update bed status
router.patch('/beds/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { status, notes } = req.body;
        const { hospitalId } = req;

        const bed = await prisma.bed.findFirst({
            where: { id, hospitalId }
        });

        if (!bed) {
            return res.status(404).json({ error: 'Bed not found' });
        }

        // Prevent changing status if occupied (must discharge first)
        if (bed.status === 'Occupied' && status !== 'Occupied') {
            return res.status(400).json({ error: 'Cannot change status of occupied bed. Discharge patient first.' });
        }

        const updatedBed = await prisma.bed.update({
            where: { id },
            data: { status }
        });

        res.json({ bed: updatedBed, message: 'Bed status updated' });
    } catch (error) {
        console.error('Update bed status error:', error);
        res.status(500).json({ error: 'Failed to update bed status' });
    }
});

// ==================== ADMISSIONS ====================

// POST /api/bed-management/admit - Admit patient
router.post('/admit', async (req, res) => {
    try {
        const { hospitalId, userId } = req;
        const { patientId, bedId, diagnosis, reason, notes } = req.body;

        if (!patientId || !bedId) {
            return res.status(400).json({ error: 'Patient and Bed are required' });
        }

        // Check if bed is available
        const bed = await prisma.bed.findFirst({
            where: { id: bedId, hospitalId }
        });

        if (!bed) {
            return res.status(404).json({ error: 'Bed not found' });
        }

        if (bed.status !== 'Available') {
            return res.status(400).json({ error: `Bed is currently ${bed.status}` });
        }

        // Check if patient is already admitted
        const activeAdmission = await prisma.admission.findFirst({
            where: {
                patientId,
                hospitalId,
                status: 'Admitted'
            }
        });

        if (activeAdmission) {
            return res.status(400).json({ error: 'Patient is already admitted' });
        }

        // Create admission and update bed status transaction
        const [admission, updatedBed] = await prisma.$transaction([
            prisma.admission.create({
                data: {
                    hospitalId,
                    patientId,
                    bedId,
                    diagnosis,
                    reason,
                    notes,
                    admittedBy: userId,
                    status: 'Admitted',
                    admissionDate: new Date()
                },
                include: {
                    patient: true,
                    bed: {
                        include: { ward: true }
                    }
                }
            }),
            prisma.bed.update({
                where: { id: bedId },
                data: { status: 'Occupied' }
            })
        ]);

        res.status(201).json({
            admission,
            bed: updatedBed,
            message: 'Patient admitted successfully'
        });
    } catch (error) {
        console.error('Admit patient error:', error);
        res.status(500).json({ error: 'Failed to admit patient' });
    }
});

// POST /api/bed-management/discharge - Discharge patient
router.post('/discharge', async (req, res) => {
    try {
        const { hospitalId, userId } = req;
        const { admissionId, notes, dischargeType = 'Regular' } = req.body;

        const admission = await prisma.admission.findFirst({
            where: { id: admissionId, hospitalId },
            include: { bed: true }
        });

        if (!admission) {
            return res.status(404).json({ error: 'Admission record not found' });
        }

        if (admission.status !== 'Admitted') {
            return res.status(400).json({ error: 'Patient is already discharged' });
        }

        // Update admission and bed status
        const [updatedAdmission, updatedBed] = await prisma.$transaction([
            prisma.admission.update({
                where: { id: admissionId },
                data: {
                    status: 'Discharged',
                    dischargeDate: new Date(),
                    dischargedBy: userId,
                    notes: notes ? `${admission.notes || ''}\nDischarge Notes: ${notes}` : admission.notes
                }
            }),
            prisma.bed.update({
                where: { id: admission.bedId },
                data: { status: 'Cleaning' } // Set to cleaning after discharge
            })
        ]);

        res.json({
            admission: updatedAdmission,
            bed: updatedBed,
            message: 'Patient discharged successfully'
        });
    } catch (error) {
        console.error('Discharge patient error:', error);
        res.status(500).json({ error: 'Failed to discharge patient' });
    }
});

// GET /api/bed-management/admissions - List active admissions
router.get('/admissions', async (req, res) => {
    try {
        const { hospitalId } = req;
        const { status = 'Admitted', search } = req.query;

        const where = {
            hospitalId,
            status
        };

        if (search) {
            where.patient = {
                name: { contains: search, mode: 'insensitive' }
            };
        }

        const admissions = await prisma.admission.findMany({
            where,
            include: {
                patient: {
                    select: {
                        id: true,
                        name: true,
                        patientId: true,
                        gender: true,
                        dateOfBirth: true
                    }
                },
                bed: {
                    include: {
                        ward: true
                    }
                }
            },
            orderBy: { admissionDate: 'desc' }
        });

        res.json({ admissions });
    } catch (error) {
        console.error('Get admissions error:', error);
        res.status(500).json({ error: 'Failed to fetch admissions' });
    }
});

module.exports = router;
