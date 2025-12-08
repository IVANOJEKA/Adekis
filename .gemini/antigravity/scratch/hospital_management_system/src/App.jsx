import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import { CurrencyProvider } from './context/CurrencyContext';
import { WalletProvider } from './context/WalletContext';
import { PatientAuthProvider } from './context/PatientAuthContext';
import { AuthProvider } from './context/AuthContext';
import { BrandingProvider } from './context/BrandingContext';
import Layout from './components/Layout';
import OfflineIndicator from './components/OfflineIndicator';
import ErrorBoundary from './components/common/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';
import { Loader2 } from 'lucide-react';

// Lazy load modules
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const ReceptionDashboard = React.lazy(() => import('./modules/Reception/ReceptionDashboard'));
const EMRDashboard = React.lazy(() => import('./modules/EMR/EMRDashboard'));
const PharmacyDashboard = React.lazy(() => import('./modules/Pharmacy/PharmacyDashboard'));
const LaboratoryDashboard = React.lazy(() => import('./modules/Laboratory/LaboratoryDashboard'));
const RadiologyDashboard = React.lazy(() => import('./modules/Radiology/RadiologyDashboard'));
const BedManagementDashboard = React.lazy(() => import('./modules/BedManagement/BedManagementDashboard'));
const NursingDashboard = React.lazy(() => import('./modules/Nursing/NursingDashboard'));
const TheatreDashboard = React.lazy(() => import('./modules/Theatre/TheatreDashboard'));
const MaternityDashboard = React.lazy(() => import('./modules/Maternity/MaternityDashboard'));
const BloodBankDashboard = React.lazy(() => import('./modules/BloodBank/BloodBankDashboard'));
const AmbulanceDashboard = React.lazy(() => import('./modules/Ambulance/AmbulanceDashboard'));
import AdminDashboard from './modules/Admin/AdminDashboard';
const HRDashboard = React.lazy(() => import('./modules/HR/HRDashboard'));
const FinanceDashboard = React.lazy(() => import('./modules/Finance/FinanceDashboard'));
const ServicesDashboard = React.lazy(() => import('./modules/Services/ServicesDashboard'));
const WalletDashboard = React.lazy(() => import('./modules/Wallet/WalletDashboard'));
const CommunicationDashboard = React.lazy(() => import('./modules/Communication/CommunicationDashboard'));
const CampsDashboard = React.lazy(() => import('./modules/Camps/CampsDashboard'));
const QueueDashboard = React.lazy(() => import('./modules/Queue/QueueDashboard'));
const DoctorDashboard = React.lazy(() => import('./modules/Doctor/DoctorDashboard'));
const InsuranceDashboard = React.lazy(() => import('./modules/Insurance/InsuranceDashboard'));
const SettingsDashboard = React.lazy(() => import('./modules/Settings/SettingsDashboard'));
const ReportsDashboard = React.lazy(() => import('./modules/Reports/ReportsDashboard'));
const TriageDashboard = React.lazy(() => import('./modules/Triage/TriageDashboard'));
const PathologyDashboard = React.lazy(() => import('./modules/Pathology/PathologyDashboard'));

// Staff & Patient Authentication
const StaffLogin = React.lazy(() => import('./pages/StaffLogin'));
const PatientLogin = React.lazy(() => import('./pages/PatientLogin'));
const PatientPortal = React.lazy(() => import('./pages/PatientPortal'));
const LandingPage = React.lazy(() => import('./pages/LandingPage'));

// Loading Fallback
const PageLoader = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400">
    <Loader2 className="w-10 h-10 animate-spin mb-4 text-primary" />
    <p className="text-sm font-medium">Loading module...</p>
  </div>
);

