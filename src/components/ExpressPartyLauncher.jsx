import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Clock, 
  MapPin, 
  CheckCircle, 
  Truck, 
  ShieldCheck, 
  Sparkles, 
  Flame, 
  Leaf, 
  AlertCircle, 
  ChevronRight,
  PhoneCall
} from 'lucide-react';
import { api } from '../services/api';

export default function ExpressPartyLauncher({ currentPin, onOrderCreated }) {
  const [packages, setPackages] = useState([]);
  const [selectedPkgId, setSelectedPkgId] = useState('PKG-NEON-GLOW');
  const [customerName, setCustomerName] = useState('Vikram Malhotra');
  const [phone, setPhone] = useState('+91 98450 12345');
  const [address, setAddress] = useState('Flat 403, Palm Grove Heights, Indiranagar');
  const [pinCode, setPinCode] = useState(currentPin || '560038');
  const [includeCleanup, setIncludeCleanup] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeOrder, setActiveOrder] = useState(null);
  const [dispatchInfo, setDispatchInfo] = useState(null);

  useEffect(() => {
    setPinCode(currentPin);
    checkPinDispatch(currentPin);
  }, [currentPin]);

  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = async () => {
    try {
      const data = await api.getPackages();
      if (data?.packages) setPackages(data.packages);
    } catch (err) {
      console.error("Failed to load packages:", err);
    }
  };

  const checkPinDispatch = async (pin) => {
    try {
      const info = await api.checkDispatch(pin || '560038');
      setDispatchInfo(info);
    } catch (err) {
      console.error("Dispatch check error:", err);
    }
  };

  const handleLaunchParty = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        customerName,
        phone,
        address,
        pinCode,
        packageId: selectedPkgId,
        addonCleanup: includeCleanup
      };

      const result = await api.dispatchExpressParty(payload);
      if (result?.success) {
        setActiveOrder(result.order);
        if (onOrderCreated) onOrderCreated(result.order);
      }
    } catch (err) {
      alert("Dispatch error: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedPkg = packages.find(p => p.id === selectedPkgId) || packages[0];
  const totalPrice = (selectedPkg?.expressPrice || 5999) + (includeCleanup ? 499 : 0);

  return (
    <div className="space-y-6">
      
      {/* Header bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              Uber for Last-Minute Celebrations
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Life happened spontaneously? Get an express 90–120 minute party setup dispatched from local dark stores.
          </p>
        </div>

        {dispatchInfo && (
          <div className="flex items-center space-x-3 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs">
            <div>
              <span className="text-slate-400">Hub: </span>
              <span className="font-semibold text-slate-200">{dispatchInfo.assignedDarkStore?.name}</span>
            </div>
            <div className="h-4 w-px bg-slate-700" />
            <div className="text-emerald-400 font-bold flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{dispatchInfo.estimatedExpressEtaMinutes} Min ETA</span>
            </div>
          </div>
        )}
      </div>

      {/* Main Grid: Kit Selection & Booking Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Standardized Dark-Store Kits */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
            <span>1. Choose Pre-Packed Standardized Kit</span>
            <span className="text-[11px] text-rose-400 font-mono">STAGED AT DARK STORE</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {packages.map((pkg) => {
              const isSelected = selectedPkgId === pkg.id;
              return (
                <div
                  key={pkg.id}
                  onClick={() => setSelectedPkgId(pkg.id)}
                  className={`cursor-pointer rounded-2xl border transition-all p-4 relative overflow-hidden flex flex-col justify-between ${
                    isSelected 
                      ? 'bg-slate-900 border-rose-500 shadow-xl shadow-rose-950/40 ring-1 ring-rose-500' 
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  {/* Express Badge */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center space-x-1">
                      <Zap className="w-3 h-3 fill-current" />
                      <span>{pkg.blueprint?.setupTimeEst || '90m'} Express</span>
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-200">
                      ₹{pkg.expressPrice?.toLocaleString('en-IN')}
                    </span>
                  </div>

                  {/* Thumbnail / honest photo preview */}
                  <div className="relative h-28 rounded-xl overflow-hidden mb-3 border border-slate-800">
                    <img 
                      src={pkg.honestPhoto?.imageUrl} 
                      alt={pkg.title} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2">
                      <span className="text-[10px] text-slate-300 font-medium">
                        {pkg.roomSuitability}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-sm text-white">{pkg.title}</h4>
                    <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">{pkg.tagline}</p>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                    <span className="text-emerald-400 font-medium">₹2,000 Paint Warranty</span>
                    <span className="text-slate-400 font-mono">{pkg.blueprint?.width} W</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Add-ons: Clean-Up Crew */}
          <div className="mt-4 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-start space-x-3">
            <input
              type="checkbox"
              id="cleanup-addon"
              checked={includeCleanup}
              onChange={(e) => setIncludeCleanup(e.target.checked)}
              className="mt-1 w-4 h-4 rounded text-rose-500 focus:ring-rose-500 bg-slate-950 border-slate-700"
            />
            <label htmlFor="cleanup-addon" className="cursor-pointer text-xs space-y-1">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-white">Add Post-Party Next-Day Clean-Up Crew (+₹499)</span>
                <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold">Recommended</span>
              </div>
              <p className="text-slate-400">
                A verified breakdown assistant arrives at 9:30 AM tomorrow to dismantle the metal arch, deflate balloons, clear celebration debris, and leave the apartment spotless.
              </p>
            </label>
          </div>

        </div>

        {/* Right Column: Dispatch Form & Real-Time Tracking */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 shadow-xl">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center space-x-2">
              <Truck className="w-4 h-4 text-rose-400" />
              <span>2. Express Delivery Slot & Dispatch</span>
            </h3>

            {!activeOrder ? (
              <form onSubmit={handleLaunchParty} className="space-y-3.5 text-xs">
                <div>
                  <label className="text-slate-400 font-medium block mb-1">Host Name</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="text-slate-400 font-medium block mb-1">Host WhatsApp / Mobile</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="text-slate-400 font-medium block mb-1">Delivery Apartment / Venue Address</label>
                  <textarea
                    rows={2}
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Flat number, building name, landmark..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-400 font-medium block mb-1">Pin Code</label>
                    <input
                      type="text"
                      maxLength={6}
                      value={pinCode}
                      onChange={(e) => {
                        setPinCode(e.target.value);
                        if (e.target.value.length === 6) checkPinDispatch(e.target.value);
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono focus:outline-none focus:border-rose-500"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 font-medium block mb-1">Setup Window</label>
                    <div className="px-3 py-2 rounded-xl bg-slate-800 text-amber-300 font-bold text-center">
                      ⚡ Next 90 Mins
                    </div>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2 pt-3">
                  <div className="flex justify-between text-slate-300">
                    <span>{selectedPkg?.title}</span>
                    <span className="font-mono">₹{selectedPkg?.expressPrice?.toLocaleString('en-IN')}</span>
                  </div>
                  {includeCleanup && (
                    <div className="flex justify-between text-slate-300">
                      <span>Morning Clean-Up Crew</span>
                      <span className="font-mono">₹499</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-400 text-[11px]">
                    <span>Smart Escrow Fee & Insurance</span>
                    <span className="text-emerald-400">FREE</span>
                  </div>
                  <div className="h-px bg-slate-800 my-1" />
                  <div className="flex justify-between font-bold text-sm text-white">
                    <span>Total Protected Amount:</span>
                    <span className="text-rose-400 font-mono">₹{totalPrice.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-sky-950/40 border border-sky-500/20 text-sky-300 text-[11px] flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 flex-shrink-0 text-sky-400" />
                  <span>Escrow Protection: Money stays in escrow until setup is verified on-site.</span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-rose-600 via-rose-500 to-orange-500 hover:from-rose-500 hover:to-orange-400 text-white font-bold text-sm shadow-xl shadow-rose-900/30 flex items-center justify-center space-x-2 transition"
                >
                  <Zap className="w-4 h-4 fill-current" />
                  <span>{isSubmitting ? 'Dispatching Gig Partner...' : 'Dispatch Express Setup Now'}</span>
                </button>
              </form>
            ) : (
              /* Active Order Live Dispatch Status Card */
              <div className="space-y-4 animate-fadeIn">
                <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/60 to-slate-900 border border-emerald-500/40">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-emerald-400 flex items-center space-x-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                      <span>ORDER ACTIVE & DISPATCHED</span>
                    </span>
                    <span className="font-mono text-xs font-bold text-white">{activeOrder.orderId}</span>
                  </div>
                  <h4 className="text-base font-bold text-white">{activeOrder.packageName}</h4>
                  <p className="text-xs text-slate-300 mt-1">{activeOrder.deliveryAddress}</p>
                </div>

                {/* Live Milestone Tracker */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="text-slate-400 font-semibold">Live Telematics Status</span>
                    <span className="text-amber-400 font-mono font-bold">ETA: ~{activeOrder.etaMinutes} mins</span>
                  </div>

                  <div className="space-y-2.5">
                    <div className="flex items-center space-x-2 text-emerald-400">
                      <CheckCircle className="w-4 h-4" />
                      <span>Dark store kit SKU [{activeOrder.kitSku}] assembled</span>
                    </div>

                    <div className="flex items-center space-x-2 text-emerald-400">
                      <CheckCircle className="w-4 h-4" />
                      <span>Gig Partner: {activeOrder.assignedPartner?.name}</span>
                    </div>

                    <div className="flex items-center space-x-2 text-amber-300 font-medium">
                      <span className="w-4 h-4 flex items-center justify-center">
                        <Truck className="w-3.5 h-3.5 animate-bounce" />
                      </span>
                      <span>En route with metal arch & electric inflator</span>
                    </div>

                    <div className="flex items-center space-x-2 text-slate-500">
                      <div className="w-4 h-4 rounded-full border border-slate-700 flex items-center justify-center text-[10px]">4</div>
                      <span>Photo verification & client OTP handover</span>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => setActiveOrder(null)}
                    className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 transition"
                  >
                    Place Another Order
                  </button>
                  <a
                    href="tel:+919845012345"
                    className="py-2 px-3 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30 text-xs font-semibold flex items-center space-x-1"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Call Decorator</span>
                  </a>
                </div>

              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}
