import React, { useState, useEffect } from 'react';
import { 
  Calculator, 
  Utensils, 
  Sparkles, 
  Cake, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  TrendingUp,
  Percent,
  AlertTriangle,
  Lightbulb
} from 'lucide-react';
import { api } from '../services/api';

export default function ReverseBudgetPlanner({ currentPin, onSelectPlan }) {
  const [guestCount, setGuestCount] = useState(40);
  const [eventType, setEventType] = useState('1st Birthday / Milestone');
  const [totalBudget, setTotalBudget] = useState(25000);
  const [loading, setLoading] = useState(false);
  const [calculationResult, setCalculationResult] = useState(null);

  const eventTypes = [
    '1st Birthday / Milestone',
    'Housewarming (Griha Pravesh)',
    'Bachelorette / Farewell',
    'Intimate Anniversary / Engagement',
    'Baby Shower / Godh Bharai'
  ];

  const quickBudgetPresets = [15000, 25000, 35000, 50000];

  useEffect(() => {
    runCalculation();
  }, [guestCount, eventType, totalBudget]);

  const runCalculation = async () => {
    setLoading(true);
    try {
      const res = await api.calculateReverseBudget({
        guestCount,
        eventType,
        totalBudget,
        pinCode: currentPin || '560038'
      });
      setCalculationResult(res);
    } catch (err) {
      console.error("Budget calculation failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              Transparent Dynamic Budget-to-Event Builder
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              No quote negotiations, no surprise hidden taxes. Enter your guest count and hard budget cap — we split it realistically and populate bookable verified options strictly under the cap.
            </p>
          </div>
        </div>
      </div>

      {/* Control Input Bar */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Guest Count */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <label htmlFor="guest-count-slider" className="font-semibold text-slate-300">Guest Count</label>
            <span className="font-mono font-bold text-rose-400">{guestCount} People</span>
          </div>
          <input
            id="guest-count-slider"
            type="range"
            min="10"
            max="120"
            step="5"
            aria-label="Guest Count"
            aria-valuemin="10"
            aria-valuemax="120"
            aria-valuenow={guestCount}
            value={guestCount}
            onChange={(e) => setGuestCount(Number(e.target.value))}
            className="w-full accent-rose-500 bg-slate-950 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>10 pax</span>
            <span>50 pax</span>
            <span>120 pax</span>
          </div>
        </div>

        {/* Event Type */}
        <div className="space-y-2">
          <label htmlFor="event-milestone-select" className="font-semibold text-slate-300 text-xs block">Event Milestone</label>
          <select
            id="event-milestone-select"
            aria-label="Event Milestone Category"
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-rose-500"
          >
            {eventTypes.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        {/* Hard Budget Cap */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <label htmlFor="custom-budget-input" className="font-semibold text-slate-300">Total Budget Cap</label>
            <span className="font-mono font-bold text-emerald-400">₹{totalBudget.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex space-x-1.5" role="group" aria-label="Quick Budget Presets">
            {quickBudgetPresets.map(b => (
              <button
                key={b}
                onClick={() => setTotalBudget(b)}
                aria-label={`Set budget to ₹${b.toLocaleString('en-IN')}`}
                className={`flex-1 py-1 px-1.5 rounded-lg text-[11px] font-mono transition ${
                  totalBudget === b 
                    ? 'bg-rose-500 text-white font-bold' 
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                ₹{(b/1000)}k
              </button>
            ))}
          </div>
          <input
            id="custom-budget-input"
            type="number"
            min="10000"
            max="200000"
            step="1000"
            aria-label="Custom Budget in Indian Rupees"
            value={totalBudget}
            onChange={(e) => setTotalBudget(Number(e.target.value))}
            className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white font-mono focus:outline-none focus:border-rose-500"
            placeholder="Custom budget in ₹"
          />
        </div>

      </div>

      {/* Realistic Split Progress Bar */}
      {calculationResult && (
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-white flex items-center space-x-1.5">
              <Percent className="w-3.5 h-3.5 text-rose-400" />
              <span>Real-World Budget Allocation Split</span>
            </span>
            <span className="text-[11px] font-mono text-emerald-400 font-semibold">
              Strictly fits in ₹{totalBudget.toLocaleString('en-IN')}
            </span>
          </div>

          {/* Multi-segment progress bar */}
          <div className="h-3 w-full rounded-full bg-slate-800 flex overflow-hidden">
            <div className="bg-amber-500 h-full transition-all duration-500" style={{ width: '50%' }} title="Catering: 50%" />
            <div className="bg-rose-500 h-full transition-all duration-500" style={{ width: '20%' }} title="Decor: 20%" />
            <div className="bg-pink-500 h-full transition-all duration-500" style={{ width: '15%' }} title="Cake & Dessert: 15%" />
            <div className="bg-sky-500 h-full transition-all duration-500" style={{ width: '15%' }} title="Ops & Escrow: 15%" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px]">
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span className="text-slate-300">Catering (50%): <strong className="font-mono text-white">₹{calculationResult.budgetSplit.catering.allocated.toLocaleString('en-IN')}</strong></span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span className="text-slate-300">Decor (20%): <strong className="font-mono text-white">₹{calculationResult.budgetSplit.decor.allocated.toLocaleString('en-IN')}</strong></span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-pink-500" />
              <span className="text-slate-300">Cake & Plinth (15%): <strong className="font-mono text-white">₹{calculationResult.budgetSplit.dessert.allocated.toLocaleString('en-IN')}</strong></span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
              <span className="text-slate-300">Ops & Escrow (15%): <strong className="font-mono text-white">₹{calculationResult.budgetSplit.logisticsAndOps.allocated.toLocaleString('en-IN')}</strong></span>
            </div>
          </div>
        </div>
      )}

      {/* Curated Package Cards Grid */}
      {calculationResult && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Catering */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                  <Utensils className="w-4 h-4" />
                </div>
                <span className="text-xs font-mono font-bold text-amber-400">
                  ₹{calculationResult.curatedPlan.catering.perPlateCost}/plate
                </span>
              </div>
              <h4 className="font-bold text-sm text-white">{calculationResult.curatedPlan.catering.title}</h4>
              <p className="text-[11px] text-slate-400">Vendor: {calculationResult.curatedPlan.catering.vendorAssigned}</p>
              
              <div className="pt-2 border-t border-slate-800 space-y-1">
                {calculationResult.curatedPlan.catering.menuItems.slice(0, 3).map((item, i) => (
                  <p key={i} className="text-[10px] text-slate-300 truncate">• {item}</p>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-xs">
              <span className="text-slate-400">For {guestCount} guests</span>
              <span className="font-mono font-bold text-white">₹{calculationResult.curatedPlan.catering.totalCateringCost.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Card 2: Decor */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                  Zero Damage
                </span>
              </div>
              <h4 className="font-bold text-sm text-white">{calculationResult.curatedPlan.decor.title}</h4>
              <p className="text-[11px] text-slate-400">{calculationResult.curatedPlan.decor.blueprint.width} Freestanding Frame</p>
              
              <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-300 space-y-1">
                <p>• {calculationResult.curatedPlan.decor.blueprint.mountType}</p>
                <p>• {calculationResult.curatedPlan.decor.blueprint.setupTimeEst} setup time</p>
                <p>• ₹2,000 Paint-Protection Guarantee</p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-xs">
              <span className="text-slate-400">Fixed Package</span>
              <span className="font-mono font-bold text-white">₹{calculationResult.curatedPlan.decor.basePrice.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Card 3: Cake & Confectionery */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-lg bg-pink-500/10 text-pink-400">
                  <Cake className="w-4 h-4" />
                </div>
                <span className="text-xs font-mono font-bold text-pink-400">Artisan Bake</span>
              </div>
              <h4 className="font-bold text-sm text-white">{calculationResult.curatedPlan.dessert.title}</h4>
              <p className="text-[11px] text-slate-400">{calculationResult.curatedPlan.dessert.flavor}</p>
              
              <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-300 space-y-1">
                <p>• Matching plinth stand included</p>
                <p>• Bakery: {calculationResult.curatedPlan.dessert.vendorAssigned}</p>
                <p>• Temperature-controlled delivery</p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-xs">
              <span className="text-slate-400">Custom Confection</span>
              <span className="font-mono font-bold text-white">₹{calculationResult.curatedPlan.dessert.totalCakeCost.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Card 4: Logistics & Clean-up */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-sky-500/20 text-sky-300">
                  Full Service
                </span>
              </div>
              <h4 className="font-bold text-sm text-white">Ops Desk & Next-Day Breakdown</h4>
              <p className="text-[11px] text-slate-400">Zero host anxiety on event day</p>
              
              <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-300 space-y-1">
                {calculationResult.curatedPlan.logistics.items.map((item, i) => (
                  <p key={i} className="truncate">• {item.name}</p>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-xs">
              <span className="text-slate-400">Ops & Cleanup</span>
              <span className="font-mono font-bold text-white">₹{calculationResult.curatedPlan.logistics.totalLogisticsCost.toLocaleString('en-IN')}</span>
            </div>
          </div>

        </div>
      )}

      {/* AI Optimization Tips Callout */}
      {calculationResult?.aiOptimizationTips && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-rose-950/30 border border-rose-500/20 text-xs">
          <div className="flex items-center space-x-2 text-rose-300 font-bold mb-2">
            <Lightbulb className="w-4 h-4" />
            <span>AI Event Architect Optimization Advice</span>
          </div>
          <div className="text-slate-300 leading-relaxed whitespace-pre-line">
            {calculationResult.aiOptimizationTips}
          </div>
        </div>
      )}

      {/* Bottom Summary Bar & Action */}
      {calculationResult && (
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div>
              <span className="text-xs text-slate-400 block">Total Curated Package:</span>
              <span className="text-xl font-extrabold font-mono text-white">
                ₹{calculationResult.calculatedTotal.toLocaleString('en-IN')}
              </span>
            </div>
            {calculationResult.savingsOrSurplus >= 0 && (
              <div className="px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                ₹{calculationResult.savingsOrSurplus.toLocaleString('en-IN')} Under Budget Cap!
              </div>
            )}
          </div>

          <button
            onClick={() => onSelectPlan && onSelectPlan(calculationResult)}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-orange-500 hover:from-rose-500 hover:to-orange-400 text-white font-bold text-sm shadow-xl shadow-rose-900/30 flex items-center justify-center space-x-2 transition"
          >
            <span>Lock Package into Escrow</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

    </div>
  );
}
