import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, Clock, AlertCircle, CheckCircle, Bell } from 'lucide-react';
import { labAPI } from '../../../services/api';

const CommunicationTab = () => {
    const [pendingTests, setPendingTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTest, setSelectedTest] = useState(null);
    const [notificationMessage, setNotificationMessage] = useState('');
    const [sending, setSending] = useState(false);

    useEffect(() => {
        fetchPendingTests();
    }, []);

    const fetchPendingTests = async () => {
        try {
            setLoading(true);
            const data = await labAPI.getPendingTests();
            setPendingTests(data);
        } catch (error) {
            console.error('Error fetching pending tests:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSendNotification = async () => {
        if (!selectedTest || !notificationMessage.trim()) return;

        try {
            setSending(true);
            await labAPI.notifyDoctor(selectedTest.id, notificationMessage);
            alert(`Notification sent to ${selectedTest.orderedBy}`);
            setSelectedTest(null);
            setNotificationMessage('');
        } catch (error) {
            console.error('Error sending notification:', error);
            alert('Failed to send notification');
        } finally {
            setSending(false);
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'STAT':
                return 'bg-red-100 text-red-700 border-red-300';
            case 'Urgent':
                return 'bg-orange-100 text-orange-700 border-orange-300';
            default:
                return 'bg-blue-100 text-blue-700 border-blue-300';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-bold text-slate-800">Doctor Communication</h3>
                    <p className="text-sm text-slate-500">Manage test orders and send result notifications</p>
                </div>
                <button
                    onClick={fetchPendingTests}
                    className="btn btn-secondary gap-2"
                >
                    <Bell size={16} />
                    Refresh
                </button>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="card p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-50 rounded-lg">
                            <AlertCircle size={20} className="text-red-600" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">STAT Orders</p>
                            <p className="text-xl font-bold text-slate-800">
                                {pendingTests.filter(t => t.priority === 'STAT').length}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="card p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-50 rounded-lg">
                            <Clock size={20} className="text-orange-600" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">Urgent Orders</p>
                            <p className="text-xl font-bold text-slate-800">
                                {pendingTests.filter(t => t.priority === 'Urgent').length}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="card p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 rounded-lg">
                            <CheckCircle size={20} className="text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">Total Pending</p>
                            <p className="text-xl font-bold text-slate-800">{pendingTests.length}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Pending Tests List */}
            <div className="card overflow-hidden">
                <div className="p-4 border-b border-slate-200 bg-slate-50">
                    <h4 className="font-semibold text-slate-800">Pending Test Orders</h4>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">Priority</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">Test ID</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">Patient</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">Test Name</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">Ordered By</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">Ordered At</th>
                                <th className="px-4 py-3 text-right text-sm font-medium text-slate-600">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="px-4 py-8 text-center text-slate-500">
                                        Loading pending tests...
                                    </td>
                                </tr>
                            ) : pendingTests.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-4 py-8 text-center text-slate-500">
                                        No pending test orders
                                    </td>
                                </tr>
                            ) : (
                                pendingTests.map(test => (
                                    <tr key={test.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 rounded text-xs font-medium border ${getPriorityColor(test.priority)}`}>
                                                {test.priority}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 font-medium text-slate-900">{test.testId}</td>
                                        <td className="px-4 py-3 text-slate-600">{test.patient?.name || 'N/A'}</td>
                                        <td className="px-4 py-3 text-slate-800">{test.testName}</td>
                                        <td className="px-4 py-3 text-slate-600">{test.orderedBy}</td>
                                        <td className="px-4 py-3 text-slate-600">
                                            {new Date(test.orderedAt).toLocaleString()}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <button
                                                onClick={() => setSelectedTest(test)}
                                                className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                                            >
                                                Notify
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Notification Modal */}
            {selectedTest && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
                        <div className="p-6 border-b border-slate-200">
                            <h3 className="text-lg font-bold text-slate-800">Send Notification</h3>
                            <p className="text-sm text-slate-500 mt-1">
                                {selectedTest.testId} - {selectedTest.testName}
                            </p>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <p className="text-sm text-slate-600 mb-2">
                                    <span className="font-medium">Doctor:</span> {selectedTest.orderedBy}
                                </p>
                                <p className="text-sm text-slate-600">
                                    <span className="font-medium">Patient:</span> {selectedTest.patient?.name}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Message
                                </label>
                                <textarea
                                    value={notificationMessage}
                                    onChange={(e) => setNotificationMessage(e.target.value)}
                                    placeholder="Enter notification message..."
                                    rows="4"
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                                ></textarea>
                            </div>
                        </div>
                        <div className="p-6 border-t border-slate-200 flex gap-3">
                            <button
                                onClick={() => {
                                    setSelectedTest(null);
                                    setNotificationMessage('');
                                }}
                                className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSendNotification}
                                disabled={sending || !notificationMessage.trim()}
                                className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                <Send size={16} />
                                {sending ? 'Sending...' : 'Send Notification'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CommunicationTab;
