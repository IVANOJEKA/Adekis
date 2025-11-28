import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Clock, MapPin, User, CheckCircle, AlertCircle, Plus } from 'lucide-react';
import { useData } from '../../../context/DataContext';
import { getVisitStatusColor } from '../../../utils/homeCareUtils';

const HomeCareVisitScheduler = ({ onScheduleVisit, onRecordVisit }) => {
    const { homeCareVisitsData, homeCarePatientsData } = useData();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [viewMode, setViewMode] = useState('week'); // 'day', 'week', 'month'

    // Helper to format date
    const formatDate = (date) => {
        return date.toISOString().slice(0, 10);
    };

    // Get dates for the current view
    const getDates = () => {
        const dates = [];
        const start = new Date(currentDate);

        if (viewMode === 'week') {
            const day = start.getDay();
            const diff = start.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
            start.setDate(diff);

            for (let i = 0; i < 7; i++) {
                const date = new Date(start);
                date.setDate(start.getDate() + i);
                dates.push(date);
            }
        } else if (viewMode === 'day') {
            dates.push(new Date(start));
        }

        return dates;
    };

    const dates = getDates();

    // Navigate dates
    const navigate = (direction) => {
        const newDate = new Date(currentDate);
        if (viewMode === 'week') {
            newDate.setDate(newDate.getDate() + (direction * 7));
        } else {
            newDate.setDate(newDate.getDate() + direction);
        }
        setCurrentDate(newDate);
    };

    // Get visits for a specific date
    const getVisitsForDate = (date) => {
        const dateStr = formatDate(date);
        return homeCareVisitsData.filter(v => v.scheduledDate === dateStr)
            .sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime));
    };

    return (
        <div className="space-y-6">
            {/* Header / Controls */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-4">
                    <div className="flex items-center bg-slate-100 rounded-lg p-1">
                        <button
                            onClick={() => setViewMode('day')}
                            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${viewMode === 'day' ? 'bg-white shadow-sm text-primary' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Day
                        </button>
                        <button
                            onClick={() => setViewMode('week')}
                            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${viewMode === 'week' ? 'bg-white shadow-sm text-primary' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Week
                        </button>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={() => navigate(-1)} className="p-1 hover:bg-slate-100 rounded-full text-slate-500">
                            <ChevronLeft size={20} />
                        </button>
                        <span className="font-bold text-slate-700 min-w-[150px] text-center">
                            {dates[0].toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                            {viewMode === 'week' && ` - ${dates[dates.length - 1].toLocaleDateString('en-US', { day: 'numeric', year: 'numeric' })}`}
                        </span>
                        <button onClick={() => navigate(1)} className="p-1 hover:bg-slate-100 rounded-full text-slate-500">
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
                <button
                    onClick={() => onScheduleVisit()}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark shadow-lg shadow-primary/30 font-medium"
                >
                    <Plus size={18} />
                    Schedule New Visit
                </button>
            </div>

            {/* Calendar Grid */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <div className={`grid ${viewMode === 'week' ? 'grid-cols-7' : 'grid-cols-1'} divide-x divide-slate-200`}>
                    {dates.map((date) => {
                        const visits = getVisitsForDate(date);
                        const isToday = formatDate(date) === formatDate(new Date());

                        return (
                            <div key={date.toISOString()} className="min-h-[600px] flex flex-col">
                                {/* Date Header */}
                                <div className={`p-3 text-center border-b border-slate-100 ${isToday ? 'bg-blue-50' : 'bg-slate-50'}`}>
                                    <p className={`text-xs font-bold uppercase ${isToday ? 'text-blue-600' : 'text-slate-500'}`}>
                                        {date.toLocaleDateString('en-US', { weekday: 'short' })}
                                    </p>
                                    <p className={`text-lg font-bold ${isToday ? 'text-blue-700' : 'text-slate-700'}`}>
                                        {date.getDate()}
                                    </p>
                                </div>

                                {/* Visits List */}
                                <div className="flex-1 p-2 space-y-2 bg-slate-50/30">
                                    {visits.length > 0 ? (
                                        visits.map((visit) => (
                                            <div
                                                key={visit.id}
                                                onClick={() => onRecordVisit(visit)}
                                                className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md group ${visit.status === 'Completed' ? 'bg-green-50 border-green-200' :
                                                        visit.status === 'In Progress' ? 'bg-blue-50 border-blue-200' :
                                                            visit.status === 'Cancelled' ? 'bg-red-50 border-red-200' :
                                                                'bg-white border-slate-200 hover:border-primary/50'
                                                    }`}
                                            >
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${getVisitStatusColor(visit.status)}`}>
                                                        {visit.status}
                                                    </span>
                                                    <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                                                        <Clock size={10} />
                                                        {visit.scheduledTime}
                                                    </span>
                                                </div>
                                                <p className="font-bold text-slate-800 text-sm line-clamp-1">{visit.patientName}</p>
                                                <div className="flex items-start gap-1 text-xs text-slate-500 mt-1">
                                                    <MapPin size={10} className="mt-0.5 flex-shrink-0" />
                                                    <span className="line-clamp-2">{visit.patientAddress}</span>
                                                </div>
                                                <div className="flex items-center gap-1 text-xs text-slate-500 mt-2 pt-2 border-t border-slate-100">
                                                    <User size={10} />
                                                    <span className="line-clamp-1">{visit.nurseName}</span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="h-full flex flex-col items-center justify-center text-slate-400 p-4">
                                            <p className="text-xs text-center">No visits</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default HomeCareVisitScheduler;
