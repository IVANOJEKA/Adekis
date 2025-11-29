import React, { useState, useMemo } from 'react';
import { Download, FileText, DollarSign, TrendingUp, TrendingDown, AlertCircle, CheckCircle, Activity, Receipt, Clock, ArrowUpRight, Shield } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useCurrency } from '../../context/CurrencyContext';

// Tab Components
import CashierView from './components/CashierView';
import PaymentsTab from './components/PaymentsTab';
import DebtTab from './components/DebtTab';
import ExpensesTab from './components/ExpensesTab';
import InsuranceTab from './components/InsuranceTab';
import TransactionsTab from './components/TransactionsTab';
import RevenueTab from './components/RevenueTab';
import ReportsTab from './components/ReportsTab';
import PaymentModal from './components/PaymentModal';
import ManualBillingModal from './components/ManualBillingModal';

const FinanceDashboard = () => {
    const {
        financialRecords,
        updateBill,
        addBill,
        clinicalRecords,
        setClinicalRecords,
        patients,
        insuranceClaims,
        debtRecords
    } = useData();

    const { formatCurrency } = useCurrency();
    const [activeTab, setActiveTab] = useState('overview');
    const [selectedPeriod, setSelectedPeriod] = useState('month');
    const [searchTerm, setSearchTerm] = useState('');
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [showManualBillingModal, setShowManualBillingModal] = useState(false);

    // Expenses state (local - should be in DataContext in production)
    const [expenses, setExpenses] = useState([
        { id: 'EXP-001', category: 'Utilities', description: 'Electricity Bill - January', amount: 500000, date: new Date().toISOString().split('T')[0], status: 'Paid', approvedBy: 'Admin' },
        { id: 'EXP-002', category: 'Supplies', description: 'Medical Supplies Purchase', amount: 1200000, date: new Date().toISOString().split('T')[0], status: 'Pending', requestedBy: 'Pharmacist' },
        { id: 'EXP-003', category: 'Salaries', description: 'Staff Salaries - January 2024', amount: 8500000, date: '2024-01-31', status: 'Paid', approvedBy: 'HR Manager' },
        { id: 'EXP-004', category: 'Maintenance', description: 'Equipment Servicing', amount: 350000, date: new Date().toISOString().split('T')[0], status: 'Pending', requestedBy: 'Maintenance' },
    ]);

    // Filter records by period
    const getFilteredRecords = () => {
        const now = new Date();
        return financialRecords.filter(record => {
            const recordDate = new Date(record.date);
            switch (selectedPeriod) {
                case 'today':
                    return recordDate.toDateString() === now.toDateString();
                case 'week':
                    return recordDate >= new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                case 'month':
                    return recordDate.getMonth() === now.getMonth() && recordDate.getFullYear() === now.getFullYear();
                case 'year':
                    return recordDate.getFullYear() === now.getFullYear();
                default:
                    return true;
            }
        });
    };

    const filteredRecords = getFilteredRecords();

    // Calculate comprehensive statistics
    const stats = useMemo(() => {
        const paid = filteredRecords.filter(r => r.status === 'Paid');
        const pending = filteredRecords.filter(r => r.status === 'Pending');

        const totalRevenue = paid.reduce((sum, r) => sum + (r.amount || 0), 0);
        const totalPending = pending.reduce((sum, r) => sum + (r.amount || 0), 0);
        const totalExpenses = expenses.filter(e => e.status === 'Paid').reduce((sum, e) => sum + e.amount, 0);
        const netProfit = totalRevenue - totalExpenses;

        const revenueByType = filteredRecords.reduce((acc, record) => {
            const type = record.type || 'Other';
            acc[type] = (acc[type] || 0) + (record.status === 'Paid' ? record.amount : 0);
            return acc;
        }, {});

        const topSources = Object.entries(revenueByType).sort(([, a], [, b]) => b - a).slice(0, 5);
        const totalDebt = (debtRecords || []).reduce((sum, d) => sum + d.amount, 0);
        const overdueDebt = (debtRecords || []).filter(d => new Date(d.dueDate) < new Date()).reduce((sum, d) => sum + d.amount, 0);
        const insurancePending = (insuranceClaims || []).filter(c => c.status === 'Pending').reduce((sum, c) => sum + c.amount, 0);

        return {
            totalRevenue,
            totalPending,
            totalExpenses,
            netProfit,
            totalDebt,
            overdueDebt,
            insurancePending,
            paidCount: paid.length,
            pendingCount: pending.length,
            collectionRate: filteredRecords.length > 0 ? (paid.length / filteredRecords.length * 100).toFixed(1) : 0,
            avgTransaction: paid.length > 0 ? totalRevenue / paid.length : 0,
            revenueByType,
            topSources
        };
    }, [filteredRecords, expenses, debtRecords, insuranceClaims]);

    // Revenue trend (last 7 days)
    const revenueTrend = useMemo(() => {
        const last7Days = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
            const dayRecords = financialRecords.filter(r =>
                new Date(r.date).toDateString() === date.toDateString() && r.status === 'Paid'
            );
            last7Days.push({
                date: date.toLocaleDateString('en-US', { weekday: 'short' }),
                revenue: dayRecords.reduce((sum, r) => sum + r.amount, 0),
                transactions: dayRecords.length
            });
        }
        return last7Days;
    }, [financialRecords]);

    // Handlers
    const processPayment = async (paymentData) => {
        await updateBill(selectedRecord.id, {
            status: 'Paid',
            paidDate: new Date().toISOString(),
            paymentMethod: paymentData.method,
            reference: paymentData.reference
        });
        setShowPaymentModal(false);
        setSelectedRecord(null);
    };

    const handleAddExpense = (expenseData) => {
        setExpenses([...expenses, {
            id: `EXP-${String(expenses.length + 1).padStart(3, '0')}`,
            ...expenseData,
            date: new Date().toISOString().split('T')[0],
            status: 'Pending'
        }]);
    };

    const handleApproveExpense = (expenseId) => {
        setExpenses(expenses.map(e =>
            e.id === expenseId ? { ...e, status: 'Paid', approvedBy: 'Administrator', approvedDate: new Date().toISOString() } : e
        ));
    };

    // Manual Billing Handler with EMR Sync
    const handleCreateManualBill = (billData) => {
        const billId = `INV-${Date.now()}`;

        // Create financial record via API
        const newBill = {
            id: billId,
            ...billData,
            createdAt: new Date().toISOString(),
            createdBy: 'Manual Entry'
        };
        addBill(newBill);

        // Sync to EMR (Clinical Records)
        const clinicalRecord = {
            id: `CLN-${Date.now()}`,
            patientId: billData.patientId,
            type: 'Financial',
            recordType: 'Manual Bill',
            date: billData.date,
            billId: billId,
            services: billData.lineItems.map(item => ({
                type: item.type,
                description: item.description,
                amount: item.total
            })),
            totalAmount: billData.amount,
            paymentStatus: billData.status,
            paymentMethod: billData.paymentMethod,
            notes: billData.notes,
            createdAt: new Date().toISOString(),
            createdBy: 'Finance - Manual Entry'
        };
        setClinicalRecords([clinicalRecord, ...clinicalRecords]);

        setShowManualBillingModal(false);
        console.log('Manual bill created and synced to EMR:', { bill: newBill, clinicalRecord });
    };

    return (
        <div className="space-y-6 animate-fade-in pb-10">
            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Finance & Accounting</h1>
                    <p className="text-slate-500 text-sm mt-1">Comprehensive financial management, payments, debt, expenses & insurance</p>
                </div>
                <div className="flex gap-3">
                    <select
                        value={selectedPeriod}
                        onChange={(e) => setSelectedPeriod(e.target.value)}
                        className="px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                        <option value="today">Today</option>
                        <option value="week">This Week</option>
                        <option value="month">This Month</option>
                        <option value="year">This Year</option>
                        <option value="all">All Time</option>
                    </select>
                    <button
                        onClick={() => setShowManualBillingModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark text-sm font-medium shadow-lg"
                    >
                        <Receipt size={16} /> Manual Bill
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm font-medium shadow-lg">
                        <Download size={16} /> Report
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 text-sm font-medium shadow-lg">
                        <FileText size={16} /> Export
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex overflow-x-auto border-b border-slate-200">
                {['overview', 'transactions', 'payments', 'debt', 'expenses', 'insurance', 'revenue', 'reports', 'cashier'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-5 py-3 font-medium text-sm whitespace-nowrap transition-colors relative ${activeTab === tab ? 'text-primary border-b-2 border-primary' : 'text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'cashier' && <CashierView />}
            {activeTab === 'payments' && <PaymentsTab financialRecords={filteredRecords} patients={patients} formatCurrency={formatCurrency} onRecordPayment={(r) => { setSelectedRecord(r); setShowPaymentModal(true); }} searchTerm={searchTerm} onSearchChange={setSearchTerm} />}
            {activeTab === 'debt' && <DebtTab debtRecords={debtRecords} patients={patients} formatCurrency={formatCurrency} />}
            {activeTab === 'expenses' && <ExpensesTab expenses={expenses} onAddExpense={handleAddExpense} onApproveExpense={handleApproveExpense} formatCurrency={formatCurrency} />}
            {activeTab === 'insurance' && <InsuranceTab insuranceClaims={insuranceClaims} patients={patients} formatCurrency={formatCurrency} />}
            {activeTab === 'transactions' && <TransactionsTab financialRecords={filteredRecords} patients={patients} formatCurrency={formatCurrency} searchTerm={searchTerm} onSearchChange={setSearchTerm} />}
            {activeTab === 'revenue' && <RevenueTab financialRecords={filteredRecords} formatCurrency={formatCurrency} />}
            {activeTab === 'reports' && <ReportsTab financialRecords={filteredRecords} expenses={expenses} formatCurrency={formatCurrency} />}

            {/* Overview Tab */}
            {activeTab === 'overview' && (
                <div className="space-y-6">
                    {/* KPI Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg">
                            <div className="flex items-center justify-between mb-3">
                                <DollarSign size={24} />
                                <ArrowUpRight size={20} className="text-blue-200" />
                            </div>
                            <p className="text-blue-100 text-sm font-medium">Total Revenue</p>
                            <p className="text-3xl font-bold mt-2">{formatCurrency(stats.totalRevenue)}</p>
                            <p className="text-blue-200 text-xs mt-2">{stats.paidCount} paid</p>
                        </div>
                        <div className="bg-gradient-to-br from-amber-500 to-amber-600 text-white p-6 rounded-xl shadow-lg">
                            <div className="flex items-center justify-between mb-3">
                                <AlertCircle size={24} />
                                <Clock size={20} className="text-amber-200" />
                            </div>
                            <p className="text-amber-100 text-sm font-medium">Pending</p>
                            <p className="text-3xl font-bold mt-2">{formatCurrency(stats.totalPending)}</p>
                            <p className="text-amber-200 text-xs mt-2">{stats.pendingCount} invoices</p>
                        </div>
                        <div className="bg-gradient-to-br from-red-500 to-red-600 text-white p-6 rounded-xl shadow-lg">
                            <div className="flex items-center justify-between mb-3">
                                <TrendingDown size={24} />
                                <Activity size={20} className="text-red-200" />
                            </div>
                            <p className="text-red-100 text-sm font-medium">Expenses</p>
                            <p className="text-3xl font-bold mt-2">{formatCurrency(stats.totalExpenses)}</p>
                            <p className="text-red-200 text-xs mt-2">{expenses.filter(e => e.status === 'Paid').length} paid</p>
                        </div>
                        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white p-6 rounded-xl shadow-lg">
                            <div className="flex items-center justify-between mb-3">
                                <TrendingUp size={24} />
                                <CheckCircle size={20} className="text-emerald-200" />
                            </div>
                            <p className="text-emerald-100 text-sm font-medium">Net Profit</p>
                            <p className="text-3xl font-bold mt-2">{formatCurrency(stats.netProfit)}</p>
                            <p className="text-emerald-200 text-xs mt-2">This {selectedPeriod}</p>
                        </div>
                    </div>

                    {/* Revenue Trend Chart */}
                    <div className="bg-white border border-slate-200 p-6 rounded-xl">
                        <h3 className="text-lg font-bold text-slate-800 mb-6">7-Day Revenue Trend</h3>
                        <div className="flex items-end justify-between gap-2 h-48">
                            {revenueTrend.map((day, index) => {
                                const maxRevenue = Math.max(...revenueTrend.map(d => d.revenue));
                                const height = maxRevenue > 0 ? (day.revenue / maxRevenue * 100) : 0;
                                return (
                                    <div key={index} className="flex-1 flex flex-col items-center gap-2">
                                        <div className="w-full bg-blue-500 rounded-t-lg hover:bg-blue-600 relative group"
                                            style={{ height: `${height}%`, minHeight: day.revenue > 0 ? '8px' : '2px' }}>
                                            <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap z-10">
                                                {formatCurrency(day.revenue)} • {day.transactions} txns
                                            </div>
                                        </div>
                                        <span className="text-xs text-slate-600 font-medium">{day.date}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Additional Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-white border border-slate-200 p-5 rounded-xl">
                            <span className="text-sm font-medium text-slate-600">Collection Rate</span>
                            <p className="text-2xl font-bold text-slate-800 mt-2">{stats.collectionRate}%</p>
                            <div className="mt-3 w-full bg-slate-100 rounded-full h-2">
                                <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${stats.collectionRate}%` }} />
                            </div>
                        </div>
                        <div className="bg-white border border-slate-200 p-5 rounded-xl">
                            <span className="text-sm font-medium text-slate-600">Avg Transaction</span>
                            <p className="text-2xl font-bold text-slate-800 mt-2">{formatCurrency(stats.avgTransaction)}</p>
                        </div>
                        <div className="bg-white border border-slate-200 p-5 rounded-xl">
                            <span className="text-sm font-medium text-slate-600">Outstanding Debt</span>
                            <p className="text-2xl font-bold text-slate-800 mt-2">{formatCurrency(stats.totalDebt)}</p>
                            <p className="text-xs text-red-600 mt-1">Overdue: {formatCurrency(stats.overdueDebt)}</p>
                        </div>
                        <div className="bg-white border border-slate-200 p-5 rounded-xl">
                            <span className="text-sm font-medium text-slate-600">Insurance Pending</span>
                            <p className="text-2xl font-bold text-slate-800 mt-2">{formatCurrency(stats.insurancePending)}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Payment Modal */}
            {showPaymentModal && selectedRecord && (
                <PaymentModal
                    record={selectedRecord}
                    patient={patients.find(p => p.id === selectedRecord.patientId)}
                    onClose={() => { setShowPaymentModal(false); setSelectedRecord(null); }}
                    onProcess={processPayment}
                    formatCurrency={formatCurrency}
                />
            )}

            {/* Manual Billing Modal */}
            {showManualBillingModal && (
                <ManualBillingModal
                    patients={patients}
                    onClose={() => setShowManualBillingModal(false)}
                    onCreate={handleCreateManualBill}
                    formatCurrency={formatCurrency}
                />
            )}
        </div>
    );
};

export default FinanceDashboard;
