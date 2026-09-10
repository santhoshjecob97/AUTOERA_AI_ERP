import React, { useState } from 'react';
import { 
  Wrench, Search, Filter, AlertTriangle, CheckCircle2, TrendingDown, 
  Package, Plus, ArrowUpRight, Download, RefreshCw, ShoppingCart, 
  FileText, Sparkles, Layers, ShieldAlert, Truck
} from 'lucide-react';

interface SparePart {
  partNumber: string;
  name: string;
  category: 'Fast-Moving' | 'Periodic Maintenance' | 'EV High-Voltage' | 'Body & Paint';
  brand: string;
  oemCode: string;
  currentStock: number;
  minReorderLevel: number;
  maxCapacity: number;
  eoqUnits: number; // Economic Order Quantity
  unitPrice: number;
  leadTimeDays: number;
  daysUntilStockout: number;
  supplier: string;
  status: 'OPTIMAL' | 'LOW_STOCK' | 'CRITICAL_STOCKOUT';
}

const dealershipPartsInventory: SparePart[] = [
  {
    partNumber: 'TP-BRK-401',
    name: 'Front Ceramic Brake Pad Set',
    category: 'Fast-Moving',
    brand: 'Tata Genuine Parts',
    oemCode: '5424-BRK-001',
    currentStock: 6,
    minReorderLevel: 15,
    maxCapacity: 80,
    eoqUnits: 40,
    unitPrice: 3200,
    leadTimeDays: 3,
    daysUntilStockout: 4,
    supplier: 'Brakes India Pvt Ltd',
    status: 'CRITICAL_STOCKOUT'
  },
  {
    partNumber: 'EV-CLT-809',
    name: 'Dielectric Battery Coolant (5 Litres)',
    category: 'EV High-Voltage',
    brand: 'Tata EV Care',
    oemCode: 'EV-COOL-99',
    currentStock: 12,
    minReorderLevel: 20,
    maxCapacity: 60,
    eoqUnits: 30,
    unitPrice: 4800,
    leadTimeDays: 5,
    daysUntilStockout: 7,
    supplier: 'Castrol India EV Fluids',
    status: 'LOW_STOCK'
  },
  {
    partNumber: 'MN-FLT-112',
    name: 'Synthetic Engine Oil 5W-30 (Barrels)',
    category: 'Periodic Maintenance',
    brand: 'Shell Helix Ultra',
    oemCode: 'SH-5W30-BULK',
    currentStock: 28,
    minReorderLevel: 10,
    maxCapacity: 50,
    eoqUnits: 25,
    unitPrice: 18500,
    leadTimeDays: 2,
    daysUntilStockout: 22,
    supplier: 'Shell Lubricants Chennai',
    status: 'OPTIMAL'
  },
  {
    partNumber: 'HY-AIR-302',
    name: 'High Efficiency Cabin PM2.5 Filter',
    category: 'Fast-Moving',
    brand: 'Hyundai Genuine',
    oemCode: '28113-F2000',
    currentStock: 8,
    minReorderLevel: 25,
    maxCapacity: 100,
    eoqUnits: 50,
    unitPrice: 850,
    leadTimeDays: 2,
    daysUntilStockout: 5,
    supplier: 'Mobis India Logistics',
    status: 'CRITICAL_STOCKOUT'
  },
  {
    partNumber: 'MH-SHK-708',
    name: 'Rear Shock Absorber Assembly',
    category: 'Body & Paint',
    brand: 'Mahindra Genuine',
    oemCode: '0403-SHK-A1',
    currentStock: 14,
    minReorderLevel: 12,
    maxCapacity: 30,
    eoqUnits: 15,
    unitPrice: 5600,
    leadTimeDays: 7,
    daysUntilStockout: 18,
    supplier: 'Gabriel India Ltd',
    status: 'OPTIMAL'
  },
  {
    partNumber: 'EV-OBC-990',
    name: 'On-Board Charger High-Voltage Wiring Harness',
    category: 'EV High-Voltage',
    brand: 'Aptiv High Voltage',
    oemCode: 'AP-HV-WIR-02',
    currentStock: 3,
    minReorderLevel: 5,
    maxCapacity: 15,
    eoqUnits: 10,
    unitPrice: 14200,
    leadTimeDays: 10,
    daysUntilStockout: 6,
    supplier: 'Aptiv Components India',
    status: 'LOW_STOCK'
  }
];

