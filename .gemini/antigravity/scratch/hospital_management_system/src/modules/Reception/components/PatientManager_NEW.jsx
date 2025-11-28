import React, { useState, useMemo } from 'react';
import { X, Search, Check, Clock, Tag } from 'lucide-react';
import { useData } from '../../../context/DataContext';
import { generatePatientId } from '../../../utils/patientIdUtils';

const WalkInRegistrationModal = ({ onClose, onSubmit }) => {
    const { patients: allPatients } = useData();
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        address: '',
        notes: ''
    });
    const [selectedServices, setSelectedServices] = useState([]);

    const servicesData = {
        Consultations: [
            { id: 'c1', name: 'General Consultation', type: 'consultation', desc: 'General medical consultation', price: 50000, duration: '30 min' },
            { id: 'c2', name: 'Specialist Consultation', type: 'consultation', desc: 'Specialist doctor consultation', price: 80000, duration: '45 min' },
            { id: 'c3', name: 'Follow-up Consultation', type: 'consultation', desc: 'Follow-up visit', price: 35000, duration: '20 min' },
        ],
        'Laboratory Tests': [
            { id: 'l1', name: 'Complete Blood Count', type: 'lab', desc: 'Full blood analysis', price: 25000, duration: '2 hours' },
            { id: 'l2', name: 'Blood Sugar Test', type: 'lab', desc: 'Glucose level test', price: 15000, duration: '1 hour' },
            { id: 'l3', name: 'Liver Function Test', type: 'lab', desc: 'Liver enzyme analysis', price: 45000, duration: '4 hours' },
            { id: 'l4', name: 'Kidney Function Test', type: 'lab', desc: 'Kidney health assessment', price: 40000, duration: '4 hours' },
            { id: 'l5', name: 'Lipid Profile', type: 'lab', desc: 'Cholesterol and lipid analysis', price: 35000, duration: '3 hours' },
            { id: 'l6', name: 'Thyroid Function Test', type: 'lab', desc: 'Thyroid hormone levels', price: 50000, duration: '6 hours' },
            { id: 'l7', name: 'Urine Analysis', type: 'lab', desc: 'Complete urine examination', price: 20000, duration: '2 hours' },
            { id: 'l8', name: 'HIV Test', type: 'lab', desc: 'HIV screening test', price: 30000, duration: '3 hours' },
        ],
        Procedures: [
            { id: 'p1', name: 'ECG', type: 'procedure', desc: 'Electrocardiogram', price: 25000, duration: '15 min' },
            { id: 'p2', name: 'Blood Pressure Check', type: 'procedure', desc: 'BP measurement', price: 5000, duration: '10 min' },
            { id: 'p3', name: 'Wound Dressing', type: 'procedure', desc: 'Wound care and dressing', price: 15000, duration: '20 min' },
            { id: 'p4', name: 'Injection', type: 'procedure', desc: 'Medication injection', price: 10000, duration: '5 min' },
        ],
        'Maternity Services': [
            { id: 'm1', name: 'Antenatal Consultation', type: 'maternity', desc: 'Prenatal checkup and consultation', price: 60000, duration: '45 min' },
            { id: 'm2', name: 'Obstetric Ultrasound', type: 'maternity', desc: 'Pregnancy ultrasound scan', price: 100000, duration: '30 min' },
            { id: 'm3', name: 'Prenatal Blood Tests', type: 'maternity', desc: 'Complete prenatal blood panel', price: 75000, duration: '2 hours' },
            { id: 'm4', name: 'Glucose Tolerance Test', type: 'maternity', desc: 'Gestational diabetes screening', price: 35000, duration: '3 hours' },
        ]
    };

    const toggleService = (service) => {
        if (selectedServices.find(s => s.id === service.id)) {
            setSelectedServices(selectedServices.filter(s => s.id !== service.id));
        } else {
            setSelectedServices([...selectedServices, service]);
        }
    };

    const totalAmount = useMemo(() => {
        return selectedServices.reduce((sum, service) => sum + service.price, 0);
    }, [selectedServices]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ ...formData, services: selectedServices, totalAmount });
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center p-4 pt-10 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white z-10">
                    <div>
                        <h2 className="font-bold text-xl text-slate-800">Register Walk-in Patient</h2>
                        <p className="text-slate-500 text-sm">Add a patient for specific services only</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                    {/* Patient ID Preview */}
                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Walk-in Patient ID (Auto-Generated)</p>
                                <p className="text-2xl font-bold text-emerald-600 mt-1">{generatePatientId(allPatients, 'walkin')}</p>
                            </div>
                            <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
                                Auto-Assigned
                            </div>
                        </div>
                    </div>

                    {/* Patient Details Form */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Patient Name</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                placeholder="Full name"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Phone Number</label>
                            <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                placeholder="0756123456"
                            />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-sm font-bold text-slate-700">Email (Optional)</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                placeholder="patient@email.com"
                            />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-sm font-bold text-slate-700">Address (Optional)</label>
                            <input
                                type="text"
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                placeholder="e.g. Kampala, Uganda"
                            />
                        </div>
                    </div>

                    {/* Services Selection */}
                    <div className="space-y-6">
                        <h3 className="font-bold text-lg text-slate-800">Select Services</h3>

                        {Object.entries(servicesData).map(([category, services]) => (
                            <div key={category} className="space-y-3">
                                <div className="flex items-center gap-2 text-slate-800 font-bold text-sm uppercase tracking-wider">
                                    {category === 'Consultations' && <span className="text-blue-500">🩺</span>}
                                    {category === 'Laboratory Tests' && <span className="text-purple-500">🧪</span>}
                                    {category === 'Procedures' && <span className="text-orange-500">🩹</span>}
                                    {category === 'Maternity Services' && <span className="text-pink-500">👶</span>}
                                    {category}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {services.map((service) => {
                                        const isSelected = selectedServices.some(s => s.id === service.id);
                                        return (
                                            <div
                                                key={service.id}
                                                onClick={() => toggleService(service)}
                                                className={`cursor-pointer border rounded-xl p-4 transition-all duration-200 flex items-start gap-3 group ${isSelected
                                                    ? 'border-primary bg-primary/5 shadow-sm'
                                                    : 'border-slate-200 hover:border-primary/50 hover:bg-slate-50'
                                                    }`}
                                            >
                                                <div className={`w-5 h-5 rounded border flex items-center justify-center mt-0.5 transition-colors ${isSelected ? 'bg-primary border-primary text-white' : 'border-slate-300 bg-white'
                                                    }`}>
                                                    {isSelected && <Check size={12} strokeWidth={3} />}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-start">
                                                        <h4 className={`font-bold text-sm ${isSelected ? 'text-primary' : 'text-slate-700'}`}>{service.name}</h4>
                                                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${service.type === 'consultation' ? 'bg-blue-100 text-blue-600' :
                                                            service.type === 'lab' ? 'bg-emerald-100 text-emerald-600' :
                                                                service.type === 'maternity' ? 'bg-pink-100 text-pink-600' :
                                                                    'bg-orange-100 text-orange-600'
                                                            }`}>
                                                            {service.type}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-slate-500 mt-1">{service.desc}</p>
                                                    <div className="flex items-center gap-4 mt-3 text-xs font-medium">
                                                        <span className="text-slate-700">UGX {service.price.toLocaleString()}</span>
                                                        <span className="text-slate-400 flex items-center gap-1">
                                                            <Clock size={12} /> {service.duration}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Notes */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Notes (Optional)</label>
                        <textarea
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all h-24 resize-none"
                            placeholder="Additional notes or special instructions"
                        ></textarea>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-slate-100 bg-white flex justify-between items-center z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                    <div>
                        <p className="text-sm text-slate-500">Selected Services: <span className="font-bold text-slate-800">{selectedServices.length}</span></p>
                        <p className="text-lg font-bold text-slate-800">Total Amount: <span className="text-primary">UGX {totalAmount.toLocaleString()}</span></p>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={onClose} className="px-6 py-2.5 text-slate-600 hover:bg-slate-100 rounded-lg font-bold transition-colors">
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={selectedServices.length === 0 || !formData.name || !formData.phone}
                            className="px-8 py-2.5 bg-slate-800 text-white rounded-lg hover:bg-slate-700 font-bold shadow-lg shadow-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                        >
                            Register Patient
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WalkInRegistrationModal;
