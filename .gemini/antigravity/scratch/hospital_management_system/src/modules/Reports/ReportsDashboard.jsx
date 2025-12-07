import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { FileText, Download, Printer, Calendar, Filter, Search, TrendingUp, Users, DollarSign, Activity, TestTube, Pill, Hotel, X, FileBarChart, Archive, Eye, RefreshCw, Clock, Mail, Send, Plus, Trash2, Edit } from 'lucide-react';

const ReportsDashboard = () => {
    const [activeTab, setActiveTab] = useState('all-reports');
    const [dateRange, setDateRange] = useState('today');
    const [departmentFilter, setDepartmentFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedReport, setSelectedReport] = useState(null);
    const [showCustomReportModal, setShowCustomReportModal] = useState(false);
    const [showScheduleModal, setShowScheduleModal] = useState(false);
    const [exportFormat, setExportFormat] = useState('pdf');
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    // Custom report form state
    const [customReport, setCustomReport] = useState({
        name: '',
        type: 'Financial',
        department: 'all',
        dateRange: 'last-7-days',
        startDate: '',
        endDate: '',
        includeFields: {
            patientDetails: true,
            financialData: true,
            clinicalData: true,
            timestamps: true,
            staffInfo: false,
            billingInfo: true,
            treatmentPlans: false,
            medications: false,
        }
    });

    // Schedule report state
    const [scheduleConfig, setScheduleConfig] = useState({
        reportId: '',
        frequency: 'daily',
        time: '08:00',
        recipients: '',
        format: 'pdf'
    });

    // Mock data for reports
    const [reports, setReports] = useState([
        // Financial Reports
        { id: 'REP-001', title: 'Daily Revenue Report', type: 'Financial', department: 'Finance', date: '2024-01-20', generatedBy: 'System', status: 'Ready', size: '2.4 MB', records: 142, scheduled: false },
        { id: 'REP-002', title: 'Monthly Financial Summary', type: 'Financial', department: 'Finance', date: '2024-01-20', generatedBy: 'Finance Manager', status: 'Ready', size: '5.1 MB', records: 2847, scheduled: true },
        { id: 'REP-003', title: 'Payment Methods Analysis', type: 'Financial', department: 'Finance', date: '2024-01-20', generatedBy: 'System', status: 'Ready', size: '1.8 MB', records: 523, scheduled: false },

        // Clinical Reports
        { id: 'REP-004', title: 'Laboratory Tests Summary', type: 'Clinical', department: 'Laboratory', date: '2024-01-20', generatedBy: 'Lab Supervisor', status: 'Ready', size: '3.2 MB', records: 248, scheduled: true },
        { id: 'REP-005', title: 'Radiology Imaging Report', type: 'Clinical', department: 'Radiology', date: '2024-01-20', generatedBy: 'Radiologist', status: 'Ready', size: '12.5 MB', records: 67, scheduled: false },
        { id: 'REP-006', title: 'Pharmacy Dispensing Report', type: 'Clinical', department: 'Pharmacy', date: '2024-01-20', generatedBy: 'Chief Pharmacist', status: 'Ready', size: '4.7 MB', records: 456, scheduled: true },

        // Operational Reports
        { id: 'REP-007', title: 'Bed Occupancy Report', type: 'Operational', department: 'Bed Management', date: '2024-01-20', generatedBy: 'System', status: 'Ready', size: '876 KB', records: 89, scheduled: false },
        { id: 'REP-008', title: 'Patient Visits Summary', type: 'Operational', department: 'Reception', date: '2024-01-20', generatedBy: 'Reception Manager', status: 'Ready', size: '2.1 MB', records: 312, scheduled: false },
        { id: 'REP-009', title: 'Staff Attendance Report', type: 'Operational', department: 'HR', date: '2024-01-20', generatedBy: 'HR Manager', status: 'Ready', size: '1.5 MB', records: 156, scheduled: true },

        // Patient Reports
        { id: 'REP-010', title: 'Patient Demographics Report', type: 'Patient', department: 'EMR', date: '2024-01-20', generatedBy: 'System', status: 'Ready', size: '3.8 MB', records: 1245, scheduled: false },
        { id: 'REP-011', title: 'Maternity Services Report', type: 'Patient', department: 'Maternity', date: '2024-01-20', generatedBy: 'Maternity Supervisor', status: 'Ready', size: '2.3 MB', records: 34, scheduled: false },

        // Insurance Reports
        { id: 'REP-012', title: 'Insurance Claims Report', type: 'Financial', department: 'Insurance', date: '2024-01-20', generatedBy: 'Insurance Officer', status: 'Ready', size: '4.2 MB', records: 89, scheduled: true },

        // Quality Reports
        { id: 'REP-013', title: 'Quality Assurance Report', type: 'Quality', department: 'Admin', date: '2024-01-20', generatedBy: 'Quality Manager', status: 'Processing', size: '-', records: 0, scheduled: false },
        { id: 'REP-014', title: 'Patient Satisfaction Survey', type: 'Quality', department: 'Admin', date: '2024-01-20', generatedBy: 'System', status: 'Ready', size: '1.2 MB', records: 178, scheduled: false },
    ]);

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
    };

    // Stats
    const stats = [
        { label: 'Total Reports', value: reports.length, icon: FileText, color: 'blue' },
        { label: 'Generated Today', value: reports.filter(r => r.date === '2024-01-20').length, icon: Calendar, color: 'emerald' },
        { label: 'Total Records', value: reports.reduce((sum, r) => sum + r.records, 0).toLocaleString(), icon: Archive, color: 'purple' },
        { label: 'Scheduled Reports', value: reports.filter(r => r.scheduled).length, icon: Clock, color: 'amber' },
    ];

    // Report categories
    const categories = [
        { name: 'Financial Reports', count: reports.filter(r => r.type === 'Financial').length, icon: DollarSign, color: 'emerald' },
        { name: 'Clinical Reports', count: reports.filter(r => r.type === 'Clinical').length, icon: Activity, color: 'blue' },
        { name: 'Operational Reports', count: reports.filter(r => r.type === 'Operational').length, icon: TrendingUp, color: 'purple' },
        { name: 'Patient Reports', count: reports.filter(r => r.type === 'Patient').length, icon: Users, color: 'cyan' },
        { name: 'Quality Reports', count: reports.filter(r => r.type === 'Quality').length, icon: FileBarChart, color: 'amber' },
    ];

    // Filter reports
    const filteredReports = reports.filter(report => {
        if (departmentFilter !== 'all' && report.department !== departmentFilter) return false;
        if (searchQuery && !report.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        if (activeTab !== 'all-reports' && activeTab !== 'custom-reports') {
            const tabType = activeTab.charAt(0).toUpperCase() + activeTab.slice(1);
            if (report.type !== tabType) return false;
        }
        return true;
    });

    const handleDownload = (report, format = 'pdf') => {
        const data = {
            reportId: report.id,
            title: report.title,
            type: report.type,
            department: report.department,
            generatedDate: report.date,
            generatedBy: report.generatedBy,
            totalRecords: report.records,
            format: format,
            exportedAt: new Date().toISOString(),
            data: Array(report.records).fill(null).map((_, i) => ({
                id: i + 1,
                timestamp: new Date().toISOString(),
                value: Math.random() * 1000,
                status: 'Complete'
            }))
        };

        let fileContent, mimeType, extension;

        if (format === 'json') {
            fileContent = JSON.stringify(data, null, 2);
            mimeType = 'application/json';
            extension = 'json';
        } else if (format === 'csv') {
            // Generate CSV
            const headers = 'ID,Timestamp,Value,Status\n';
            const rows = data.data.map(row => `${row.id},${row.timestamp},${row.value},${row.status}`).join('\n');
            fileContent = headers + rows;
            mimeType = 'text/csv';
            extension = 'csv';
        } else {
            // PDF simulation (downloadable text file)
            fileContent = `HOSPITAL MANAGEMENT SYSTEM - REPORT\n\n${report.title}\n\nReport ID: ${report.id}\nType: ${report.type}\nDepartment: ${report.department}\nGenerated: ${report.date}\nGenerated By: ${report.generatedBy}\nTotal Records: ${report.records}\n\n--- Report Data ---\n${JSON.stringify(data.data.slice(0, 10), null, 2)}\n\n... and ${report.records - 10} more records`;
            mimeType = 'text/plain';
            extension = 'txt';
        }

        const blob = new Blob([fileContent], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${report.id}_${report.title.replace(/\s+/g, '_')}.${extension}`;
        link.click();
        URL.revokeObjectURL(url);

        showToast(`Downloaded ${report.title} as ${format.toUpperCase()}!`, 'success');
    };

    const handlePrint = (report) => {
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
                <head>
                    <title>${report.title}</title>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 20px; }
                        h1 { color: #1e293b; }
                        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                        th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
                        th { background-color: #f1f5f9; font-weight: bold; }
                        .header { margin-bottom: 30px; }
                        .info { display: flex; gap: 20px; margin-bottom: 20px; }
                        .info-item { flex: 1; }
                        .info-label { font-weight: bold; color: #64748b; }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1>${report.title}</h1>
                        <p style="color: #64748b;">Hospital Management System - Official Report</p>
                    </div>
                    <div class="info">
                        <div class="info-item">
                            <div class="info-label">Report ID:</div>
                            <div>${report.id}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Department:</div>
                            <div>${report.department}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Generated By:</div>
                            <div>${report.generatedBy}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Date:</div>
                            <div>${report.date}</div>
                        </div>
                    </div>
                    <div class="info">
                        <div class="info-item">
                            <div class="info-label">Type:</div>
                            <div>${report.type}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Total Records:</div>
                            <div>${report.records.toLocaleString()}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">File Size:</div>
                            <div>${report.size}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Status:</div>
                            <div>${report.status}</div>
                        </div>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Timestamp</th>
                                <th>Value</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${Array(Math.min(report.records, 50)).fill(null).map((_, i) => `
                                <tr>
                                    <td>${i + 1}</td>
                                    <td>${new Date().toLocaleString()}</td>
                                    <td>UGX ${(Math.random() * 100000).toFixed(2)}</td>
                                    <td>Complete</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                    <p style="margin-top: 20px; color: #64748b; font-size: 12px;">
                        ${report.records > 50 ? `Showing first 50 of ${report.records} records` : `Showing all ${report.records} records`}
                    </p>
                    <script>window.print();</script>
                </body>
            </html>
        `);
        printWindow.document.close();
        showToast(`Print dialog opened for ${report.title}!`, 'success');
    };

    const handleViewReport = (report) => {
        setSelectedReport(report);
        setShowViewModal(true);
    };

    const handleGenerateCustomReport = () => {
        const newReport = {
            id: `REP-${String(reports.length + 1).padStart(3, '0')}`,
            title: customReport.name || 'Custom Report',
            type: customReport.type,
            department: customReport.department === 'all' ? 'Multiple' : customReport.department,
            date: new Date().toISOString().split('T')[0],
            generatedBy: 'Custom Generator',
            status: 'Ready',
            size: `${(Math.random() * 5 + 1).toFixed(1)} MB`,
            records: Math.floor(Math.random() * 1000) + 100,
            scheduled: false
        };

        setReports([newReport, ...reports]);
        setShowCustomReportModal(false);
        setCustomReport({
            name: '',
            type: 'Financial',
            department: 'all',
            dateRange: 'last-7-days',
            startDate: '',
            endDate: '',
            includeFields: {
                patientDetails: true,
                financialData: true,
                clinicalData: true,
                timestamps: true,
                staffInfo: false,
                billingInfo: true,
                treatmentPlans: false,
                medications: false,
            }
        });
        showToast(`Custom report "${newReport.title}" generated successfully!`, 'success');
    };

    const handleScheduleReport = () => {
        const report = reports.find(r => r.id === scheduleConfig.reportId);
        if (report) {
            setReports(reports.map(r =>
                r.id === scheduleConfig.reportId ? { ...r, scheduled: true } : r
            ));
            setShowScheduleModal(false);
            showToast(`Scheduled "${report.title}" to run ${scheduleConfig.frequency} at ${scheduleConfig.time}`, 'success');
        }
    };

    const handleDeleteReport = (reportId) => {
        if (confirm('Are you sure you want to delete this report?')) {
            setReports(reports.filter(r => r.id !== reportId));
            showToast('Report deleted successfully!', 'success');
        }
    };

    const getTypeColor = (type) => {
        const colors = {
            'Financial': 'bg-emerald-100 text-emerald-700',
            'Clinical': 'bg-blue-100 text-blue-700',
            'Operational': 'bg-purple-100 text-purple-700',
            'Patient': 'bg-cyan-100 text-cyan-700',
            'Quality': 'bg-amber-100 text-amber-700',
        };
        return colors[type] || 'bg-slate-100 text-slate-700';
    };

    const getStatusColor = (status) => {
        return status === 'Ready' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700';
    };

    return (
        <div className="space-y-6 animate-fade-in pb-10">
            {/* Toast Notification */}
            {toast.show && (
                <div className="fixed top-4 right-4 z-50 animate-fade-in">
                    <div className={`px-6 py-3 rounded-lg shadow-lg ${toast.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'
                        } text-white font-medium`}>
                        {toast.message}
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Reports & Records</h1>
                    <p className="text-slate-500 text-sm mt-1">Comprehensive hospital reporting system</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setShowCustomReportModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-medium shadow-lg shadow-primary/30"
                    >
                        <Plus size={16} />
                        Generate Custom Report
                    </button>
                    <button
                        onClick={() => setShowScheduleModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium"
                    >
                        <Clock size={16} />
                        Schedule Report
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white border border-slate-200 p-5 rounded-xl hover:shadow-md transition-all">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                <stat.icon size={20} />
                            </div>
                            <p className="text-sm text-slate-600 font-medium">{stat.label}</p>
                        </div>
                        <p className="text-3xl font-bold text-slate-800">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Main Content */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                {/* Tabs */}
                <div className="flex items-center gap-1 p-2 border-b border-slate-100 bg-slate-50/50 overflow-x-auto">
                    {['All Reports', 'Financial', 'Clinical', 'Operational', 'Patient', 'Quality'].map((tab) => {
                        const tabKey = tab.toLowerCase().replace(' ', '-');
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
                    <div className="space-y-6">
                        {/* Report Categories Overview */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                            {categories.map((category, index) => (
                                <div key={index} className="border border-slate-200 rounded-xl p-4 text-center hover:shadow-md transition-shadow cursor-pointer">
                                    <div className="p-3 bg-primary/10 rounded-lg w-fit mx-auto mb-3">
                                        <category.icon size={24} className="text-primary" />
                                    </div>
                                    <p className="font-bold text-2xl text-slate-800">{category.count}</p>
                                    <p className="text-xs text-slate-500 mt-1">{category.name}</p>
                                </div>
                            ))}
                        </div>

                        {/* Filters */}
                        <div className="flex flex-wrap gap-3">
                            <div className="relative flex-1 min-w-[200px]">
                                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search reports..."
                                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                                />
                            </div>
                            <select
                                value={departmentFilter}
                                onChange={(e) => setDepartmentFilter(e.target.value)}
                                className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                            >
                                <option value="all">All Departments</option>
                                <option value="Finance">Finance</option>
                                <option value="Laboratory">Laboratory</option>
                                <option value="Radiology">Radiology</option>
                                <option value="Pharmacy">Pharmacy</option>
                                <option value="Reception">Reception</option>
                                <option value="EMR">EMR</option>
                                <option value="Insurance">Insurance</option>
                                <option value="HR">HR</option>
                                <option value="Admin">Admin</option>
                            </select>
                            <select
                                value={exportFormat}
                                onChange={(e) => setExportFormat(e.target.value)}
                                className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                            >
                                <option value="pdf">Export as PDF</option>
                                <option value="csv">Export as CSV</option>
                                <option value="json">Export as JSON</option>
                            </select>
                        </div>

                        {/* Reports List */}
                        <div className="space-y-3">
                            {filteredReports.map((report) => (
                                <div key={report.id} className="border border-slate-200 rounded-xl p-5 hover:shadow-md transition-all">
                                    <div className="flex flex-col lg:flex-row justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between mb-3">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <FileText size={20} className="text-primary" />
                                                        <h3 className="font-bold text-slate-800 text-lg">{report.title}</h3>
                                                        {report.scheduled && (
                                                            <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-xs font-bold flex items-center gap-1">
                                                                <Clock size={12} />
                                                                Scheduled
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="flex flex-wrap gap-2 mb-3">
                                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${getTypeColor(report.type)}`}>
                                                            {report.type}
                                                        </span>
                                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusColor(report.status)}`}>
                                                            {report.status}
                                                        </span>
                                                        <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium">
                                                            {report.department}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                                <div>
                                                    <p className="text-xs text-slate-500">Report ID</p>
                                                    <p className="font-medium text-slate-700">{report.id}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-slate-500">Generated By</p>
                                                    <p className="font-medium text-slate-700">{report.generatedBy}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-slate-500">Total Records</p>
                                                    <p className="font-medium text-slate-700">{report.records.toLocaleString()}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-slate-500">File Size</p>
                                                    <p className="font-medium text-slate-700">{report.size}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            <button
                                                onClick={() => handleViewReport(report)}
                                                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark text-sm font-medium whitespace-nowrap flex items-center gap-2"
                                            >
                                                <Eye size={16} />
                                                View
                                            </button>
                                            <button
                                                onClick={() => handleDownload(report, exportFormat)}
                                                className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 text-sm font-medium whitespace-nowrap flex items-center gap-2"
                                            >
                                                <Download size={16} />
                                                Download
                                            </button>
                                            <button
                                                onClick={() => handlePrint(report)}
                                                className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 text-sm font-medium whitespace-nowrap flex items-center gap-2"
                                            >
                                                <Printer size={16} />
                                                Print
                                            </button>
                                            <button
                                                onClick={() => handleDeleteReport(report.id)}
                                                className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 text-sm font-medium whitespace-nowrap flex items-center gap-2"
                                            >
                                                <Trash2 size={16} />
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* View Report Modal */}
            {showViewModal && selectedReport && createPortal(
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-fade-in">
                        <div className="p-6 border-b border-slate-200 flex justify-between items-center">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-800">{selectedReport.title}</h2>
                                <p className="text-sm text-slate-500 mt-1">{selectedReport.id} • {selectedReport.department}</p>
                            </div>
                            <button
                                onClick={() => setShowViewModal(false)}
                                className="p-2 hover:bg-slate-100 rounded-lg"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto max-h-[60vh]">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                <div className="bg-slate-50 p-4 rounded-lg">
                                    <p className="text-xs text-slate-500 mb-1">Type</p>
                                    <p className="font-bold text-slate-800">{selectedReport.type}</p>
                                </div>
                                <div className="bg-slate-50 p-4 rounded-lg">
                                    <p className="text-xs text-slate-500 mb-1">Status</p>
                                    <p className="font-bold text-slate-800">{selectedReport.status}</p>
                                </div>
                                <div className="bg-slate-50 p-4 rounded-lg">
                                    <p className="text-xs text-slate-500 mb-1">Records</p>
                                    <p className="font-bold text-slate-800">{selectedReport.records.toLocaleString()}</p>
                                </div>
                                <div className="bg-slate-50 p-4 rounded-lg">
                                    <p className="text-xs text-slate-500 mb-1">Size</p>
                                    <p className="font-bold text-slate-800">{selectedReport.size}</p>
                                </div>
                            </div>

                            <div className="border border-slate-200 rounded-lg overflow-hidden">
                                <table className="w-full text-sm">
                                    <thead className="bg-slate-50 border-b border-slate-200">
                                        <tr>
                                            <th className="px-4 py-3 text-left font-bold text-slate-700">ID</th>
                                            <th className="px-4 py-3 text-left font-bold text-slate-700">Timestamp</th>
                                            <th className="px-4 py-3 text-left font-bold text-slate-700">Value</th>
                                            <th className="px-4 py-3 text-left font-bold text-slate-700">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {Array(20).fill(null).map((_, i) => (
                                            <tr key={i} className="hover:bg-slate-50">
                                                <td className="px-4 py-3">{i + 1}</td>
                                                <td className="px-4 py-3">{new Date().toLocaleString()}</td>
                                                <td className="px-4 py-3 font-medium">UGX {(Math.random() * 100000).toFixed(2)}</td>
                                                <td className="px-4 py-3">
                                                    <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-xs font-bold">
                                                        Complete
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <p className="text-xs text-slate-500 mt-3">Showing first 20 of {selectedReport.records} records</p>
                        </div>

                        <div className="p-6 border-t border-slate-200 flex gap-3 justify-end">
                            <button
                                onClick={() => setShowViewModal(false)}
                                className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50">
                                Close
                            </button>
                            <button
                                onClick={() => {
                                    handleDownload(selectedReport, exportFormat);
                                    setShowViewModal(false);
                                }}
                                className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600">
                                Download Report
                            </button>
                        </div>
                    </div>
                </div >,
                document.body
            )}

            {/* Custom Report Modal */}
            {
                showCustomReportModal && createPortal(
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-fade-in">
                            <div className="p-6 border-b border-slate-200 flex justify-between items-center">
                                <h2 className="text-2xl font-bold text-slate-800">Generate Custom Report</h2>
                                <button
                                    onClick={() => setShowCustomReportModal(false)}
                                    className="p-2 hover:bg-slate-100 rounded-lg"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="p-6 overflow-y-auto max-h-[60vh] space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-slate-700 mb-2 block">Report Name</label>
                                        <input
                                            type="text"
                                            value={customReport.name}
                                            onChange={(e) => setCustomReport({ ...customReport, name: e.target.value })}
                                            placeholder="Enter report name"
                                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-slate-700 mb-2 block">Report Type</label>
                                        <select
                                            value={customReport.type}
                                            onChange={(e) => setCustomReport({ ...customReport, type: e.target.value })}
                                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                                        >
                                            <option>Financial</option>
                                            <option>Clinical</option>
                                            <option>Operational</option>
                                            <option>Patient</option>
                                            <option>Quality</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-slate-700 mb-2 block">Department</label>
                                        <select
                                            value={customReport.department}
                                            onChange={(e) => setCustomReport({ ...customReport, department: e.target.value })}
                                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                                        >
                                            <option value="all">All Departments</option>
                                            <option value="Finance">Finance</option>
                                            <option value="Laboratory">Laboratory</option>
                                            <option value="Radiology">Radiology</option>
                                            <option value="Pharmacy">Pharmacy</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-slate-700 mb-2 block">Date Range</label>
                                        <select
                                            value={customReport.dateRange}
                                            onChange={(e) => setCustomReport({ ...customReport, dateRange: e.target.value })}
                                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                                        >
                                            <option value="last-7-days">Last 7 Days</option>
                                            <option value="last-30-days">Last 30 Days</option>
                                            <option value="last-3-months">Last 3 Months</option>
                                            <option value="last-year">Last Year</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-slate-700 mb-2 block">Include Data Fields</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {Object.keys(customReport.includeFields).map((field) => (
                                            <label key={field} className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    className="w-4 h-4 text-primary rounded"
                                                    checked={customReport.includeFields[field]}
                                                    onChange={(e) => setCustomReport({
                                                        ...customReport,
                                                        includeFields: {
                                                            ...customReport.includeFields,
                                                            [field]: e.target.checked
                                                        }
                                                    })}
                                                />
                                                <span className="text-sm text-slate-700 capitalize">{field.replace(/([A-Z])/g, ' $1').trim()}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 border-t border-slate-200 flex gap-3 justify-end">
                                <button
                                    onClick={() => setShowCustomReportModal(false)}
                                    className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleGenerateCustomReport}
                                    className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark font-medium flex items-center gap-2"
                                >
                                    <FileText size={20} />
                                    Generate Report
                                </button>
                            </div>
                        </div>
                    </div>,
                    document.body
                )
            }

            {/* Schedule Report Modal */}
            {
                showScheduleModal && createPortal(
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full animate-fade-in">
                            <div className="p-6 border-b border-slate-200 flex justify-between items-center">
                                <h2 className="text-2xl font-bold text-slate-800">Schedule Report</h2>
                                <button
                                    onClick={() => setShowScheduleModal(false)}
                                    className="p-2 hover:bg-slate-100 rounded-lg"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-slate-700 mb-2 block">Select Report</label>
                                    <select
                                        value={scheduleConfig.reportId}
                                        onChange={(e) => setScheduleConfig({ ...scheduleConfig, reportId: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                                    >
                                        <option value="">Choose a report</option>
                                        {reports.map(report => (
                                            <option key={report.id} value={report.id}>{report.title}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-slate-700 mb-2 block">Frequency</label>
                                        <select
                                            value={scheduleConfig.frequency}
                                            onChange={(e) => setScheduleConfig({ ...scheduleConfig, frequency: e.target.value })}
                                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                                        >
                                            <option value="daily">Daily</option>
                                            <option value="weekly">Weekly</option>
                                            <option value="monthly">Monthly</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-slate-700 mb-2 block">Time</label>
                                        <input
                                            type="time"
                                            value={scheduleConfig.time}
                                            onChange={(e) => setScheduleConfig({ ...scheduleConfig, time: e.target.value })}
                                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-slate-700 mb-2 block">Email Recipients (comma-separated)</label>
                                    <input
                                        type="text"
                                        value={scheduleConfig.recipients}
                                        onChange={(e) => setScheduleConfig({ ...scheduleConfig, recipients: e.target.value })}
                                        placeholder="email1@hospital.com, email2@hospital.com"
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-slate-700 mb-2 block">Format</label>
                                    <div className="flex gap-4">
                                        {['pdf', 'csv', 'excel'].map((fmt) => (
                                            <label key={fmt} className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="format"
                                                    value={fmt}
                                                    checked={scheduleConfig.format === fmt}
                                                    onChange={(e) => setScheduleConfig({ ...scheduleConfig, format: e.target.value })}
                                                    className="w-4 h-4 text-primary"
                                                />
                                                <span className="text-sm text-slate-700 uppercase">{fmt}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 border-t border-slate-200 flex gap-3 justify-end">
                                <button
                                    onClick={() => setShowScheduleModal(false)}
                                    className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleScheduleReport}
                                    className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark font-medium flex items-center gap-2"
                                >
                                    <Clock size={16} />
                                    Schedule
                                </button>
                            </div>
                        </div>
                    </div>,
                    document.body
                )
            }
        </div >
    );
};

export default ReportsDashboard;
