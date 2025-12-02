const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

// Import routes
const authRoutes = require('./routes/auth');
const patientRoutes = require('./routes/patients');
const appointmentRoutes = require('./routes/appointments');
const prescriptionRoutes = require('./routes/prescriptions');
const billRoutes = require('./routes/bills');
const serviceRoutes = require('./routes/services');
const queueRoutes = require('./routes/queue');
const caseRoutes = require('./routes/cases');
const inventoryRoutes = require('./routes/inventory');
const bloodBankRoutes = require('./routes/bloodbank');
const ambulanceRoutes = require('./routes/ambulance');
const hrRoutes = require('./routes/hr');
const insuranceRoutes = require('./routes/insurance');
const walletRoutes = require('./routes/wallet');
const bedManagementRoutes = require('./routes/bedManagement');
const theatreRoutes = require('./routes/theatre');
const emrRoutes = require('./routes/emr');
const maternityRoutes = require('./routes/maternity');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON bodies

// Routes
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Adekis HMS API', status: 'Running' });
});

app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// API Routes
const triageRoutes = require('./routes/triage');
const labRoutes = require('./routes/lab');
const labInventoryRoutes = require('./routes/labInventory');

app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/bills', billRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/queue', queueRoutes);
app.use('/api/cases', caseRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/bloodbank', bloodBankRoutes);
app.use('/api/ambulance', ambulanceRoutes);
app.use('/api/hr', hrRoutes);
app.use('/api/insurance', insuranceRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/bed-management', bedManagementRoutes);
app.use('/api/theatre', theatreRoutes);
app.use('/api/emr', emrRoutes);
app.use('/api/maternity', maternityRoutes);
app.use('/api/triage', triageRoutes);
app.use('/api/lab', labRoutes);
app.use('/api/lab-inventory', labInventoryRoutes);

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
