import React, { useState } from 'react';
import { 
  Sparkles, 
  MapPin, 
  Zap, 
  Layers, 
  Calculator, 
  Sliders, 
  Tv, 
  Users, 
  ShieldCheck, 
  KeyRound, 
  Clock, 
  ChevronDown 
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, currentPin, setCurrentPin, onOpenApiKeyModal, isAiActive }) {
  const [pinMenuOpen, setPinMenuOpen] = useState(false);

  const presetPins = [
    { pin: "560038", label: "Indiranagar, Bangalore (Dark Store Hub 401)" },
    { pin: "560034", label: "Koramangala, Bangalore (Hub 5th Block)" },
    { pin: "400050", label: "Bandra West, Mumbai (Bandra FastHub)" },
    { pin: "110016", label: "Hauz Khas, Delhi (South Delhi Hub)" }
  ];

  const navItems = [
    { id: 'express', label: '90m Express Setup', icon: Zap, badge: 'Uber-Style' },
    { id: 'packages', label: 'Honest Blueprints', icon: Layers, badge: 'Zero-Damage' },
    { id: 'budget', label: 'Reverse Budget', icon: Calculator, badge: 'Instant Split' },
    { id: 'visualizer', label: 'Living Room Fit', icon: Sliders, badge: 'AI AR' },
    { id: 'control-room', label: 'Live Control Room', icon: Tv, badge: 'Day-of GPS' },
    { id: 'crowd-pool', label: 'Crowd-Gifting Pool', icon: Users, badge: 'UPI Split' },
    { id: 'ops-escrow', label: 'Escrow & Ops Desk', icon: ShieldCheck, badge: 'Verified' },
  ];

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('express')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 via-orange-500 to-amber-400 flex items-center justify-center shadow-lg shadow-rose-900/40">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                  EventSphere<span className="text-rose-500">.ai</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  GenAI v2.0
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">Hyperlocal Gig Partner Network & Express Party Engine</p>
            </div>
          </div>

          {/* Right Action Controls: Pin Selector & Gemini Key */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Pin Code Picker */}
            <div className="relative">
              <button
                onClick={() => setPinMenuOpen(!pinMenuOpen)}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700/80 border border-slate-700 text-xs text-slate-200 transition"
              >
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                <span className="font-semibold">{currentPin}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {pinMenuOpen && (
                <div className="absolute right-0 mt-2 w-72 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl p-2 z-50 text-xs">
                  <div className="px-2 py-1 font-semibold text-slate-400 border-b border-slate-800">
                    Select Delivery Pin Code (Dark Store Zone)
                  </div>
                  <div className="py-1 space-y-1">
                    {presetPins.map(p => (
                      <button
                        key={p.pin}
                        onClick={() => {
                          setCurrentPin(p.pin);
                          setPinMenuOpen(false);
                        }}
                        className={`w-full text-left px-2.5 py-2 rounded-lg flex flex-col transition ${
                          currentPin === p.pin ? 'bg-rose-500/20 text-rose-300 font-semibold border border-rose-500/30' : 'hover:bg-slate-800 text-slate-300'
                        }`}
                      >
                        <span className="font-mono">{p.pin}</span>
                        <span className="text-[10px] text-slate-400">{p.label}</span>
                      </button>
                    ))}
                  </div>
                  <div className="pt-2 border-t border-slate-800">
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="Enter custom 6-digit PIN"
                      className="w-full px-2.5 py-1.5 rounded bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && e.target.value.length === 6) {
                          setCurrentPin(e.target.value);
                          setPinMenuOpen(false);
                        }
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Gemini API Key Button */}
            <button
              onClick={onOpenApiKeyModal}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition ${
                isAiActive 
                  ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40 hover:bg-emerald-900/50' 
                  : 'bg-slate-800 text-amber-300 border-amber-500/40 hover:bg-slate-700'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isAiActive ? 'Gemini 1.5 Active' : 'Configure Gemini'}</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </button>

          </div>
        </div>

        {/* Tab Navigation Navigation Bar */}
        <div className="flex space-x-1 overflow-x-auto py-2 scrollbar-none border-t border-slate-800/80">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-rose-500 text-white shadow-md shadow-rose-900/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-rose-300 border border-slate-700'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
}
