const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// POST /api/auth/register - Create new user
router.post('/register', async (req, res) => {
    try {
        const { email, password, name, role, department, hospitalId } = req.body;

        // Validation
        if (!email || !password || !name || !role || !hospitalId) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return res.status(400).json({ error: 'User with this email already exists' });
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // Create user
        const user = await prisma.user.create({
            data: {
                email,
                passwordHash,
                name,
                role,
                department: department || null,
                hospitalId,
                permissions: [], // Will be set by admin later
                status: 'active'
            },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                department: true,
                hospitalId: true,
                permissions: true
            }
        });

        // Generate JWT token
        const token = jwt.sign(
            {
                userId: user.id,
                email: user.email,
                role: user.role,
                hospitalId: user.hospitalId,
                permissions: user.permissions
            },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            message: 'User created successfully',
            user,
            token
        });

    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ error: 'Failed to create user' });
    }
});

// POST /api/auth/login - User login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(`Login attempt for: ${email}`);

        // Validation
        if (!email || !password) {
            console.error('Login failed: Missing email or password');
            return res.status(400).json({ error: 'Email and password required' });
        }

        // Find user
        const user = await prisma.user.findUnique({
            where: { email },
            include: {
                hospital: {
                    select: {
                        id: true,
                        name: true,
                        subdomain: true
                    }
                }
            }
        });

        if (!user) {
            console.error(`Login failed: User not found for email ${email}`);
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Check if user is active
        if (user.status !== 'active') {
            console.error(`Login failed: User ${email} is inactive`);
            return res.status(403).json({ error: 'Account is inactive. Contact administrator.' });
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.passwordHash);

        if (!isValidPassword) {
            console.error(`Login failed: Invalid password for ${email}`);
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Update last login
        await prisma.user.update({
            where: { id: user.id },
            data: { lastLogin: new Date() }
        });

        // Generate JWT token
        const token = jwt.sign(
            {
                userId: user.id,
                email: user.email,
                role: user.role,
                hospitalId: user.hospitalId,
                permissions: user.permissions
            },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        console.log(`Login successful for ${email}`);

        // Return user data (excluding password hash)
        const { passwordHash, ...userData } = user;

        res.json({
            message: 'Login successful',
            user: userData,
            token
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

// GET /api/auth/me - Get current user info (requires authentication)
router.get('/me', async (req, res) => {
    try {
        // Get token from header
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET);

        // Get fresh user data from database
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            include: {
                hospital: {
                    select: {
                        id: true,
                        name: true,
                        subdomain: true
                    }
                }
            },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                department: true,
                phone: true,
                status: true,
                permissions: true,
                lastLogin: true,
                hospital: true
            }
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ user });

    } catch (error) {
        console.error('Get user error:', error);
        res.status(401).json({ error: 'Invalid or expired token' });
    }
});

module.exports = router;
