import React from 'react';
import { Box, AlertTriangle, TrendingUp, Search, RefreshCw, ShoppingCart } from 'lucide-react';
import { InventoryPart } from '../types';
import { BarChart, Bar, XAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockInventory: InventoryPart[] = [
    { id: '1', name: 'Brake Pad Set (Front)', sku: 'BP-2024-X', category: 'Brakes', stockLevel: 12, reorderPoint: 15, unitPrice: 2500, status: 'Low Stock', predictedDemand: 45, supplier: 'Bosch' },
    { id: '2', name: 'Synth Engine Oil 5W30', sku: 'OIL-SYN-530', category: 'Fluids', stockLevel: 150, reorderPoint: 50, unitPrice: 1200, status: 'In Stock', predictedDemand: 120, supplier: 'Shell' },
    { id: '3', name: 'Air Filter Type A', sku: 'AF-TY-A', category: 'Filters', stockLevel: 8, reorderPoint: 10, unitPrice: 450, status: 'Critical', predictedDemand: 30, supplier: 'OEM' },
    { id: '4', name: 'Spark Plug Iridium', sku: 'SP-IR-4', category: 'Ignition', stockLevel: 40, reorderPoint: 20, unitPrice: 800, status: 'In Stock', predictedDemand: 15, supplier: 'NGK' },
];

const demandData = [
    { name: 'Brakes', demand: 120 },
    { name: 'Filters', demand: 250 },
    { name: 'Fluids', demand: 400 },
    { name: 'Batteries', demand: 45 },
    { name: 'Tires', demand: 80 },
];

const ServiceInventory: React.FC = () => {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                        <h3 className="font-bold text-slate-900 flex items-center gap-2">
                            <Box size={18} className="text-orange-600"/> Parts Inventory
                        </h3>
                        <div className="relative">
                            <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
                            <input type="text" placeholder="Search SKU or Name..." className="pl-8 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 w-64"/>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 text-slate-500">
                                <tr>
                                    <th className="px-6 py-4 font-medium">Part Name & SKU</th>
                                    <th className="px-6 py-4 font-medium">Category</th>
                                    <th className="px-6 py-4 font-medium">Stock Level</th>
                                    <th className="px-6 py-4 font-medium">Predicted Demand</th>
                                    <th className="px-6 py-4 font-medium">Status</th>
                                    <th className="px-6 py-4 font-medium">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {mockInventory.map(part => (
                                    <tr key={part.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-slate-900">{part.name}</div>
                                            <div className="text-xs text-slate-500">{part.sku}</div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">{part.category}</td>
                                        <td className="px-6 py-4 font-mono font-medium">{part.stockLevel}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1 text-slate-600">
                                                <TrendingUp size={14} className="text-green-500"/>
                                                {part.predictedDemand}/mo
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                                                part.status === 'Critical' ? 'bg-red-100 text-red-700' :
                                                part.status === 'Low Stock' ? 'bg-orange-100 text-orange-700' :
                                                'bg-green-100 text-green-700'
                                            }`}>
                                                {part.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors">
                                                <ShoppingCart size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                    <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <RefreshCw size={18} className="text-blue-600"/> AI Demand Forecasting
                    </h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={demandData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                                <Tooltip cursor={{fill: 'transparent'}} />
                                <Bar dataKey="demand" fill="#f97316" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100 text-xs text-blue-800 leading-relaxed">
                        <strong>AI Insight:</strong> Brake pad demand is projected to rise by 15% next month due to seasonal monsoon trends. Recommended increasing safety stock for 'BP-2024-X'.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServiceInventory;