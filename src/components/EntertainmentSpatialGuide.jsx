import React, { useState, useEffect } from 'react';
import { 
  Music, 
  MapPin, 
  Sparkles, 
  Mic2, 
  Camera, 
  Smile, 
  Wand2, 
  Compass, 
  CheckCircle2, 
  Clock, 
  Maximize2,
  Plug,
  ArrowRight
} from 'lucide-react';
import { api } from '../services/api';

export default function EntertainmentSpatialGuide({ onSelectAct }) {
  const [acts, setActs] = useState([]);
  const [spatialGuide, setSpatialGuide] = useState(null);
  const [selectedZone, setSelectedZone] = useState(0);

  useEffect(() => {
    loadEntertainmentData();
  }, []);

  const loadEntertainmentData = async () => {
    try {
      const data = await api.getEntertainmentAndSpatial();
      if (data?.acts) {
        setActs(data.acts);
        setSpatialGuide(data.spatialGuide);
      }
    } catch (err) {
      console.error("Entertainment data error:", err);
    }
  };

  const getActIcon = (category) => {
    switch (category) {
      case 'Live Music': return <Music className="w-4 h-4 text-rose-400" />;
      case 'Games & Engagement': return <Mic2 className="w-4 h-4 text-amber-400" />;
      case 'Magic & Illusion': return <Wand2 className="w-4 h-4 text-purple-400" />;
      case 'Photo & Souvenir': return <Camera className="w-4 h-4 text-sky-400" />;
      case 'Art & Keepsake': return <Smile className="w-4 h-4 text-emerald-400" />;
      default: return <Sparkles className="w-4 h-4 text-rose-400" />;
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <Music className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                Live Entertainment & Spatial Placement Blueprint
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Curated entertainment artists + Architectural apartment floor planning: where to position backdrop, cake, music, buffet, and return gifts to avoid bottlenecks.
              </p>
            </div>
          </div>
        </div>

        <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300">
          Apartment Blueprint: 10x12 ft & 12x14 ft
        </div>
      </div>

      {/* Part 1: Spatial Placement Blueprint Guide */}
      {spatialGuide && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <Compass className="w-4 h-4 text-sky-400" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                1. Spatial Blueprint: Where to Place Every Event Element
              </h3>
            </div>
            <span className="text-xs text-slate-400">Designed for zero apartment congestion</span>
          </div>

          {/* Interactive Zone Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {spatialGuide.guidelines.map((g, i) => (
              <button
                key={i}
                onClick={() => setSelectedZone(i)}
                className={`p-2.5 rounded-2xl border text-left transition flex flex-col justify-between ${
                  selectedZone === i 
                    ? 'bg-slate-950 border-rose-500 text-white shadow-md shadow-rose-950/30 ring-1 ring-rose-500' 
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <span className="text-[10px] font-mono font-bold text-rose-400 block mb-1">
                  ZONE {i + 1}
                </span>
                <span className="font-bold text-xs text-white line-clamp-1">{g.zone.split('. ')[1]}</span>
              </button>
            ))}
          </div>

          {/* Active Zone Detail Card */}
          {spatialGuide.guidelines[selectedZone] && (
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                <div>
                  <span className="text-[10px] uppercase font-bold text-rose-400 font-mono">
                    RECOMMENDED APARTMENT POSITION
                  </span>
                  <h4 className="text-base font-extrabold text-white mt-0.5">
                    {spatialGuide.guidelines[selectedZone].zone}
                  </h4>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-sky-500/10 text-sky-300 border border-sky-500/20 text-xs font-semibold">
                  📍 {spatialGuide.guidelines[selectedZone].location}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-slate-400 font-semibold block text-[11px]">Why Place Here:</span>
                  <p className="text-slate-200 leading-relaxed">{spatialGuide.guidelines[selectedZone].reasoning}</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-slate-400 font-semibold block text-[11px]">Clearance & Floor Span:</span>
                  <p className="text-emerald-400 font-medium leading-relaxed">{spatialGuide.guidelines[selectedZone].clearanceNeeded}</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-slate-400 font-semibold block text-[11px]">Power / Setup SOP:</span>
                  <p className="text-amber-300 font-medium leading-relaxed">
                    {spatialGuide.guidelines[selectedZone].electricalSOP || "Non-slip rubber base plates required. Zero wall tape."}
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* Part 2: Curated Entertainment Acts */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              2. Add Live Entertainment & Interactive Experiences
            </h3>
          </div>
          <span className="text-xs text-slate-500">Self-contained gear • Scaled for apartment decibels</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {acts.map((act) => (
            <div
              key={act.id}
              className="p-5 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-4 shadow-xl hover:border-slate-700 transition"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 flex items-center space-x-1">
                    {getActIcon(act.category)}
                    <span>{act.category}</span>
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-400">
                    ⏱️ {act.duration}
                  </span>
                </div>

                <h4 className="font-bold text-base text-white">{act.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{act.description}</p>
                
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-300 space-y-1">
                  <div><strong className="text-slate-400">Gear:</strong> {act.equipmentIncluded}</div>
                  <div><strong className="text-slate-400">Space:</strong> {act.spaceRequirement}</div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase">Artist Fee</span>
                  <span className="text-lg font-black font-mono text-emerald-400">₹{act.price.toLocaleString('en-IN')}</span>
                </div>

                <button
                  onClick={() => onSelectAct && onSelectAct(act)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-rose-600 hover:from-purple-500 hover:to-rose-500 text-white font-bold text-xs flex items-center space-x-1.5 shadow-md shadow-purple-950/30 transition"
                >
                  <span>Book Artist</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
