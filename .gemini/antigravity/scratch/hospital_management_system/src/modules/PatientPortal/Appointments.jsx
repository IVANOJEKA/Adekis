import React from 'react';
import { Calendar } from 'lucide-react';

const Appointments = ({ patientId }) => {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Appointments</h2>
                <p className="text-slate-600">View your upcoming and past appointments</p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12">
                <div className="text-center text-slate-400">
                    <Calendar size={64} className="mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">Appointments Coming Soon</p>
                    <p className="text-sm mt-2">Your appointment history will appear here</p>
                </div>
            </div>
        </div>
    );
};

export default Appointments;
