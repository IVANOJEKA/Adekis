const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authMiddleware, attachHospitalId } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// All routes require authentication
router.use(authMiddleware); router.use(attachHospitalId);

// ==================== EMPLOYEES ====================

// Get all employees
router.get('/employees', async (req, res) => {
    try {
        const { hospitalId } = req.user;
        const employees = await prisma.employee.findMany({
            where: { hospitalId },
            orderBy: { createdAt: 'desc' }
        });
        res.json(employees);
    } catch (error) {
        console.error('Error fetching employees:', error);
        res.status(500).json({ error: 'Failed to fetch employees' });
    }
});

// Get single employee
router.get('/employees/:id', async (req, res) => {
    try {
        const { hospitalId } = req.user;
        const { id } = req.params;

        const employee = await prisma.employee.findFirst({
            where: { id, hospitalId },
            include: {
                attendance: { orderBy: { date: 'desc' }, take: 30 },
                payroll: { orderBy: { month: 'desc' }, take: 12 },
                leaveRequests: { orderBy: { createdAt: 'desc' } }
            }
        });

        if (!employee) {
            return res.status(404).json({ error: 'Employee not found' });
        }

        res.json(employee);
    } catch (error) {
        console.error('Error fetching employee:', error);
        res.status(500).json({ error: 'Failed to fetch employee' });
    }
});

// Add new employee
router.post('/employees', async (req, res) => {
    try {
        const { hospitalId } = req.user;
        const { firstName, lastName, email, phone, role, department, joinDate, salary, bankAccount } = req.body;

        // Generate employee ID
        const count = await prisma.employee.count({ where: { hospitalId } });
        const employeeId = `EMP-${String(count + 1).padStart(4, '0')}`;

        const employee = await prisma.employee.create({
            data: {
                hospitalId,
                employeeId,
                firstName,
                lastName,
                email,
                phone,
                role,
                department,
                joinDate: new Date(joinDate),
                salary: parseFloat(salary),
                bankAccount,
                status: 'Active'
            }
        });
        res.json(employee);
    } catch (error) {
        console.error('Error adding employee:', error);
        res.status(500).json({ error: 'Failed to add employee' });
    }
});

// Update employee
router.put('/employees/:id', async (req, res) => {
    try {
        const { hospitalId } = req.user;
        const { id } = req.params;
        const { firstName, lastName, email, phone, role, department, salary, status, bankAccount } = req.body;

        const employee = await prisma.employee.update({
            where: { id, hospitalId },
            data: { firstName, lastName, email, phone, role, department, salary: parseFloat(salary), status, bankAccount }
        });
        res.json(employee);
    } catch (error) {
        console.error('Error updating employee:', error);
        res.status(500).json({ error: 'Failed to update employee' });
    }
});

// ==================== ATTENDANCE ====================

// Get attendance records
router.get('/attendance', async (req, res) => {
    try {
        const { hospitalId } = req.user;
        const { startDate, endDate, employeeId } = req.query;

        const where = { hospitalId };
        if (employeeId) where.employeeId = employeeId;
        if (startDate && endDate) {
            where.date = {
                gte: new Date(startDate),
                lte: new Date(endDate)
            };
        }

        const attendance = await prisma.attendance.findMany({
            where,
            include: { employee: true },
            orderBy: { date: 'desc' }
        });
        res.json(attendance);
    } catch (error) {
        console.error('Error fetching attendance:', error);
        res.status(500).json({ error: 'Failed to fetch attendance' });
    }
});

// Mark attendance
router.post('/attendance', async (req, res) => {
    try {
        const { hospitalId } = req.user;
        const { employeeId, date, status, checkIn, checkOut, notes } = req.body;

        const attendance = await prisma.attendance.create({
            data: {
                hospitalId,
                employeeId,
                date: new Date(date),
                status,
                checkIn: checkIn ? new Date(checkIn) : null,
                checkOut: checkOut ? new Date(checkOut) : null,
                notes
            }
        });
        res.json(attendance);
    } catch (error) {
        console.error('Error marking attendance:', error);
        res.status(500).json({ error: 'Failed to mark attendance' });
    }
});

