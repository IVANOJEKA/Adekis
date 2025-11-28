import React, { useState } from 'react';
import { Package, CheckCircle, AlertCircle, Plus, X } from 'lucide-react';

const ExpensesTab = ({ expenses, onAddExpense, onApproveExpense, formatCurrency }) => {
    const [showAddModal, setShowAddModal] = useState(false);
    const [newExpense, setNewExpense] = useState({
        category: 'Supplies',
        description: '',
        amount: '',
        requestedBy: 'Administrator'
    });

    const totalExpenses = expenses.filter(e => e.status === 'Paid').reduce((sum, e) => sum + e.amount, 0);
    const pendingExpenses = expenses.filter(e => e.status === 'Pending');

    const handleSubmit = (e) => {
        e.preventDefault();
        onAddExpense(newExpense);
        setNewExpense({ category: 'Supplies', description: '', amount: '', requestedBy: 'Administrator' });
        setShowAddModal(false);
    };

    const categories = ['Utilities', 'Supplies', 'Salaries', 'Maintenance', 'Equipment', 'Other'];

    return (
        <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-red-50 border-2 border-red-200 p-5 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-red-700">Total Expenses</span>
                        <Package size={20} className="text-red-500" />
                    </div>
                    <p className="text-2xl font-bold text-red-900">{formatCurrency(totalExpenses)}</p>
                    <p className="text-sm text-red-600 mt-1">{expenses.filter(e => e.status === 'Paid').length} paid</p>
                </div>

                <div className="bg-amber-50 border-2 border-amber-200 p-5 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-amber-700">Pending Approval</span>
                        <AlertCircle size={20} className="text-amber-500" />
                    </div>
                    <p className="text-2xl font-bold text-amber-900">{pendingExpenses.length}</p>
                    <p className="text-sm text-amber-600 mt-1">
                        {formatCurrency(pendingExpenses.reduce((sum, e) => sum + e.amount, 0))}
                    </p>
                </div>

                <div className="bg-blue-50 border-2 border-blue-200 p-5 rounded-xl flex items-center justify-center">
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium transition-colors shadow-lg"
                    >
                        <Plus size={20} />
                        Add New Expense
                    </button>
                </div>
            </div>

            {/* Expenses by Category */}
            <div className="bg-white border border-slate-200 p-6 rounded-xl">
                <h3 className="font-bold text-slate-800 mb-4">Expenses by Category</h3>
                <div className="space-y-3">
                    {categories.map(category => {
                        const categoryExpenses = expenses.filter(e => e.category === category && e.status === 'Paid');
                        const total = categoryExpenses.reduce((sum, e) => sum + e.amount, 0);
                        const percentage = totalExpenses > 0 ? (total / totalExpenses * 100).toFixed(1) : 0;

                        if (total === 0) return null;

                        return (
                            <div key={category} className="flex items-center gap-4">
                                <div className="flex-shrink-0 w-28">
                                    <span className="text-sm font-medium text-slate-700">{category}</span>
                                </div>
                                <div className="flex-1">
                                    <div className="w-full bg-slate-100 rounded-full h-3">
                                        <div
                                            className="bg-red-500 h-3 rounded-full"
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                </div>
                                <div className="flex-shrink-0 w-32 text-right">
                                    <span className="text-sm font-bold text-slate-900">{formatCurrency(total)}</span>
                                    <span className="text-xs text-slate-500 ml-2">({percentage}%)</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Pending Approval */}
            {pendingExpenses.length > 0 && (
                <div className="bg-amber-50 border-2 border-amber-200 p-6 rounded-xl">
                    <h3 className="font-bold text-amber-900 mb-4">Pending Approval ({pendingExpenses.length})</h3>
                    <div className="space-y-3">
                        {pendingExpenses.map(expense => (
                            <div key={expense.id} className="bg-white p-4 rounded-lg flex items-center justify-between">
                                <div className="flex-1">
                                    <p className="font-bold text-slate-900">{expense.description}</p>
                                    <p className="text-sm text-slate-600">
                                        {expense.category} • Requested by {expense.requestedBy} • {new Date(expense.date).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-lg font-bold text-slate-900">{formatCurrency(expense.amount)}</span>
                                    <button
                                        onClick={() => onApproveExpense(expense.id)}
                                        className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 text-sm font-medium"
                                    >
                                        <CheckCircle size={16} className="inline mr-1" />
                                        Approve
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* All Expenses */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200">
                    <h3 className="font-bold text-slate-800">All Expenses</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase">Description</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase">Category</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase">Amount</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {expenses.map(expense => (
                                <tr key={expense.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 font-mono text-sm font-semibold text-slate-900">{expense.id}</td>
                                    <td className="px-6 py-4">
                                        <p className="font-medium text-slate-900">{expense.description}</p>
                                        <p className="text-xs text-slate-500">
                                            {expense.status === 'Paid' ? `Approved by ${expense.approvedBy}` : `Requested by ${expense.requestedBy}`}
                                        </p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                                            {expense.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-slate-900">{formatCurrency(expense.amount)}</td>
                                    <td className="px-6 py-4 text-sm text-slate-600">{new Date(expense.date).toLocaleDateString()}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${expense.status === 'Paid'
                                            ? 'bg-emerald-100 text-emerald-700'
                                            : 'bg-amber-100 text-amber-700'
                                            }`}>
                                            {expense.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Expense Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
                        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-slate-800">Add New Expense</h2>
                            <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
                                <select
                                    value={newExpense.category}
                                    onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    required
                                >
                                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                                <input
                                    type="text"
                                    value={newExpense.description}
                                    onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Amount</label>
                                <input
                                    type="number"
                                    value={newExpense.amount}
                                    onChange={(e) => setNewExpense({ ...newExpense, amount: Number(e.target.value) })}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    required
                                />
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="flex-1 px-4 py-2.5 border-2 border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-dark font-medium"
                                >
                                    Add Expense
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExpensesTab;
