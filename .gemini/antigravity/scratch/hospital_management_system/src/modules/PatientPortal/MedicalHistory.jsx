import React from 'react';
import { FileText, Calendar, User, AlertCircle } from 'lucide-react';

const MedicalHistory = ({ patientId }) => {
    // This will be populated with actual data from DataContext
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Medical History</h2>
                <p className="text-slate-600">View your past consultations and diagnoses</p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
                <div className="text-center py-12 text-slate-400">
                    <FileText size={64} className="mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">Medical History Coming Soon</p>
                    <p className="text-sm mt-2">Your consultation notes and medical history will appear here</p>
                </div>
            </div>
        </div>
    );
};

export default MedicalHistory;
