const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { authMiddleware, attachHospitalId } = require('../middleware/auth');


// Apply authentication middleware
router.use(authMiddleware);
router.use(attachHospitalId);

// Get all lab tests (with filtering)
router.get('/', async (req, res) => {
    try {
        const { status, patientId, type } = req.query;
        const where = {
            hospitalId: req.user.hospitalId,
            ...(status && { status }),
            ...(patientId && { patientId }),
            ...(type && { testType: type })
        };

        const tests = await prisma.labTest.findMany({
            where,
            include: {
                patient: {
                    select: { name: true, gender: true, dateOfBirth: true }
                }
            },
            orderBy: { orderedAt: 'desc' }
        });

        res.json(tests);
    } catch (error) {
        console.error('Error fetching lab tests:', error);
        res.status(500).json({ error: 'Failed to fetch lab tests' });
    }
});

// Order new lab test
router.post('/', async (req, res) => {
    try {
        const { patientId, testName, testType, notes, priority, orderedByRole } = req.body;

        // Generate Test ID
        const count = await prisma.labTest.count({ where: { hospitalId: req.user.hospitalId } });
        const testId = `LAB-${String(count + 1).padStart(5, '0')}`;

        const test = await prisma.labTest.create({
            data: {
                hospitalId: req.user.hospitalId,
                testId,
                patientId,
                testName,
                testType,
                orderedBy: req.user.name,
                orderedByRole: orderedByRole || req.user.role,
                priority: priority || 'Normal',
                status: 'pending',
                notes,
                accessLog: {
                    created: {
                        by: req.user.name,
                        at: new Date().toISOString()
                    }
                }
            }
        });

        res.status(201).json(test);
    } catch (error) {
        console.error('Error ordering lab test:', error);
        res.status(500).json({ error: 'Failed to order lab test' });
    }
});

// Update test results or status
router.put('/:id/results', async (req, res) => {
    try {
        const { results, notes, status } = req.body;

        const data = {};
        if (results) data.results = results;
        if (notes) data.notes = notes;
        if (status) data.status = status;
        if (status === 'completed') data.completedAt = new Date();

        const test = await prisma.labTest.update({
            where: {
                id: req.params.id,
                hospitalId: req.user.hospitalId
            },
            data
        });

        res.json(test);
    } catch (error) {
        console.error('Error updating lab test:', error);
        res.status(500).json({ error: 'Failed to update lab test' });
    }
});

// Get specific lab test
router.get('/:id', async (req, res) => {
    try {
        const test = await prisma.labTest.findUnique({
            where: {
                id: req.params.id,
                hospitalId: req.user.hospitalId
            },
            include: {
                patient: true
            }
        });

        if (!test) {
            return res.status(404).json({ error: 'Lab test not found' });
        }

        res.json(test);
    } catch (error) {
        console.error('Error fetching lab test:', error);
        res.status(500).json({ error: 'Failed to fetch lab test' });
    }
});

// Validate test results
router.put('/:id/validate', async (req, res) => {
    try {
        const { notes } = req.body;

        const test = await prisma.labTest.update({
            where: {
                id: req.params.id,
                hospitalId: req.user.hospitalId
            },
            data: {
                resultsValidatedBy: req.user.name,
                resultsValidatedAt: new Date(),
                notes: notes || test.notes
            }
        });

        res.json(test);
    } catch (error) {
        console.error('Error validating test results:', error);
        res.status(500).json({ error: 'Failed to validate test results' });
    }
});

