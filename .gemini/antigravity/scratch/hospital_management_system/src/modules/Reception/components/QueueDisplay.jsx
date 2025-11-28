import React, { useState } from 'react';
import { Users, Clock, ArrowRight, Stethoscope, Activity, FlaskConical, Phone, Bell } from 'lucide-react';
import { useData } from '../../../context/DataContext';

const QueueDisplay = () => {
    const { patients, setPatients } = useData();
    const [callNext, setCallNext] = useState(null);

    // Group patients by their current queue/status
    const queuedPatients = patients.filter(p => p.status === 'WAITING' || p.status === 'In Queue');

    // Organize by department/service type
    const triageQueue = queuedPatients.filter(p => !p.department || p.department === 'Triage');
    const doctorQueue = queuedPatients.filter(p => p.department === 'Doctor' || p.department === 'OPD');
    const labQueue = queuedPatients.filter(p => p.department === 'Laboratory');

    const handleCallPatient = (patient) => {
        // Update patient status to "In Service"
        setPatients(patients.map(p =>
            p.id === patient.id ? { ...p, status: 'IN SERVICE' } : p
        ));

        setCallNext(patient);
        setTimeout(() => setCallNext(null), 3000);

        // You could add notification sound here
        alert(`Calling ${patient.name} - ${patient.id}`);
    };

    const QueueCard = ({ title, icon: Icon, color, queuePatients }) => (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col h-full">
            <div className={`p-4 border-b border-slate-100 bg-${color}-50/30 flex justify-between items-center`}>
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-${color}-100 text-${color}-600`}>
                        <Icon size={20} />
                    </div>
                    <h3 className="font-bold text-slate-800">{title}</h3>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold bg-${color}-100 text-${color}-700`}>
                    {queuePatients.length} Waiting
                </span>
            </div>

            <div className="divide-y divide-slate-100 flex-1">
                {queuePatients.length > 0 ? (
                    queuePatients.map((patient) => {
                        const arrivalTime = patient.lastVisit || patient.visitDate || new Date().toLocaleTimeString();
                        const waitTime = patient.waitTime || 'New';

                        return (
                            <div key={patient.id} className="p-4 hover:bg-slate-50 transition-colors group">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <p className="font-bold text-slate-800">{patient.name}</p>
                                        <p className="text-xs text-slate-500">{patient.id}</p>
                                    </div>
                                    <span className="text-xs font-medium text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                                        <Clock size={10} /> {waitTime}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div className="text-xs text-slate-500">
                                        <p>Age: {patient.age || 'N/A'} • {patient.gender}</p>
                                        <p>Phone: {patient.phone}</p>
                                    </div>
                                    <button
                                        onClick={() => handleCallPatient(patient)}
                                        className="text-xs font-bold text-primary hover:text-primary-dark flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity px-3 py-1 bg-primary/10 rounded-lg"
                                    >
                                        <Phone size={12} /> Call
                                    </button>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="p-8 text-center text-slate-400">
                        <Users size={32} className="mx-auto mb-2 opacity-20" />
                        <p className="text-sm">No patients waiting</p>
                    </div>
                )}
            </div>

            {queuePatients.length > 0 && (
                <div className="p-3 bg-slate-50 border-t border-slate-100">
                    <button
                        onClick={() => queuePatients[0] && handleCallPatient(queuePatients[0])}
                        className="w-full py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium text-sm flex items-center justify-center gap-2"
                    >
                        <Bell size={16} />
                        Call Next Patient
                    </button>
                </div>
            )}
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Call Notification */}
            {callNext && (
                <div className="fixed top-4 right-4 bg-primary text-white px-6 py-4 rounded-xl shadow-2xl animate-bounce z-50 flex items-center gap-3">
                    <Bell size={24} />
                    <div>
                        <p className="font-bold">Calling Patient</p>
                        <p className="text-sm">{callNext.name} - {callNext.id}</p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <QueueCard
                    title="Triage / Vitals"
                    icon={Activity}
                    color="blue"
                    queuePatients={triageQueue}
                />
                <QueueCard
                    title="General Doctor"
                    icon={Stethoscope}
                    color="emerald"
                    queuePatients={doctorQueue}
                />
                <QueueCard
                    title="Laboratory"
                    icon={FlaskConical}
                    color="purple"
                    queuePatients={labQueue}
                />
            </div>

            {/* Total Queue Summary */}
            <div className="bg-white border border-slate-200 rounded-xl p-6">
                <h3 className="font-bold text-slate-800 mb-4">Queue Summary</h3>
                <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-slate-50 rounded-lg">
                        <p className="text-3xl font-bold text-slate-800">{queuedPatients.length}</p>
                        <p className="text-sm text-slate-600 mt-1">Total Waiting</p>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <p className="text-3xl font-bold text-blue-600">{patients.filter(p => p.status === 'IN SERVICE').length}</p>
                        <p className="text-sm text-slate-600 mt-1">In Service</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                        <p className="text-3xl font-bold text-green-600">{patients.filter(p => p.status === 'COMPLETED').length}</p>
                        <p className="text-sm text-slate-600 mt-1">Completed Today</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QueueDisplay;
