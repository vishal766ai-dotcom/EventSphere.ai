import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroBanner from './components/HeroBanner';
import ExpressPartyLauncher from './components/ExpressPartyLauncher';
import HonestPackagesView from './components/HonestPackagesView';
import ReverseBudgetPlanner from './components/ReverseBudgetPlanner';
import LivingRoomVisualizer from './components/LivingRoomVisualizer';
import LiveControlRoom from './components/LiveControlRoom';
import CrowdGiftingPool from './components/CrowdGiftingPool';
import OpsDeskDashboard from './components/OpsDeskDashboard';
import GuestAssistantBot from './components/GuestAssistantBot';
import ApiKeyModal from './components/ApiKeyModal';
import { api } from './services/api';
import { MessageSquare, X, ShieldCheck, Sparkles, Heart } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('express');
  const [currentPin, setCurrentPin] = useState('560038');
  const [dispatchData, setDispatchData] = useState(null);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [isAiActive, setIsAiActive] = useState(false);
  const [showFloatingBot, setShowFloatingBot] = useState(false);

  useEffect(() => {
    checkPin(currentPin);
    checkAiStatus();
  }, [currentPin]);

  const checkPin = async (pin) => {
    try {
      const data = await api.checkDispatch(pin);
      setDispatchData(data);
    } catch (err) {
      console.error("Failed to check pin dispatch:", err);
    }
  };

  const checkAiStatus = async () => {
    try {
      const hasKey = Boolean(localStorage.getItem('gemini_api_key'));
      const status = await api.getGeminiStatus();
      setIsAiActive(hasKey || status?.hasServerApiKey);
    } catch (err) {
      console.error("AI status error:", err);
    }
  };

  const handleQuickAction = (tabName) => {
    setActiveTab(tabName);
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-rose-500 selection:text-white">
      
      {/* Top Sticky Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentPin={currentPin}
        setCurrentPin={setCurrentPin}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        isAiActive={isAiActive}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Dynamic Hero Banner */}
        <HeroBanner
          onQuickAction={handleQuickAction}
          currentPin={currentPin}
          dispatchData={dispatchData}
        />

        {/* Tab Content Renderer */}
        <div className="mt-8 transition-all">
          {activeTab === 'express' && (
            <ExpressPartyLauncher 
              currentPin={currentPin} 
              onOrderCreated={() => setActiveTab('control-room')}
            />
          )}

          {activeTab === 'packages' && (
            <HonestPackagesView 
              onBookPackage={(pkg) => setActiveTab('express')}
            />
          )}

          {activeTab === 'budget' && (
            <ReverseBudgetPlanner 
              currentPin={currentPin}
              onSelectPlan={() => setActiveTab('ops-escrow')}
            />
          )}

          {activeTab === 'visualizer' && (
            <LivingRoomVisualizer 
              onSelectTheme={(theme) => setActiveTab('express')}
            />
          )}

          {activeTab === 'control-room' && (
            <LiveControlRoom />
          )}

          {activeTab === 'crowd-pool' && (
            <CrowdGiftingPool />
          )}

          {activeTab === 'ops-escrow' && (
            <OpsDeskDashboard />
          )}
        </div>

      </main>

      {/* Floating WhatsApp Guest Bot Widget Button */}
      <div className="fixed bottom-6 right-6 z-40">
        {!showFloatingBot ? (
          <button
            onClick={() => setShowFloatingBot(true)}
            className="group relative flex items-center space-x-2 px-4 py-3 rounded-full bg-[#00a884] hover:bg-[#008f6f] text-white shadow-2xl shadow-emerald-900/50 transition transform hover:scale-105"
          >
            <MessageSquare className="w-5 h-5" />
            <span className="text-xs font-bold hidden sm:inline">WhatsApp Guest Concierge</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-300 animate-ping absolute -top-1 -right-1" />
          </button>
        ) : (
          <div className="relative w-80 sm:w-96 shadow-2xl rounded-3xl overflow-hidden border border-slate-700 animate-fadeIn">
            <div className="absolute top-2 right-2 z-50">
              <button
                onClick={() => setShowFloatingBot(false)}
                className="w-7 h-7 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <GuestAssistantBot />
          </div>
        )}
      </div>

      {/* Api Key Config Modal */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        onKeySaved={() => checkAiStatus()}
      />

      {/* Footer */}
      <footer className="mt-16 border-t border-slate-800/80 bg-slate-950 py-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-lg bg-rose-600 flex items-center justify-center text-white text-xs font-bold">
              E
            </div>
            <span className="font-bold text-white">EventSphere AI</span>
            <span>— GenAI Hyperlocal Celebration Engine</span>
          </div>

          <div className="flex items-center space-x-6 text-[11px]">
            <span className="flex items-center space-x-1 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>₹2,000 Zero-Damage Warranty</span>
            </span>
            <span>90–120 Min Express Dark Store Dispatch</span>
            <span>Escrow Protected</span>
          </div>

          <div className="text-[11px] text-slate-500">
            Deployed on Google Cloud Run & Vertex AI Architecture
          </div>
        </div>
      </footer>

    </div>
  );
}
