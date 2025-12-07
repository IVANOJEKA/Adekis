import React, { useState } from 'react';
import { Star, Target, TrendingUp, CheckCircle, BarChart2, Plus, Users, User } from 'lucide-react';
import { useData } from '../../../context/DataContext';

const PerformanceManagement = () => {
    const { performanceReviews, employees, goals } = useData();
    const [selectedStatus, setSelectedStatus] = useState('all');

    // Dummy Stats Calculation
    const totalReviews = performanceReviews?.length || 0;
    const completedReviews = performanceReviews?.filter(r => r.status === 'Completed').length || 0;
    const avgRating = performanceReviews?.reduce((acc, r) => acc + r.rating, 0) / (completedReviews || 1);
    const pendingReviews = performanceReviews?.filter(r => r.status === 'Pending').length || 0;

    const filteredReviews = performanceReviews?.filter(r =>
        selectedStatus === 'all' || r.status.toLowerCase() === selectedStatus.toLowerCase()
    ) || [];

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between h-full bg-gradient-to-br from-purple-500 to-indigo-600 text-white">
                    <div>
                        <div className="flex justify-between items-start mb-2">
                            <span className="p-2 bg-white/20 rounded-xl">
                                <Star size={20} />
                            </span>
                            <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded-lg">Avg</span>
                        </div>
                        <h3 className="text-3xl font-black mb-1">{avgRating.toFixed(1)}</h3>
                        <p className="text-sm font-medium opacity-90">Average Rating</p>
                    </div>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm group hover:border-blue-200 transition-all">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-100 transition-colors">
                            <CheckCircle size={20} />
                        </div>
                        <span className="font-bold text-slate-700">Completed</span>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800">{completedReviews}</h3>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
                        <div className="bg-blue-500 h-full rounded-full" style={{ width: `${(completedReviews / totalReviews) * 100}%` }}></div>
                    </div>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm group hover:border-amber-200 transition-all">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-amber-50 text-amber-600 rounded-xl group-hover:bg-amber-100 transition-colors">
                            <Target size={20} />
                        </div>
                        <span className="font-bold text-slate-700">Pending</span>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800">{pendingReviews}</h3>
                    <p className="text-xs text-slate-500 mt-2">Reviews to finalize</p>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm group hover:border-emerald-200 transition-all">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl group-hover:bg-emerald-100 transition-colors">
                            <TrendingUp size={20} />
                        </div>
                        <span className="font-bold text-slate-700">Growth</span>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800">+12%</h3>
                    <p className="text-xs text-slate-500 mt-2">Improvement vs last Q</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Reviews List */}
                <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-50/50">
                        <div>
                            <h3 className="text-lg font-bold text-slate-800">Performance Reviews</h3>
                            <p className="text-sm text-slate-500">Track and manage employee evaluations</p>
                        </div>
                        <div className="flex gap-2">
                            <select
                                className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20"
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                            >
                                <option value="all">All Reviews</option>
                                <option value="completed">Completed</option>
                                <option value="pending">Pending</option>
                            </select>
                            <button className="btn btn-primary btn-sm rounded-xl gap-2">
                                <Plus size={16} />
                                New Review
                            </button>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4">Employee</th>
                                    <th className="px-6 py-4">Review Period</th>
                                    <th className="px-6 py-4">Rating</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredReviews.map(review => (
                                    <tr key={review.id} className="hover:bg-slate-50/80 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs">
                                                    {review.employeeName.charAt(0)}
                                                </div>
                                                <span className="font-bold text-slate-800">{review.employeeName}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">{review.period}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1">
                                                <Star size={14} className="text-amber-400 fill-amber-400" />
                                                <span className="font-bold text-slate-700">{review.rating}</span>
                                                <span className="text-slate-400">/5.0</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-lg text-xs font-bold ${review.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                                                }`}>
                                                {review.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-xs font-bold text-primary hover:underline">View</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Team Goals Widget */}
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 h-fit sticky top-24">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-slate-800 text-lg">Active Goals</h3>
                        <button className="text-primary hover:bg-blue-50 p-2 rounded-xl transition-colors">
                            <Plus size={20} />
                        </button>
                    </div>

                    <div className="space-y-6">
                        {goals?.map(goal => (
                            <div key={goal.id} className="group">
                                <div className="flex justify-between items-center mb-2">
                                    <h4 className="font-semibold text-slate-800 text-sm group-hover:text-primary transition-colors cursor-pointer">{goal.title}</h4>
                                    <span className="text-xs font-medium text-slate-500">{goal.progress}%</span>
                                </div>
                                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-500 ${goal.progress >= 80 ? 'bg-emerald-500' :
                                                goal.progress >= 50 ? 'bg-blue-500' :
                                                    'bg-amber-500'
                                            }`}
                                        style={{ width: `${goal.progress}%` }}
                                    ></div>
                                </div>
                                <div className="flex items-center gap-2 mt-2">
                                    <div className="flex -space-x-2">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="w-6 h-6 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-[10px] text-slate-500 font-bold">
                                                <User size={12} />
                                            </div>
                                        ))}
                                    </div>
                                    <span className="text-xs text-slate-400">+3 assignees</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button className="w-full mt-8 py-3 bg-slate-50 border border-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-100 transition-all text-sm">
                        View All Goals
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PerformanceManagement;
