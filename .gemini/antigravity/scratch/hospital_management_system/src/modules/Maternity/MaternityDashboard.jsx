import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import {
    Baby, Calendar, Heart, Activity, UserPlus, FileText, AlertTriangle,
    Users, TrendingUp, Clock, CheckCircle, Plus, Search, Filter, Edit, Eye
} from 'lucide-react';
import RegistrationModal from './components/RegistrationModal';

const MaternityDashboard = () => {
    const {
        maternityPatients,
        registerMaternityPatient,
        patients,
        addPatient,
        ancVisits,
        recordANCVisit,
        deliveries,
        pncVisits
    } = useData();

    const [activeTab, setActiveTab] = useState('overview');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [showRegistrationModal, setShowRegistrationModal] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState(null);

    // Calculate key metrics
    const metrics = useMemo(() => {
        const today = new Date().toISOString().split('T')[0];
        const thisWeek = new Date();
        thisWeek.setDate(thisWeek.getDate() - 7);

        return {
            totalActive: maternityPatients.filter(p => p.status !== 'Discharged').length,
            antenatalCare: maternityPatients.filter(p => p.status === 'Antenatal').length,
            inLabor: maternityPatients.filter(p => p.status === 'Labor').length,
            postnatal: maternityPatients.filter(p => p.status === 'Postnatal').length,
            highRisk: maternityPatients.filter(p => p.riskLevel === 'High').length,
            deliveriesToday: deliveries.filter(d => d.deliveryDate?.startsWith(today)).length,
            deliveriesThisWeek: deliveries.filter(d => {
                const deliveryDate = new Date(d.deliveryDate);
                return deliveryDate >= thisWeek;
            }).length,
            upcomingANC: ancVisits.filter(v => {
                const nextVisit = new Date(v.nextVisitDate);
                const futureDate = new Date();
                futureDate.setDate(futureDate.getDate() + 7);
                return nextVisit >= new Date(today) && nextVisit <= futureDate;
            }).length
        };
    }, [maternityPatients, deliveries, ancVisits]);

    // Filter patients
    const filteredPatients = useMemo(() => {
        let filtered = maternityPatients;

        if (statusFilter !== 'all') {
            filtered = filtered.filter(p => p.status === statusFilter);
        }

        if (searchTerm) {
            filtered = filtered.filter(p =>
                p.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.id?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        return filtered.sort((a, b) => {
            // Sort by status priority: Labor > Antenatal > Postnatal > Delivered > Discharged
            const statusPriority = { 'Labor': 1, 'Antenatal': 2, 'Postnatal': 3, 'Delivered': 4, 'Discharged': 5 };
            return (statusPriority[a.status] || 99) - (statusPriority[b.status] || 99);
        });
    }, [maternityPatients, statusFilter, searchTerm]);

    // Handle patient registration with HMS integration
    const handleRegisterPatient = async (formData) => {
        try {
            // 1. Create general patient record for HMS integration via API
            // Calculate DOB from age
            const birthYear = new Date().getFullYear() - parseInt(formData.age || 0);
            const dateOfBirth = new Date(birthYear, 0, 1).toISOString();

            const patientData = {
                name: formData.patientName,
                dateOfBirth: dateOfBirth,
                gender: 'Female',
                phone: formData.phoneNumber,
                patientCategory: 'Maternity',
                bloodGroup: formData.bloodGroup,
                status: 'Active'
            };

            const result = await addPatient(patientData);

            if (!result.success) {
                alert(`Failed to register patient: ${result.error}`);
                return;
            }

            const patientId = result.patient.patientId || result.patient.id;

            // 2. Create maternity patient record
            const maternityData = {
                patientId: patientId,
                patientName: formData.patientName,
                lmp: formData.lmp,
                edd: formData.edd,
                gravida: parseInt(formData.gravida),
                para: parseInt(formData.para),
                bloodGroup: formData.bloodGroup,
                riskLevel: formData.riskLevel || 'Low'
            };

            const newMaternityPatient = await registerMaternityPatient(maternityData);

            // 3. Create first ANC visit record
            const ancVisitData = {
                maternityPatientId: newMaternityPatient.id,
                visitNumber: 1,
                visitDate: new Date().toISOString(),
                gestationalAge: parseInt(formData.currentWeeks),
                weight: null,
                bloodPressure: null,
                fundalHeight: null,
                fetalHeartRate: null,
                complaints: '',
                examination: 'Initial registration',
                nextVisitDate: calculateNextANCDate(formData.currentWeeks),
                attendedBy: formData.assignedDoctor || 'TBD'
            };

            await recordANCVisit(ancVisitData);

            setShowRegistrationModal(false);
            alert('Maternity patient registered successfully!');

        } catch (error) {
            console.error("Registration failed:", error);
            alert("Failed to register maternity patient. Please try again.");
        }
    }; alert(`Patient registered successfully!\nMaternity ID: ${matId}\nPatient ID: ${newMaternityPatient.patientId}\n\nFirst ANC visit scheduled for ${new Date(firstANCVisit.nextVisitDate).toLocaleDateString()}`);
};

const calculateNextANCDate = (currentWeeks) => {
    const today = new Date();
    let weeksToAdd = 4; // Default 4 weeks

    // WHO ANC schedule
    if (currentWeeks < 12) weeksToAdd = 4;
    else if (currentWeeks < 20) weeksToAdd = 4;
    else if (currentWeeks < 26) weeksToAdd = 2;
    else if (currentWeeks < 36) weeksToAdd = 2;
    else weeksToAdd = 1;

    const nextDate = new Date(today);
    nextDate.setDate(nextDate.getDate() + (weeksToAdd * 7));
    return nextDate.toISOString().split('T')[0];
};

const renderMetricsCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-500 mb-1">Total Active Patients</p>
                    <p className="text-3xl font-bold text-gray-900">{metrics.totalActive}</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                    <Users className="h-8 w-8 text-blue-500" />
                </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
                <span className="text-green-600 font-medium">{metrics.antenatalCare} Antenatal</span>
                <span className="text-gray-400 mx-2">•</span>
                <span className="text-purple-600 font-medium">{metrics.postnatal} Postnatal</span>
            </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-500 mb-1">In Labor</p>
                    <p className="text-3xl font-bold text-gray-900">{metrics.inLabor}</p>
                </div>
                <div className="p-3 bg-pink-50 rounded-lg">
                    <Activity className="h-8 w-8 text-pink-500" />
                </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
                <span className="text-gray-500">Active deliveries</span>
            </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-500 mb-1">Deliveries Today</p>
                    <p className="text-3xl font-bold text-gray-900">{metrics.deliveriesToday}</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                    <Baby className="h-8 w-8 text-purple-500" />
                </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
                <span className="text-gray-600">{metrics.deliveriesThisWeek} this week</span>
            </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-500 mb-1">High Risk Cases</p>
                    <p className="text-3xl font-bold text-gray-900">{metrics.highRisk}</p>
                </div>
                <div className="p-3 bg-red-50 rounded-lg">
                    <AlertTriangle className="h-8 w-8 text-red-500" />
                </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
                <span className="text-red-600 font-medium">Requires attention</span>
            </div>
        </div>
    </div>
);

const getRiskBadgeColor = (level) => {
    switch (level) {
        case 'High': return 'bg-red-100 text-red-800';
        case 'Moderate': return 'bg-yellow-100 text-yellow-800';
        case 'Low': return 'bg-green-100 text-green-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};

const getStatusBadgeColor = (status) => {
    switch (status) {
        case 'Labor': return 'bg-pink-100 text-pink-800';
        case 'Antenatal': return 'bg-blue-100 text-blue-800';
        case 'Postnatal': return 'bg-purple-100 text-purple-800';
        case 'Delivered': return 'bg-green-100 text-green-800';
        case 'Discharged': return 'bg-gray-100 text-gray-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};

const renderPatientsList = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
                <h2 className="text-lg font-bold text-gray-900">Maternity Patients</h2>
                <div className="flex gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search patients..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    >
                        <option value="all">All Status</option>
                        <option value="Antenatal">Antenatal</option>
                        <option value="Labor">In Labor</option>
                        <option value="Postnatal">Postnatal</option>
                        <option value="Delivered">Delivered</option>
                    </select>
                </div>
            </div>
        </div>

        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gestation</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">EDD</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Level</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {filteredPatients.length === 0 ? (
                        <tr>
                            <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                                {searchTerm || statusFilter !== 'all' ? 'No patients match your filters' : 'No maternity patients registered yet'}
                            </td>
                        </tr>
                    ) : (
                        filteredPatients.map((patient) => (
                            <tr key={patient.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <span className="font-medium text-gray-900">{patient.patientName}</span>
                                        <span className="text-xs text-gray-500">{patient.id}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-gray-900">{patient.age}</td>
                                <td className="px-6 py-4 text-gray-900">{patient.currentWeeks} weeks</td>
                                <td className="px-6 py-4 text-gray-900">
                                    {new Date(patient.edd).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRiskBadgeColor(patient.riskLevel)}`}>
                                        {patient.riskLevel}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(patient.status)}`}>
                                        {patient.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-gray-900">{patient.assignedDoctor || 'Unassigned'}</td>
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => setSelectedPatient(patient)}
                                        className="text-pink-600 hover:text-pink-800 font-medium text-sm flex items-center gap-1"
                                    >
                                        <Eye className="h-4 w-4" />
                                        View
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    </div>
);

return (
    <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Maternity & Obstetrics</h1>
                <p className="text-gray-500 mt-1">Comprehensive maternal and newborn care management</p>
            </div>
            <button
                onClick={() => setShowRegistrationModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 font-medium shadow-sm"
            >
                <UserPlus className="h-5 w-5" />
                Register New Mother
            </button>
        </div>

        {/* Quick Stats */}
        {metrics.upcomingANC > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
                <Calendar className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                    <p className="font-medium text-blue-900">Upcoming ANC Visits</p>
                    <p className="text-sm text-blue-700">{metrics.upcomingANC} patients have scheduled visits in the next 7 days</p>
                </div>
            </div>
        )}

        {/* Metrics Cards */}
        {renderMetricsCards()}

        {/* Patients List */}
        {renderPatientsList()}

        {/* Registration Modal */}
        <RegistrationModal
            isOpen={showRegistrationModal}
            onClose={() => setShowRegistrationModal(false)}
            onSubmit={handleRegisterPatient}
        />
    </div>
);
};

export default MaternityDashboard;
