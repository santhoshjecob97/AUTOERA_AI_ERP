import React, { useState } from 'react';
import { DollarSign, TrendingUp, TrendingDown, Target, AlertCircle, Sparkles, BarChart3, Users, Calendar } from 'lucide-react';

const PricingPage: React.FC = () => {
  const [selectedVehicle, setSelectedVehicle] = useState('BMW X7');
  const [discountPercent, setDiscountPercent] = useState(2);
  
  const vehicles = [
    { name: 'BMW X7', basePrice: 13593600, aiSuggested: 13393600, minPrice: 13000000, maxPrice: 14000000 },
    { name: 'Audi Q7', basePrice: 9000000, aiSuggested: 8820000, minPrice: 8500000, maxPrice: 9500000 },
    { name: 'Mercedes GLE', basePrice: 11500000, aiSuggested: 11270000, minPrice: 11000000, maxPrice: 12000000 },
  ];

  const currentVehicle = vehicles.find(v => v.name === selectedVehicle) || vehicles[0];
  const discountedPrice = currentVehicle.basePrice * (1 - discountPercent / 100);
  
  // AI Calculations
  const conversionProb = Math.min(95, 70 + (discountPercent * 5));
  const expectedRevenue = discountedPrice * (conversionProb / 100);
  const profitMargin = Math.max(5, 12 - discountPercent);
  const daysToSale = Math.max(1, 5 - discountPercent);

  const competitors = [
    { name: 'Dealer A', price: 13800000, lastUpdated: '2 hours ago' },
    { name: 'Dealer B', price: 13600000, lastUpdated: '5 hours ago' },
    { name: 'Dealer C', price: 13400000, lastUpdated: '1 day ago' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <DollarSign className="text-green-600" /> Dynamic Pricing
        </h1>
        <p className="text-slate-500">AI-powered pricing optimization with market intelligence.</p>
      </div>

      {/* Vehicle Selector */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
        <div className="flex gap-2 overflow-x-auto">
          {vehicles.map(vehicle => (
            <button
              key={vehicle.name}
              onClick={() => setSelectedVehicle(vehicle.name)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                selectedVehicle === vehicle.name
                  ? 'bg-green-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {vehicle.name}
            </button>
          ))}
        </div>
      </div>

      {/* AI Recommendation */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="text-green-600" size={24} />
          <h3 className="text-xl font-bold text-slate-900">AI Pricing Recommendation</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div className="text-3xl font-bold text-green-600">₹{(currentVehicle.aiSuggested / 10000000).toFixed(2)}Cr</div>
            <div className="text-sm text-slate-600">Optimal Price (2% discount)</div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold text-slate-900">92%</div>
              <TrendingUp className="text-green-600" size={20} />
            </div>
            <div className="text-sm text-slate-600">AI Confidence</div>
            <div className="w-full bg-green-200 rounded-full h-2 mt-2">
              <div className="bg-green-600 h-2 rounded-full" style={{ width: '92%' }}></div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <div className="font-bold text-slate-900">{conversionProb}%</div>
              <div className="text-slate-600">Conversion</div>
            </div>
            <div>
              <div className="font-bold text-slate-900">{profitMargin.toFixed(1)}%</div>
              <div className="text-slate-600">Margin</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Market Analysis */}
        <div className="lg:col-span-2 space-y-6">
          {/* Competitor Prices */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="text-blue-600" size={20} />
              <h3 className="font-bold text-slate-900">Competitor Analysis</h3>
            </div>
            <div className="space-y-3">
              {competitors.map((comp, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <div className="font-medium text-slate-900">{comp.name}</div>
                    <div className="text-xs text-slate-500">{comp.lastUpdated}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-slate-900">₹{(comp.price / 10000000).toFixed(2)}Cr</div>
                    <div className={`text-xs ${comp.price > currentVehicle.aiSuggested ? 'text-green-600' : 'text-red-600'}`}>
                      {comp.price > currentVehicle.aiSuggested ? 'Above' : 'Below'} AI price
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-blue-50 rounded-lg flex items-start gap-2">
              <Target className="text-blue-600 mt-0.5" size={18} />
              <div className="text-sm text-blue-900">
                <strong>Market Position:</strong> Competitive - Your AI-suggested price is {((currentVehicle.aiSuggested / competitors[1].price) * 100 - 100).toFixed(1)}% below average competitor pricing
              </div>
            </div>
          </div>

          {/* Pricing Impact Simulator */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            <h3 className="font-bold text-slate-900 mb-4">Pricing Impact Simulator</h3>
            
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-slate-700">Discount: {discountPercent}%</span>
                <span className="text-sm text-slate-600">₹{(discountedPrice / 10000000).toFixed(2)}Cr</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                step="0.5"
                value={discountPercent}
                onChange={(e) => setDiscountPercent(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-green-600"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>0%</span>
                <span>5%</span>
                <span>10%</span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center gap-1 text-green-600 mb-1">
                  <TrendingUp size={16} />
                  <span className="text-xs font-medium">Conversion</span>
                </div>
                <div className="text-2xl font-bold text-slate-900">{conversionProb}%</div>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-1 text-blue-600 mb-1">
                  <DollarSign size={16} />
                  <span className="text-xs font-medium">Expected Revenue</span>
                </div>
                <div className="text-lg font-bold text-slate-900">₹{(expectedRevenue / 10000000).toFixed(2)}Cr</div>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center gap-1 text-purple-600 mb-1">
                  <BarChart3 size={16} />
                  <span className="text-xs font-medium">Profit Margin</span>
                </div>
                <div className="text-2xl font-bold text-slate-900">{profitMargin.toFixed(1)}%</div>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg">
                <div className="flex items-center gap-1 text-orange-600 mb-1">
                  <Calendar size={16} />
                  <span className="text-xs font-medium">Time to Sale</span>
                </div>
                <div className="text-2xl font-bold text-slate-900">{daysToSale.toFixed(1)}d</div>
              </div>
            </div>
          </div>

          {/* Customer Price Sensitivity */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Users className="text-purple-600" size={20} />
              <h3 className="font-bold text-slate-900">Customer Price Sensitivity</h3>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-slate-900">Rajesh Kumar</span>
                <span className="text-sm px-2 py-1 bg-purple-200 text-purple-800 rounded-full">Medium Sensitivity</span>
              </div>
              <p className="text-sm text-slate-700 mb-3">
                Customer is willing to pay premium for features but expects competitive pricing. Recommend 2% discount to accelerate decision.
              </p>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="p-2 bg-white rounded">
                  <div className="text-slate-600">Price Elasticity</div>
                  <div className="font-bold text-slate-900">-1.8</div>
                </div>
                <div className="p-2 bg-white rounded">
                  <div className="text-slate-600">Budget Range</div>
                  <div className="font-bold text-slate-900">₹1.2-1.4Cr</div>
                </div>
                <div className="p-2 bg-white rounded">
                  <div className="text-slate-600">Urgency</div>
                  <div className="font-bold text-green-600">High</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Strategy */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            <h3 className="font-bold text-slate-900 mb-4">Pricing Strategy</h3>
            
            <div className="space-y-3 mb-6">
              <div className="p-3 bg-slate-50 rounded-lg">
                <div className="text-sm text-slate-600">Current Price</div>
                <div className="text-xl font-bold text-slate-900">₹{(currentVehicle.basePrice / 10000000).toFixed(2)}Cr</div>
              </div>
              <div className="p-3 bg-green-50 rounded-lg border-2 border-green-200">
                <div className="flex items-center gap-1 text-sm text-green-700 mb-1">
                  <Sparkles size={14} />
                  <span>AI Suggested</span>
                </div>
                <div className="text-xl font-bold text-green-600">₹{(currentVehicle.aiSuggested / 10000000).toFixed(2)}Cr</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <div className="text-sm text-slate-600">Min Price</div>
                <div className="text-lg font-bold text-slate-900">₹{(currentVehicle.minPrice / 10000000).toFixed(2)}Cr</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <div className="text-sm text-slate-600">Max Price</div>
                <div className="text-lg font-bold text-slate-900">₹{(currentVehicle.maxPrice / 10000000).toFixed(2)}Cr</div>
              </div>
            </div>

            <div className="space-y-2 mb-6">
              <label className="text-sm font-medium text-slate-700">Discount Options:</label>
              {[0, 2, 3, 5].map(discount => (
                <button
                  key={discount}
                  onClick={() => setDiscountPercent(discount)}
                  className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                    discountPercent === discount
                      ? 'border-green-600 bg-green-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-900">
                      {discount === 0 ? 'No Discount' : `${discount}% Off`}
                      {discount === 2 && <span className="ml-2 text-xs px-2 py-0.5 bg-green-200 text-green-800 rounded-full">⭐ AI</span>}
                    </span>
                    <span className="text-sm text-slate-600">
                      ₹{((currentVehicle.basePrice * (1 - discount / 100)) / 10000000).toFixed(2)}Cr
                    </span>
                  </div>
                </button>
              ))}
            </div>

            <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium transition-colors mb-2">
              Apply AI Pricing
            </button>
            <button className="w-full bg-white border-2 border-slate-200 hover:bg-slate-50 text-slate-700 py-3 rounded-lg font-medium transition-colors">
              Manual Override
            </button>
          </div>

          {/* Market Indicators */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            <h3 className="font-bold text-slate-900 mb-4">Market Indicators</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-slate-600">Demand Level</span>
                  <span className="text-sm font-bold text-red-600">🔥 High</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="bg-red-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-slate-600">Inventory Age</span>
                  <span className="text-sm font-bold text-green-600">12 days (Fresh)</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '20%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-slate-600">Market Trend</span>
                  <span className="text-sm font-bold text-blue-600">↗ Increasing</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