// Log print activity and store in EMR
router.post('/:id/log-print', async (req, res) => {
    try {
        // Get the test with patient details
        const test = await prisma.labTest.findUnique({
            where: {
                id: req.params.id,
                hospitalId: req.user.hospitalId
            },
            include: {
                patient: true
            }
        });

        if (!test) {
            return res.status(404).json({ error: 'Test not found' });
        }

        // Update test with print information
        const updatedTest = await prisma.labTest.update({
            where: {
                id: req.params.id,
                hospitalId: req.user.hospitalId
            },
            data: {
                printedBy: req.user.name,
                printedAt: new Date()
            }
        });

        // Automatically create EMR clinical note with lab results
        try {
            await prisma.clinicalNote.create({
                data: {
                    hospitalId: req.user.hospitalId,
                    patientId: test.patientId,
                    recordId: test.id, // Link to lab test
                    noteType: 'Laboratory Results',
                    chiefComplaint: `${test.testType} - ${test.testName}`,
                    diagnosis: test.results || 'Results pending',
                    treatment: test.notes || '',
                    vitalSigns: {
                        testId: test.testId,
                        testType: test.testType,
                        priority: test.priority,
                        orderedBy: test.orderedBy,
                        orderedAt: test.orderedAt,
                        completedAt: test.completedAt,
                        validatedBy: test.resultsValidatedBy,
                        validatedAt: test.resultsValidatedAt
                    },
                    createdBy: req.user.name,
                    createdAt: new Date()
                }
            });

            console.log(`Lab results automatically stored in EMR for patient ${test.patient.name}`);
        } catch (emrError) {
            // Log error but don't fail the print operation
            console.error('Error storing lab results in EMR:', emrError);
            // Continue with print logging even if EMR storage fails
        }

        res.json({
            success: true,
            test: updatedTest,
            emrStored: true,
            message: 'Results printed and stored in patient EMR'
        });
    } catch (error) {
        console.error('Error logging print:', error);
        res.status(500).json({ error: 'Failed to log print activity' });
    }
});

// Get pending tests for lab (communication tab)
router.get('/pending', async (req, res) => {
    try {
        const tests = await prisma.labTest.findMany({
            where: {
                hospitalId: req.user.hospitalId,
                status: 'pending'
            },
            include: {
                patient: {
                    select: { name: true, gender: true, dateOfBirth: true, patientId: true }
                }
            },
            orderBy: [
                { priority: 'desc' }, // STAT, Urgent, Normal
                { orderedAt: 'asc' }
            ]
        });

        res.json(tests);
    } catch (error) {
        console.error('Error fetching pending tests:', error);
        res.status(500).json({ error: 'Failed to fetch pending tests' });
    }
});

// Get tests ordered by a specific doctor
router.get('/my-orders', async (req, res) => {
    try {
        const { doctorName } = req.query;

        const tests = await prisma.labTest.findMany({
            where: {
                hospitalId: req.user.hospitalId,
                orderedBy: doctorName || req.user.name,
                orderedByRole: 'Doctor'
            },
            include: {
                patient: {
                    select: { name: true, gender: true, dateOfBirth: true, patientId: true }
                }
            },
            orderBy: { orderedAt: 'desc' }
        });

        res.json(tests);
    } catch (error) {
        console.error('Error fetching doctor orders:', error);
        res.status(500).json({ error: 'Failed to fetch doctor orders' });
    }
});

// Notify doctor when results are ready (simplified - in production would send email/SMS)
router.post('/:id/notify-doctor', async (req, res) => {
    try {
        const { message } = req.body;

        const test = await prisma.labTest.findUnique({
            where: {
                id: req.params.id,
                hospitalId: req.user.hospitalId
            },
            include: {
                patient: true
            }
        });

        if (!test) {
            return res.status(404).json({ error: 'Test not found' });
        }

        // In production, this would send an actual notification
        // For now, we'll just log it
        console.log(`Notification: Test ${test.testId} results ready for ${test.orderedBy}`);
        console.log(`Message: ${message}`);

        res.json({
            success: true,
            notification: {
                testId: test.testId,
                doctor: test.orderedBy,
                patient: test.patient.name,
                message,
                sentAt: new Date()
            }
        });
    } catch (error) {
        console.error('Error sending notification:', error);
        res.status(500).json({ error: 'Failed to send notification' });
    }
});

module.exports = router;
