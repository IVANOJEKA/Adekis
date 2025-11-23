import React from 'react';
import { Users, Clock, ArrowRight, Stethoscope, Activity, FlaskConical } from 'lucide-react';

const QueueDisplay = () => {
    const queues = [
        {
            id: 1, name: 'Triage / Vitals', count: 2, icon: Activity, color: 'blue', patients: [
                { name: 'John Doe', time: '10:30 AM', wait: '15m' },
                { name: 'Alice Smith', time: '10:40 AM', wait: '5m' }
            ]
        },
        {
            id: 2, name: 'General Doctor', count: 3, icon: Stethoscope, color: 'emerald', patients: [
                { name: 'Sarah Wilson', time: '10:15 AM', wait: '30m' },
                { name: 'Mike Jones', time: '10:20 AM', wait: '25m' },
                { name: 'Emily Brown', time: '10:35 AM', wait: '10m' }
            ]
        },
        {
            id: 3, name: 'Laboratory', count: 1, icon: FlaskConical, color: 'purple', patients: [
                { name: 'David Clark', time: '10:25 AM', wait: '20m' }
            ]
        }
    ];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {queues.map((queue) => (
                    <div key={queue.id} className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col h-full">
                        <div className={`p-4 border-b border-slate-100 bg-${queue.color}-50/30 flex justify-between items-center`}>
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg bg-${queue.color}-100 text-${queue.color}-600`}>
                                    <queue.icon size={20} />
                                </div>
                                <h3 className="font-bold text-slate-800">{queue.name}</h3>
                            </div>
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold bg-${queue.color}-100 text-${queue.color}-700`}>
                                {queue.count} Waiting
                            </span>
                        </div>

                        <div className="divide-y divide-slate-100 flex-1">
                            {queue.patients.map((patient, idx) => (
                                <div key={idx} className="p-4 hover:bg-slate-50 transition-colors group">
                                    <div className="flex justify-between items-start mb-2">
                                        <p className="font-bold text-slate-800">{patient.name}</p>
                                        <span className="text-xs font-medium text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                                            <Clock size={10} /> {patient.wait}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <p className="text-xs text-slate-500">Arrived: {patient.time}</p>
                                        <button className="text-xs font-bold text-primary hover:text-primary-dark flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            Call <ArrowRight size={12} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {queue.patients.length === 0 && (
                                <div className="p-8 text-center text-slate-400">
                                    <Users size={32} className="mx-auto mb-2 opacity-20" />
                                    <p className="text-sm">No patients waiting</p>
                                </div>
                            )}
                        </div>

                        <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
                            <button className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">
                                View Full List
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default QueueDisplay;
