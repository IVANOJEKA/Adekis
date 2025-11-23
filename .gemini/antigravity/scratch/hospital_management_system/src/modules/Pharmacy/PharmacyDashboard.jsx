import React, { useState } from 'react';
import { ShoppingCart, Package, TrendingUp, DollarSign, Search, Plus, Minus, X, CreditCard, Barcode, Pill, AlertTriangle, Calendar, Building2, Download, Eye, Edit, Trash2, Filter, FileText, Clock, CheckCircle, User, MessageSquare, Send } from 'lucide-react';
import { useData } from '../../context/DataContext';

const PharmacyDashboard = () => {
    const {
        inventory = [],
        setInventory,
        prescriptions = [],
        setPrescriptions,
        financialRecords = [],
        setFinancialRecords,
        performDataReset,
        restoreInitialData,
        getDataCounts,
        queueEntries,
        setQueueEntries,
        addBill
    } = useData();
    const [activeTab, setActiveTab] = useState('queue');
    const [cart, setCart] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [showReceipt, setShowReceipt] = useState(false);
    const [selectedPrescription, setSelectedPrescription] = useState(null);
    const [prescriptionFilter, setPrescriptionFilter] = useState('all');
    const [messageText, setMessageText] = useState('');
    const [showMedicineModal, setShowMedicineModal] = useState(false);
    const [editingMedicine, setEditingMedicine] = useState(null);
    const [medicineForm, setMedicineForm] = useState({
        name: '',
        category: '',
        unit: 'Tablets',
        unitPrice: '',
        quantity: '',
        totalPrice: 0,
        minStock: '',
        supplier: '',
        batch: '',
        expiry: '',
        description: ''
    });
    const [showResetModal, setShowResetModal] = useState(false);

    // Payment modal state
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentPrescription, setPaymentPrescription] = useState(null);
    const [paymentAmount, setPaymentAmount] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('Cash');
    const [amountReceived, setAmountReceived] = useState('');

    const stats = [
        { label: 'Total Products', value: inventory.length, icon: Package, color: 'blue', subtext: `${inventory.reduce((sum, item) => sum + item.stock, 0)} units in stock` },
        { label: 'Low Stock Items', value: inventory.filter(i => i.stock <= i.minStock).length, icon: AlertTriangle, color: 'amber', subtext: 'Need reordering' },
        { label: 'Sales Today', value: 'UGX 450,000', icon: DollarSign, color: 'emerald', subtext: '42 transactions' },
        { label: 'Inventory Value', value: 'UGX 8.5M', icon: TrendingUp, color: 'purple', subtext: 'Total stock worth' },
    ];

    // POS Functions
    const addToCart = (product) => {
        const existingItem = cart.find(item => item.id === product.id);
        if (existingItem) {
            setCart(cart.map(item =>
                item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
            ));
        } else {
            setCart([...cart, { ...product, quantity: 1 }]);
        }
    };

    const updateQuantity = (productId, change) => {
        setCart(cart.map(item => {
            if (item.id === productId) {
                const newQuantity = item.quantity + change;
                return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
            }
            return item;
        }).filter(item => item.quantity > 0));
    };

    const removeFromCart = (productId) => {
        setCart(cart.filter(item => item.id !== productId));
    };

    const getCartTotal = () => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const completeSale = () => {
        setShowReceipt(true);
        setTimeout(() => {
            setCart([]);
            setShowReceipt(false);
        }, 3000);
    };

    const handleClearPrescription = (prescriptionId) => {
        setPrescriptions(prescriptions.map(rx =>
            rx.id === prescriptionId ? { ...rx, status: 'Cleared' } : rx
        ));
    };

    const handleDispensePrescription = (prescription) => {
        // Open payment modal instead of directly dispensing
        setPaymentPrescription(prescription);
        setPaymentAmount(prescription.totalAmount || 0);
        setAmountReceived('');
        setPaymentMethod('Cash');
        setShowPaymentModal(true);
    };

    const handleProcessPayment = () => {
        if (!paymentPrescription) return;

        const prescription = paymentPrescription;
        const paidAmount = parseFloat(amountReceived) || parseFloat(paymentAmount);

        if (!paidAmount || paidAmount < paymentAmount) {
            alert('Please enter a valid payment amount');
            return;
        }

        // Update prescription status
        setPrescriptions(prescriptions.map(rx =>
            rx.id === prescription.id
                ? {
                    ...rx,
                    status: 'Dispensed',
                    paid: true,
                    paymentStatus: 'Paid',
                    paidAmount: paidAmount,
                    balance: 0,
                    paymentMethod: paymentMethod,
                    dispensedBy: 'Pharmacist',
                    dispensedAt: new Date().toISOString()
                }
                : rx
        ));

        // Update financial record
        setFinancialRecords(financialRecords.map(fin =>
            fin.prescriptionId === prescription.id
                ? {
                    ...fin,
                    status: 'Paid',
                    paymentMethod: paymentMethod,
                    paidAt: new Date().toISOString()
                }
                : fin
        ));

        // Update inventory stock (reduce quantities)
        if (prescription.medications && prescription.medications.length > 0) {
            setInventory(inventory.map(item => {
                const prescribed = prescription.medications.find(med =>
                    med.name.toLowerCase() === item.name.toLowerCase()
                );

                if (prescribed && prescribed.quantity) {
                    const newStock = item.stock - prescribed.quantity;
                    return {
                        ...item,
                        stock: newStock > 0 ? newStock : 0
                    };
                }

                return item;
            }));
        }

        // Complete Queue Entry if exists
        const queueEntry = queueEntries.find(e => e.department === 'Pharmacy' && e.patientName === prescription.patient && e.status === 'InService');
        if (queueEntry) {
            setQueueEntries(queueEntries.map(e =>
                e.id === queueEntry.id ? { ...e, status: 'Completed', serviceEndTime: new Date().toISOString() } : e
            ));
        }

        // Add Bill Record
        addBill({
            patientId: prescription.patientId,
            amount: paidAmount,
            type: 'Pharmacy',
            description: `Prescription: ${prescription.medications.map(m => m.name).join(', ')}`,
            status: 'Paid'
        });

        // Close modal and show success
        setShowPaymentModal(false);
        setPaymentPrescription(null);

        const change = paidAmount - paymentAmount;
        alert(`Payment processed successfully!${change > 0 ? `\nChange: UGX ${change.toLocaleString()}` : ''}\n\nPrescription dispensed and inventory updated.`);
    };

    // Medicine Management Handlers
    const medicineCategories = [
        'Analgesics', 'Antibiotics', 'Antivirals', 'Antifungals',
        'Cardiovascular', 'Gastrointestinal', 'Respiratory',
        'Diabetic', 'Dermatological', 'Ophthalmic', 'Vitamins & Supplements',
        'Surgical Supplies', 'Other'
    ];

    const unitTypes = [
        'Tablets', 'Capsules', 'Bottles', 'Vials', 'Ampoules',
        'Syringes', 'Tubes', 'Sachets', 'Drops', 'Inhalers'
    ];

    const handleMedicineFormChange = (field, value) => {
        const updated = { ...medicineForm, [field]: value };

        // Auto-calculate total price when unit price or quantity changes
        if (field === 'unitPrice' || field === 'quantity') {
            const unitPrice = parseFloat(field === 'unitPrice' ? value : updated.unitPrice) || 0;
            const quantity = parseFloat(field === 'quantity' ? value : updated.quantity) || 0;
            updated.totalPrice = unitPrice * quantity;
        }

        setMedicineForm(updated);
    };

    const handleOpenMedicineModal = (medicine = null) => {
        if (medicine) {
            setEditingMedicine(medicine);
            setMedicineForm({
                name: medicine.name,
                category: medicine.category,
                unit: medicine.unit || 'Tablets',
                unitPrice: (medicine.price / medicine.stock).toFixed(2),
                quantity: medicine.stock.toString(),
                totalPrice: medicine.price,
                minStock: medicine.minStock.toString(),
                supplier: medicine.supplier || '',
                batch: medicine.batch || '',
                expiry: medicine.expiry || '',
                description: medicine.description || ''
            });
        } else {
            setEditingMedicine(null);
            setMedicineForm({
                name: '',
                category: '',
                unit: 'Tablets',
                unitPrice: '',
                quantity: '',
                totalPrice: 0,
                minStock: '',
                supplier: '',
                batch: '',
                expiry: '',
                description: ''
            });
        }
        setShowMedicineModal(true);
    };

    const handleSaveMedicine = (e) => {
        e.preventDefault();

        const newMedicine = {
            id: editingMedicine ? editingMedicine.id : Date.now(),
            name: medicineForm.name,
            category: medicineForm.category,
            unit: medicineForm.unit,
            price: medicineForm.totalPrice,
            stock: parseInt(medicineForm.quantity),
            minStock: parseInt(medicineForm.minStock),
            supplier: medicineForm.supplier,
            batch: medicineForm.batch,
            expiry: medicineForm.expiry,
            description: medicineForm.description
        };

        if (editingMedicine) {
            setInventory(inventory.map(item =>
                item.id === editingMedicine.id ? newMedicine : item
            ));
        } else {
            setInventory([...inventory, newMedicine]);
        }

        setShowMedicineModal(false);
        setEditingMedicine(null);
    };

    const handleDeleteMedicine = (medicineId) => {
        if (confirm('Are you sure you want to delete this medicine?')) {
            setInventory(inventory.filter(item => item.id !== medicineId));
        }
    };

    const filteredInventory = inventory.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-fade-in pb-10">
            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Pharmacy Management</h1>
                    <p className="text-slate-500 text-sm mt-1">Complete pharmacy system with POS and inventory management</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setActiveTab('pos')}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-medium shadow-lg shadow-primary/30"
                    >
                        <ShoppingCart size={16} />
                        Open POS
                    </button>
                    <button
                        onClick={() => handleOpenMedicineModal()}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium"
                    >
                        <Plus size={16} />
                        Add Medicine
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                    <div key={index} className={`bg-${stat.color}-50 border border-${stat.color}-100 p-5 rounded-xl hover:shadow-md transition-all duration-200 relative overflow-hidden`}>
                        <div className={`absolute top-0 right-0 p-4 opacity-10 text-${stat.color}-500`}>
                            <stat.icon size={60} />
                        </div>
                        <div className="relative z-10">
                            <div className={`p-2 rounded-lg bg-${stat.color}-100 text-${stat.color}-600 w-fit mb-3`}>
                                <stat.icon size={20} />
                            </div>
                            <p className="text-sm text-slate-600 font-medium mb-1">{stat.label}</p>
                            <p className="text-3xl font-bold text-slate-800 mb-1">{stat.value}</p>
                            <p className="text-xs text-slate-500">{stat.subtext}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Content */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                {/* Tabs */}
                <div className="flex items-center gap-1 p-2 border-b border-slate-100 bg-slate-50/50 overflow-x-auto">
                    {['Queue', 'POS', 'Prescriptions', 'Inventory', 'Suppliers', 'Communication', 'Reports', 'Settings'].map((tab) => {
                        const tabKey = tab.toLowerCase();
                        const isActive = activeTab === tabKey;
                        return (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tabKey)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${isActive
                                    ? 'bg-white text-slate-800 shadow-sm ring-1 ring-slate-200'
                                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
                                    }`}
                            >
                                {tab}
                            </button>
                        );
                    })}
                </div>

                {/* Tab Content */}
                <div className="p-6">
                    {/* Queue Tab */}
                    {activeTab === 'queue' && (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <h2 className="text-lg font-bold text-slate-800">Pharmacy Queue</h2>
                                    <p className="text-sm text-slate-500">Patients waiting for medication dispensing</p>
                                </div>
                                <div className="flex gap-2">
                                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
                                        Waiting: {queueEntries.filter(e => e.department === 'Pharmacy' && e.status === 'Waiting').length}
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {queueEntries
                                    .filter(e => e.department === 'Pharmacy' && (e.status === 'Waiting' || e.status === 'Called' || e.status === 'InService'))
                                    .sort((a, b) => new Date(a.checkInTime) - new Date(b.checkInTime))
                                    .map(entry => (
                                        <div key={entry.id} className={`border rounded-xl p-5 hover:shadow-md transition-all ${entry.status === 'InService' ? 'border-green-500 bg-green-50' : 'border-slate-200 bg-white'}`}>
                                            <div className="flex justify-between items-start mb-3">
                                                <span className="font-mono font-bold text-lg text-slate-700">{entry.queueNumber}</span>
                                                <span className={`px-2 py-1 rounded text-xs font-bold ${entry.priority === 'Emergency' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                                                    {entry.priority}
                                                </span>
                                            </div>
                                            <h3 className="font-bold text-slate-800 mb-1">{entry.patientName}</h3>
                                            <p className="text-sm text-slate-500 mb-3">{entry.service}</p>

                                            <div className="flex gap-2">
                                                {entry.status === 'Waiting' && (
                                                    <button
                                                        onClick={() => {
                                                            const updatedEntries = queueEntries.map(e =>
                                                                e.id === entry.id ? { ...e, status: 'InService', serviceStartTime: new Date().toISOString() } : e
                                                            );
                                                            setQueueEntries(updatedEntries);
                                                            // Find prescription for this patient
                                                            const patientPrescription = prescriptions.find(p => p.patient === entry.patientName && p.status === 'Pending');
                                                            if (patientPrescription) {
                                                                setPrescriptionFilter('pending');
                                                                setActiveTab('prescriptions');
                                                            } else {
                                                                setActiveTab('pos');
                                                            }
                                                        }}
                                                        className="flex-1 py-2 bg-primary text-white rounded-lg font-medium text-sm hover:bg-primary-dark transition-colors"
                                                    >
                                                        Call & Serve
                                                    </button>
                                                )}
                                                {entry.status === 'InService' && (
                                                    <button
                                                        onClick={() => {
                                                            const updatedEntries = queueEntries.map(e =>
                                                                e.id === entry.id ? { ...e, status: 'Completed', serviceEndTime: new Date().toISOString() } : e
                                                            );
                                                            setQueueEntries(updatedEntries);
                                                        }}
                                                        className="flex-1 py-2 bg-green-600 text-white rounded-lg font-medium text-sm hover:bg-green-700 transition-colors"
                                                    >
                                                        Complete Service
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                {queueEntries.filter(e => e.department === 'Pharmacy' && (e.status === 'Waiting' || e.status === 'InService')).length === 0 && (
                                    <div className="col-span-full py-12 text-center text-slate-400 border-2 border-dashed border-slate-200 rounded-xl">
                                        <Users size={48} className="mx-auto mb-3 opacity-20" />
                                        <p>No patients in pharmacy queue</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* POS Tab */}
                    {activeTab === 'pos' && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Product Selection */}
                            <div className="lg:col-span-2 space-y-4">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search products by name or scan barcode..."
                                        className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                                    />
                                    <Barcode className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-[600px] overflow-y-auto custom-scrollbar">
                                    {filteredInventory.map((product) => (
                                        <button
                                            key={product.id}
                                            onClick={() => addToCart(product)}
                                            className="p-4 border border-slate-200 rounded-xl hover:border-primary hover:shadow-md transition-all text-left group"
                                        >
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                                                    <Pill size={18} className="text-primary" />
                                                </div>
                                                {product.stock <= product.minStock && (
                                                    <span className="ml-auto">
                                                        <AlertTriangle size={14} className="text-amber-500" />
                                                    </span>
                                                )}
                                            </div>
                                            <h3 className="font-bold text-sm text-slate-800 mb-1 line-clamp-2">{product.name}</h3>
                                            <p className="text-xs text-slate-500 mb-2">{product.category}</p>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm font-bold text-primary">UGX {product.price.toLocaleString()}</span>
                                                <span className="text-xs text-slate-400">{product.stock} in stock</span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Cart */}
                            <div className="border border-slate-200 rounded-xl p-4 h-fit sticky top-4">
                                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                    <ShoppingCart size={20} className="text-primary" />
                                    Cart ({cart.length} items)
                                </h3>

                                {cart.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                                        <ShoppingCart size={48} className="mb-3 opacity-20" />
                                        <p className="text-sm">Cart is empty</p>
                                        <p className="text-xs mt-1">Add products to start</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar mb-4">
                                            {cart.map((item) => (
                                                <div key={item.id} className="border border-slate-100 rounded-lg p-3">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <h4 className="font-medium text-sm text-slate-800 flex-1 pr-2">{item.name}</h4>
                                                        <button onClick={() => removeFromCart(item.id)} className="text-slate-400 hover:text-red-500">
                                                            <X size={16} />
                                                        </button>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                onClick={() => updateQuantity(item.id, -1)}
                                                                className="p-1 bg-slate-100 hover:bg-slate-200 rounded"
                                                            >
                                                                <Minus size={14} />
                                                            </button>
                                                            <span className="font-bold text-sm w-8 text-center">{item.quantity}</span>
                                                            <button
                                                                onClick={() => updateQuantity(item.id, 1)}
                                                                className="p-1 bg-slate-100 hover:bg-slate-200 rounded"
                                                            >
                                                                <Plus size={14} />
                                                            </button>
                                                        </div>
                                                        <span className="font-bold text-primary text-sm">
                                                            UGX {(item.price * item.quantity).toLocaleString()}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="border-t border-slate-200 pt-4 space-y-3">
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-slate-600">Subtotal:</span>
                                                <span className="font-medium text-slate-800">UGX {getCartTotal().toLocaleString()}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-lg font-bold">
                                                <span className="text-slate-800">Total:</span>
                                                <span className="text-primary">UGX {getCartTotal().toLocaleString()}</span>
                                            </div>
                                            <button
                                                onClick={completeSale}
                                                className="w-full py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/30"
                                            >
                                                <CreditCard size={18} />
                                                Complete Sale
                                            </button>
                                            <button
                                                onClick={() => setCart([])}
                                                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium text-sm"
                                            >
                                                Clear Cart
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    )
                    }

                    {/* Prescriptions Tab */}
                    {
                        activeTab === 'prescriptions' && (
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-lg font-bold text-slate-800">Doctor Prescription Orders</h2>
                                    <div className="flex gap-2">
                                        {['All', 'Pending', 'Cleared', 'Dispensed'].map((filter) => (
                                            <button
                                                key={filter}
                                                onClick={() => setPrescriptionFilter(filter.toLowerCase())}
                                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${prescriptionFilter === filter.toLowerCase()
                                                    ? 'bg-primary text-white'
                                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                                    }`}
                                            >
                                                {filter}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    {prescriptions
                                        .filter(rx => prescriptionFilter === 'all' || rx.status.toLowerCase() === prescriptionFilter)
                                        .map((prescription) => {
                                            const getStatusColor = (status) => {
                                                switch (status.toLowerCase()) {
                                                    case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200';
                                                    case 'cleared': return 'bg-blue-100 text-blue-700 border-blue-200';
                                                    case 'dispensed': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
                                                    default: return 'bg-slate-100 text-slate-700 border-slate-200';
                                                }
                                            };

                                            return (
                                                <div key={prescription.id} className="border border-slate-200 rounded-xl p-5 hover:shadow-md transition-shadow">
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div>
                                                            <h3 className="font-bold text-slate-800 text-lg mb-1">{prescription.id}</h3>
                                                            <p className="text-sm text-slate-600">Patient: {prescription.patient}</p>
                                                            <p className="text-sm text-slate-600">Doctor: {prescription.doctor}</p>
                                                            <p className="text-xs text-slate-400 mt-1">{prescription.date}</p>
                                                        </div>
                                                        <span className={`px-3 py-1.5 rounded-full text-xs font-bold border ${getStatusColor(prescription.status)}`}>
                                                            {prescription.status}
                                                        </span>
                                                    </div>

                                                    <div className="bg-slate-50 rounded-lg p-4 mb-4">
                                                        <h4 className="font-bold text-sm text-slate-700 mb-3">Medications:</h4>
                                                        <div className="space-y-2">
                                                            {(prescription.medications || []).map((med, idx) => (
                                                                <div key={idx} className="flex justify-between items-center">
                                                                    <div>
                                                                        <p className="font-medium text-sm text-slate-800">{med.name}</p>
                                                                        <p className="text-xs text-slate-500">{med.dosage} - {med.frequency}</p>
                                                                    </div>
                                                                    <div className="text-right">
                                                                        <span className="text-xs text-slate-400">{med.duration}</span>
                                                                        {med.totalPrice && <p className="text-xs font-medium text-slate-600">UGX {med.totalPrice.toLocaleString()}</p>}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                        {prescription.totalAmount && (
                                                            <div className="mt-3 pt-3 border-t border-slate-200 flex justify-between items-center">
                                                                <span className="text-sm font-bold text-slate-700">Total Amount:</span>
                                                                <span className="text-lg font-bold text-emerald-600">UGX {prescription.totalAmount.toLocaleString()}</span>
                                                            </div>
                                                        )}
                                                        {prescription.paymentStatus && (
                                                            <div className="mt-2">
                                                                <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${prescription.paymentStatus === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                                                                    }`}>
                                                                    Payment: {prescription.paymentStatus}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="flex gap-2">
                                                        {prescription.status === 'Pending' && (
                                                            <button
                                                                onClick={() => handleClearPrescription(prescription.id)}
                                                                className="flex-1 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium text-sm flex items-center justify-center gap-2"
                                                            >
                                                                <CheckCircle size={16} />
                                                                Clear for Dispensing
                                                            </button>
                                                        )}
                                                        {prescription.status === 'Cleared' && (
                                                            <button
                                                                onClick={() => handleDispensePrescription(prescription)}
                                                                className="flex-1 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 font-medium text-sm flex items-center justify-center gap-2"
                                                            >
                                                                <ShoppingCart size={16} />
                                                                Dispense & Bill
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                </div>
                            </div>
                        )
                    }

                    {/* Inventory Tab */}
                    {
                        activeTab === 'inventory' && (
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-lg font-bold text-slate-800">Inventory Management</h2>
                                    <div className="flex gap-2">
                                        <button className="flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium">
                                            <Filter size={16} />
                                            Filter
                                        </button>
                                        <button
                                            onClick={() => handleOpenMedicineModal()}
                                            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark text-sm font-medium"
                                        >
                                            <Plus size={16} />
                                            Add Medicine
                                        </button>
                                    </div>
                                </div>

                                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-slate-50 border-b border-slate-100">
                                            <tr>
                                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Product</th>
                                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Category</th>
                                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Stock</th>
                                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Price</th>
                                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Batch</th>
                                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Expiry</th>
                                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {inventory.map((item) => {
                                                const isLowStock = item.stock <= item.minStock;
                                                const expiryDate = new Date(item.expiry);
                                                const monthsToExpiry = (expiryDate - new Date()) / (1000 * 60 * 60 * 24 * 30);
                                                const isExpiringSoon = monthsToExpiry < 6;

                                                return (
                                                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="p-2 bg-primary/10 rounded-lg">
                                                                    <Pill size={18} className="text-primary" />
                                                                </div>
                                                                <div>
                                                                    <p className="font-bold text-slate-800">{item.name}</p>
                                                                    <p className="text-xs text-slate-500">{item.supplier}</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-slate-600">{item.category}</td>
                                                        <td className="px-6 py-4">
                                                            <div>
                                                                <p className={`font-bold ${isLowStock ? 'text-amber-600' : 'text-slate-800'}`}>
                                                                    {item.stock} {item.unit}
                                                                </p>
                                                                {isLowStock && (
                                                                    <p className="text-xs text-amber-600 flex items-center gap-1 mt-1">
                                                                        <AlertTriangle size={12} /> Low Stock
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 font-bold text-slate-800">UGX {item.price.toLocaleString()}</td>
                                                        <td className="px-6 py-4 text-slate-600 text-xs">{item.batch}</td>
                                                        <td className="px-6 py-4">
                                                            <span className={`text-xs font-medium ${isExpiringSoon ? 'text-red-600' : 'text-slate-600'}`}>
                                                                {item.expiry}
                                                                {isExpiringSoon && <span className="block text-red-500 text-xs mt-1">⚠ Expiring soon</span>}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-right">
                                                            <div className="flex justify-end gap-2">
                                                                <button
                                                                    onClick={() => handleOpenMedicineModal(item)}
                                                                    className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg" title="Edit"
                                                                >
                                                                    <Edit size={16} />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDeleteMedicine(item.id)}
                                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="Delete"
                                                                >
                                                                    <Trash2 size={16} />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )
                    }

                    {/* Suppliers Tab */}
                    {
                        activeTab === 'suppliers' && (
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-lg font-bold text-slate-800">Suppliers</h2>
                                    <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark text-sm font-medium">
                                        Add Supplier
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {['PharmaCorp', 'MediSupply', 'HealthCare Ltd'].map((supplier, index) => (
                                        <div key={index} className="border border-slate-200 rounded-xl p-5 hover:shadow-md transition-shadow">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="p-3 bg-primary/10 rounded-lg">
                                                    <Building2 size={24} className="text-primary" />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-slate-800">{supplier}</h3>
                                                    <p className="text-xs text-slate-500">Active Supplier</p>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-3 text-sm">
                                                <div>
                                                    <p className="text-slate-500 text-xs">Products</p>
                                                    <p className="font-bold text-slate-700">{Math.floor(Math.random() * 50) + 10}</p>
                                                </div>
                                                <div>
                                                    <p className="text-slate-500 text-xs">Orders</p>
                                                    <p className="font-bold text-slate-700">{Math.floor(Math.random() * 20) + 5}</p>
                                                </div>
                                            </div>
                                            <button className="w-full mt-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg font-medium text-sm">
                                                View Details
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                    }

                    {/* Communication Tab */}
                    {
                        activeTab === 'communication' && (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-lg font-bold text-slate-800">Inter-Module Communication</h2>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    {/* Recent Messages */}
                                    <div className="lg:col-span-2 space-y-3">
                                        <h3 className="font-bold text-slate-700 mb-3">Recent Messages</h3>
                                        {[
                                            { from: 'Reception', message: 'Patient John Smith (P001) has arrived for prescription pickup', time: '10:30 AM', module: 'Reception', urgent: false },
                                            { from: 'Doctor Module', message: 'New prescription RX-001 submitted for Mary Johnson', time: '09:15 AM', module: 'Doctor', urgent: false },
                                            { from: 'Laboratory', message: 'Lab results ready for patient P003 - requires medication adjustment', time: 'Yesterday', module: 'Laboratory', urgent: true },
                                            { from: 'Finance', message: 'Insurance claim approved for RX-002. Please update records.', time: 'Yesterday', module: 'Finance', urgent: false },
                                        ].map((msg, index) => (
                                            <div key={index} className={`border rounded-xl p-4 hover:shadow-sm transition-shadow ${msg.urgent ? 'border-red-200 bg-red-50' : 'border-slate-200 bg-white'
                                                }`}>
                                                <div className="flex justify-between items-start mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <MessageSquare size={16} className={msg.urgent ? 'text-red-600' : 'text-primary'} />
                                                        <span className="font-bold text-sm text-slate-800">{msg.from}</span>
                                                        {msg.urgent && (
                                                            <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-bold rounded-full">Urgent</span>
                                                        )}
                                                    </div>
                                                    <span className="text-xs text-slate-400">{msg.time}</span>
                                                </div>
                                                <p className="text-sm text-slate-600">{msg.message}</p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Quick Actions */}
                                    <div className="space-y-4">
                                        <h3 className="font-bold text-slate-700 mb-3">Send Message</h3>
                                        <div className="border border-slate-200 rounded-xl p-4 space-y-3">
                                            <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
                                                <option>Select Module</option>
                                                <option>Reception</option>
                                                <option>Doctor</option>
                                                <option>Laboratory</option>
                                                <option>Finance</option>
                                                <option>Nursing</option>
                                            </select>
                                            <textarea
                                                value={messageText}
                                                onChange={(e) => setMessageText(e.target.value)}
                                                placeholder="Type your message..."
                                                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[120px] resize-none"
                                            />
                                            <button className="w-full py-2 bg-primary text-white rounded-lg hover:bg-primary-dark font-medium text-sm flex items-center justify-center gap-2">
                                                <Send size={16} />
                                                Send Message
                                            </button>
                                        </div>

                                        <div className="border border-slate-200 rounded-xl p-4">
                                            <h4 className="font-bold text-sm text-slate-700 mb-3">Quick Links</h4>
                                            <div className="space-y-2">
                                                {['Reception', 'Doctor', 'Laboratory', 'EMR', 'Finance'].map((module) => (
                                                    <button key={module} className="w-full py-2 px-3 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg text-sm font-medium text-left transition-colors">
                                                        {module}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    }

                    {/* Reports Tab */}
                    {
                        activeTab === 'reports' && (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-lg font-bold text-slate-800">Pharmacy Reports</h2>
                                    <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark text-sm font-medium">
                                        <Download size={16} />
                                        Export Report
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="border border-slate-200 rounded-xl p-5">
                                        <h3 className="font-bold text-slate-800 mb-4">Sales Summary (Today)</h3>
                                        <div className="space-y-3">
                                            <div className="flex justify-between p-3 bg-slate-50 rounded-lg">
                                                <span className="text-slate-600">Total Sales:</span>
                                                <span className="font-bold text-emerald-600">UGX 450,000</span>
                                            </div>
                                            <div className="flex justify-between p-3 bg-slate-50 rounded-lg">
                                                <span className="text-slate-600">Transactions:</span>
                                                <span className="font-bold text-slate-800">42</span>
                                            </div>
                                            <div className="flex justify-between p-3 bg-slate-50 rounded-lg">
                                                <span className="text-slate-600">Avg. Transaction:</span>
                                                <span className="font-bold text-slate-800">UGX 10,714</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border border-slate-200 rounded-xl p-5">
                                        <h3 className="font-bold text-slate-800 mb-4">Inventory Alerts</h3>
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg border border-amber-100">
                                                <span className="text-sm text-amber-800">Low Stock Items:</span>
                                                <span className="font-bold text-amber-900">{inventory.filter(i => i.stock <= i.minStock).length}</span>
                                            </div>
                                            <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-100">
                                                <span className="text-sm text-red-800">Expiring Soon:</span>
                                                <span className="font-bold text-red-900">
                                                    {inventory.filter(i => {
                                                        const monthsToExpiry = (new Date(i.expiry) - new Date()) / (1000 * 60 * 60 * 24 * 30);
                                                        return monthsToExpiry < 6;
                                                    }).length}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    }

                    {/* Settings Tab */}
                    {activeTab === 'settings' && (
                        <div className="max-w-4xl mx-auto space-y-6">
                            <div>
                                <h2 className="text-lg font-bold text-slate-800 mb-2">Pharmacy Settings</h2>
                                <p className="text-sm text-slate-500">Manage pharmacy configuration and data</p>
                            </div>

                            {/* Data Management Section */}
                            <div className="border border-slate-200 rounded-xl p-6 space-y-4">
                                <h3 className="font-bold text-slate-700 flex items-center gap-2">
                                    <AlertTriangle size={20} className="text-amber-500" />
                                    Data Management
                                </h3>

                                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                                    <h4 className="font-bold text-amber-900 mb-2">⚠️ Reset All Data</h4>
                                    <p className="text-sm text-amber-800 mb-4">
                                        This will permanently delete all data in the system including patients, prescriptions, inventory, and sales. This action cannot be undone.
                                    </p>
                                    <button
                                        onClick={() => setShowResetModal(true)}
                                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium text-sm flex items-center gap-2"
                                    >
                                        <AlertTriangle size={16} />
                                        Reset All Data
                                    </button>
                                </div>

                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <h4 className="font-bold text-blue-900 mb-2">🔄 Restore Sample Data</h4>
                                    <p className="text-sm text-blue-800 mb-4">
                                        This will restore the initial sample data including demo patients, inventory items, and prescriptions. Useful for testing or starting fresh.
                                    </p>
                                    <button
                                        onClick={() => {
                                            if (confirm('Restore initial sample data? This will replace all current data.')) {
                                                restoreInitialData('all');
                                                alert('Sample data restored successfully!');
                                                window.location.reload();
                                            }
                                        }}
                                        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium text-sm"
                                    >
                                        Restore Sample Data
                                    </button>
                                </div>

                                {/* Data Summary */}
                                {getDataCounts && (
                                    <div className="bg-slate-50 rounded-lg p-4">
                                        <h4 className="font-bold text-slate-700 mb-3">Current Data Summary</h4>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                            <div className="text-center p-3 bg-white rounded-lg border border-slate-200">
                                                <p className="text-2xl font-bold text-primary">{getDataCounts().patients || 0}</p>
                                                <p className="text-xs text-slate-600 mt-1">Patients</p>
                                            </div>
                                            <div className="text-center p-3 bg-white rounded-lg border border-slate-200">
                                                <p className="text-2xl font-bold text-primary">{getDataCounts().prescriptions || 0}</p>
                                                <p className="text-xs text-slate-600 mt-1">Prescriptions</p>
                                            </div>
                                            <div className="text-center p-3 bg-white rounded-lg border border-slate-200">
                                                <p className="text-2xl font-bold text-primary">{getDataCounts().inventory || 0}</p>
                                                <p className="text-xs text-slate-600 mt-1">Inventory Items</p>
                                            </div>
                                            <div className="text-center p-3 bg-white rounded-lg border border-slate-200">
                                                <p className="text-2xl font-bold text-primary">{getDataCounts().users || 0}</p>
                                                <p className="text-xs text-slate-600 mt-1">Users</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div >
            </div >

            {/* Medicine Modal */}
            {
                showMedicineModal && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center">
                                <h2 className="text-xl font-bold text-slate-800">
                                    {editingMedicine ? 'Edit Medicine' : 'Add New Medicine'}
                                </h2>
                                <button
                                    onClick={() => setShowMedicineModal(false)}
                                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSaveMedicine} className="p-6 space-y-6">
                                {/* Basic Information */}
                                <div>
                                    <h3 className="font-bold text-slate-700 mb-3">Basic Information</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                                Medicine Name <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={medicineForm.name}
                                                onChange={(e) => handleMedicineFormChange('name', e.target.value)}
                                                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                                                placeholder="e.g., Paracetamol 500mg"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                                Category <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                required
                                                value={medicineForm.category}
                                                onChange={(e) => handleMedicineFormChange('category', e.target.value)}
                                                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                                            >
                                                <option value="">Select Category</option>
                                                {medicineCategories.map(cat => (
                                                    <option key={cat} value={cat}>{cat}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Unit & Pricing */}
                                <div>
                                    <h3 className="font-bold text-slate-700 mb-3">Unit & Pricing</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                                Unit Type <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                required
                                                value={medicineForm.unit}
                                                onChange={(e) => handleMedicineFormChange('unit', e.target.value)}
                                                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                                            >
                                                {unitTypes.map(unit => (
                                                    <option key={unit} value={unit}>{unit}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                                Unit Price (UGX) <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="number"
                                                required
                                                min="0"
                                                step="0.01"
                                                value={medicineForm.unitPrice}
                                                onChange={(e) => handleMedicineFormChange('unitPrice', e.target.value)}
                                                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                                                placeholder="Price per unit"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                                Quantity <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="number"
                                                required
                                                min="1"
                                                value={medicineForm.quantity}
                                                onChange={(e) => handleMedicineFormChange('quantity', e.target.value)}
                                                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                                                placeholder="Number of units"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                                Total Price (Auto-calculated)
                                            </label>
                                            <div className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 font-bold text-primary">
                                                UGX {medicineForm.totalPrice.toLocaleString()}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Stock & Supplier */}
                                <div>
                                    <h3 className="font-bold text-slate-700 mb-3">Stock & Supplier Details</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                                Minimum Stock Level <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="number"
                                                required
                                                min="0"
                                                value={medicineForm.minStock}
                                                onChange={(e) => handleMedicineFormChange('minStock', e.target.value)}
                                                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                                                placeholder="Alert threshold"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                                Supplier
                                            </label>
                                            <input
                                                type="text"
                                                value={medicineForm.supplier}
                                                onChange={(e) => handleMedicineFormChange('supplier', e.target.value)}
                                                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                                                placeholder="Supplier name"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                                Batch/Lot Number
                                            </label>
                                            <input
                                                type="text"
                                                value={medicineForm.batch}
                                                onChange={(e) => handleMedicineFormChange('batch', e.target.value)}
                                                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                                                placeholder="e.g., BT2024001"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                                Expiry Date <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="date"
                                                required
                                                value={medicineForm.expiry}
                                                onChange={(e) => handleMedicineFormChange('expiry', e.target.value)}
                                                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Description/Notes
                                    </label>
                                    <textarea
                                        value={medicineForm.description}
                                        onChange={(e) => handleMedicineFormChange('description', e.target.value)}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[80px]"
                                        placeholder="Additional information about the medicine..."
                                    />
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-3 pt-4 border-t border-slate-200">
                                    <button
                                        type="button"
                                        onClick={() => setShowMedicineModal(false)}
                                        className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-dark font-medium transition-colors"
                                    >
                                        {editingMedicine ? 'Update Medicine' : 'Add Medicine'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }

            {/* Sale Success Notification */}
            {
                showReceipt && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 text-center">
                            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-emerald-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                    <path d="M5 13l4 4L19 7"></path>
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2">Sale Completed!</h3>
                            <p className="text-slate-600 mb-4">Total: UGX {getCartTotal().toLocaleString()}</p>
                            <p className="text-sm text-slate-500">Receipt printed successfully</p>
                        </div>
                    </div>
                )
            }

            {/* Payment Processing Modal */}
            {showPaymentModal && paymentPrescription && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-6 py-4 rounded-t-2xl">
                            <div className="flex justify-between items-center text-white">
                                <div>
                                    <h2 className="text-xl font-bold">Process Payment</h2>
                                    <p className="text-emerald-100 text-sm">Prescription: {paymentPrescription.id}</p>
                                </div>
                                <button onClick={() => setShowPaymentModal(false)} className="p-2 hover:bg-white/20 rounded-lg">
                                    <X size={24} />
                                </button>
                            </div>
                        </div>

                        <div className="p-6 space-y-4">
                            {/* Patient Info */}
                            <div className="bg-slate-50 rounded-lg p-4">
                                <h3 className="font-bold text-slate-800 mb-2">Patient Information</h3>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div>
                                        <span className="text-slate-500">Patient:</span>
                                        <span className="font-medium text-slate-800 ml-2">{paymentPrescription.patient}</span>
                                    </div>
                                    <div>
                                        <span className="text-slate-500">ID:</span>
                                        <span className="font-medium text-slate-800 ml-2">{paymentPrescription.patientId}</span>
                                    </div>
                                    <div>
                                        <span className="text-slate-500">Doctor:</span>
                                        <span className="font-medium text-slate-800 ml-2">{paymentPrescription.doctor}</span>
                                    </div>
                                    <div>
                                        <span className="text-slate-500">Date:</span>
                                        <span className="font-medium text-slate-800 ml-2">{paymentPrescription.date}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Medications Breakdown */}
                            <div className="border border-slate-200 rounded-lg">
                                <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
                                    <h3 className="font-bold text-slate-800">Medications</h3>
                                </div>
                                <div className="p-4 space-y-3">
                                    {(paymentPrescription.medications || []).map((med, idx) => (
                                        <div key={idx} className="flex justify-between items-start pb-3 border-b border-slate-100 last:border-0">
                                            <div className="flex-1">
                                                <p className="font-medium text-slate-800">{med.name}</p>
                                                <p className="text-xs text-slate-500">{med.dosage} - {med.frequency}</p>
                                                <p className="text-xs text-slate-500">Duration: {med.duration}</p>
                                                {med.quantity && <p className="text-xs text-slate-600 mt-1">Quantity: {med.quantity} units</p>}
                                            </div>
                                            <div className="text-right">
                                                {med.unitPrice && (
                                                    <>
                                                        <p className="text-xs text-slate-500">UGX {med.unitPrice.toLocaleString()} × {med.quantity}</p>
                                                        <p className="font-bold text-slate-800">UGX {(med.totalPrice || 0).toLocaleString()}</p>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="bg-emerald-50 px-4 py-3 border-t border-emerald-100">
                                    <div className="flex justify-between items-center">
                                        <span className="font-bold text-slate-800">Total Amount:</span>
                                        <span className="text-2xl font-bold text-emerald-600">
                                            UGX {(paymentPrescription.totalAmount || 0).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Details */}
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Payment Method</label>
                                    <select
                                        value={paymentMethod}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                                    >
                                        <option value="Cash">Cash</option>
                                        <option value="Card">Credit/Debit Card</option>
                                        <option value="Mobile Money">Mobile Money</option>
                                        <option value="Insurance">Insurance</option>
                                        <option value="Bank Transfer">Bank Transfer</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Amount Received {paymentMethod === 'Cash' && '(for change calculation)'}
                                    </label>
                                    <input
                                        type="number"
                                        value={amountReceived}
                                        onChange={(e) => setAmountReceived(e.target.value)}
                                        placeholder={`Enter amount (min: ${paymentAmount})`}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                                    />
                                </div>

                                {amountReceived && parseFloat(amountReceived) >= paymentAmount && paymentMethod === 'Cash' && (
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium text-blue-800">Change:</span>
                                            <span className="text-lg font-bold text-blue-600">
                                                UGX {(parseFloat(amountReceived) - paymentAmount).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={() => setShowPaymentModal(false)}
                                    className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleProcessPayment}
                                    className="flex-1 px-4 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 font-bold shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2"
                                >
                                    <CreditCard size={18} />
                                    Process Payment
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Reset Data Confirmation Modal */}
            {showResetModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
                        <div className="bg-red-500 px-6 py-4 rounded-t-2xl">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <AlertTriangle size={24} />
                                Confirm Data Reset
                            </h2>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                <p className="font-bold text-red-900 mb-2">⚠️ Warning!</p>
                                <p className="text-sm text-red-800">
                                    This will permanently delete ALL data including:
                                </p>
                                <ul className="text-sm text-red-800 mt-2 ml-4 list-disc">
                                    <li>All patient records</li>
                                    <li>All prescriptions and medical records</li>
                                    <li>All inventory items</li>
                                    <li>All financial records and transactions</li>
                                    <li>All appointments and schedules</li>
                                </ul>
                                <p className="text-sm font-bold text-red-900 mt-3">
                                    This action CANNOT be undone!
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">
                                    Type <span className="text-red-600 font-mono">RESET</span> to confirm:
                                </label>
                                <input
                                    id="resetConfirmInput"
                                    type="text"
                                    className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:outline-none focus:border-red-500 font-mono"
                                    placeholder="Type RESET here"
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={() => setShowResetModal(false)}
                                    className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        const input = document.getElementById('resetConfirmInput');
                                        if (input.value === 'RESET') {
                                            performDataReset(
                                                { all: true },
                                                'Manual reset from Pharmacy Settings',
                                                'Pharmacy Admin'
                                            );
                                            setShowResetModal(false);
                                            alert('All data has been reset successfully!');
                                            window.location.reload();
                                        } else {
                                            alert('Please type RESET exactly to confirm.');
                                        }
                                    }}
                                    className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-bold"
                                >
                                    Reset All Data
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div >
    );
};

export default PharmacyDashboard;
