import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import { CurrencyProvider } from './context/CurrencyContext';
import { WalletProvider } from './context/WalletContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ReceptionDashboard from './modules/Reception/ReceptionDashboard';
import EMRDashboard from './modules/EMR/EMRDashboard';
import PharmacyDashboard from './modules/Pharmacy/PharmacyDashboard';
import LaboratoryDashboard from './modules/Laboratory/LaboratoryDashboard';
import RadiologyDashboard from './modules/Radiology/RadiologyDashboard';
import BedManagementDashboard from './modules/BedManagement/BedManagementDashboard';
import NursingDashboard from './modules/Nursing/NursingDashboard';
import TheatreDashboard from './modules/Theatre/TheatreDashboard';
import MaternityDashboard from './modules/Maternity/MaternityDashboard';
import BloodBankDashboard from './modules/BloodBank/BloodBankDashboard';
import AmbulanceDashboard from './modules/Ambulance/AmbulanceDashboard';
import AdminDashboard from './modules/Admin/AdminDashboard';
import HRDashboard from './modules/HR/HRDashboard';
import FinanceDashboard from './modules/Finance/FinanceDashboard';
import ServicesDashboard from './modules/Services/ServicesDashboard';
import DebtDashboard from './modules/Debt/DebtDashboard';
import WalletDashboard from './modules/Wallet/WalletDashboard';
import CommunicationDashboard from './modules/Communication/CommunicationDashboard';
import CampsDashboard from './modules/Camps/CampsDashboard';
import QueueDashboard from './modules/Queue/QueueDashboard';
import DoctorDashboard from './modules/Doctor/DoctorDashboard';
import InsuranceDashboard from './modules/Insurance/InsuranceDashboard';
import SettingsDashboard from './modules/Settings/SettingsDashboard';
import ReportsDashboard from './modules/Reports/ReportsDashboard';
import TriageDashboard from './modules/Triage/TriageDashboard';
import PathologyDashboard from './modules/Pathology/PathologyDashboard';
import OfflineIndicator from './components/OfflineIndicator';

function App() {
  // Register service worker for offline functionality
  React.useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/service-worker.js')
          .then((registration) => {
            console.log('[App] Service Worker registered:', registration.scope);
          })
          .catch((error) => {
            console.error('[App] Service Worker registration failed:', error);
          });
      });
    }
  }, []);
  return (
    <DataProvider>
      <CurrencyProvider>
        <WalletProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Dashboard />} />
                <Route path="reception" element={<ReceptionDashboard />} />
                <Route path="doctor" element={<DoctorDashboard />} />
                <Route path="emr" element={<EMRDashboard />} />
                <Route path="pharmacy" element={<PharmacyDashboard />} />
                <Route path="laboratory" element={<LaboratoryDashboard />} />
                <Route path="radiology" element={<RadiologyDashboard />} />
                <Route path="bed-management" element={<BedManagementDashboard />} />
                <Route path="nursing" element={<NursingDashboard />} />
                <Route path="theatre" element={<TheatreDashboard />} />
                <Route path="maternity" element={<MaternityDashboard />} />
                <Route path="blood-bank" element={<BloodBankDashboard />} />
                <Route path="ambulance" element={<AmbulanceDashboard />} />
                <Route path="finance" element={<FinanceDashboard />} />
                <Route path="insurance" element={<InsuranceDashboard />} />
                <Route path="hr" element={<HRDashboard />} />
                <Route path="services" element={<ServicesDashboard />} />
                <Route path="wallet" element={<WalletDashboard />} />
                <Route path="debt" element={<DebtDashboard />} />
                <Route path="communication" element={<CommunicationDashboard />} />
                <Route path="camps" element={<CampsDashboard />} />
                <Route path="queue" element={<QueueDashboard />} />
                <Route path="triage" element={<TriageDashboard />} />
                <Route path="pathology" element={<PathologyDashboard />} />
                <Route path="admin" element={<AdminDashboard />} />
                <Route path="settings" element={<SettingsDashboard />} />
                <Route path="reports" element={<ReportsDashboard />} />
              </Route>
            </Routes>
          </BrowserRouter>
          {/* Offline Indicator - Shows when offline or has pending syncs */}
          <OfflineIndicator />
        </WalletProvider>
      </CurrencyProvider>
    </DataProvider>
  );
}

export default App;