const ServiceInventoryPage: React.FC = () => {
  const [parts, setParts] = useState<SparePart[]>(dealershipPartsInventory);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [poGeneratedPart, setPoGeneratedPart] = useState<string | null>(null);

  const filteredParts = parts.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.partNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'ALL' || p.category === categoryFilter;
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const totalValuation = parts.reduce((acc, p) => acc + (p.currentStock * p.unitPrice), 0);
  const criticalStockouts = parts.filter(p => p.status === 'CRITICAL_STOCKOUT').length;
  const lowStock = parts.filter(p => p.status === 'LOW_STOCK').length;

  const handleGeneratePO = (part: SparePart) => {
    setPoGeneratedPart(`Generated Purchase Order for ${part.eoqUnits} units of ${part.name} to ${part.supplier}`);
    setTimeout(() => setPoGeneratedPart(null), 4000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header Banner */}
      <div className="bg-[#0D1117] border border-slate-800/90 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles size={13} className="text-orange-500" />
              Section 06 &bull; Spare Parts Demand Forecasting (14-Day Lookahead)
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-['Outfit'] flex items-center gap-3">
              Workshop Spare Parts &amp; Inventory Intelligence
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-3xl">
              Nightly consumption analysis, Economic Order Quantity (EOQ) replenishment triggers, 95% parts fill-rate SLA &amp; automated vendor procurement.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-orange-500/20 transition-all cursor-pointer">
              <Plus size={15} />
              <span>Add New Part / SKU</span>
            </button>
          </div>
        </div>
      </div>

      {/* PO Generated Alert */}
      {poGeneratedPart && (
        <div className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2.5 animate-in fade-in">
          <CheckCircle2 size={16} />
          <span>{poGeneratedPart}</span>
        </div>
      )}

      {/* Inventory KPI Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#0D1117] border border-slate-800/80 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Gross Inventory Valuation</span>
            <Package className="text-cyan-400" size={18} />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-white font-['Outfit']">₹{(totalValuation / 100000).toFixed(2)}L</span>
            <span className="text-xs text-emerald-400 font-semibold">95.2% Fill Rate</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Across 1,420 Active SKUs</p>
        </div>

        <div className="bg-[#0D1117] border border-slate-800/80 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Stockout Forecast &lt; 7 Days</span>
            <AlertTriangle className="text-rose-400" size={18} />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-rose-400 font-['Outfit']">{criticalStockouts} SKUs</span>
            <span className="text-xs text-rose-400 font-semibold">Action Required</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Direct impact on Bay turnaround</p>
        </div>

        <div className="bg-[#0D1117] border border-slate-800/80 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Low Stock Threshold</span>
            <ShieldAlert className="text-amber-400" size={18} />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-amber-300 font-['Outfit']">{lowStock} SKUs</span>
            <span className="text-xs text-amber-400 font-semibold">At Reorder Level</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Lead time &lt; 5 days</p>
        </div>

        <div className="bg-[#0D1117] border border-slate-800/80 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Active Purchase Orders</span>
            <Truck className="text-purple-400" size={18} />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-white font-['Outfit']">8 Dispatched</span>
            <span className="text-xs text-purple-400 font-semibold">₹3.8L in Transit</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Arrival in 24-48 hours</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#0D1117] border border-slate-800/90 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search size={15} className="absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search part by name, SKU part number, or vendor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-400 focus:outline-none focus:border-orange-500"
          />
        </div>

        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <span className="text-xs text-slate-400 font-medium">Category:</span>
          {['ALL', 'Fast-Moving', 'EV High-Voltage', 'Periodic Maintenance'].map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
                categoryFilter === cat ? 'bg-orange-500 text-white' : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Parts Table */}
      <div className="bg-[#0D1117] border border-slate-800/90 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/90 text-[11px] uppercase font-bold text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Part / SKU Name</th>
                <th className="py-3.5 px-3">Category</th>
                <th className="py-3.5 px-3">Current Stock</th>
                <th className="py-3.5 px-3">Reorder Point</th>
                <th className="py-3.5 px-3">Stockout Forecast</th>
                <th className="py-3.5 px-3">Unit Price</th>
                <th className="py-3.5 px-3">Status</th>
                <th className="py-3.5 px-4 text-right">Autonomous Replenishment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredParts.map(part => {
                const isCritical = part.status === 'CRITICAL_STOCKOUT';
                const isLow = part.status === 'LOW_STOCK';

                return (
                  <tr key={part.partNumber} className="hover:bg-slate-900/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white">{part.name}</div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {part.partNumber} &bull; <span className="text-slate-500">{part.brand}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-900 border border-slate-800 text-slate-300">
                        {part.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-1.5">
                        <span className={`font-black text-sm ${isCritical ? 'text-rose-400' : isLow ? 'text-amber-400' : 'text-white'}`}>
                          {part.currentStock}
                        </span>
                        <span className="text-[10px] text-slate-500">/ {part.maxCapacity}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-3 font-semibold text-slate-300">
                      {part.minReorderLevel} units
                    </td>
                    <td className="py-3.5 px-3">
                      <span className={`font-bold ${isCritical ? 'text-rose-400' : isLow ? 'text-amber-400' : 'text-slate-400'}`}>
                        {part.daysUntilStockout} days remaining
                      </span>
                    </td>
                    <td className="py-3.5 px-3 font-bold text-white">
                      ₹{part.unitPrice.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black border ${
                        isCritical ? 'bg-rose-500/20 text-rose-400 border-rose-500/40' :
                        isLow ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' :
                        'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                      }`}>
                        {part.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleGeneratePO(part)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all inline-flex items-center gap-1.5 ${
                          isCritical || isLow
                            ? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-md shadow-orange-500/20'
                            : 'bg-slate-900 border border-slate-700 hover:border-slate-600 text-slate-300'
                        }`}
                      >
                        <ShoppingCart size={13} />
                        <span>Order EOQ ({part.eoqUnits})</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ServiceInventoryPage;
