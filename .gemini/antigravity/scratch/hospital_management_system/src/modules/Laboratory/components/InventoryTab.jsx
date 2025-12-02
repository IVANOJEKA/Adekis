import React, { useState, useEffect } from 'react';
import { Package, Plus, TrendingDown, AlertTriangle, Edit2, Trash2, ArrowUpCircle, ArrowDownCircle, RefreshCw } from 'lucide-react';
import { labInventoryAPI } from '../../../services/api';

const InventoryTab = () => {
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showTransactionModal, setShowTransactionModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [lowStockOnly, setLowStockOnly] = useState(false);

    useEffect(() => {
        fetchInventory();
    }, [lowStockOnly]);

    const fetchInventory = async () => {
        try {
            setLoading(true);
            const data = await labInventoryAPI.getAll({ lowStock: lowStockOnly });
            setInventory(data);
        } catch (error) {
            console.error('Error fetching inventory:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddItem = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        try {
            const itemData = {
                itemName: formData.get('itemName'),
                itemCode: formData.get('itemCode'),
                category: formData.get('category'),
                unit: formData.get('unit'),
                quantity: formData.get('quantity'),
                minimumLevel: formData.get('minimumLevel'),
                supplier: formData.get('supplier'),
                expiryDate: formData.get('expiryDate') || null,
                costPerUnit: formData.get('costPerUnit')
            };

            await labInventoryAPI.add(itemData);
            setShowAddModal(false);
            fetchInventory();
        } catch (error) {
            console.error('Error adding item:', error);
            alert('Failed to add item');
        }
    };

    const handleTransaction = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        try {
            const transactionData = {
                inventoryId: selectedItem.id,
                type: formData.get('type'),
                quantity: formData.get('quantity'),
                reason: formData.get('reason')
            };

            await labInventoryAPI.recordTransaction(transactionData);
            setShowTransactionModal(false);
            setSelectedItem(null);
            fetchInventory();
        } catch (error) {
            console.error('Error recording transaction:', error);
            alert('Failed to record transaction');
        }
    };

    const handleDeleteItem = async (id) => {
        if (!confirm('Are you sure you want to delete this item?')) return;

        try {
            await labInventoryAPI.delete(id);
            fetchInventory();
        } catch (error) {
            console.error('Error deleting item:', error);
            alert('Failed to delete item');
        }
    };

    const isLowStock = (item) => item.quantity <= item.minimumLevel;
    const isExpiringSoon = (item) => {
        if (!item.expiryDate) return false;
        const daysUntilExpiry = Math.ceil((new Date(item.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
        return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
    };

    const categories = ['Reagent', 'Equipment', 'Consumable'];
    const units = ['ml', 'L', 'pieces', 'kg', 'g', 'boxes'];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-bold text-slate-800">Laboratory Inventory</h3>
                    <p className="text-sm text-slate-500">Manage lab supplies and reagents</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setLowStockOnly(!lowStockOnly)}
                        className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${lowStockOnly
                                ? 'bg-orange-600 text-white'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                    >
                        {lowStockOnly ? 'Show All' : 'Low Stock Only'}
                    </button>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="btn btn-primary gap-2"
                    >
                        <Plus size={16} />
                        Add Item
                    </button>
                </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="card p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 rounded-lg">
                            <Package size={20} className="text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">Total Items</p>
                            <p className="text-xl font-bold text-slate-800">{inventory.length}</p>
                        </div>
                    </div>
                </div>
                <div className="card p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-50 rounded-lg">
                            <TrendingDown size={20} className="text-orange-600" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">Low Stock</p>
                            <p className="text-xl font-bold text-slate-800">
                                {inventory.filter(isLowStock).length}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="card p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-50 rounded-lg">
                            <AlertTriangle size={20} className="text-red-600" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">Expiring Soon</p>
                            <p className="text-xl font-bold text-slate-800">
                                {inventory.filter(isExpiringSoon).length}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="card p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-50 rounded-lg">
                            <Package size={20} className="text-emerald-600" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">Categories</p>
                            <p className="text-xl font-bold text-slate-800">
                                {[...new Set(inventory.map(i => i.category))].length}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Inventory Table */}
            <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">Item Code</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">Item Name</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">Category</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">Quantity</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">Min Level</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">Supplier</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">Expiry</th>
                                <th className="px-4 py-3 text-right text-sm font-medium text-slate-600">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {loading ? (
                                <tr>
                                    <td colSpan="8" className="px-4 py-8 text-center text-slate-500">
                                        Loading inventory...
                                    </td>
                                </tr>
                            ) : inventory.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="px-4 py-8 text-center text-slate-500">
                                        No inventory items found
                                    </td>
                                </tr>
                            ) : (
                                inventory.map(item => (
                                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-4 py-3 font-medium text-slate-900">{item.itemCode}</td>
                                        <td className="px-4 py-3 text-slate-800">{item.itemName}</td>
                                        <td className="px-4 py-3">
                                            <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs font-medium">
                                                {item.category}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`font-medium ${isLowStock(item) ? 'text-orange-600' : 'text-slate-800'}`}>
                                                {item.quantity} {item.unit}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-slate-600">{item.minimumLevel} {item.unit}</td>
                                        <td className="px-4 py-3 text-slate-600">{item.supplier || 'N/A'}</td>
                                        <td className="px-4 py-3">
                                            {item.expiryDate ? (
                                                <span className={isExpiringSoon(item) ? 'text-red-600 font-medium' : 'text-slate-600'}>
                                                    {new Date(item.expiryDate).toLocaleDateString()}
                                                </span>
                                            ) : (
                                                <span className="text-slate-400">N/A</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => {
                                                        setSelectedItem(item);
                                                        setShowTransactionModal(true);
                                                    }}
                                                    className="text-blue-600 hover:text-blue-800"
                                                    title="Record Transaction"
                                                >
                                                    <RefreshCw size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteItem(item.id)}
                                                    className="text-red-600 hover:text-red-800"
                                                    title="Delete Item"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Item Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-slate-200">
                            <h3 className="text-lg font-bold text-slate-800">Add Inventory Item</h3>
                        </div>
                        <form onSubmit={handleAddItem} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Item Name *</label>
                                    <input name="itemName" required type="text" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Item Code *</label>
                                    <input name="itemCode" required type="text" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Category *</label>
                                    <select name="category" required className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none">
                                        <option value="">Select Category</option>
                                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Unit *</label>
                                    <select name="unit" required className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none">
                                        <option value="">Select Unit</option>
                                        {units.map(unit => <option key={unit} value={unit}>{unit}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Initial Quantity *</label>
                                    <input name="quantity" required type="number" min="0" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Minimum Level *</label>
                                    <input name="minimumLevel" required type="number" min="0" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Supplier</label>
                                    <input name="supplier" type="text" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Cost Per Unit *</label>
                                    <input name="costPerUnit" required type="number" step="0.01" min="0" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Expiry Date</label>
                                <input name="expiryDate" type="date" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none" />
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium">Cancel</button>
                                <button type="submit" className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark font-medium">Add Item</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Transaction Modal */}
            {showTransactionModal && selectedItem && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
                        <div className="p-6 border-b border-slate-200">
                            <h3 className="text-lg font-bold text-slate-800">Record Transaction</h3>
                            <p className="text-sm text-slate-500 mt-1">{selectedItem.itemName} ({selectedItem.itemCode})</p>
                        </div>
                        <form onSubmit={handleTransaction} className="p-6 space-y-4">
                            <div>
                                <p className="text-sm text-slate-600 mb-2">
                                    <span className="font-medium">Current Stock:</span> {selectedItem.quantity} {selectedItem.unit}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Transaction Type *</label>
                                <select name="type" required className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none">
                                    <option value="">Select Type</option>
                                    <option value="In">Stock In</option>
                                    <option value="Out">Stock Out</option>
                                    <option value="Adjusted">Adjustment</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Quantity *</label>
                                <input name="quantity" required type="number" min="1" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Reason *</label>
                                <textarea name="reason" required rows="3" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none resize-none"></textarea>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={() => { setShowTransactionModal(false); setSelectedItem(null); }} className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium">Cancel</button>
                                <button type="submit" className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark font-medium">Record Transaction</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InventoryTab;
