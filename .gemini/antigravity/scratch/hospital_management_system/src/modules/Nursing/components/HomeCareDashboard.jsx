import React, { useState } from 'react';
import { useData } from '../../../context/DataContext';
import HomeCarePatientsList from './HomeCarePatientsList';
import EnrollPatientModal from './EnrollPatientModal';
import HomeCareVisitScheduler from './HomeCareVisitScheduler';
import VisitDocumentationModal from './VisitDocumentationModal';
import { generateHomeCareVisitId } from '../../../utils/homeCareUtils';

const HomeCareDashboard = () => {
    const {
        homeCarePatientsData, setHomeCarePatientsData,
        homeCareVisitsData, setHomeCareVisitsData
    } = useData();

    const [activeTab, setActiveTab] = useState('patients'); // 'patients', 'schedule', 'reports'
    const [showEnrollModal, setShowEnrollModal] = useState(false);
    const [showVisitModal, setShowVisitModal] = useState(false);
    const [selectedVisit, setSelectedVisit] = useState(null);

    // Handle enrolling a new patient
    const handleEnrollPatient = (newPatient) => {
        setHomeCarePatientsData([newPatient, ...homeCarePatientsData]);
    };

    // Handle scheduling a visit (mock implementation for now)
    const handleScheduleVisit = (patient) => {
        // In a real app, this would open a scheduling modal
        // For now, we'll just create a mock visit for today
        const newVisit = {
            id: generateHomeCareVisitId(homeCareVisitsData),
            homeCarePatientId: patient?.id || 'HC-001',
            patientName: patient?.patientName || 'Unknown',
            patientAddress: patient?.address || 'Unknown',
            nurseId: patient?.assignedNurseId || 'EMP-001',
            nurseName: patient?.assignedNurseName || 'Nurse',
            scheduledDate: new Date().toISOString().slice(0, 10),
            scheduledTime: '09:00 AM',
            status: 'Scheduled',
            visitType: 'Routine',
            servicesRendered: [],
            vitalSigns: null,
            medications: [],
            notes: '',
            billAmount: 50000
        };

        setHomeCareVisitsData([...homeCareVisitsData, newVisit]);
        alert('New visit scheduled for today!');
    };

    // Handle opening visit documentation
    const handleRecordVisit = (visit) => {
        setSelectedVisit(visit);
        setShowVisitModal(true);
    };

    // Handle saving visit documentation
    const handleSaveVisitRecord = (updatedVisit) => {
        const updatedVisits = homeCareVisitsData.map(v =>
            v.id === updatedVisit.id ? updatedVisit : v
        );
        setHomeCareVisitsData(updatedVisits);
        setShowVisitModal(false);
        setSelectedVisit(null);
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Tab Navigation */}
            <div className="flex border-b border-slate-200">
                <button
                    onClick={() => setActiveTab('patients')}
                    className={`px-6 py-3 font-medium text-sm transition-colors relative ${activeTab === 'patients' ? 'text-primary' : 'text-slate-500 hover:text-slate-700'
                        }`}
                >
                    Patients & Enrollment
                    {activeTab === 'patients' && (
                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full" />
                    )}
                </button>
                <button
                    onClick={() => setActiveTab('schedule')}
                    className={`px-6 py-3 font-medium text-sm transition-colors relative ${activeTab === 'schedule' ? 'text-primary' : 'text-slate-500 hover:text-slate-700'
                        }`}
                >
                    Visit Schedule
                    {activeTab === 'schedule' && (
                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full" />
                    )}
                </button>
                <button
                    onClick={() => setActiveTab('reports')}
                    className={`px-6 py-3 font-medium text-sm transition-colors relative ${activeTab === 'reports' ? 'text-primary' : 'text-slate-500 hover:text-slate-700'
                        }`}
                >
                    Reports & Analytics
                    {activeTab === 'reports' && (
                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full" />
                    )}
                </button>
            </div>

            {/* Tab Content */}
            <div className="min-h-[600px]">
                {activeTab === 'patients' && (
                    <HomeCarePatientsList
                        onEnrollPatient={() => setShowEnrollModal(true)}
                        onViewPatient={(p) => console.log('View', p)}
                        onScheduleVisit={handleScheduleVisit}
                    />
                )}

                {activeTab === 'schedule' && (
                    <HomeCareVisitScheduler
                        onScheduleVisit={() => handleScheduleVisit()}
                        onRecordVisit={handleRecordVisit}
                    />
                )}

                {activeTab === 'reports' && (
                    <div className="flex flex-col items-center justify-center h-64 text-slate-400 bg-slate-50 rounded-xl border border-slate-200 border-dashed">
                        <p>Reports module coming soon...</p>
                    </div>
                )}
            </div>

            {/* Modals */}
            {showEnrollModal && (
                <EnrollPatientModal
                    onClose={() => setShowEnrollModal(false)}
                    onSubmit={handleEnrollPatient}
                />
            )}

            {showVisitModal && selectedVisit && (
                <VisitDocumentationModal
                    visit={selectedVisit}
                    onClose={() => setShowVisitModal(false)}
                    onSave={handleSaveVisitRecord}
                />
            )}
        </div>
    );
};

export default HomeCareDashboard;
