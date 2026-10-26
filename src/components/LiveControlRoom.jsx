import React, { useState, useEffect } from 'react';
import { 
  Tv, 
  MapPin, 
  Navigation, 
  Send, 
  Clock, 
  Truck, 
  PhoneCall, 
  CheckCircle, 
  AlertCircle, 
  Radio, 
  BellRing,
  Sparkles,
  Users
} from 'lucide-react';
import { api } from '../services/api';

export default function LiveControlRoom() {
  const [controlData, setControlData] = useState(null);
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [broadcastNotification, setBroadcastNotification] = useState('');

  useEffect(() => {
    fetchControlState();
    const interval = setInterval(fetchControlState, 8000);
    return () => clearInterval(interval);
  }, []);

  const fetchControlState = async () => {
    try {
      const data = await api.getControlRoom();
      setControlData(data);
    } catch (err) {
      console.error("Control room fetch error:", err);
    }
  };

  const handleBroadcast = async (itineraryItem = null) => {
    setIsBroadcasting(true);
    try {
      const payload = {
        itineraryId: itineraryItem?.id,
        customMessage: itineraryItem ? null : broadcastMessage
      };
      const res = await api.broadcastItinerary(payload);
      if (res?.success) {
        setBroadcastNotification(res.message);
        setBroadcastMessage('');
        fetchControlState();
        setTimeout(() => setBroadcastNotification(''), 4000);
      }
    } catch (err) {
      alert("Broadcast failed: " + err.message);
    } finally {
      setIsBroadcasting(false);
    }
  };

  if (!controlData) {
    return (
      <div className="p-8 text-center text-slate-400 text-xs">
        Connecting to Host Live Telematics Control Room...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
              <Tv className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white flex items-center space-x-2">
                <span>Interactive Live Event Control Room</span>
                <span className="flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>DAY-OF HOST CONSOLE</span>
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Zero frantic "Bhaiya kahan pahuche?" phone calls. Track live vendor GPS pins and broadcast instant updates to 48 WhatsApp guests in 1 click.
              </p>
            </div>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs flex items-center space-x-3">
          <MapPin className="w-4 h-4 text-rose-400" />
          <div>
            <div className="font-bold text-white">{controlData.eventName}</div>
            <div className="text-[10px] text-slate-400 truncate max-w-xs">{controlData.venue}</div>
          </div>
        </div>
      </div>

      {/* Broadcast Alert Banner if sent */}
      {broadcastNotification && (
        <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center space-x-2 animate-fadeIn">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{broadcastNotification}</span>
        </div>
      )}

      {/* Grid: Vendor GPS Tracking Map & Status Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left 7 Cols: Simulated Radar GPS Map & Vendor Status */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Radar Map Simulation Canvas/Card */}
          <div className="rounded-3xl bg-slate-900 border border-slate-800 p-5 relative overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center space-x-2">
                <Radio className="w-4 h-4 text-rose-400 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-white">Live Vendor Telematics Radar</span>
              </div>
              <span className="text-[11px] font-mono text-emerald-400">GPS Auto-syncing (8s)</span>
            </div>

            {/* Simulated Live Route Map View */}
            <div className="h-64 rounded-2xl bg-slate-950 border border-slate-800 relative flex items-center justify-center overflow-hidden">
              {/* Map grid lines */}
              <div className="absolute inset-0 blueprint-grid opacity-30" />
              
              {/* Center Venue Marker */}
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-rose-500/20 border-2 border-rose-500 flex items-center justify-center radar-pulse">
                  <div className="w-4 h-4 rounded-full bg-rose-500 shadow-lg shadow-rose-500" />
                </div>
                <span className="text-[10px] font-bold text-white bg-slate-900/90 px-2 py-0.5 rounded border border-rose-500/40 mt-1">
                  Venue (Clubhouse Terrace)
                </span>
              </div>

              {/* Decorator Van Pin */}
              <div className="absolute top-12 left-16 flex items-center space-x-1.5 animate-pulse">
                <div className="w-7 h-7 rounded-full bg-sky-500/20 border border-sky-400 flex items-center justify-center">
                  <Truck className="w-3.5 h-3.5 text-sky-400" />
                </div>
                <span className="text-[9px] font-mono font-bold bg-slate-900 text-sky-300 px-1.5 py-0.5 rounded border border-sky-500/30">
                  Decorator: 6m ETA
                </span>
              </div>

              {/* Cake Delivery Pin */}
              <div className="absolute bottom-14 right-20 flex items-center space-x-1.5">
                <div className="w-7 h-7 rounded-full bg-pink-500/20 border border-pink-400 flex items-center justify-center">
                  <Truck className="w-3.5 h-3.5 text-pink-400" />
                </div>
                <span className="text-[9px] font-mono font-bold bg-slate-900 text-pink-300 px-1.5 py-0.5 rounded border border-pink-500/30">
                  Cake: 22m ETA
                </span>
              </div>

              {/* Catering Team (On Site) */}
              <div className="absolute top-20 right-16 flex items-center space-x-1.5">
                <div className="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <span className="text-[9px] font-mono font-bold bg-slate-900 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-500/30">
                  Catering: On-Site
                </span>
              </div>
            </div>

            {/* Vendor Live Status Cards */}
            <div className="mt-4 space-y-2.5">
              {controlData.vendorsTracking.map(v => (
                <div 
                  key={v.id}
                  className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-slate-800 text-slate-300">
                      <Truck className="w-4 h-4 text-rose-400" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-xs">{v.role}</h4>
                      <div className="flex items-center space-x-2 text-[11px] text-slate-400">
                        <span>{v.partnerName}</span>
                        <span>•</span>
                        <span className="text-amber-300 font-medium">{v.status}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block">ETA</span>
                      <span className="font-mono font-bold text-emerald-400 text-sm">
                        {v.etaMinutes === 0 ? 'ARRIVED' : `${v.etaMinutes} min`}
                      </span>
                    </div>

                    <a
                      href={`tel:${v.phone}`}
                      className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
                      title="Direct Call"
                    >
                      <PhoneCall className="w-3.5 h-3.5 text-rose-400" />
                    </a>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>

        {/* Right 5 Cols: Digital Itinerary Timeline & 1-Click WhatsApp Broadcast */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="rounded-3xl bg-slate-900 border border-slate-800 p-5 shadow-2xl space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <BellRing className="w-4 h-4 text-amber-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                  Digital Itinerary & Guest Broadcast
                </h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                48 Guests Connected
              </span>
            </div>

            {/* Timeline Items */}
            <div className="space-y-3">
              {controlData.digitalItinerary.map((item) => (
                <div 
                  key={item.id}
                  className={`p-3.5 rounded-xl border transition flex items-center justify-between text-xs ${
                    item.status === 'ACTIVE' 
                      ? 'bg-rose-500/10 border-rose-500 text-white' 
                      : 'bg-slate-950 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-rose-400 text-[11px]">{item.time}</span>
                      {item.broadcastSent && (
                        <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-semibold">
                          Broadcasted
                        </span>
                      )}
                    </div>
                    <h5 className="font-semibold text-white text-xs">{item.title}</h5>
                  </div>

                  <button
                    onClick={() => handleBroadcast(item)}
                    disabled={isBroadcasting}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-rose-500 hover:text-white text-slate-300 border border-slate-700 text-[11px] font-medium transition flex items-center space-x-1"
                  >
                    <Send className="w-3 h-3" />
                    <span>Ping WhatsApp</span>
                  </button>
                </div>
              ))}
            </div>

            {/* Custom WhatsApp broadcast input */}
            <div className="pt-3 border-t border-slate-800 space-y-2">
              <label className="text-[11px] font-semibold text-slate-400 block">
                Send Custom Announcement to All Guests
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e.target.value)}
                  placeholder="e.g. Cake cutting starting in 5 mins! Gather at stage."
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-rose-500"
                />
                <button
                  onClick={() => handleBroadcast()}
                  disabled={!broadcastMessage || isBroadcasting}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-orange-500 hover:from-rose-500 hover:to-orange-400 text-white text-xs font-bold flex items-center space-x-1.5 transition disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </div>
            </div>

            {/* Broadcast Log */}
            <div className="pt-2 text-[11px] space-y-1.5">
              <span className="text-slate-400 font-semibold block">Broadcast Feed:</span>
              {controlData.broadcastHistory.map((bc) => (
                <div key={bc.id} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 text-slate-300">
                  <div className="flex items-center justify-between text-[10px] text-slate-500 mb-0.5">
                    <span>{bc.channel}</span>
                    <span className="font-mono">{bc.timestamp}</span>
                  </div>
                  <p className="text-xs text-white">{bc.message}</p>
                </div>
              ))}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
