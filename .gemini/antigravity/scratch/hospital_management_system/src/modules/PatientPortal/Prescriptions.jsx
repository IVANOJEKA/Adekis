import React from 'react';
import { Pill } from 'lucide-react';

const Prescriptions = ({ patientId }) => {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Prescriptions</h2>
                <p className="text-slate-600">View your current and past prescriptions</p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12">
                <div className="text-center text-slate-400">
                    <Pill size={64} className="mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">Prescriptions Coming Soon</p>
                    <p className="text-sm mt-2">Your medication history will appear here</p>
                </div>
            </div>
        </div>
    );
};

export default Prescriptions;
