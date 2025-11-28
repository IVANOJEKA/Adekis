import React from 'react';
import { TestTube, Download, Calendar, CheckCircle, Clock } from 'lucide-react';
import { useData } from '../../context/DataContext';

const LabResults = ({ patientId }) => {
    const { labOrders } = useData();

    const patientLabs = labOrders?.filter(lab => lab.patientId === patientId) || [];

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Lab Results</h2>
                <p className="text-slate-600">View and download your laboratory test results</p>
            </div>

            {patientLabs.length > 0 ? (
                <div className="space-y-4">
                    {patientLabs.map(lab => (
                        <div key={lab.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-emerald-50 rounded-lg">
                                        <TestTube size={24} className="text-emerald-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-800 text-lg">{lab.testName}</h3>
                                        <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                                            <Calendar size={14} />
                                            {lab.orderDate}
                                        </div>
                                    </div>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${lab.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                                        lab.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                                            'bg-slate-100 text-slate-600'
                                    }`}>
                                    {lab.status === 'Completed' && <CheckCircle size={14} className="inline mr-1" />}
                                    {lab.status === 'Pending' && <Clock size={14} className="inline mr-1" />}
                                    {lab.status}
                                </span>
                            </div>

                            {lab.status === 'Completed' && lab.results && (
                                <div className="bg-slate-50 rounded-lg p-4 mb-4">
                                    <p className="text-sm font-medium text-slate-700 mb-2">Results:</p>
                                    <p className="text-slate-600">{lab.results}</p>
                                </div>
                            )}

                            {lab.status === 'Completed' && (
                                <button className="flex items-center gap-2 text-primary hover:text-primary-dark font-medium text-sm">
                                    <Download size={16} />
                                    Download Report
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12">
                    <div className="text-center text-slate-400">
                        <TestTube size={64} className="mx-auto mb-4 opacity-50" />
                        <p className="text-lg font-medium">No Lab Results</p>
                        <p className="text-sm mt-2">You don't have any lab test results yet</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LabResults;
