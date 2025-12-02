const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { authMiddleware, attachHospitalId } = require('../middleware/auth');

const prisma = new PrismaClient();

// Middleware
router.use(authMiddleware); router.use(attachHospitalId);

// ==================== MATERNITY PATIENTS ====================

// Get all maternity patients
router.get('/patients', async (req, res) => {
    try {
        const patients = await prisma.maternityPatient.findMany({
            where: { hospitalId: req.user.hospitalId },
            include: {
                ancVisits: {
                    orderBy: { visitDate: 'desc' },
                    take: 1
                },
                deliveries: true,
                pncVisits: {
                    orderBy: { visitDate: 'desc' },
                    take: 1
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json(patients);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching maternity patients' });
    }
});

// Register new maternity patient
router.post('/patients', async (req, res) => {
    try {
        const {
            patientId,
            patientName,
            lmp,
            edd,
            gravida,
            para,
            bloodGroup,
            riskLevel
        } = req.body;

        const maternityPatient = await prisma.maternityPatient.create({
            data: {
                patientId,
                patientName,
                lmp: new Date(lmp),
                edd: new Date(edd),
                gravida: parseInt(gravida),
                para: parseInt(para),
                bloodGroup,
                riskLevel: riskLevel || 'Low',
                hospitalId: req.user.hospitalId
            }
        });

        res.status(201).json(maternityPatient);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error registering maternity patient' });
    }
});

// Get maternity patient details
router.get('/patients/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const patient = await prisma.maternityPatient.findUnique({
            where: {
                id,
                hospitalId: req.user.hospitalId
            },
            include: {
                ancVisits: {
                    orderBy: { visitDate: 'desc' }
                },
                deliveries: {
                    include: { newborns: true }
                },
                pncVisits: {
                    orderBy: { visitDate: 'desc' }
                }
            }
        });

        if (!patient) {
            return res.status(404).json({ error: 'Maternity patient not found' });
        }

        res.json(patient);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching patient details' });
    }
});

// Update maternity patient
router.put('/patients/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // Remove fields that shouldn't be updated
        delete updateData.id;
        delete updateData.hospitalId;
        delete updateData.createdAt;

        const patient = await prisma.maternityPatient.update({
            where: {
                id,
                hospitalId: req.user.hospitalId
            },
            data: updateData
        });

        res.json(patient);
    } catch (error) {
        res.status(500).json({ error: 'Error updating patient' });
    }
});

// ==================== ANC VISITS ====================

// Get ANC visit history for a maternity patient
router.get('/anc/:maternityPatientId', async (req, res) => {
    try {
        const { maternityPatientId } = req.params;

        const visits = await prisma.aNCVisit.findMany({
            where: {
                maternityPatientId,
                hospitalId: req.user.hospitalId
            },
            orderBy: { visitDate: 'desc' }
        });

        res.json(visits);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching ANC visits' });
    }
});

// Record ANC visit
router.post('/anc', async (req, res) => {
    try {
        const {
            maternityPatientId,
            visitNumber,
            visitDate,
            gestationalAge,
            weight,
            bloodPressure,
            fundalHeight,
            fetalHeartRate,
            complaints,
            examination,
            investigations,
            medications,
            nextVisitDate,
            attendedBy
        } = req.body;

        const visit = await prisma.aNCVisit.create({
            data: {
                maternityPatientId,
                visitNumber: parseInt(visitNumber),
                visitDate: visitDate ? new Date(visitDate) : undefined,
                gestationalAge: parseInt(gestationalAge),
                weight: weight ? parseFloat(weight) : null,
                bloodPressure,
                fundalHeight,
                fetalHeartRate: fetalHeartRate ? parseInt(fetalHeartRate) : null,
                complaints,
                examination,
                investigations: investigations || null,
                medications: medications || null,
                nextVisitDate: nextVisitDate ? new Date(nextVisitDate) : null,
                attendedBy,
                hospitalId: req.user.hospitalId
            }
        });

        res.status(201).json(visit);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error recording ANC visit' });
    }
});

// ==================== DELIVERIES ====================

// Get all delivery records
router.get('/deliveries', async (req, res) => {
    try {
        const deliveries = await prisma.delivery.findMany({
            where: { hospitalId: req.user.hospitalId },
            include: {
                maternityPatient: true,
                newborns: true
            },
            orderBy: { deliveryDate: 'desc' }
        });

        res.json(deliveries);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching deliveries' });
    }
});

