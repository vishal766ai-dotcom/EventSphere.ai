import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  Radio, 
  Send, 
  Sparkles, 
  Users, 
  Cake, 
  Utensils, 
  Gift, 
  Leaf, 
  ShieldCheck 
} from 'lucide-react';
import { api } from '../services/api';

export default function EventTimelineManager() {
  const [timeline, setTimeline] = useState(null);
  const [activeFilter, setActiveFilter] = useState('ALL');

  useEffect(() => {
    loadTimeline();
  }, []);

  const loadTimeline = async () => {
    try {
      const data = await api.getTimeline();
      setTimeline(data);
    } catch (err) {
      console.error("Timeline load error:", err);
    }
  };

  const getStageIcon = (stage) => {
    const s = stage.toLowerCase();
    if (s.includes('setup') || s.includes('pre')) return <ShieldCheck className="w-4 h-4 text-sky-400" />;
    if (s.includes('decor') || s.includes('lighting')) return <Sparkles className="w-4 h-4 text-amber-400" />;
    if (s.includes('welcome') || s.includes('guest')) return <Users className="w-4 h-4 text-emerald-400" />;
    if (s.includes('cake') || s.includes('highlight')) return <Cake className="w-4 h-4 text-pink-400" />;
    if (s.includes('dinner') || s.includes('catering')) return <Utensils className="w-4 h-4 text-orange-400" />;
    if (s.includes('gift') || s.includes('farewell')) return <Gift className="w-4 h-4 text-purple-400" />;
    if (s.includes('clean') || s.includes('breakdown')) return <Leaf className="w-4 h-4 text-emerald-400" />;
    return <Clock className="w-4 h-4 text-rose-400" />;
  };

  if (!timeline) {
    return <div className="p-8 text-center text-slate-400 text-xs">Loading Event Time Schedule...</div>;
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                Event Time Management — Run of Show
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Minute-by-minute schedule of what happens at the event: from vendor setup and stage lighting tests to cake cutting, dinner, and return gift handover.
              </p>
            </div>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-rose-400" />
          <span className="font-bold text-white">{timeline.eventName}</span>
          <span className="text-slate-500 font-mono">• {timeline.totalDuration}</span>
        </div>
      </div>

      {/* Timeline Milestones Cards */}
      <div className="relative pl-6 border-l-2 border-slate-800 space-y-6">
        {timeline.milestones.map((m, idx) => {
          const isDone = m.status === 'COMPLETED';
          const isCurrent = m.status === 'IN_PROGRESS';

          return (
            <div key={idx} className="relative group">
              {/* Timeline Node Point */}
              <div 
                className={`absolute -left-[31px] top-1.5 w-6 h-6 rounded-full border-2 flex items-center justify-center transition ${
                  isDone 
                    ? 'bg-emerald-950 border-emerald-400 text-emerald-400' 
                    : (isCurrent 
                        ? 'bg-rose-950 border-rose-500 text-rose-400 ring-4 ring-rose-500/20' 
                        : 'bg-slate-950 border-slate-700 text-slate-500')
                }`}
              >
                {isDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : <span className="w-2 h-2 rounded-full bg-current" />}
              </div>

              {/* Card Container */}
              <div 
                className={`p-5 rounded-3xl border transition shadow-xl ${
                  isCurrent 
                    ? 'bg-slate-900 border-rose-500/80 shadow-rose-950/30' 
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
                  <div className="flex items-center space-x-2.5">
                    <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                      {getStageIcon(m.stage)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-mono font-bold text-rose-400">{m.time}</span>
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                          {m.stage}
                        </span>
                      </div>
                      <h4 className="font-bold text-base text-white mt-0.5">{m.title}</h4>
                    </div>
                  </div>

                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full self-start sm:self-auto font-mono ${
                    isDone 
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                      : (isCurrent 
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse' 
                          : 'bg-slate-800 text-slate-400')
                  }`}>
                    {m.status}
                  </span>
                </div>

                <div className="pt-3 grid grid-cols-1 md:grid-cols-12 gap-4 text-xs">
                  <div className="md:col-span-7 space-y-1">
                    <span className="text-slate-400 font-semibold block text-[11px]">What Happens at Event:</span>
                    <p className="text-slate-200 leading-relaxed">{m.whatHappens}</p>
                  </div>

                  <div className="md:col-span-5 p-3 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-1">
                    <span className="text-rose-400 font-bold block text-[11px]">Host Action Cue:</span>
                    <p className="text-slate-300 text-[11px] leading-relaxed">{m.hostAction}</p>
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