// Update attendance
router.put('/attendance/:id', async (req, res) => {
    try {
        const { hospitalId } = req.user;
        const { id } = req.params;
        const { status, checkIn, checkOut, notes } = req.body;

        const attendance = await prisma.attendance.update({
            where: { id, hospitalId },
            data: {
                status,
                checkIn: checkIn ? new Date(checkIn) : null,
                checkOut: checkOut ? new Date(checkOut) : null,
                notes
            }
        });
        res.json(attendance);
    } catch (error) {
        console.error('Error updating attendance:', error);
        res.status(500).json({ error: 'Failed to update attendance' });
    }
});

// ==================== LEAVE REQUESTS ====================

// Get leave requests
router.get('/leaves', async (req, res) => {
    try {
        const { hospitalId } = req.user;
        const leaves = await prisma.leaveRequest.findMany({
            where: { hospitalId },
            include: { employee: true },
            orderBy: { createdAt: 'desc' }
        });
        res.json(leaves);
    } catch (error) {
        console.error('Error fetching leave requests:', error);
        res.status(500).json({ error: 'Failed to fetch leave requests' });
    }
});

// Create leave request
router.post('/leaves', async (req, res) => {
    try {
        const { hospitalId } = req.user;
        const { employeeId, type, startDate, endDate, reason } = req.body;

        const leave = await prisma.leaveRequest.create({
            data: {
                hospitalId,
                employeeId,
                type,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                reason,
                status: 'Pending'
            }
        });
        res.json(leave);
    } catch (error) {
        console.error('Error creating leave request:', error);
        res.status(500).json({ error: 'Failed to create leave request' });
    }
});

// Approve/Reject leave
router.put('/leaves/:id', async (req, res) => {
    try {
        const { hospitalId } = req.user;
        const { id } = req.params;
        const { status, approvedBy } = req.body;

        const leave = await prisma.leaveRequest.update({
            where: { id, hospitalId },
            data: { status, approvedBy }
        });
        res.json(leave);
    } catch (error) {
        console.error('Error updating leave request:', error);
        res.status(500).json({ error: 'Failed to update leave request' });
    }
});

// ==================== PAYROLL ====================

// Get payroll records
router.get('/payroll', async (req, res) => {
    try {
        const { hospitalId } = req.user;
        const { month, employeeId } = req.query;

        const where = { hospitalId };
        if (month) where.month = month;
        if (employeeId) where.employeeId = employeeId;

        const payroll = await prisma.payroll.findMany({
            where,
            include: { employee: true },
            orderBy: { month: 'desc' }
        });
        res.json(payroll);
    } catch (error) {
        console.error('Error fetching payroll:', error);
        res.status(500).json({ error: 'Failed to fetch payroll' });
    }
});

// Create payroll entry
router.post('/payroll', async (req, res) => {
    try {
        const { hospitalId } = req.user;
        const { employeeId, month, basicSalary, allowances, deductions } = req.body;

        const netSalary = parseFloat(basicSalary) + parseFloat(allowances || 0) - parseFloat(deductions || 0);

        const payroll = await prisma.payroll.create({
            data: {
                hospitalId,
                employeeId,
                month,
                basicSalary: parseFloat(basicSalary),
                allowances: parseFloat(allowances || 0),
                deductions: parseFloat(deductions || 0),
                netSalary,
                status: 'Pending'
            }
        });
        res.json(payroll);
    } catch (error) {
        console.error('Error creating payroll:', error);
        res.status(500).json({ error: 'Failed to create payroll' });
    }
});

// Process/Pay payroll
router.put('/payroll/:id', async (req, res) => {
    try {
        const { hospitalId } = req.user;
        const { id } = req.params;
        const { status, paymentDate } = req.body;

        const payroll = await prisma.payroll.update({
            where: { id, hospitalId },
            data: {
                status,
                paymentDate: paymentDate ? new Date(paymentDate) : null
            }
        });
        res.json(payroll);
    } catch (error) {
        console.error('Error updating payroll:', error);
        res.status(500).json({ error: 'Failed to update payroll' });
    }
});

module.exports = router;
