import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { Tent, MapPin, Calendar, Users, Plus, Search, UserPlus, Stethoscope, ArrowLeft, X, DollarSign } from 'lucide-react';
import MedicalConsultationForm from '../Doctor/components/MedicalConsultationForm';

const CampsDashboard = () => {
    const { camps, setCamps, patients, setPatients, financialRecords, setFinancialRecords } = useData();
    const [selectedCamp, setSelectedCamp] = useState(null);
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [showConsultationModal, setShowConsultationModal] = useState(false);
    const [showScheduleCampModal, setShowScheduleCampModal] = useState(false);
    const [selectedPatientId, setSelectedPatientId] = useState(null);

    // Filter patients for the selected camp
    const campPatients = selectedCamp ? patients.filter(p => p.campId === selectedCamp.id) : [];

    // Auto-update camp status based on dates
    useEffect(() => {
        const updateCampStatuses = () => {
            const today = new Date().toISOString().split('T')[0];
            const updatedCamps = camps.map(camp => {
                if (camp.endDate < today && camp.status !== 'Completed') {
                    return { ...camp, status: 'Completed' };
                } else if (camp.startDate <= today && camp.endDate >= today && camp.status !== 'Ongoing') {
                    return { ...camp, status: 'Ongoing' };
                } else if (camp.startDate > today && camp.status !== 'Upcoming') {
                    return { ...camp, status: 'Upcoming' };
                }
                return camp;
            });

            // Only update if there are changes
            if (JSON.stringify(updatedCamps) !== JSON.stringify(camps)) {
                setCamps(updatedCamps);
            }
        };

        updateCampStatuses();
        // Check daily
        const interval = setInterval(updateCampStatuses, 24 * 60 * 60 * 1000);
        return () => clearInterval(interval);
    }, [camps, setCamps]);

    const handleEnterCamp = (camp) => {
        setSelectedCamp(camp);
    };

    const handleBackToDashboard = () => {
        setSelectedCamp(null);
        setShowRegisterModal(false);
        setShowConsultationModal(false);
        setSelectedPatientId(null);
    };

    const handleScheduleCamp = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const newCamp = {
            id: `CAMP-${Date.now()}`,
            name: formData.get('name'),
            location: formData.get('location'),
            startDate: formData.get('startDate'),
            endDate: formData.get('endDate'),
            status: 'Upcoming',
            targetPatients: parseInt(formData.get('targetPatients')),
            registeredPatients: 0,
            description: formData.get('description'),
            organizer: formData.get('organizer')
        };
        setCamps([...camps, newCamp]);
        setShowScheduleCampModal(false);
    };

    const handleRegisterPatient = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const newPatient = {
            id: `P-${Date.now()}`,
            campId: selectedCamp.id,
            name: formData.get('name'),
            age: parseInt(formData.get('age')),
            gender: formData.get('gender'),
            phone: formData.get('phone'),
            email: formData.get('email') || '',
            address: formData.get('address') || '',
            bloodGroup: formData.get('bloodGroup') || '',
            allergies: formData.get('allergies') ? formData.get('allergies').split(',').map(a => a.trim()) : [],
            emergencyContact: formData.get('emergencyContact') || '',
            registrationDate: new Date().toISOString().split('T')[0],
            status: 'Active',
            registeredAt: selectedCamp.name
        };

        setPatients([...patients, newPatient]);

        // Update camp registered count
        const updatedCamps = camps.map(c =>
            c.id === selectedCamp.id
                ? { ...c, registeredPatients: c.registeredPatients + 1 }
                : c
        );
        setCamps(updatedCamps);
        setSelectedCamp({ ...selectedCamp, registeredPatients: selectedCamp.registeredPatients + 1 });

        setShowRegisterModal(false);
    };

    const handleStartConsultation = (patientId) => {
        setSelectedPatientId(patientId);
        setShowConsultationModal(true);
    };

    const handleConsultationSave = () => {
        // Add financial record for consultation
        const patient = patients.find(p => p.id === selectedPatientId);
        if (patient) {
            const consultationFee = {
                id: `FIN-${Date.now()}`,
                patientId: selectedPatientId,
                patientName: patient.name,
                type: 'Consultation',
                amount: 500, // Default consultation fee
                date: new Date().toISOString().split('T')[0],
                status: 'Completed',
                description: `Camp Consultation - ${selectedCamp.name}`,
                campId: selectedCamp.id
            };
            setFinancialRecords([...financialRecords, consultationFee]);
        }
        setShowConsultationModal(false);
    };

    // Calculate camp statistics
    const getCampStats = (camp) => {
        const campPats = patients.filter(p => p.campId === camp.id);
        const campFinancials = financialRecords.filter(f => f.campId === camp.id);
        const revenue = campFinancials.reduce((sum, f) => sum + f.amount, 0);

        return {
            patients: campPats.length,
            revenue: revenue,
            completion: camp.targetPatients > 0 ? Math.round((campPats.length / camp.targetPatients) * 100) : 0
        };
    };

    if (selectedCamp) {
        const stats = getCampStats(selectedCamp);

        return (
            <div className="space-y-6">
                {/* Camp Header */}
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between bg-white p-6 rounded-xl shadow-sm border border-slate-200 gap-4">
                    <div className="flex items-center gap-4">
                        <button onClick={handleBackToDashboard} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                            <ArrowLeft size={24} className="text-slate-600" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-800">{selectedCamp.name}</h1>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 mt-1">
                                <span className="flex items-center gap-1"><MapPin size={14} /> {selectedCamp.location}</span>
                                <span className="flex items-center gap-1"><Calendar size={14} /> {selectedCamp.startDate} - {selectedCamp.endDate}</span>
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${selectedCamp.status === 'Ongoing' ? 'bg-green-100 text-green-700' :
                                    selectedCamp.status === 'Upcoming' ? 'bg-blue-100 text-blue-700' :
                                        'bg-gray-100 text-gray-700'
                                    }`}>{selectedCamp.status}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="text-center px-4 py-2 bg-blue-50 rounded-lg">
                            <div className="text-xs text-slate-500">Patients</div>
                            <div className="text-xl font-bold text-slate-800">{stats.patients} / {selectedCamp.targetPatients}</div>
                        </div>
                        <div className="text-center px-4 py-2 bg-green-50 rounded-lg">
                            <div className="text-xs text-slate-500">Revenue</div>
                            <div className="text-xl font-bold text-slate-800">UGX {stats.revenue.toLocaleString()}</div>
                        </div>
                        <button onClick={() => setShowRegisterModal(true)} className="btn btn-primary gap-2">
                            <UserPlus size={20} />
                            Register Patient
                        </button>
                    </div>
                </div>

                {/* Patient List */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-6 border-b border-slate-200 flex justify-between items-center">
                        <h2 className="text-lg font-bold text-slate-800">Registered Patients</h2>
                        <div className="relative w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input type="text" placeholder="Search patients..." className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20" />
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4">Patient ID</th>
                                    <th className="px-6 py-4">Name</th>
                                    <th className="px-6 py-4">Age/Gender</th>
                                    <th className="px-6 py-4">Phone</th>
                                    <th className="px-6 py-4">Blood Group</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {campPatients.length > 0 ? (
                                    campPatients.map((patient) => (
                                        <tr key={patient.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-slate-900">{patient.id}</td>
                                            <td className="px-6 py-4 text-slate-800">{patient.name}</td>
                                            <td className="px-6 py-4 text-slate-600">{patient.age} / {patient.gender}</td>
                                            <td className="px-6 py-4 text-slate-600">{patient.phone || 'N/A'}</td>
                                            <td className="px-6 py-4 text-slate-600">{patient.bloodGroup || 'Unknown'}</td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => handleStartConsultation(patient.id)}
                                                    className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center gap-1 justify-end ml-auto"
                                                >
                                                    <Stethoscope size={16} /> Consult
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                                            No patients registered yet. Click "Register Patient" to add one.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Register Patient Modal */}
                {showRegisterModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                        <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
                            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 sticky top-0">
                                <h3 className="font-bold text-lg text-slate-800">Register New Patient</h3>
                                <button onClick={() => setShowRegisterModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                                    <X size={24} />
                                </button>
                            </div>
                            <form onSubmit={handleRegisterPatient} className="p-6 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Full Name *</label>
                                        <input name="name" required type="text" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="e.g. John Doe" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Age *</label>
                                        <input name="age" required type="number" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="e.g. 35" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Gender *</label>
                                        <select name="gender" required className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all">
                                            <option value="">Select</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number *</label>
                                        <input name="phone" required type="tel" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="e.g. 0712345678" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Blood Group</label>
                                        <select name="bloodGroup" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all">
                                            <option value="">Select</option>
                                            <option value="A+">A+</option>
                                            <option value="A-">A-</option>
                                            <option value="B+">B+</option>
                                            <option value="B-">B-</option>
                                            <option value="AB+">AB+</option>
                                            <option value="AB-">AB-</option>
                                            <option value="O+">O+</option>
                                            <option value="O-">O-</option>
                                        </select>
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                                        <input name="email" type="email" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="e.g. john@example.com" />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                                        <input name="address" type="text" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="e.g. 123 Main Street, City" />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Emergency Contact</label>
                                        <input name="emergencyContact" type="tel" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="e.g. 0798765432" />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Allergies (comma-separated)</label>
                                        <input name="allergies" type="text" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="e.g. Penicillin, Peanuts" />
                                    </div>
                                </div>
                                <div className="pt-4 flex gap-3">
                                    <button type="button" onClick={() => setShowRegisterModal(false)} className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition-colors">Cancel</button>
                                    <button type="submit" className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark font-medium shadow-lg shadow-primary/30 transition-all transform act

ive:scale-95">Register Patient</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Consultation Modal */}
                {showConsultationModal && selectedPatientId && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                        <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl h-[90vh] overflow-y-auto relative animate-in fade-in zoom-in duration-200">
                            <button
                                onClick={() => setShowConsultationModal(false)}
                                className="absolute top-4 right-4 z-10 p-2 bg-white/80 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
                            >
                                <X size={24} />
                            </button>
                            <MedicalConsultationForm
                                patientId={selectedPatientId}
                                onClose={() => setShowConsultationModal(false)}
                                onSave={handleConsultationSave}
                            />
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Health Camps</h1>
                    <p className="text-slate-500">Community outreach and medical camps management</p>
                </div>
                <button onClick={() => setShowScheduleCampModal(true)} className="btn btn-primary gap-2">
                    <Plus size={20} />
                    Schedule Camp
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {camps.map((camp) => {
                    const stats = getCampStats(camp);
                    return (
                        <div key={camp.id} onClick={() => handleEnterCamp(camp)} className="card overflow-hidden group cursor-pointer hover:shadow-lg transition-all duration-300 border border-slate-200 hover:border-primary/30">
                            <div className="h-32 bg-gradient-to-r from-blue-500 to-cyan-500 relative group-hover:scale-105 transition-transform duration-500">
                                <div className={`absolute top-4 right-4 backdrop-blur-sm text-white px-2 py-1 rounded text-xs font-bold ${camp.status === 'Ongoing' ? 'bg-green-500/20' :
                                    camp.status === 'Upcoming' ? 'bg-blue-500/20' :
                                        'bg-gray-500/20'
                                    }`}>
                                    {camp.status.toUpperCase()}
                                </div>
                            </div>
                            <div className="p-6 relative bg-white">
                                <div className="w-12 h-12 bg-white rounded-lg shadow-md flex items-center justify-center absolute -top-6 left-6 text-primary group-hover:rotate-12 transition-transform duration-300">
                                    <Tent size={24} />
                                </div>

                                <div className="mt-4">
                                    <h3 className="font-bold text-lg text-slate-800 mb-1 group-hover:text-primary transition-colors">{camp.name}</h3>
                                    <p className="text-sm text-slate-500 mb-4 line-clamp-2">{camp.description}</p>

                                    <div className="space-y-2 text-sm text-slate-600">
                                        <div className="flex items-center gap-2">
                                            <MapPin size={16} className="text-slate-400" />
                                            <span>{camp.location}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Calendar size={16} className="text-slate-400" />
                                            <span>{camp.startDate} - {camp.endDate}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Users size={16} className="text-slate-400" />
                                            <span>{stats.patients} / {camp.targetPatients} Patients ({stats.completion}%)</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <DollarSign size={16} className="text-slate-400" />
                                            <span>UGX {stats.revenue.toLocaleString()}</span>
                                        </div>
                                    </div>

                                    <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center">
                                        <div className="flex -space-x-2">
                                            {/* Mock avatars */}
                                            {[1, 2, 3].map((j) => (
                                                <div key={j} className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white"></div>
                                            ))}
                                            <div className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-xs font-bold text-slate-500">+{stats.patients}</div>
                                        </div>
                                        <button className="text-primary font-medium text-sm hover:underline flex items-center gap-1">
                                            Enter Camp <ArrowLeft size={16} className="rotate-180" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Schedule Camp Modal */}
            {showScheduleCampModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h3 className="font-bold text-lg text-slate-800">Schedule New Camp</h3>
                            <button onClick={() => setShowScheduleCampModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleScheduleCamp} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Camp Name *</label>
                                    <input name="name" required type="text" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="e.g. Rural Eye Checkup Camp" />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Location *</label>
                                    <input name="location" required type="text" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="e.g. Village North District" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Start Date *</label>
                                    <input name="startDate" required type="date" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">End Date *</label>
                                    <input name="endDate" required type="date" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Target Patients *</label>
                                    <input name="targetPatients" required type="number" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="e.g. 500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Organizer *</label>
                                    <input name="organizer" required type="text" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="e.g. Dr. Smith" />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Description *</label>
                                    <textarea name="description" required rows="3" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="Brief description of the camp and services offered"></textarea>
                                </div>
                            </div>
                            <div className="pt-4 flex gap-3">
                                <button type="button" onClick={() => setShowScheduleCampModal(false)} className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition-colors">Cancel</button>
                                <button type="submit" className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark font-medium shadow-lg shadow-primary/30 transition-all transform active:scale-95">Schedule Camp</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CampsDashboard;
