import React, { useState, useEffect } from 'react';
import { 
  Layers, 
  Ruler, 
  ShieldCheck, 
  Zap, 
  Sparkles, 
  Image as ImageIcon, 
  FileText, 
  Sliders, 
  Leaf, 
  CheckCircle2, 
  Info,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { api } from '../services/api';

export default function HonestPackagesView({ onBookPackage }) {
  const [packages, setPackages] = useState([]);
  const [activeCardView, setActiveCardView] = useState({}); // { [pkgId]: 'split' | 'sketch' | 'photo' }
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [ecoFilter, setEcoFilter] = useState(false);
  const [selectedCleanups, setSelectedCleanups] = useState({});

  useEffect(() => {
    loadPackages();
  }, [ecoFilter]);

  const loadPackages = async () => {
    try {
      const data = await api.getPackages({ ecoOnly: ecoFilter });
      if (data?.packages) {
        setPackages(data.packages);
        const initialViews = {};
        data.packages.forEach(p => {
          initialViews[p.id] = 'split'; // Default to side-by-side Honest Split View
        });
        setActiveCardView(initialViews);
      }
    } catch (err) {
      console.error("Failed to load packages:", err);
    }
  };

  const toggleCleanup = (pkgId) => {
    setSelectedCleanups(prev => ({
      ...prev,
      [pkgId]: !prev[pkgId]
    }));
  };

  const setViewForPackage = (pkgId, view) => {
    setActiveCardView(prev => ({
      ...prev,
      [pkgId]: view
    }));
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400">
              <Layers className="w-5 h-5" />
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              Honest Aesthetic Split Cards
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Zero Pinterest over-filtering. We show you exact architectural blueprints alongside unedited photos from real Indian apartments.
          </p>
        </div>

        {/* Filter Badges */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setEcoFilter(!ecoFilter)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition ${
              ecoFilter 
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-950/40' 
                : 'bg-slate-900 border border-slate-700 text-emerald-400 hover:bg-slate-800'
            }`}
          >
            <Leaf className="w-3.5 h-3.5" />
            <span>Zero-Waste / Eco Only</span>
          </button>
        </div>
      </div>

      {/* Zero Damage Guarantee Callout */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-sky-950/30 border border-emerald-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-white flex items-center space-x-2">
              <span>Standardized Zero-Damage SOP & ₹2,000 Paint Warranty</span>
              <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 font-mono">Guaranteed</span>
            </h4>
            <p className="text-xs text-slate-300 mt-0.5">
              All decorators carry free-standing metal frames with silicone feet. No tape peeling your rented flat wall paint.
            </p>
          </div>
        </div>
        <div className="text-xs font-mono text-slate-400 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 whitespace-nowrap">
          SOP Ref: #ZERO-DAMAGE-2026
        </div>
      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 gap-8">
        {packages.map((pkg) => {
          const view = activeCardView[pkg.id] || 'split';
          const hasCleanup = selectedCleanups[pkg.id] ?? true;
          const finalPrice = pkg.basePrice + (hasCleanup ? (pkg.cleanupAddon?.price || 499) : 0);

          return (
            <div 
              key={pkg.id}
              className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl hover:border-slate-700 transition"
            >
              {/* Card Header */}
              <div className="p-5 border-b border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950/50">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
                      {pkg.category}
                    </span>
                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-sky-500/10 text-sky-300 border border-sky-500/20">
                      {pkg.roomSuitability}
                    </span>
                    {pkg.sustainability?.isEco && (
                      <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 flex items-center space-x-1">
                        <Leaf className="w-3 h-3" />
                        <span>Zero-Waste</span>
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white mt-1.5">{pkg.title}</h3>
                  <p className="text-xs text-slate-400">{pkg.tagline}</p>
                </div>

                {/* View Mode Switcher */}
                <div className="flex items-center space-x-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
                  <button
                    onClick={() => setViewForPackage(pkg.id, 'split')}
                    className={`px-3 py-1 rounded-lg font-medium transition ${
                      view === 'split' ? 'bg-rose-500 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Side-by-Side Split
                  </button>
                  <button
                    onClick={() => setViewForPackage(pkg.id, 'sketch')}
                    className={`px-3 py-1 rounded-lg font-medium transition ${
                      view === 'sketch' ? 'bg-sky-500 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Blueprint Only
                  </button>
                  <button
                    onClick={() => setViewForPackage(pkg.id, 'photo')}
                    className={`px-3 py-1 rounded-lg font-medium transition ${
                      view === 'photo' ? 'bg-amber-500 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Real Photo Only
                  </button>
                </div>
              </div>

              {/* Visual Presentation Area */}
              <div className="p-5">
                
                {/* Side-by-side or Single View */}
                <div className={`grid gap-4 ${view === 'split' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
                  
                  {/* SIDE A: Technical Blueprint & Blueprint Specs */}
                  {(view === 'split' || view === 'sketch') && (
                    <div className="rounded-2xl bg-slate-950 border border-slate-800 p-4 relative blueprint-grid flex flex-col justify-between">
                      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-xs">
                        <div className="flex items-center space-x-1.5 text-sky-400 font-bold">
                          <Ruler className="w-4 h-4" />
                          <span>SIDE A: Architectural Blueprint Diagram</span>
                        </div>
                        <span className="font-mono text-[10px] text-slate-400">SOP: {pkg.blueprint.sopRef}</span>
                      </div>

                      {/* SVG Blueprint Diagram */}
                      <div className="my-2 h-56 flex items-center justify-center rounded-xl bg-slate-900/60 border border-sky-500/20 p-2 overflow-hidden">
                        <img 
                          src={pkg.blueprint.blueprintSketch} 
                          alt="Blueprint Sketch"
                          className="max-h-full max-w-full object-contain filter drop-shadow" 
                        />
                      </div>

                      {/* Blueprint Dimension Specs */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-slate-800/80 text-[11px]">
                        <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                          <span className="text-slate-400 block text-[10px]">Dimensions:</span>
                          <span className="font-bold text-white font-mono">{pkg.blueprint.width} x {pkg.blueprint.height}</span>
                        </div>
                        <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                          <span className="text-slate-400 block text-[10px]">Frame Mount:</span>
                          <span className="font-bold text-emerald-400">Freestanding</span>
                        </div>
                        <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                          <span className="text-slate-400 block text-[10px]">Power Needs:</span>
                          <span className="font-bold text-amber-300 font-mono">{pkg.blueprint.plugPointsNeeded} Sockets</span>
                        </div>
                        <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                          <span className="text-slate-400 block text-[10px]">Setup Time:</span>
                          <span className="font-bold text-sky-300">{pkg.blueprint.setupTimeEst}</span>
                        </div>
                      </div>

                    </div>
                  )}

                  {/* SIDE B: Real Unedited Customer Photo */}
                  {(view === 'split' || view === 'photo') && (
                    <div className="rounded-2xl bg-slate-950 border border-slate-800 p-4 flex flex-col justify-between">
                      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-xs">
                        <div className="flex items-center space-x-1.5 text-amber-400 font-bold">
                          <ImageIcon className="w-4 h-4" />
                          <span>SIDE B: Unedited Real Apartment Photo</span>
                        </div>
                        <span className="text-[10px] text-emerald-400 font-semibold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                          Verified Host Review
                        </span>
                      </div>

                      {/* Photo Container */}
                      <div className="my-2 h-56 rounded-xl overflow-hidden relative border border-slate-800 group">
                        <img 
                          src={pkg.honestPhoto.imageUrl} 
                          alt="Real apartment photo"
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex flex-col justify-end p-3">
                          <p className="text-xs text-white font-medium">{pkg.honestPhoto.caption}</p>
                          <p className="text-[11px] text-slate-300 italic mt-0.5">"{pkg.honestPhoto.verifiedHostComment}"</p>
                        </div>
                      </div>

                      {/* Lighting and Wall Context */}
                      <div className="pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
                        <span>Lighting: {pkg.honestPhoto.lightingCondition}</span>
                        <span className="text-slate-300 font-mono">Zero Wall Nails Used</span>
                      </div>

                    </div>
                  )}

                </div>

                {/* Material Specification Checklist */}
                <div className="mt-4 p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-xs">
                  <div className="font-semibold text-slate-300 mb-2 flex items-center space-x-2">
                    <FileText className="w-3.5 h-3.5 text-rose-400" />
                    <span>Exact Materials Dispatched in Decorator Kit:</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-[11px] text-slate-400">
                    {pkg.blueprint.materials.map((mat, i) => (
                      <div key={i} className="flex items-start space-x-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span>{mat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer Controls: Clean-up add-on & Booking Button */}
                <div className="mt-4 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  
                  {/* Clean up checkbox */}
                  <div className="flex items-center space-x-3 bg-slate-950 px-3.5 py-2.5 rounded-xl border border-slate-800">
                    <input
                      type="checkbox"
                      id={`cleanup-${pkg.id}`}
                      checked={hasCleanup}
                      onChange={() => toggleCleanup(pkg.id)}
                      className="w-4 h-4 rounded text-rose-500 bg-slate-900 border-slate-700 focus:ring-rose-500 cursor-pointer"
                    />
                    <label htmlFor={`cleanup-${pkg.id}`} className="text-xs cursor-pointer select-none">
                      <span className="font-bold text-white">Next-Day Morning Clean-Up Crew </span>
                      <span className="text-rose-400 font-mono font-semibold">(+₹{pkg.cleanupAddon?.price || 499})</span>
                      <p className="text-[10px] text-slate-400">Staff arrives at 9:30 AM next day, deflates balloons and leaves room spotless</p>
                    </label>
                  </div>

                  {/* Pricing and Book Button */}
                  <div className="flex items-center space-x-4 self-end sm:self-auto">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block uppercase">Transparent Price</span>
                      <span className="text-xl font-black font-mono text-white">
                        ₹{finalPrice.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <button
                      onClick={() => onBookPackage && onBookPackage(pkg, hasCleanup)}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-orange-500 hover:from-rose-500 hover:to-orange-400 text-white font-bold text-xs shadow-lg shadow-rose-900/30 flex items-center space-x-1.5 transition"
                    >
                      <Zap className="w-3.5 h-3.5 fill-current" />
                      <span>Book with Escrow Protection</span>
                    </button>
                  </div>

                </div>

              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