function App() {
  // Register service worker for offline functionality
  React.useEffect(() => {
    // Unregister any existing service workers to fix refresh loop
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(registrations => {
        for (const registration of registrations) {
          registration.unregister();
          console.log('Service Worker unregistered');
        }
      });
    }
  }, []);

  return (
    <DataProvider>
      <CurrencyProvider>
        <WalletProvider>
          <PatientAuthProvider>
            <AuthProvider>
              <BrandingProvider>
                <BrowserRouter>
                  <ErrorBoundary>
                    <Suspense fallback={<Layout><PageLoader /></Layout>}>
                      <Routes>
                        {/* Public Routes (No Auth Required) */}
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/staff-login" element={<StaffLogin />} />
                        <Route path="/patient-login" element={<PatientLogin />} />
                        <Route path="/patient-portal" element={<PatientPortal />} />


                        {/* Protected Staff Routes (With Layout & Auth) */}
                        <Route element={<Layout />}>
                          <Route path="dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                          <Route path="reception" element={<ProtectedRoute requiredPermission="reception"><ReceptionDashboard /></ProtectedRoute>} />
                          <Route path="doctor" element={<ProtectedRoute requiredPermission="doctor"><DoctorDashboard /></ProtectedRoute>} />
                          <Route path="emr" element={<ProtectedRoute requiredPermission="emr"><EMRDashboard /></ProtectedRoute>} />
                          <Route path="pharmacy" element={<ProtectedRoute requiredPermission="pharmacy"><PharmacyDashboard /></ProtectedRoute>} />
                          <Route path="laboratory" element={<ProtectedRoute requiredPermission="laboratory"><LaboratoryDashboard /></ProtectedRoute>} />
                          <Route path="radiology" element={<ProtectedRoute requiredPermission="radiology"><RadiologyDashboard /></ProtectedRoute>} />
                          <Route path="bed-management" element={<ProtectedRoute requiredPermission="bed-management"><BedManagementDashboard /></ProtectedRoute>} />
                          <Route path="nursing" element={<ProtectedRoute requiredPermission="nursing"><NursingDashboard /></ProtectedRoute>} />
                          <Route path="theatre" element={<ProtectedRoute requiredPermission="theatre"><TheatreDashboard /></ProtectedRoute>} />
                          <Route path="maternity" element={<ProtectedRoute requiredPermission="maternity"><MaternityDashboard /></ProtectedRoute>} />
                          <Route path="blood-bank" element={<ProtectedRoute requiredPermission="blood-bank"><BloodBankDashboard /></ProtectedRoute>} />
                          <Route path="ambulance" element={<ProtectedRoute requiredPermission="ambulance"><AmbulanceDashboard /></ProtectedRoute>} />
                          <Route path="finance" element={<ProtectedRoute requiredPermission="finance"><FinanceDashboard /></ProtectedRoute>} />
                          <Route path="insurance" element={<ProtectedRoute requiredPermission="insurance"><InsuranceDashboard /></ProtectedRoute>} />
                          <Route path="hr" element={<ProtectedRoute requiredPermission="hr"><HRDashboard /></ProtectedRoute>} />
                          <Route path="services" element={<ProtectedRoute requiredPermission="services"><ServicesDashboard /></ProtectedRoute>} />
                          <Route path="wallet" element={<ProtectedRoute requiredPermission="wallet"><WalletDashboard /></ProtectedRoute>} />
                          <Route path="communication" element={<ProtectedRoute requiredPermission="communication"><CommunicationDashboard /></ProtectedRoute>} />
                          <Route path="camps" element={<ProtectedRoute requiredPermission="camps"><CampsDashboard /></ProtectedRoute>} />
                          <Route path="queue" element={<ProtectedRoute requiredPermission="queue"><QueueDashboard /></ProtectedRoute>} />
                          <Route path="triage" element={<ProtectedRoute requiredPermission="triage"><TriageDashboard /></ProtectedRoute>} />
                          <Route path="pathology" element={<ProtectedRoute requiredPermission="pathology"><PathologyDashboard /></ProtectedRoute>} />
                          <Route path="admin" element={<ProtectedRoute requiredPermission="admin"><AdminDashboard /></ProtectedRoute>} />
                          <Route path="settings" element={<ProtectedRoute requiredPermission="settings"><SettingsDashboard /></ProtectedRoute>} />
                          <Route path="reports" element={<ProtectedRoute requiredPermission="reports"><ReportsDashboard /></ProtectedRoute>} />
                        </Route>
                      </Routes>
                    </Suspense>
                  </ErrorBoundary>
                </BrowserRouter>
                <OfflineIndicator />
              </BrandingProvider>
            </AuthProvider>
          </PatientAuthProvider>
        </WalletProvider>
      </CurrencyProvider>
    </DataProvider>
  );
}

export default App;
