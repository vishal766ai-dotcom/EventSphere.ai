import React, { useState, useEffect } from 'react';
import { 
  Gift, 
  Baby, 
  Sparkles, 
  Coffee, 
  HeartHandshake, 
  Leaf, 
  CheckCircle2, 
  Truck, 
  Calculator, 
  ArrowRight,
  PackageCheck,
  ShieldCheck
} from 'lucide-react';
import { api } from '../services/api';

export default function GuestGiftingHub({ onBookGifts }) {
  const [catalog, setCatalog] = useState([]);
  const [logisticsSOP, setLogisticsSOP] = useState(null);
  const [selectedAgeTab, setSelectedAgeTab] = useState(0);

  // Age distribution calculator state
  const [kidsCount, setKidsCount] = useState(8);
  const [teensCount, setTeensCount] = useState(4);
  const [adultsCount, setAdultsCount] = useState(20);
  const [seniorsCount, setSeniorsCount] = useState(8);
  const [packagingType, setPackagingType] = useState("Eco Jute Tote (+₹30/unit)");
  const [estimateData, setEstimateData] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    loadGiftingData();
  }, []);

  useEffect(() => {
    calculateEstimate();
  }, [kidsCount, teensCount, adultsCount, seniorsCount, packagingType]);

  const loadGiftingData = async () => {
    try {
      const data = await api.getGiftingCatalog();
      if (data?.catalog) {
        setCatalog(data.catalog);
        setLogisticsSOP(data.logisticsSOP);
      }
    } catch (err) {
      console.error("Gifting data error:", err);
    }
  };

  const calculateEstimate = async () => {
    setIsCalculating(true);
    try {
      const res = await api.estimateGifting({
        kids: kidsCount,
        teens: teensCount,
        adults: adultsCount,
        seniors: seniorsCount,
        packagingType
      });
      setEstimateData(res);
    } catch (err) {
      console.error("Estimate error:", err);
    } finally {
      setIsCalculating(false);
    }
  };

  const getAgeIcon = (iconName) => {
    switch (iconName) {
      case 'Baby': return <Baby className="w-4 h-4 text-pink-400" />;
      case 'Sparkles': return <Sparkles className="w-4 h-4 text-amber-400" />;
      case 'Coffee': return <Coffee className="w-4 h-4 text-emerald-400" />;
      case 'HeartHandshake': return <HeartHandshake className="w-4 h-4 text-sky-400" />;
      default: return <Gift className="w-4 h-4 text-rose-400" />;
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-400">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                Guest Return Favors & All-Ages Gifting Suite
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Say goodbye to generic plastic trinkets. Curated, sustainable return gifts categorized by age group with automated dark-store pre-bundling.
              </p>
            </div>
          </div>
        </div>

        <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold flex items-center space-x-1.5 self-start sm:self-auto">
          <Leaf className="w-3.5 h-3.5 text-emerald-400" />
          <span>Zero-Plastic Eco Packaging</span>
        </div>
      </div>

      {/* Section 1: Gifting by Age Group Catalog */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-2">
            <Gift className="w-4 h-4 text-pink-400" />
            <span>1. Curated Return Gifts by Age Group</span>
          </h3>
          <span className="text-xs text-slate-500">Select an age bracket to view gift options</span>
        </div>

        {/* Age Group Switcher Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {catalog.map((group, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedAgeTab(idx)}
              className={`p-3 rounded-2xl border text-left transition flex items-center space-x-3 ${
                selectedAgeTab === idx
                  ? 'bg-slate-900 border-pink-500 text-white shadow-lg shadow-pink-950/40 ring-1 ring-pink-500'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              <div className="p-2 rounded-xl bg-slate-800">
                {getAgeIcon(group.icon)}
              </div>
              <div>
                <h4 className="font-bold text-xs text-white">{group.ageGroup}</h4>
                <span className="text-[10px] text-slate-400 block line-clamp-1">{group.tagline}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Selected Age Group Items Grid */}
        {catalog[selectedAgeTab] && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {catalog[selectedAgeTab].items.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-3 shadow-xl hover:border-slate-700 transition"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-rose-300">
                      {item.id}
                    </span>
                    {item.ecoCertified && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 flex items-center space-x-1">
                        <Leaf className="w-2.5 h-2.5" />
                        <span>Eco-Friendly</span>
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-sm text-white">{item.title}</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{item.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase">Unit Price</span>
                    <span className="font-mono font-bold text-emerald-400 text-base">₹{item.pricePerUnit}</span>
                  </div>
                  <span className="text-[11px] text-slate-400 italic">Best for: {item.bestFor}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Section 2: Interactive Age Distribution Estimator & Budget Calculator */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center space-x-2">
              <Calculator className="w-4 h-4 text-emerald-400" />
              <span>2. Guest Age Distribution & Gift Budget Estimator</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Input your guest age breakdown to calculate exact bundle quantities and packaging.
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-rose-400 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
            Total Guests: {Number(kidsCount) + Number(teensCount) + Number(adultsCount) + Number(seniorsCount)} Pax
          </span>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-pink-300 flex items-center space-x-1.5">
                <Baby className="w-3.5 h-3.5" />
                <span>Kids (3-12 yrs)</span>
              </span>
              <span className="font-mono font-bold text-white text-sm">{kidsCount}</span>
            </div>
            <input
              type="range"
              min="0"
              max="40"
              value={kidsCount}
              onChange={(e) => setKidsCount(Number(e.target.value))}
              className="w-full accent-pink-500 cursor-pointer"
            />
            <span className="text-[10px] text-slate-500 block">DIY Pottery Painting Kits</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-amber-300 flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Teens (13-25 yrs)</span>
              </span>
              <span className="font-mono font-bold text-white text-sm">{teensCount}</span>
            </div>
            <input
              type="range"
              min="0"
              max="40"
              value={teensCount}
              onChange={(e) => setTeensCount(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <span className="text-[10px] text-slate-500 block">Plantable Seed Journals</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-emerald-300 flex items-center space-x-1.5">
                <Coffee className="w-3.5 h-3.5" />
                <span>Adults (26-55 yrs)</span>
              </span>
              <span className="font-mono font-bold text-white text-sm">{adultsCount}</span>
            </div>
            <input
              type="range"
              min="0"
              max="80"
              value={adultsCount}
              onChange={(e) => setAdultsCount(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <span className="text-[10px] text-slate-500 block">Kashmiri Kahwa & Honey Jars</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-sky-300 flex items-center space-x-1.5">
                <HeartHandshake className="w-3.5 h-3.5" />
                <span>Seniors (55+ yrs)</span>
              </span>
              <span className="font-mono font-bold text-white text-sm">{seniorsCount}</span>
            </div>
            <input
              type="range"
              min="0"
              max="40"
              value={seniorsCount}
              onChange={(e) => setSeniorsCount(Number(e.target.value))}
              className="w-full accent-sky-500 cursor-pointer"
            />
            <span className="text-[10px] text-slate-500 block">Pure Brass Temple Diyas</span>
          </div>

        </div>

        {/* Packaging Selector */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div>
            <span className="font-semibold text-white block">Sustainable Presentation & Packaging:</span>
            <span className="text-[11px] text-slate-400">Includes personalized laser-printed seed-paper thank-you tags</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {["Eco Jute Tote (+₹30/unit)", "Bamboo Keepsake Box (+₹50/unit)", "Standard Paper Sleeve (Free)"].map((pkg) => (
              <button
                key={pkg}
                onClick={() => setPackagingType(pkg)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                  packagingType === pkg 
                    ? 'bg-rose-500 text-white font-semibold' 
                    : 'bg-slate-900 border border-slate-700 text-slate-300 hover:bg-slate-800'
                }`}
              >
                {pkg}
              </button>
            ))}
          </div>
        </div>

        {/* Calculated Breakdown Summary */}
        {estimateData && (
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-3">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              {estimateData.breakdown.map((b, i) => (
                <div key={i} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="flex justify-between items-center text-slate-400 text-[10px] mb-1">
                    <span>{b.ageGroup}</span>
                    <span className="font-mono font-bold text-white">{b.count} units</span>
                  </div>
                  <div className="text-white font-semibold truncate text-[11px]">{b.selectedGift}</div>
                  <div className="text-emerald-400 font-mono font-bold mt-1">₹{b.subtotal.toLocaleString('en-IN')}</div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-0.5">
                <span className="text-slate-400 text-xs">Total Gift Package & Presentation:</span>
                <div className="text-2xl font-black font-mono text-white">
                  ₹{estimateData.grandTotal.toLocaleString('en-IN')}
                  <span className="text-xs font-normal text-slate-400 ml-2">
                    (₹{Math.round(estimateData.grandTotal / Math.max(estimateData.totalGuests, 1))}/guest average)
                  </span>
                </div>
              </div>

              <button
                onClick={() => onBookGifts && onBookGifts(estimateData)}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-500 hover:to-rose-400 text-white font-bold text-xs shadow-lg shadow-pink-950/40 flex items-center justify-center space-x-2 transition"
              >
                <PackageCheck className="w-4 h-4" />
                <span>Bundle Return Gifts to Event Setup</span>
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Section 3: 4-Step Gifting Process Protocol */}
      {logisticsSOP && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center space-x-2 pb-2 border-b border-slate-800">
            <Truck className="w-4 h-4 text-sky-400" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              3. The EventSphere 4-Step Gifting Process
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            {logisticsSOP.steps.map((st) => (
              <div key={st.step} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="w-7 h-7 rounded-full bg-pink-500/20 text-pink-400 font-bold flex items-center justify-center text-xs font-mono">
                  {st.step}
                </div>
                <h4 className="font-bold text-white text-xs">{st.title}</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
