import React, { useState } from 'react';
import { Cuboid, Palette, Settings, Share2, Save, Sparkles, IndianRupee, Check } from 'lucide-react';

interface VehicleConfig {
  model: string;
  exteriorColor: string;
  interiorColor: string;
  wheels: string;
  packages: string[];
  basePrice: number;
}

const VirtualShowroomPage: React.FC = () => {
  const [selectedVehicle, setSelectedVehicle] = useState('BMW X7');
  const [config, setConfig] = useState<VehicleConfig>({
    model: 'BMW X7',
    exteriorColor: 'Black Sapphire',
    interiorColor: 'Cognac Leather',
    wheels: '22" M Sport',
    packages: ['M Sport Package', 'Tech Package'],
    basePrice: 9890000
  });

  const vehicles = ['BMW X7', 'Audi Q7', 'Mercedes GLE', 'Volvo XC90', 'Land Rover Discovery'];
  
  const exteriorColors = [
    { name: 'Black Sapphire', hex: '#1a1a1a', cost: 0 },
    { name: 'Alpine White', hex: '#f5f5f5', cost: 0 },
    { name: 'Phytonic Blue', hex: '#2563eb', cost: 50000 },
    { name: 'Tanzanite Blue', hex: '#1e40af', cost: 50000 },
  ];

  const interiorColors = [
    { name: 'Cognac Leather', cost: 0 },
    { name: 'Black Leather', cost: 0 },
    { name: 'Ivory White', cost: 80000 },
  ];

  const wheelOptions = [
    { name: '21" Standard', cost: 0 },
    { name: '22" M Sport', cost: 150000 },
    { name: '23" Premium', cost: 250000 },
  ];

  const packageOptions = [
    { name: 'M Sport Package', cost: 450000, features: ['Sport Seats', 'M Steering Wheel', 'Sport Suspension'] },
    { name: 'Tech Package', cost: 280000, features: ['Head-Up Display', 'Gesture Control', 'Wireless Charging'] },
    { name: 'Luxury Seating', cost: 320000, features: ['Massage Seats', 'Ventilated Seats', 'Executive Lounge'] },
  ];

  const calculateTotal = () => {
    const colorCost = exteriorColors.find(c => c.name === config.exteriorColor)?.cost || 0;
    const interiorCost = interiorColors.find(c => c.name === config.interiorColor)?.cost || 0;
    const wheelsCost = wheelOptions.find(w => w.name === config.wheels)?.cost || 0;
    const packagesCost = config.packages.reduce((sum, pkg) => {
      return sum + (packageOptions.find(p => p.name === pkg)?.cost || 0);
    }, 0);
    
    const subtotal = config.basePrice + colorCost + interiorCost + wheelsCost + packagesCost;
    const gst = subtotal * 0.28;
    return { subtotal, gst, total: subtotal + gst, customization: colorCost + interiorCost + wheelsCost + packagesCost };
  };

  const pricing = calculateTotal();

  const togglePackage = (pkgName: string) => {
    setConfig(prev => ({
      ...prev,
      packages: prev.packages.includes(pkgName)
        ? prev.packages.filter(p => p !== pkgName)
        : [...prev.packages, pkgName]
    }));
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Cuboid className="text-purple-600" /> Virtual Showroom
          </h1>
          <p className="text-slate-500">3D vehicle visualization and customization platform.</p>
        </div>

        <div className="flex gap-2">
          <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
            <Save size={16} />
            Save Config
          </button>
          <button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            <Share2 size={16} />
            Share
          </button>
        </div>
      </div>

      {/* Vehicle Selector */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
        <div className="flex gap-2 overflow-x-auto">
          {vehicles.map(vehicle => (
            <button
              key={vehicle}
              onClick={() => setSelectedVehicle(vehicle)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                selectedVehicle === vehicle
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {vehicle}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 3D Viewer */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-12 aspect-video flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]"></div>
            <div className="relative z-10 text-center">
              <Cuboid size={120} className="mx-auto text-purple-400 mb-4 animate-pulse" />
              <h3 className="text-2xl font-bold text-white mb-2">{selectedVehicle}</h3>
              <p className="text-slate-400">360° Interactive View</p>
              <div className="mt-6 flex gap-4 justify-center">
                <button className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm backdrop-blur-sm transition-colors">
                  ← Rotate
                </button>
                <button className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm backdrop-blur-sm transition-colors">
                  Zoom
                </button>
                <button className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm backdrop-blur-sm transition-colors">
                  Rotate →
                </button>
              </div>
            </div>
          </div>

          {/* AI Recommendations */}
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-100">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="text-purple-600" size={20} />
              <h3 className="font-bold text-slate-900">AI-Powered Recommendations</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3 bg-white p-3 rounded-lg">
                <Check className="text-green-600 mt-0.5" size={18} />
                <div className="flex-1">
                  <p className="font-medium text-slate-900">Add Panoramic Sunroof (+₹1.2L)</p>
                  <p className="text-sm text-slate-600">89% match based on customer preferences</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-white p-3 rounded-lg">
                <Check className="text-green-600 mt-0.5" size={18} />
                <div className="flex-1">
                  <p className="font-medium text-slate-900">Upgrade to Harman Kardon (+₹80K)</p>
                  <p className="text-sm text-slate-600">76% match - Premium audio experience</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Customization Panel */}
        <div className="space-y-6">
          {/* Exterior Color */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
            <div className="flex items-center gap-2 mb-4">
              <Palette size={18} className="text-purple-600" />
              <h3 className="font-bold text-slate-900">Exterior Color</h3>
            </div>
            <div className="space-y-2">
              {exteriorColors.map(color => (
                <button
                  key={color.name}
                  onClick={() => setConfig(prev => ({ ...prev, exteriorColor: color.name }))}
                  className={`w-full flex items-center justify-between p-3 rounded-lg border-2 transition-all ${
                    config.exteriorColor === color.name
                      ? 'border-purple-600 bg-purple-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full border-2 border-slate-300"
                      style={{ backgroundColor: color.hex }}
                    ></div>
                    <span className="font-medium text-slate-900">{color.name}</span>
                  </div>
                  {color.cost > 0 && (
                    <span className="text-sm text-slate-600">+₹{(color.cost / 100000).toFixed(1)}L</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Interior */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
            <div className="flex items-center gap-2 mb-4">
              <Settings size={18} className="text-purple-600" />
              <h3 className="font-bold text-slate-900">Interior</h3>
            </div>
            <div className="space-y-2">
              {interiorColors.map(interior => (
                <button
                  key={interior.name}
                  onClick={() => setConfig(prev => ({ ...prev, interiorColor: interior.name }))}
                  className={`w-full flex items-center justify-between p-3 rounded-lg border-2 transition-all ${
                    config.interiorColor === interior.name
                      ? 'border-purple-600 bg-purple-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <span className="font-medium text-slate-900">{interior.name}</span>
                  {interior.cost > 0 && (
                    <span className="text-sm text-slate-600">+₹{(interior.cost / 100000).toFixed(1)}L</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Wheels */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
            <h3 className="font-bold text-slate-900 mb-4">Wheels</h3>
            <div className="space-y-2">
              {wheelOptions.map(wheel => (
                <button
                  key={wheel.name}
                  onClick={() => setConfig(prev => ({ ...prev, wheels: wheel.name }))}
                  className={`w-full flex items-center justify-between p-3 rounded-lg border-2 transition-all ${
                    config.wheels === wheel.name
                      ? 'border-purple-600 bg-purple-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <span className="font-medium text-slate-900">{wheel.name}</span>
                  {wheel.cost > 0 && (
                    <span className="text-sm text-slate-600">+₹{(wheel.cost / 100000).toFixed(1)}L</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Packages */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
            <h3 className="font-bold text-slate-900 mb-4">Packages</h3>
            <div className="space-y-3">
              {packageOptions.map(pkg => (
                <div key={pkg.name}>
                  <button
                    onClick={() => togglePackage(pkg.name)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg border-2 transition-all ${
                      config.packages.includes(pkg.name)
                        ? 'border-purple-600 bg-purple-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="text-left">
                      <div className="font-medium text-slate-900">{pkg.name}</div>
                      <div className="text-xs text-slate-600">{pkg.features.join(', ')}</div>
                    </div>
                    <span className="text-sm text-slate-600">+₹{(pkg.cost / 100000).toFixed(1)}L</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
            <div className="flex items-center gap-2 mb-4">
              <IndianRupee className="text-green-600" size={20} />
              <h3 className="font-bold text-slate-900">Pricing Breakdown</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Base Price:</span>
                <span className="font-medium">₹{(config.basePrice / 100000).toFixed(2)}L</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Customization:</span>
                <span className="font-medium">₹{(pricing.customization / 100000).toFixed(2)}L</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-green-200">
                <span className="text-slate-600">Subtotal:</span>
                <span className="font-medium">₹{(pricing.subtotal / 100000).toFixed(2)}L</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">GST (28%):</span>
                <span className="font-medium">₹{(pricing.gst / 100000).toFixed(2)}L</span>
              </div>
              <div className="flex justify-between pt-2 border-t-2 border-green-300">
                <span className="font-bold text-slate-900">Total:</span>
                <span className="font-bold text-green-600 text-lg">₹{(pricing.total / 10000000).toFixed(2)}Cr</span>
              </div>
            </div>
            <button className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium transition-colors">
              Generate Quote
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VirtualShowroomPage;
