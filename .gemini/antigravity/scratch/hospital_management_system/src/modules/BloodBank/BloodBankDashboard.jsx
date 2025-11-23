import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import {
    Droplet, Users, AlertTriangle, Search, Plus, FileText,
    CheckCircle, XCircle, Clock, Settings
} from 'lucide-react';

const BloodBankDashboard = () => {
    const {
        bloodInventory = [], setBloodInventory,
        bloodDonors = [], setBloodDonors,
        bloodRequests = [], setBloodRequests,
        patients = [] // Default to empty array
    } = useData();

    const [activeTab, setActiveTab] = useState('inventory');
    const [showDonorModal, setShowDonorModal] = useState(false);
    const [showRequestModal, setShowRequestModal] = useState(false);
    const [showAdjustModal, setShowAdjustModal] = useState(false);

    // Search State for Requests
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);

    // Adjustment State
    const [adjustmentData, setAdjustmentData] = useState({ group: 'A+', type: 'Add', amount: 1, reason: '' });

    // --- Inventory Logic ---
    const getTotalUnits = () => bloodInventory.reduce((sum, item) => sum + item.units, 0);

    const handleAdjustStock = (e) => {
        e.preventDefault();
        const { group, type, amount, reason } = adjustmentData;
        const numAmount = parseInt(amount);

        const updatedInventory = bloodInventory.map(item => {
            if (item.group === group) {
                const newUnits = type === 'Add' ? item.units + numAmount : item.units - numAmount;
                return { ...item, units: Math.max(0, newUnits) }; // Prevent negative
            }
            return item;
        });
        setBloodInventory(updatedInventory);
        setShowAdjustModal(false);
    };

    // --- Donor Logic ---
    const checkEligibility = (lastDonation) => {
        if (!lastDonation || lastDonation === 'Never') return true;
        const lastDate = new Date(lastDonation);
        if (isNaN(lastDate.getTime())) return true; // Safety check for invalid date
        const today = new Date();
        const diffTime = Math.abs(today - lastDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays >= 90; // 3 months approx
    };

    const handleAddDonor = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const newDonor = {
            id: `D-${1000 + bloodDonors.length + 1}`,
            name: formData.get('name'),
            bloodGroup: formData.get('bloodGroup'),
            age: formData.get('age'),
            gender: formData.get('gender'),
            contact: formData.get('contact'),
            lastDonation: 'Never',
            status: 'Eligible'
        };
        setBloodDonors([...bloodDonors, newDonor]);
        setShowDonorModal(false);
    };

    const handleRecordDonation = (donorId) => {
        const donor = bloodDonors.find(d => d.id === donorId);
        if (!donor) return;

        if (!checkEligibility(donor.lastDonation)) {
            alert('Donor is not eligible yet. Must wait 3 months between donations.');
            return;
        }

        // Update inventory
        const updatedInventory = bloodInventory.map(item =>
            item.group === donor.bloodGroup
                ? { ...item, units: item.units + 1 }
                : item
        );
        setBloodInventory(updatedInventory);

        // Update donor history
        const updatedDonors = bloodDonors.map(d =>
            d.id === donorId
                ? { ...d, lastDonation: new Date().toISOString().split('T')[0] }
                : d
        );
        setBloodDonors(updatedDonors);
    };

    // --- Request Logic ---
    // Search Effect
    useEffect(() => {
        if (searchTerm.length > 1 && Array.isArray(patients)) {
            const results = patients.filter(p =>
                (p.name && p.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (p.id && p.id.toLowerCase().includes(searchTerm.toLowerCase()))
            );
            setSearchResults(results);
        } else {
            setSearchResults([]);
        }
    }, [searchTerm, patients]);

    const handleSelectPatient = (patient) => {
        setSelectedPatient(patient);
        setSearchTerm('');
        setSearchResults([]);
    };

    const handleAddRequest = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        if (!selectedPatient) {
            alert('Please select a patient');
            return;
        }

        const newRequest = {
            id: `BR-${String(bloodRequests.length + 1).padStart(3, '0')}`,
            patientName: selectedPatient.name,
            patientId: selectedPatient.id,
            bloodGroup: formData.get('bloodGroup'),
            units: parseInt(formData.get('units')),
            urgency: formData.get('urgency'),
            status: 'Pending',
            requestDate: new Date().toISOString().split('T')[0],
            doctor: 'Dr. Current User'
        };
        setBloodRequests([...bloodRequests, newRequest]);
        setShowRequestModal(false);
        setSelectedPatient(null);
    };

    const handleApproveRequest = (requestId) => {
        const request = bloodRequests.find(r => r.id === requestId);
        if (!request) return;

        // Check stock
        const stockItem = bloodInventory.find(i => i.group === request.bloodGroup);
        if (stockItem.units < request.units) {
            alert(`Insufficient stock for ${request.bloodGroup}`);
            return;
        }

        // Deduct stock
        const updatedInventory = bloodInventory.map(item =>
            item.group === request.bloodGroup
                ? { ...item, units: item.units - request.units }
                : item
        );
        setBloodInventory(updatedInventory);

        // Update request status
        const updatedRequests = bloodRequests.map(r =>
            r.id === requestId ? { ...r, status: 'Approved' } : r
        );
        setBloodRequests(updatedRequests);
    };

    const handleRejectRequest = (requestId) => {
        const updatedRequests = bloodRequests.map(r =>
            r.id === requestId ? { ...r, status: 'Rejected' } : r
        );
        setBloodRequests(updatedRequests);
    };

    return (
        <div className="space-y-6 animate-fade-in pb-10">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Blood Bank Management</h1>
                    <p className="text-slate-500">Inventory, donors, and transfusion requests</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setShowAdjustModal(true)}
                        className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 font-medium flex items-center gap-2 transition-colors"
                    >
                        <Settings size={18} />
                        Adjust Stock
                    </button>
                    <button
                        onClick={() => setShowRequestModal(true)}
                        className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 font-medium flex items-center gap-2 transition-colors"
                    >
                        <FileText size={18} />
                        New Request
                    </button>
                    <button
                        onClick={() => setShowDonorModal(true)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium flex items-center gap-2 shadow-lg shadow-red-200 transition-colors"
                    >
                        <Plus size={18} />
                        Add Donor
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-slate-500 text-sm font-medium">Total Units</p>
                        <p className="text-3xl font-bold text-slate-800">{getTotalUnits()}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center">
                        <Droplet size={20} />
                    </div>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-slate-500 text-sm font-medium">Registered Donors</p>
                        <p className="text-3xl font-bold text-slate-800">{bloodDonors.length}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                        <Users size={20} />
                    </div>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-slate-500 text-sm font-medium">Pending Requests</p>
                        <p className="text-3xl font-bold text-slate-800">{bloodRequests.filter(r => r.status === 'Pending').length}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
                        <Clock size={20} />
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-slate-200 flex gap-6">
                {['inventory', 'donors', 'requests'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`pb-3 text-sm font-bold capitalize transition-colors relative ${activeTab === tab ? 'text-red-600' : 'text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        {tab}
                        {activeTab === tab && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 rounded-t-full" />
                        )}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="min-h-[400px]">
                {/* Inventory Tab */}
                {activeTab === 'inventory' && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in">
                        {bloodInventory.map((item) => (
                            <div key={item.group} className={`bg-white p-6 rounded-xl border-t-4 shadow-sm relative overflow-hidden ${item.status === 'Critical' ? 'border-t-red-600' :
                                item.status === 'Low' ? 'border-t-orange-400' :
                                    'border-t-emerald-500'
                                }`}>
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-14 h-14 rounded-full bg-slate-50 flex items-center justify-center text-xl font-black text-slate-800 border border-slate-100">
                                        {item.group}
                                    </div>
                                    {item.status === 'Critical' && <AlertTriangle size={20} className="text-red-600" />}
                                </div>
                                <div className="space-y-1">
                                    <p className="text-3xl font-bold text-slate-800">{item.units}</p>
                                    <p className="text-sm text-slate-500">Available Units</p>
                                </div>
                                <div className={`mt-4 text-xs font-bold px-2 py-1 rounded inline-block ${item.status === 'Critical' ? 'bg-red-50 text-red-700' :
                                    item.status === 'Low' ? 'bg-orange-50 text-orange-700' :
                                        'bg-emerald-50 text-emerald-700'
                                    }`}>
                                    {item.status.toUpperCase()} STOCK
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Donors Tab */}
                {activeTab === 'donors' && (
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-fade-in">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4">Donor ID</th>
                                    <th className="px-6 py-4">Name</th>
                                    <th className="px-6 py-4">Blood Group</th>
                                    <th className="px-6 py-4">Last Donation</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {bloodDonors.map(donor => {
                                    const isEligible = checkEligibility(donor.lastDonation);
                                    return (
                                        <tr key={donor.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4 font-mono text-slate-500">{donor.id}</td>
                                            <td className="px-6 py-4 font-medium text-slate-800">{donor.name}</td>
                                            <td className="px-6 py-4">
                                                <span className="px-2 py-1 bg-red-50 text-red-700 rounded font-bold text-xs border border-red-100">
                                                    {donor.bloodGroup}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-slate-600">{donor.lastDonation}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${isEligible ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                                                    }`}>
                                                    {isEligible ? 'Eligible' : 'Ineligible'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => handleRecordDonation(donor.id)}
                                                    disabled={!isEligible}
                                                    className={`text-sm font-medium hover:underline ${isEligible ? 'text-emerald-600 hover:text-emerald-700' : 'text-slate-400 cursor-not-allowed'
                                                        }`}
                                                >
                                                    Record Donation
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Requests Tab */}
                {activeTab === 'requests' && (
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-fade-in">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4">Request ID</th>
                                    <th className="px-6 py-4">Patient</th>
                                    <th className="px-6 py-4">Blood Group</th>
                                    <th className="px-6 py-4">Units</th>
                                    <th className="px-6 py-4">Urgency</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {bloodRequests.map(request => (
                                    <tr key={request.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 font-mono text-slate-500">{request.id}</td>
                                        <td className="px-6 py-4 font-medium text-slate-800">
                                            {request.patientName}
                                            <span className="block text-xs text-slate-400">{request.patientId}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 bg-red-50 text-red-700 rounded font-bold text-xs border border-red-100">
                                                {request.bloodGroup}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-800 font-bold">{request.units}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${request.urgency === 'Urgent' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                                                }`}>
                                                {request.urgency}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${request.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' :
                                                request.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                                                    'bg-amber-100 text-amber-700'
                                                }`}>
                                                {request.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {request.status === 'Pending' && (
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => handleApproveRequest(request.id)}
                                                        className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                                                        title="Approve"
                                                    >
                                                        <CheckCircle size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleRejectRequest(request.id)}
                                                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                                                        title="Reject"
                                                    >
                                                        <XCircle size={18} />
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Add Donor Modal */}
            {showDonorModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
                        <h3 className="text-xl font-bold text-slate-800 mb-4">Register New Donor</h3>
                        <form onSubmit={handleAddDonor} className="space-y-4">
                            <input name="name" required placeholder="Full Name" className="w-full p-3 border rounded-lg" />
                            <div className="grid grid-cols-2 gap-4">
                                <select name="bloodGroup" className="w-full p-3 border rounded-lg">
                                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(g => (
                                        <option key={g} value={g}>{g}</option>
                                    ))}
                                </select>
                                <input name="age" type="number" required placeholder="Age" className="w-full p-3 border rounded-lg" />
                            </div>
                            <select name="gender" className="w-full p-3 border rounded-lg">
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                            <input name="contact" required placeholder="Phone Number" className="w-full p-3 border rounded-lg" />
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => setShowDonorModal(false)} className="flex-1 py-2 border rounded-lg">Cancel</button>
                                <button type="submit" className="flex-1 py-2 bg-red-600 text-white rounded-lg font-bold">Register</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* New Request Modal */}
            {showRequestModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="p-6 border-b border-slate-100">
                            <h3 className="text-xl font-bold text-slate-800">New Blood Request</h3>
                        </div>
                        <div className="p-6 space-y-4">
                            {/* Patient Search */}
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Patient</label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                    <input
                                        type="text"
                                        placeholder="Search patient by name or ID..."
                                        className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all bg-slate-50"
                                        value={selectedPatient ? selectedPatient.name : searchTerm}
                                        onChange={(e) => {
                                            setSearchTerm(e.target.value);
                                            setSelectedPatient(null);
                                        }}
                                    />
                                </div>
                                {searchResults.length > 0 && !selectedPatient && (
                                    <div className="absolute mt-1 bg-white rounded-xl shadow-xl border border-slate-100 max-h-40 overflow-y-auto z-50 w-[calc(100%-3rem)]">
                                        {searchResults.map(patient => (
                                            <div
                                                key={patient.id}
                                                onClick={() => handleSelectPatient(patient)}
                                                className="p-3 hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-0"
                                            >
                                                <div className="font-bold text-slate-800">{patient.name}</div>
                                                <div className="text-xs text-slate-500">{patient.id}</div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <form onSubmit={handleAddRequest} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Blood Group</label>
                                        <select name="bloodGroup" className="w-full p-3 border rounded-lg">
                                            {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(g => (
                                                <option key={g} value={g}>{g}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Units</label>
                                        <input name="units" type="number" min="1" max="5" required placeholder="Units" className="w-full p-3 border rounded-lg" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Urgency</label>
                                    <select name="urgency" className="w-full p-3 border rounded-lg">
                                        <option value="Normal">Normal</option>
                                        <option value="Urgent">Urgent</option>
                                        <option value="Critical">Critical</option>
                                    </select>
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <button type="button" onClick={() => setShowRequestModal(false)} className="flex-1 py-3 border rounded-xl font-bold text-slate-600">Cancel</button>
                                    <button type="submit" className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200">Submit Request</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Adjust Stock Modal */}
            {showAdjustModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
                        <h3 className="text-xl font-bold text-slate-800 mb-4">Adjust Inventory</h3>
                        <form onSubmit={handleAdjustStock} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Blood Group</label>
                                <select
                                    className="w-full p-3 border rounded-lg"
                                    value={adjustmentData.group}
                                    onChange={(e) => setAdjustmentData({ ...adjustmentData, group: e.target.value })}
                                >
                                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(g => (
                                        <option key={g} value={g}>{g}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Action</label>
                                    <select
                                        className="w-full p-3 border rounded-lg"
                                        value={adjustmentData.type}
                                        onChange={(e) => setAdjustmentData({ ...adjustmentData, type: e.target.value })}
                                    >
                                        <option value="Add">Add Stock</option>
                                        <option value="Remove">Remove Stock</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Units</label>
                                    <input
                                        type="number"
                                        min="1"
                                        required
                                        className="w-full p-3 border rounded-lg"
                                        value={adjustmentData.amount}
                                        onChange={(e) => setAdjustmentData({ ...adjustmentData, amount: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Reason</label>
                                <input
                                    placeholder="e.g., Expired, Damaged, External Donation"
                                    required
                                    className="w-full p-3 border rounded-lg"
                                    value={adjustmentData.reason}
                                    onChange={(e) => setAdjustmentData({ ...adjustmentData, reason: e.target.value })}
                                />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => setShowAdjustModal(false)} className="flex-1 py-2 border rounded-lg">Cancel</button>
                                <button type="submit" className="flex-1 py-2 bg-slate-800 text-white rounded-lg font-bold">Update Stock</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BloodBankDashboard;
