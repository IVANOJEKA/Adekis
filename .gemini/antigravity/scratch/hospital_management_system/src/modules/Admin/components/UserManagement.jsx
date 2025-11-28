import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Edit, Search, CheckCircle, XCircle, Key, Shield, CheckSquare, Square } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

const AVAILABLE_PERMISSIONS = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'reception', label: 'Reception' },
    { id: 'doctor', label: 'Doctor' },
    { id: 'triage', label: 'Triage' },
    { id: 'emr', label: 'EMR' },
    { id: 'pharmacy', label: 'Pharmacy' },
    { id: 'laboratory', label: 'Laboratory' },
    { id: 'pathology', label: 'Pathology' },
    { id: 'radiology', label: 'Radiology' },
    { id: 'bed-management', label: 'Bed Management' },
    { id: 'nursing', label: 'Nursing' },
    { id: 'theatre', label: 'Theatre' },
    { id: 'maternity', label: 'Maternity' },
    { id: 'blood-bank', label: 'Blood Bank' },
    { id: 'ambulance', label: 'Ambulance' },
    { id: 'finance', label: 'Finance' },
    { id: 'insurance', label: 'Insurance' },
    { id: 'hr', label: 'HR Management' },
    { id: 'services', label: 'Services' },
    { id: 'wallet', label: 'Wallet' },
    { id: 'debt', label: 'Debt Management' },
    { id: 'communication', label: 'Communication' },
    { id: 'camps', label: 'Health Camps' },
    { id: 'queue', label: 'Queue Management' },
    { id: 'reports', label: 'Reports' },
    { id: 'admin', label: 'Administration' },
    { id: 'settings', label: 'Settings' },
];

