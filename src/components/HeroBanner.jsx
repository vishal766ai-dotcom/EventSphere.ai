import React from 'react';
import { Zap, ShieldCheck, Paintbrush, Clock, Sparkles, ArrowRight, CheckCircle2, Leaf } from 'lucide-react';

export default function HeroBanner({ onQuickAction, currentPin, dispatchData }) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 p-6 sm:p-8 mb-8 shadow-2xl">
      
      {/* Background glow effects */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-rose-600/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-orange-600/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Column: Vision & Action */}
        <div className="lg:col-span-7 space-y-5">
          
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-gradient-to-r from-rose-500/10 to-amber-500/10 border border-rose-500/30 text-xs font-semibold text-rose-300">
            <Zap className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
            <span>Uber for Last-Minute Celebrations (90–120 Min Setup)</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Celebrate Spontaneously. <br />
            <span className="bg-gradient-to-r from-rose-400 via-orange-300 to-amber-300 bg-clip-text text-transparent">
              Honest Blueprints. Zero Paint Damage.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
            No more waiting 48 hours or peeling apartment wall paint with cheap double-sided tape. 
            Pre-assembled dark store kits, verified freelance gig decorators dispatched to your pin code, 
            and escrow-protected payments released only when you verify the setup.
          </p>

          {/* Key Trust Pillars */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            
            <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/60">
              <div className="flex items-center space-x-1.5 text-rose-400 font-bold text-xs mb-1">
                <Clock className="w-3.5 h-3.5" />
                <span>90-Min Sprint</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">Dark store inventory across metro pin codes</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/60">
              <div className="flex items-center space-x-1.5 text-emerald-400 font-bold text-xs mb-1">
                <Paintbrush className="w-3.5 h-3.5" />
                <span>₹2,000 Warranty</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">Freestanding metal arches, zero tape on wall</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/60">
              <div className="flex items-center space-x-1.5 text-sky-400 font-bold text-xs mb-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Smart Escrow</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">Payment locked until host OTP handover</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/60">
              <div className="flex items-center space-x-1.5 text-emerald-300 font-bold text-xs mb-1">
                <Leaf className="w-3.5 h-3.5" />
                <span>Clean-Up Crew</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">Next-day breakdown & zero-waste composting</p>
            </div>

          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onQuickAction('express')}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-rose-600 via-rose-500 to-orange-500 hover:from-rose-500 hover:to-orange-400 text-white font-bold text-sm shadow-xl shadow-rose-900/30 flex items-center space-x-2 transition transform hover:-translate-y-0.5"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>Launch 90-Min Express Setup</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onQuickAction('budget')}
              className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-sm flex items-center space-x-2 transition"
            >
              <span>Reverse Budget Planner</span>
            </button>

            <button
              onClick={() => onQuickAction('visualizer')}
              className="px-4 py-3 rounded-xl bg-slate-800/60 hover:bg-slate-700 border border-slate-700/80 text-rose-300 font-semibold text-sm flex items-center space-x-1.5 transition"
            >
              <Sparkles className="w-4 h-4 text-rose-400" />
              <span>AI Living Room Fit</span>
            </button>
          </div>

        </div>

        {/* Right Column: Live Hyperlocal Status Card */}
        <div className="lg:col-span-5">
          <div className="rounded-2xl bg-slate-950/80 border border-slate-800 p-5 shadow-inner">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-bold text-slate-200">Hyperlocal Dispatch Desk</span>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-rose-300">
                PIN: {currentPin}
              </span>
            </div>

            <div className="py-4 space-y-3 text-xs">
              
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Assigned Dark Store Hub:</span>
                <span className="font-semibold text-slate-200 text-right">
                  {dispatchData?.assignedDarkStore?.name || "Indiranagar Hub 401"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Pre-packed Standard Kits in Stock:</span>
                <span className="font-mono font-bold text-emerald-400">
                  {dispatchData?.availableKitsCount || 42} Kits Ready
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Verified Gig Decorators Nearby:</span>
                <span className="font-semibold text-slate-200">
                  {dispatchData?.activeGigPartnersInZone || 3} Partners Available
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Guaranteed On-Site ETA:</span>
                <span className="font-bold text-amber-400 flex items-center space-x-1">
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  <span>{dispatchData?.estimatedExpressEtaMinutes || 90} Minutes</span>
                </span>
              </div>

              <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex items-center space-x-2 text-emerald-300 text-[11px]">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
                <span>Zero-Damage Wall SOP Active (Freestanding Metal Frames only)</span>
              </div>

            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-[11px] text-slate-400">
              <span>Ops Center: Active & Monitoring</span>
              <button 
                onClick={() => onQuickAction('control-room')} 
                className="text-rose-400 hover:text-rose-300 font-semibold"
              >
                Open Host Control Room →
              </button>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
