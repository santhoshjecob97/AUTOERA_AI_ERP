import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, RadialBarChart, RadialBar } from 'recharts';

const analyticsData = [
    { name: 'Mon', revenue: 45000, efficiency: 85 },
    { name: 'Tue', revenue: 52000, efficiency: 88 },
    { name: 'Wed', revenue: 48000, efficiency: 82 },
    { name: 'Thu', revenue: 61000, efficiency: 90 },
    { name: 'Fri', revenue: 55000, efficiency: 47 },
    { name: 'Sat', revenue: 68000, efficiency: 95 },
];

const ServiceAnalyticsPage: React.FC = () => {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                    <h3 className="font-bold text-slate-900 mb-4">Service Revenue & Efficiency</h3>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={analyticsData}>
                                <defs>
                                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#f97316" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                <YAxis yAxisId="left" orientation="left" stroke="#f97316" axisLine={false} tickLine={false} />
                                <YAxis yAxisId="right" orientation="right" stroke="#3b82f6" axisLine={false} tickLine={false} domain={[0, 100]} />
                                <Tooltip />
                                <Legend />
                                <Area yAxisId="left" type="monotone" dataKey="revenue" stroke="#f97316" fillOpacity={1} fill="url(#colorRev)" name="Revenue (₹)" />
                                <Area yAxisId="right" type="monotone" dataKey="efficiency" stroke="#3b82f6" fillOpacity={0} strokeWidth={2} name="Efficiency %" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                    <h3 className="font-bold text-slate-900 mb-4">Predictive Failure Analysis</h3>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadialBarChart cx="50%" cy="50%" innerRadius="10%" outerRadius="80%" barSize={10} data={[
                                { name: 'Battery', uv: 31.47, fill: '#8884d8' },
                                { name: 'Brakes', uv: 26.69, fill: '#83a6ed' },
                                { name: 'Engine', uv: 15.69, fill: '#8dd1e1' },
                                { name: 'Tires', uv: 8.22, fill: '#82ca9d' },
                            ]}>
                                <RadialBar
                                    label={{ position: 'insideStart', fill: '#fff' }}
                                    background
                                    dataKey="uv"
                                />
                                <Legend iconSize={10} layout="vertical" verticalAlign="middle" wrapperStyle={{ right: 0 }} />
                            </RadialBarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServiceAnalyticsPage;