const UserManagement = ({ users = [], setUsers, auditLogs = [], setAuditLogs, showToast }) => {
    const { ROLE_PERMISSIONS } = useAuth();
    const [showUserModal, setShowUserModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('All');
    const [selectedPermissions, setSelectedPermissions] = useState([]);
    const [selectedRole, setSelectedRole] = useState('Doctor');

    const roles = ['All', 'Doctor', 'Nurse', 'Administrator', 'Pharmacist', 'Lab Technician', 'Receptionist', 'Radiologist', 'Finance Officer', 'HR Manager', 'Blood Bank Officer'];
    const departments = ['General Medicine', 'Surgery', 'Pediatrics', 'Cardiology', 'Nursing', 'Pharmacy', 'Laboratory', 'Administration', 'Radiology', 'Finance', 'HR'];

    // Update permissions when role changes in the modal
    useEffect(() => {
        if (showUserModal && !editingUser) {
            // New user: set default permissions for the selected role
            const defaults = ROLE_PERMISSIONS[selectedRole] || [];
            setSelectedPermissions(defaults.includes('*') ? AVAILABLE_PERMISSIONS.map(p => p.id) : defaults);
        } else if (showUserModal && editingUser) {
            // Editing user: set their existing permissions
            // If they have no explicit permissions, fall back to role defaults
            const userPerms = editingUser.permissions || ROLE_PERMISSIONS[editingUser.role] || [];
            setSelectedPermissions(userPerms.includes('*') ? AVAILABLE_PERMISSIONS.map(p => p.id) : userPerms);
        }
    }, [selectedRole, showUserModal, editingUser, ROLE_PERMISSIONS]);

    const handleRoleChange = (e) => {
        const newRole = e.target.value;
        setSelectedRole(newRole);
        // Auto-update permissions to defaults for the new role
        const defaults = ROLE_PERMISSIONS[newRole] || [];
        setSelectedPermissions(defaults.includes('*') ? AVAILABLE_PERMISSIONS.map(p => p.id) : defaults);
    };

    const togglePermission = (permId) => {
        if (selectedPermissions.includes(permId)) {
            setSelectedPermissions(selectedPermissions.filter(id => id !== permId));
        } else {
            setSelectedPermissions([...selectedPermissions, permId]);
        }
    };

    const toggleAllPermissions = () => {
        if (selectedPermissions.length === AVAILABLE_PERMISSIONS.length) {
            setSelectedPermissions([]);
        } else {
            setSelectedPermissions(AVAILABLE_PERMISSIONS.map(p => p.id));
        }
    };

    const logAudit = (action, target) => {
        const newLog = {
            id: `AUD-${String(auditLogs.length + 1).padStart(3, '0')}`,
            timestamp: new Date().toISOString(),
            user: 'System Administrator',
            action,
            target,
            ipAddress: '192.168.1.105',
            status: 'Success'
        };
        setAuditLogs([newLog, ...auditLogs]);
    };

    const handleAddUser = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const newUser = {
            id: `U-${String(users.length + 1).padStart(3, '0')}`,
            name: formData.get('name'),
            role: formData.get('role'),
            department: formData.get('department'),
            status: 'Active',
            email: formData.get('email'),
            phone: formData.get('phone'),
            lastLogin: null,
            permissions: selectedPermissions
        };
        setUsers([...users, newUser]);
        setShowUserModal(false);
        showToast('User added successfully!', 'success');
        logAudit('User Created', newUser.name);
    };

    const handleEditUser = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const updatedUsers = users.map(u =>
            u.id === editingUser.id
                ? {
                    ...u,
                    name: formData.get('name'),
                    role: formData.get('role'),
                    department: formData.get('department'),
                    email: formData.get('email'),
                    phone: formData.get('phone'),
                    permissions: selectedPermissions
                }
                : u
        );
        setUsers(updatedUsers);
        setEditingUser(null);
        setShowUserModal(false);
        showToast('User updated successfully!', 'success');
        logAudit('User Updated', formData.get('name'));
    };

    const toggleUserStatus = (user) => {
        const updatedUsers = users.map(u =>
            u.id === user.id ? { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' } : u
        );
        setUsers(updatedUsers);
        showToast(`User ${user.status === 'Active' ? 'deactivated' : 'activated'}`, 'success');
        logAudit(`User ${user.status === 'Active' ? 'Deactivated' : 'Activated'}`, user.name);
    };

    const openEditModal = (user) => {
        setEditingUser(user);
        setSelectedRole(user.role);
        setShowUserModal(true);
    };

    const filteredUsers = users.filter(u => {
        const matchesSearch = u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.email?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = filterRole === 'All' || u.role === filterRole;
        return matchesSearch && matchesRole;
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">User Management</h2>
                    <p className="text-slate-500 text-sm">Manage system users, roles, and permissions</p>
                </div>
                <button
                    onClick={() => {
                        setEditingUser(null);
                        setSelectedRole('Doctor'); // Default
                        setShowUserModal(true);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2 shadow-lg shadow-blue-200"
                >
                    <UserPlus size={18} />
                    Add New User
                </button>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>
                <select
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                    className="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                    {roles.map(role => (
                        <option key={role} value={role}>{role}</option>
                    ))}
                </select>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase">User</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase">Role</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase">Department</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase">Permissions</th>
                            <th className="px-6 py-3 text-right text-xs font-bold text-slate-600 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredUsers.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                                    <Users size={48} className="mx-auto mb-2 text-slate-300" />
                                    <p>No users found</p>
                                </td>
                            </tr>
                        ) : (
                            filteredUsers.map(user => (
                                <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div>
                                            <div className="font-medium text-slate-800">{user.name}</div>
                                            <div className="text-sm text-slate-500">{user.email}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">{user.department}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${user.status === 'Active'
                                            ? 'bg-emerald-100 text-emerald-700'
                                            : 'bg-slate-100 text-slate-600'
                                            }`}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600 text-sm">
                                        <div className="flex items-center gap-1" title={user.permissions?.join(', ') || 'Default Role Permissions'}>
                                            <Shield size={14} className="text-slate-400" />
                                            <span>
                                                {user.permissions?.includes('*')
                                                    ? 'Full Access'
                                                    : `${user.permissions?.length || 0} Modules`}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => openEditModal(user)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                                title="Edit User"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                onClick={() => toggleUserStatus(user)}
                                                className={`p-2 rounded-lg ${user.status === 'Active'
                                                    ? 'text-red-600 hover:bg-red-50'
                                                    : 'text-emerald-600 hover:bg-emerald-50'
                                                    }`}
                                                title={user.status === 'Active' ? 'Deactivate' : 'Activate'}
                                            >
                                                {user.status === 'Active' ? <XCircle size={16} /> : <CheckCircle size={16} />}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* User Modal */}
            {showUserModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl my-8">
                        <div className="p-6 border-b border-slate-200">
                            <h3 className="text-xl font-bold text-slate-800">
                                {editingUser ? 'Edit User & Permissions' : 'Add New User'}
                            </h3>
                        </div>
                        <form onSubmit={editingUser ? handleEditUser : handleAddUser} className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                                    <input
                                        name="name"
                                        required
                                        defaultValue={editingUser?.name}
                                        placeholder="John Doe"
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
                                    <input
                                        name="email"
                                        type="email"
                                        required
                                        defaultValue={editingUser?.email}
                                        placeholder="john.doe@hospital.com"
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Phone</label>
                                    <input
                                        name="phone"
                                        required
                                        defaultValue={editingUser?.phone}
                                        placeholder="0700123456"
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Department</label>
                                    <select
                                        name="department"
                                        required
                                        defaultValue={editingUser?.department || 'General Medicine'}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    >
                                        {departments.map(dept => (
                                            <option key={dept} value={dept}>{dept}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Role</label>
                                    <select
                                        name="role"
                                        required
                                        value={selectedRole}
                                        onChange={handleRoleChange}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    >
                                        {roles.filter(r => r !== 'All').map(role => (
                                            <option key={role} value={role}>{role}</option>
                                        ))}
                                    </select>
                                </div>
                                {!editingUser && (
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
                                        <input
                                            name="password"
                                            type="password"
                                            required={!editingUser}
                                            placeholder="Minimum 8 characters"
                                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Permissions Section */}
                            <div className="border-t border-slate-200 pt-4">
                                <div className="flex justify-between items-center mb-3">
                                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                        <Shield size={16} className="text-blue-600" />
                                        Module Permissions
                                    </label>
                                    <button
                                        type="button"
                                        onClick={toggleAllPermissions}
                                        className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                                    >
                                        {selectedPermissions.length === AVAILABLE_PERMISSIONS.length ? 'Deselect All' : 'Select All'}
                                    </button>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-60 overflow-y-auto p-2 border border-slate-100 rounded-lg bg-slate-50">
                                    {AVAILABLE_PERMISSIONS.map(perm => (
                                        <div
                                            key={perm.id}
                                            onClick={() => togglePermission(perm.id)}
                                            className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-colors ${selectedPermissions.includes(perm.id)
                                                    ? 'bg-blue-100 text-blue-800'
                                                    : 'hover:bg-slate-200 text-slate-600'
                                                }`}
                                        >
                                            {selectedPermissions.includes(perm.id) ? (
                                                <CheckSquare size={16} className="text-blue-600 flex-shrink-0" />
                                            ) : (
                                                <Square size={16} className="text-slate-400 flex-shrink-0" />
                                            )}
                                            <span className="text-sm font-medium">{perm.label}</span>
                                        </div>
                                    ))}
                                </div>
                                <p className="text-xs text-slate-500 mt-2">
                                    * Permissions are automatically set based on the selected Role, but can be customized here.
                                </p>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowUserModal(false);
                                        setEditingUser(null);
                                    }}
                                    className="flex-1 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold"
                                >
                                    {editingUser ? 'Update User & Permissions' : 'Add User'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;