// Record delivery
router.post('/deliveries', async (req, res) => {
    try {
        const {
            maternityPatientId,
            admissionDate,
            deliveryDate,
            deliveryTime,
            deliveryType,
            outcome,
            laborDuration,
            complications,
            bloodLoss,
            attendedBy,
            notes,
            newborns // Array of newborn data
        } = req.body;

        // Use transaction to create delivery and newborns
        const result = await prisma.$transaction(async (prisma) => {
            const delivery = await prisma.delivery.create({
                data: {
                    maternityPatientId,
                    admissionDate: new Date(admissionDate),
                    deliveryDate: new Date(deliveryDate),
                    deliveryTime,
                    deliveryType,
                    outcome,
                    laborDuration: laborDuration ? parseInt(laborDuration) : null,
                    complications,
                    bloodLoss: bloodLoss ? parseInt(bloodLoss) : null,
                    attendedBy,
                    notes,
                    hospitalId: req.user.hospitalId
                }
            });

            // Create newborns if provided
            if (newborns && newborns.length > 0) {
                for (const newborn of newborns) {
                    await prisma.newborn.create({
                        data: {
                            deliveryId: delivery.id,
                            name: newborn.name,
                            gender: newborn.gender,
                            birthWeight: parseFloat(newborn.birthWeight),
                            birthLength: newborn.birthLength ? parseFloat(newborn.birthLength) : null,
                            headCircumference: newborn.headCircumference ? parseFloat(newborn.headCircumference) : null,
                            apgarScore1: newborn.apgarScore1 ? parseInt(newborn.apgarScore1) : null,
                            apgarScore5: newborn.apgarScore5 ? parseInt(newborn.apgarScore5) : null,
                            complications: newborn.complications,
                            status: newborn.status || 'Stable',
                            hospitalId: req.user.hospitalId
                        }
                    });
                }
            }

            // Update maternity patient status
            await prisma.maternityPatient.update({
                where: { id: maternityPatientId },
                data: { status: 'Delivered' }
            });

            return delivery;
        });

        res.status(201).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error recording delivery' });
    }
});

// Get delivery details
router.get('/deliveries/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const delivery = await prisma.delivery.findUnique({
            where: {
                id,
                hospitalId: req.user.hospitalId
            },
            include: {
                maternityPatient: true,
                newborns: true
            }
        });

        if (!delivery) {
            return res.status(404).json({ error: 'Delivery not found' });
        }

        res.json(delivery);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching delivery details' });
    }
});

// ==================== NEWBORNS ====================

// Get newborns for a delivery
router.get('/newborns/:deliveryId', async (req, res) => {
    try {
        const { deliveryId } = req.params;

        const newborns = await prisma.newborn.findMany({
            where: {
                deliveryId,
                hospitalId: req.user.hospitalId
            }
        });

        res.json(newborns);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching newborns' });
    }
});

// Record newborn (if not done during delivery)
router.post('/newborns', async (req, res) => {
    try {
        const {
            deliveryId,
            name,
            gender,
            birthWeight,
            birthLength,
            headCircumference,
            apgarScore1,
            apgarScore5,
            complications,
            status
        } = req.body;

        const newborn = await prisma.newborn.create({
            data: {
                deliveryId,
                name,
                gender,
                birthWeight: parseFloat(birthWeight),
                birthLength: birthLength ? parseFloat(birthLength) : null,
                headCircumference: headCircumference ? parseFloat(headCircumference) : null,
                apgarScore1: apgarScore1 ? parseInt(apgarScore1) : null,
                apgarScore5: apgarScore5 ? parseInt(apgarScore5) : null,
                complications,
                status: status || 'Stable',
                hospitalId: req.user.hospitalId
            }
        });

        res.status(201).json(newborn);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error recording newborn' });
    }
});

// ==================== PNC VISITS ====================

// Get PNC visit history for a maternity patient
router.get('/pnc/:maternityPatientId', async (req, res) => {
    try {
        const { maternityPatientId } = req.params;

        const visits = await prisma.pNCVisit.findMany({
            where: {
                maternityPatientId,
                hospitalId: req.user.hospitalId
            },
            orderBy: { visitDate: 'desc' }
        });

        res.json(visits);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching PNC visits' });
    }
});

// Record PNC visit
router.post('/pnc', async (req, res) => {
    try {
        const {
            maternityPatientId,
            visitNumber,
            visitDate,
            daysPostpartum,
            maternalCondition,
            breastfeedingStatus,
            familyPlanningAdvice,
            complications,
            attendedBy,
            nextVisitDate
        } = req.body;

        const visit = await prisma.pNCVisit.create({
            data: {
                maternityPatientId,
                visitNumber: parseInt(visitNumber),
                visitDate: visitDate ? new Date(visitDate) : undefined,
                daysPostpartum: parseInt(daysPostpartum),
                maternalCondition,
                breastfeedingStatus,
                familyPlanningAdvice,
                complications,
                attendedBy,
                nextVisitDate: nextVisitDate ? new Date(nextVisitDate) : null,
                hospitalId: req.user.hospitalId
            }
        });

        res.status(201).json(visit);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error recording PNC visit' });
    }
});

module.exports = router;
