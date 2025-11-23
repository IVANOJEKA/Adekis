import React, { useState, useMemo } from 'react';
import { Bed, User, CheckCircle, AlertCircle, Clock, Building2, Heart, Baby, Users, Stethoscope, Plus, X, ArrowRightLeft, DollarSign } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useCurrency } from '../../context/CurrencyContext';

const BedManagementDashboard = () => {
    const { wards, beds, admissions, patients, setAdmissions, setBeds, addBill } = useData();
    const { formatCurrency } = useCurrency();

    const [selectedWardId, setSelectedWardId] = useState(wards[0]?.id || null);
    const [showAdmitModal, setShowAdmitModal] = useState(false);
    const [showTransferModal, setShowTransferModal] = useState(false);
    const [selectedBed, setSelectedBed] = useState(null);

    // Get ward icon based on type
    const getWardIcon = (wardName) => {
        if (wardName.includes('ICU')) return Heart;
        if (wardName.includes('Maternity')) return Baby;
        if (wardName.includes('Private')) return Building2;
        if (wardName.includes('Pediatric')) return Users;
        return Bed;
    };

    // Calculate ward stats
    const wardStats = useMemo(() => {
        return wards.map(ward => {
            const wardBeds = beds.filter(b => b.wardId === ward.id);
            const total = wardBeds.length;
            const available = wardBeds.filter(b => b.status === 'Available').length;
            const occupied = wardBeds.filter(b => b.status === 'Occupied').length;
            const maintenance = wardBeds.filter(b => b.status === 'Maintenance').length;
            const reserved = wardBeds.filter(b => b.status === 'Reserved').length;

            return { ...ward, total, available, occupied, maintenance, reserved };
        });
    }, [wards, beds]);

    const selectedWard = wardStats.find(w => w.id === selectedWardId) || wardStats[0];
    const selectedWardBeds = beds.filter(b => b.wardId === selectedWardId);

    // Calculate days admitted and accrued bill
    const calculateAdmissionBill = (admission) => {
        const admitDate = new Date(admission.admissionDate);
        const now = new Date();
        const daysAdmitted = Math.max(1, Math.ceil((now - admitDate) / (1000 * 60 * 60 * 24)));

        const ward = wards.find(w => w.id === admission.wardId);
        const dailyRate = ward?.basePrice || 50000;
        const accruedBill = daysAdmitted * dailyRate;

        return { daysAdmitted, accruedBill, dailyRate };
    };

    // Handle admission
    const handleAdmit = (bedId, patientId, diagnosis, doctorId = 'U-001') => {
        const bed = beds.find(b => b.id === bedId);
        if (!bed || bed.status !== 'Available') return;

        const newAdmission = {
            id: `ADM-${Date.now()}`,
            patientId,
            bedId,
            wardId: bed.wardId,
            admissionDate: new Date().toISOString(),
            diagnosis,
            doctorId,
            status: 'Admitted'
        };

        setAdmissions([...admissions, newAdmission]);
        setBeds(beds.map(b => b.id === bedId ? { ...b, status: 'Occupied', patientId } : b));
        setShowAdmitModal(false);
        setSelectedBed(null);
    };

    // Handle transfer
    const handleTransfer = (admissionId, newBedId) => {
        const admission = admissions.find(a => a.id === admissionId);
        if (!admission) return;

        const newBed = beds.find(b => b.id === newBedId);
        if (!newBed || newBed.status !== 'Available') return;

        // Update admission
        setAdmissions(admissions.map(a =>
            a.id === admissionId
                ? { ...a, bedId: newBedId, wardId: newBed.wardId }
                : a
        ));

        // Update beds
        setBeds(beds.map(b => {
            if (b.id === admission.bedId) return { ...b, status: 'Available', patientId: null };
            if (b.id === newBedId) return { ...b, status: 'Occupied', patientId: admission.patientId };
            return b;
        }));

        setShowTransferModal(false);
        setSelectedBed(null);
    };

    // Handle discharge
    const handleDischarge = (admissionId) => {
        const admission = admissions.find(a => a.id === admissionId);
        if (!admission) return;

        const { accruedBill } = calculateAdmissionBill(admission);

        if (window.confirm(`Discharge patient?\n\nTotal Bed Charges: ${formatCurrency(accruedBill)}\n\nThis will be added to their medical bill.`)) {
            // Add Bill
            if (accruedBill > 0) {
                addBill({
                    patientId: admission.patientId,
                    amount: accruedBill,
                    type: 'Admission',
                    description: `Bed Charge: ${daysAdmitted} days in ${wards.find(w => w.id === admission.wardId)?.name}`,
                    status: 'Pending'
                });
            }

            // Update admission status
            setAdmissions(admissions.map(a =>
                a.id === admissionId ? { ...a, status: 'Discharged', dischargeDate: new Date().toISOString() } : a
            ));

            // Free the bed
            setBeds(beds.map(b =>
                b.id === admission.bedId ? { ...b, status: 'Available', patientId: null } : b
            ));
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Occupied': return 'bg-red-100 border-red-300 text-red-700';
            case 'Available': return 'bg-emerald-100 border-emerald-300 text-emerald-700';
            case 'Maintenance': return 'bg-amber-100 border-amber-300 text-amber-700';
            case 'Reserved': return 'bg-blue-100 border-blue-300 text-blue-700';
            default: return 'bg-slate-100 border-slate-300 text-slate-700';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Occupied': return User;
            case 'Available': return CheckCircle;
            case 'Maintenance': return AlertCircle;
            case 'Reserved': return Clock;
            default: return Bed;
        }
    };

    return (
        <div className="space-y-6 animate-fade-in pb-10">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Bed Management</h1>
                    <p className="text-slate-500 text-sm mt-1">Manage hospital beds with visual ward layouts</p>
                </div>
                <button
                    onClick={() => setShowAdmitModal(true)}
                    className="btn btn-primary gap-2 shadow-lg shadow-primary/30"
                >
                    <Plus size={20} />
                    Admit Patient
                </button>
            </div>

            {/* Ward Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {wardStats.map((ward) => {
                    const WardIcon = getWardIcon(ward.name);
                    return (
                        <div key={ward.id} className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md transition-all cursor-pointer"
                            onClick={() => setSelectedWardId(ward.id)}>
                            <div className="flex items-start gap-3 mb-3">
                                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                    <WardIcon size={20} />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-slate-800 text-sm">{ward.name}</h3>
                                </div>
                            </div>
                            <div className="space-y-1 text-xs">
                                <div className="flex justify-between">
                                    <span className="text-slate-600">Total:</span>
                                    <span className="font-bold text-slate-800">{ward.total}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-emerald-600">Available:</span>
                                    <span className="font-bold text-emerald-700">{ward.available}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-red-600">Occupied:</span>
                                    <span className="font-bold text-red-700">{ward.occupied}</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Ward Tabs */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                <div className="flex items-center gap-2 p-2 border-b border-slate-100 bg-slate-50/50 overflow-x-auto">
                    {wardStats.map((ward) => {
                        const WardIcon = getWardIcon(ward.name);
                        const isActive = selectedWardId === ward.id;
                        return (
                            <button
                                key={ward.id}
                                onClick={() => setSelectedWardId(ward.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${isActive
                                    ? 'bg-white text-slate-800 shadow-sm ring-1 ring-slate-200'
                                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
                                    }`}
                            >
                                <WardIcon size={16} />
                                {ward.name}
                            </button>
                        );
                    })}
                </div>

                {/* Ward Details */}
                <div className="p-6">
                    {selectedWard && (
                        <div className="space-y-6">
                            {/* Ward Header */}
                            <div className="flex items-start justify-between">
                                <div className="flex items-start gap-3">
                                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                                        {React.createElement(getWardIcon(selectedWard.name), { size: 24 })}
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-slate-800">{selectedWard.name}</h2>
                                        <p className="text-sm text-slate-500">{selectedWard.type}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 text-sm">
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-slate-800">{selectedWard.total}</p>
                                        <p className="text-xs text-slate-500">Total</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-emerald-600">{selectedWard.available}</p>
                                        <p className="text-xs text-slate-500">Available</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-red-600">{selectedWard.occupied}</p>
                                        <p className="text-xs text-slate-500">Occupied</p>
                                    </div>
                                </div>
                            </div>

                            {/* Legend */}
                            <div className="flex items-center gap-6 pb-4 border-b border-slate-100">
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-emerald-200 rounded"></div>
                                    <span className="text-sm text-slate-600">Available</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-red-200 rounded"></div>
                                    <span className="text-sm text-slate-600">Occupied</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-amber-200 rounded"></div>
                                    <span className="text-sm text-slate-600">Maintenance</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-blue-200 rounded"></div>
                                    <span className="text-sm text-slate-600">Reserved</span>
                                </div>
                            </div>

                            {/* Bed Layout */}
                            <div>
                                <h3 className="text-lg font-bold text-slate-800 mb-4">{selectedWard.name} Layout</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {selectedWardBeds.map(bed => {
                                        const admission = admissions.find(a => a.bedId === bed.id && a.status === 'Admitted');
                                        const patient = admission ? patients.find(p => p.id === admission.patientId) : null;
                                        const StatusIcon = getStatusIcon(bed.status);
                                        const billInfo = admission ? calculateAdmissionBill(admission) : null;

                                        return (
                                            <div key={bed.id} className={`border-2 rounded-xl p-4 transition-all hover:shadow-md ${getStatusColor(bed.status)}`}>
                                                <div className="flex items-start justify-between mb-3">
                                                    <div className="flex items-center gap-2">
                                                        <Bed size={18} className="text-current" />
                                                        <span className="font-bold text-lg">{bed.number}</span>
                                                    </div>
                                                    <StatusIcon size={20} className="text-current" />
                                                </div>

                                                {bed.status === 'Occupied' && patient && admission && billInfo ? (
                                                    <div className="space-y-2">
                                                        <div>
                                                            <p className="font-bold text-slate-800">{patient.name}</p>
                                                            <p className="text-xs text-slate-600">ID: {patient.id}</p>
                                                        </div>
                                                        <p className="text-sm text-slate-700">{admission.diagnosis}</p>
                                                        <div className="grid grid-cols-2 gap-2 pt-2">
                                                            <div className="bg-white/50 p-2 rounded">
                                                                <p className="text-xs text-slate-600">Days</p>
                                                                <p className="font-bold text-blue-700">{billInfo.daysAdmitted}</p>
                                                            </div>
                                                            <div className="bg-white/50 p-2 rounded">
                                                                <p className="text-xs text-slate-600">Bill</p>
                                                                <p className="font-bold text-emerald-700 text-xs">{formatCurrency(billInfo.accruedBill)}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-2 pt-2">
                                                            <button
                                                                onClick={() => { setSelectedBed(bed); setShowTransferModal(true); }}
                                                                className="flex-1 px-2 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-xs font-medium"
                                                            >
                                                                Transfer
                                                            </button>
                                                            <button
                                                                onClick={() => handleDischarge(admission.id)}
                                                                className="flex-1 px-2 py-1.5 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 text-xs font-medium"
                                                            >
                                                                Discharge
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : bed.status === 'Available' ? (
                                                    <div className="space-y-2">
                                                        <p className="font-medium text-lg">Available</p>
                                                        <div className="pt-2 border-t border-emerald-300">
                                                            <p className="text-xs text-emerald-700">
                                                                Cleaned: {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
                                                            </p>
                                                        </div>
                                                        <button
                                                            onClick={() => { setSelectedBed(bed); setShowAdmitModal(true); }}
                                                            className="w-full px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark text-xs font-medium"
                                                        >
                                                            Admit Patient
                                                        </button>
                                                    </div>
                                                ) : bed.status === 'Reserved' ? (
                                                    <div className="space-y-2">
                                                        <p className="font-medium text-lg">Reserved</p>
                                                        <div className="pt-2 border-t border-blue-300">
                                                            <p className="text-xs text-blue-700">
                                                                Cleaned: {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-2">
                                                        <p className="font-medium text-lg">Maintenance</p>
                                                        <p className="text-xs text-amber-700">Under maintenance</p>
                                                        <button
                                                            onClick={() => setBeds(beds.map(b => b.id === bed.id ? { ...b, status: 'Available' } : b))}
                                                            className="w-full px-3 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 text-xs font-medium"
                                                        >
                                                            Mark Available
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Admit Patient Modal */}
            {showAdmitModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h2 className="text-xl font-bold text-slate-800">Admit Patient</h2>
                            <button onClick={() => { setShowAdmitModal(false); setSelectedBed(null); }} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                                <X size={20} className="text-slate-500" />
                            </button>
                        </div>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.target);
                            handleAdmit(
                                formData.get('bedId'),
                                formData.get('patientId'),
                                formData.get('diagnosis')
                            );
                        }} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Select Bed</label>
                                <select
                                    name="bedId"
                                    required
                                    defaultValue={selectedBed?.id || ''}
                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                                >
                                    <option value="">Choose a bed...</option>
                                    {beds.filter(b => b.status === 'Available').map(bed => {
                                        const ward = wards.find(w => w.id === bed.wardId);
                                        return (
                                            <option key={bed.id} value={bed.id}>
                                                {bed.number} - {ward?.name} ({formatCurrency(ward?.basePrice || 0)}/day)
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Select Patient</label>
                                <select
                                    name="patientId"
                                    required
                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                                >
                                    <option value="">Choose a patient...</option>
                                    {patients.map(patient => (
                                        <option key={patient.id} value={patient.id}>
                                            {patient.name} ({patient.id})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Diagnosis / Reason</label>
                                <textarea
                                    name="diagnosis"
                                    required
                                    rows="3"
                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                                    placeholder="Enter diagnosis or reason for admission..."
                                ></textarea>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => { setShowAdmitModal(false); setSelectedBed(null); }}
                                    className="flex-1 px-6 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors shadow-lg shadow-primary/30"
                                >
                                    Admit Patient
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Transfer Patient Modal */}
            {showTransferModal && selectedBed && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h2 className="text-xl font-bold text-slate-800">Transfer Patient</h2>
                            <button onClick={() => { setShowTransferModal(false); setSelectedBed(null); }} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                                <X size={20} className="text-slate-500" />
                            </button>
                        </div>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            const admission = admissions.find(a => a.bedId === selectedBed.id && a.status === 'Admitted');
                            if (admission) {
                                handleTransfer(admission.id, e.target.newBedId.value);
                            }
                        }} className="p-6 space-y-4">
                            <div className="bg-blue-50 p-4 rounded-lg mb-4">
                                <p className="text-sm text-blue-600 mb-1">Current Bed</p>
                                <p className="font-bold text-slate-800">
                                    {selectedBed.number} - {wards.find(w => w.id === selectedBed.wardId)?.name}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Transfer To Bed</label>
                                <select
                                    name="newBedId"
                                    required
                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                                >
                                    <option value="">Choose a bed...</option>
                                    {beds.filter(b => b.status === 'Available' && b.id !== selectedBed.id).map(bed => {
                                        const ward = wards.find(w => w.id === bed.wardId);
                                        return (
                                            <option key={bed.id} value={bed.id}>
                                                {bed.number} - {ward?.name} ({formatCurrency(ward?.basePrice || 0)}/day)
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => { setShowTransferModal(false); setSelectedBed(null); }}
                                    className="flex-1 px-6 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-6 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/30"
                                >
                                    Transfer
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BedManagementDashboard;
