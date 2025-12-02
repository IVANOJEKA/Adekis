const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
dotenv.config({ path: path.join(__dirname, '.env') });

console.log('--- Auth Test Script ---');
console.log('JWT_SECRET from env:', process.env.JWT_SECRET ? 'Defined' : 'Undefined');

// Simulate Route Logic
const routeSecret = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
console.log('Route Secret (first 5 chars):', routeSecret.substring(0, 5) + '...');

const payload = { userId: '123', role: 'admin' };
const token = jwt.sign(payload, routeSecret, { expiresIn: '1h' });
console.log('Generated Token:', token);

// Simulate Middleware Logic
const middlewareSecret = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
console.log('Middleware Secret (first 5 chars):', middlewareSecret.substring(0, 5) + '...');

try {
    const decoded = jwt.verify(token, middlewareSecret);
    console.log('Verification SUCCESS!');
    console.log('Decoded:', decoded);
} catch (error) {
    console.error('Verification FAILED:', error.message);
}
