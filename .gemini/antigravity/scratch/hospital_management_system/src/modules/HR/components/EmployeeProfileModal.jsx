import React, { useState } from 'react';
import { X, Mail, Phone, MapPin, Calendar, Briefcase, DollarSign, Edit2, Trash2, Save } from 'lucide-react';

const EmployeeProfileModal = ({ show, employee, onClose, onUpdate, onDelete, departments }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(employee || {});

    if (!show || !employee) return null;

    const handleSave = () => {
        onUpdate(employee.id, formData);
        setIsEditing(false);
    };

    const handleDelete = () => {
        if (window.confirm(`Are you sure you want to delete ${employee.name}? This action cannot be undone.`)) {
            onDelete(employee.id);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="p-6 border-b border-slate-200 flex justify-between items-start sticky top-0 bg-white z-10">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold">
                            {employee.name.charAt(0)}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-800">{employee.name}</h2>
                            <p className="text-slate-600">{employee.role}</p>
                            <span className={`inline-block mt-1 px-2 py-1 text-xs font-bold rounded ${employee.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                }`}>
                                {employee.status}
                            </span>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        {!isEditing ? (
                            <>
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="p-2 hover:bg-slate-100 rounded-lg transition"
                                    title="Edit"
                                >
                                    <Edit2 size={20} />
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition"
                                    title="Delete"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={handleSave}
                                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition flex items-center gap-2"
                            >
                                <Save size={18} />
                                Save Changes
                            </button>
                        )}
                        <button
                            onClick={() => {
                                setIsEditing(false);
                                setFormData(employee);
                                onClose();
                            }}
                            className="p-2 hover:bg-slate-100 rounded-lg transition"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Employee ID */}
                    <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                        <p className="text-sm font-medium text-emerald-800">
                            Employee ID: <span className="font-bold text-emerald-600">{employee.id}</span>
                        </p>
                    </div>

                    {/* Contact Information */}
                    <div>
                        <h3 className="text-lg font-bold text-slate-800 mb-3">Contact Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center gap-3">
                                <Mail className="text-slate-400" size={20} />
                                {isEditing ? (
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="flex-1 px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                    />
                                ) : (
                                    <div>
                                        <p className="text-xs text-slate-500">Email</p>
                                        <p className="text-slate-800">{employee.email}</p>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center gap-3">
                                <Phone className="text-slate-400" size={20} />
                                {isEditing ? (
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="flex-1 px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                    />
                                ) : (
                                    <div>
                                        <p className="text-xs text-slate-500">Phone</p>
                                        <p className="text-slate-800">{employee.phone}</p>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center gap-3 md:col-span-2">
                                <MapPin className="text-slate-400" size={20} />
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        className="flex-1 px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                    />
                                ) : (
                                    <div>
                                        <p className="text-xs text-slate-500">Address</p>
                                        <p className="text-slate-800">{employee.address || 'Not provided'}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Employment Details */}
                    <div>
                        <h3 className="text-lg font-bold text-slate-800 mb-3">Employment Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center gap-3">
                                <Briefcase className="text-slate-400" size={20} />
                                {isEditing ? (
                                    <div className="flex-1">
                                        <label className="block text-xs text-slate-500 mb-1">Department</label>
                                        <select
                                            value={formData.department}
                                            onChange={(e) => {
                                                const selectedDept = departments.find(d => d.id === e.target.value);
                                                setFormData({
                                                    ...formData,
                                                    department: e.target.value,
                                                    departmentName: selectedDept?.name || ''
                                                });
                                            }}
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                        >
                                            {departments?.map(dept => (
                                                <option key={dept.id} value={dept.id}>{dept.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                ) : (
                                    <div>
                                        <p className="text-xs text-slate-500">Department</p>
                                        <p className="text-slate-800">{employee.departmentName}</p>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center gap-3">
                                <Calendar className="text-slate-400" size={20} />
                                {isEditing ? (
                                    <div className="flex-1">
                                        <label className="block text-xs text-slate-500 mb-1">Employment Type</label>
                                        <select
                                            value={formData.employmentType}
                                            onChange={(e) => setFormData({ ...formData, employmentType: e.target.value })}
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                        >
                                            <option value="Full-Time">Full-Time</option>
                                            <option value="Part-Time">Part-Time</option>
                                            <option value="Contract">Contract</option>
                                            <option value="Intern">Intern</option>
                                            <option value="Temporary">Temporary</option>
                                        </select>
                                    </div>
                                ) : (
                                    <div>
                                        <p className="text-xs text-slate-500">Employment Type</p>
                                        <p className="text-slate-800">{employee.employmentType}</p>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center gap-3">
                                <DollarSign className="text-slate-400" size={20} />
                                {isEditing ? (
                                    <div className="flex-1">
                                        <label className="block text-xs text-slate-500 mb-1">Monthly Salary (UGX)</label>
                                        <input
                                            type="number"
                                            value={formData.salary}
                                            onChange={(e) => setFormData({ ...formData, salary: parseInt(e.target.value) })}
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                        />
                                    </div>
                                ) : (
                                    <div>
                                        <p className="text-xs text-slate-500">Salary</p>
                                        <p className="text-slate-800">UGX {employee.salary?.toLocaleString()}</p>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center gap-3">
                                <Calendar className="text-slate-400" size={20} />
                                {isEditing ? (
                                    <div className="flex-1">
                                        <label className="block text-xs text-slate-500 mb-1">Join Date</label>
                                        <input
                                            type="date"
                                            value={formData.joinDate}
                                            onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })}
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                        />
                                    </div>
                                ) : (
                                    <div>
                                        <p className="text-xs text-slate-500">Join Date</p>
                                        <p className="text-slate-800">{employee.joinDate}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Leave Balance */}
                    {employee.leaveBalance && (
                        <div>
                            <h3 className="text-lg font-bold text-slate-800 mb-3">Leave Balance</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-blue-50 rounded-lg">
                                    <p className="text-sm text-slate-600">Annual Leave</p>
                                    <p className="text-2xl font-bold text-blue-700">{employee.leaveBalance.annual} days</p>
                                </div>
                                <div className="p-4 bg-green-50 rounded-lg">
                                    <p className="text-sm text-slate-600">Sick Leave</p>
                                    <p className="text-2xl font-bold text-green-700">{employee.leaveBalance.sick} days</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Status Toggle */}
                    {isEditing && (
                        <div>
                            <h3 className="text-lg font-bold text-slate-800 mb-3">Status</h3>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            >
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                                <option value="On Leave">On Leave</option>
                                <option value="Suspended">Suspended</option>
                            </select>
                        </div>
                    )}
                </div>

                {/* Footer */}
                {!isEditing && (
                    <div className="p-6 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-100 transition font-medium"
                        >
                            Close
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EmployeeProfileModal;
