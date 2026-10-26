import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Unlock, 
  Camera, 
  CheckCircle2, 
  AlertTriangle, 
  KeyRound, 
  Headphones, 
  Clock, 
  MapPin, 
  PhoneCall, 
  RefreshCw,
  FileCheck,
  Zap
} from 'lucide-react';
import { api } from '../services/api';

export default function OpsDeskDashboard() {
  const [escrowAccounts, setEscrowAccounts] = useState([]);
  const [selectedEscrow, setSelectedEscrow] = useState(null);
  const [otpInput, setOtpInput] = useState('');
  const [verificationMsg, setVerificationMsg] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [activePartnerModal, setActivePartnerModal] = useState(false);
  const [sopsList, setSopsList] = useState([]);

  useEffect(() => {
    loadEscrow();
    loadSops();
  }, []);

  const loadEscrow = async () => {
    try {
      const data = await api.getEscrowVault();
      if (data?.accounts) {
        setEscrowAccounts(data.accounts);
        setSelectedEscrow(data.accounts[0]);
      }
    } catch (err) {
      console.error("Escrow load error:", err);
    }
  };

  const loadSops = async () => {
    try {
      const data = await api.getSops();
      if (data?.sops) setSopsList(data.sops);
    } catch (err) {
      console.error("SOPs load error:", err);
    }
  };

  const handleSimulatePartnerPhoto = async (photoType) => {
    if (!selectedEscrow) return;
    try {
      const res = await api.submitMilestonePhoto(selectedEscrow.escrowId, {
        photoType,
        photoUrl: photoType === 'checkIn' 
          ? "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=400&q=80"
          : "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=400&q=80"
      });
      if (res?.success) {
        setVerificationMsg(`📸 Partner photo submitted for ${photoType}! Milestone verified.`);
        loadEscrow();
      }
    } catch (err) {
      alert("Error submitting photo: " + err.message);
    }
  };

  const handleReleaseEscrow = async (e) => {
    e.preventDefault();
    if (!selectedEscrow) return;
    setIsVerifying(true);
    setVerificationMsg('');

    try {
      const res = await api.verifyAndReleaseEscrow(selectedEscrow.escrowId, otpInput);
      if (res?.success) {
        setVerificationMsg(res.message);
        setOtpInput('');
        loadEscrow();
      }
    } catch (err) {
      setVerificationMsg(`❌ ${err.message || 'Verification failed. Try OTP 1234 or 4289'}`);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                Escrow-Style Financial Protection & Ops Desk
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Zero on-site friction. Customer funds are held securely until the decorator submits setup photos and the host provides the 4-digit handover OTP.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={loadEscrow}
            className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white text-xs flex items-center space-x-1"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Vault</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Escrow Account Details & Verification Console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left 7 Cols: Escrow Milestone Tracker */}
        <div className="lg:col-span-7 space-y-4">
          
          {selectedEscrow && (
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-5">
              
              <div className="flex items-start justify-between pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-rose-400">{selectedEscrow.escrowId}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                      Ref: {selectedEscrow.orderRef}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mt-1">Host: {selectedEscrow.clientName}</h3>
                  <p className="text-xs text-slate-400">Gig Partner: {selectedEscrow.vendorName}</p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Escrow Funds Locked</span>
                  <span className="text-2xl font-black font-mono text-emerald-400">
                    ₹{selectedEscrow.amount.toLocaleString('en-IN')}
                  </span>
                  <div className="mt-1">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      selectedEscrow.status === 'RELEASED_TO_VENDOR' 
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}>
                      {selectedEscrow.status === 'RELEASED_TO_VENDOR' ? 'PAID OUT' : 'LOCKED IN ESCROW'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Milestones Flow */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Automated Milestone Verifications
                </h4>

                <div className="space-y-2 text-xs">
                  
                  {/* Step 1 */}
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <div>
                        <div className="font-semibold text-white">Client Payment Deposited in Escrow</div>
                        <div className="text-[11px] text-slate-400">At {selectedEscrow.milestones.clientDeposited.time} • UPI / Card</div>
                      </div>
                    </div>
                    <span className="font-mono text-emerald-400 font-bold">₹{selectedEscrow.milestones.clientDeposited.amount}</span>
                  </div>

                  {/* Step 2 */}
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {selectedEscrow.milestones.vendorCheckInPhoto?.done ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Clock className="w-4 h-4 text-amber-400" />
                      )}
                      <div>
                        <div className="font-semibold text-white">Gig Decorator Arrival & Wall Check-In Photo</div>
                        <div className="text-[11px] text-slate-400">
                          {selectedEscrow.milestones.vendorCheckInPhoto?.done 
                            ? `Verified at ${selectedEscrow.milestones.vendorCheckInPhoto.time} with GPS stamp`
                            : 'Pending arrival check-in'}
                        </div>
                      </div>
                    </div>
                    
                    {!selectedEscrow.milestones.vendorCheckInPhoto?.done && (
                      <button
                        onClick={() => handleSimulatePartnerPhoto('checkIn')}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-300 text-[11px] font-semibold flex items-center space-x-1"
                      >
                        <Camera className="w-3 h-3" />
                        <span>Submit Check-In Photo</span>
                      </button>
                    )}
                  </div>

                  {/* Step 3 */}
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {selectedEscrow.milestones.vendorSetupCompletePhoto?.done ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Clock className="w-4 h-4 text-amber-400" />
                      )}
                      <div>
                        <div className="font-semibold text-white">Finished Setup Photo & Wall Integrity Check</div>
                        <div className="text-[11px] text-slate-400">
                          {selectedEscrow.milestones.vendorSetupCompletePhoto?.done 
                            ? `Completed & uploaded at ${selectedEscrow.milestones.vendorSetupCompletePhoto.time}` 
                            : 'Pending setup completion'}
                        </div>
                      </div>
                    </div>

                    {!selectedEscrow.milestones.vendorSetupCompletePhoto?.done && (
                      <button
                        onClick={() => handleSimulatePartnerPhoto('setupComplete')}
                        className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-[11px] font-semibold flex items-center space-x-1"
                      >
                        <Camera className="w-3 h-3" />
                        <span>Submit Setup Photo</span>
                      </button>
                    )}
                  </div>

                  {/* Step 4 */}
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {selectedEscrow.milestones.payoutReleased?.done ? (
                        <Unlock className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Lock className="w-4 h-4 text-amber-400" />
                      )}
                      <div>
                        <div className="font-semibold text-white">Client Handover Verification OTP</div>
                        <div className="text-[11px] text-slate-400">
                          {selectedEscrow.milestones.payoutReleased?.done
                            ? `Released to ${selectedEscrow.vendorName} at ${selectedEscrow.milestones.payoutReleased.releaseTime}`
                            : 'Host must verify wall integrity and enter OTP to disburse payout'}
                        </div>
                      </div>
                    </div>

                    <span className="font-mono text-[11px] text-slate-400">
                      OTP: {selectedEscrow.milestones.clientHandoverOtp.requiredOtp} (or 1234)
                    </span>
                  </div>

                </div>
              </div>

              {/* Paint Damage Warranty Badge */}
              <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between text-xs text-emerald-300">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Paint-Protection Warranty Active: Covers ₹2,000 against wall marks</span>
                </div>
                <span className="font-bold text-emerald-400">PROTECTED</span>
              </div>

            </div>
          )}

        </div>

        {/* Right 5 Cols: OTP Release Console & Remote Ops Desk Troubleshooting */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* OTP Release Card */}
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center space-x-2">
              <KeyRound className="w-4 h-4 text-rose-400" />
              <span>Host Handover OTP Verification</span>
            </h3>

            <p className="text-xs text-slate-400">
              Host inspects setup and confirms zero wall damage. Enter the 4-digit code provided on host screen/SMS to disburse payout to the gig decorator.
            </p>

            <form onSubmit={handleReleaseEscrow} className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 font-medium block mb-1">Enter 4-Digit OTP Code</label>
                <input
                  type="text"
                  maxLength={4}
                  required
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value)}
                  placeholder="e.g. 4289 or 1234"
                  className="w-full text-center tracking-widest text-lg font-mono font-bold px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              {verificationMsg && (
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200">
                  {verificationMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={isVerifying || selectedEscrow?.status === 'RELEASED_TO_VENDOR'}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs shadow-lg shadow-emerald-950/40 flex items-center justify-center space-x-2 transition disabled:opacity-40"
              >
                <Unlock className="w-4 h-4" />
                <span>
                  {selectedEscrow?.status === 'RELEASED_TO_VENDOR' 
                    ? 'Funds Already Released' 
                    : (isVerifying ? 'Verifying OTP...' : 'Release Escrow to Gig Partner')}
                </span>
              </button>
            </form>
          </div>

          {/* Remote Coordination Desks (Ops Desk) */}
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-3 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Headphones className="w-4 h-4 text-sky-400" />
                <h4 className="font-bold text-white text-xs uppercase tracking-wider">
                  Remote Coordination Desk
                </h4>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                Live Monitoring
              </span>
            </div>

            <p className="text-slate-400 leading-relaxed">
              Our central operations engine tracks rider telematics, resolves vendor transit delays, and handles emergency substitutions in real time.
            </p>

            <div className="space-y-2 pt-1">
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                <span>Rider Delay Auto-rerouting</span>
                <span className="font-mono text-emerald-400 font-bold">ACTIVE</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                <span>Emergency Dark Store Kit Reserve</span>
                <span className="font-mono text-emerald-400 font-bold">12 KITS</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                <span>Direct Hotline to Ops Lead</span>
                <a href="tel:+918049001122" className="text-rose-400 hover:underline font-mono">
                  +91 80 4900 1122
                </a>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
