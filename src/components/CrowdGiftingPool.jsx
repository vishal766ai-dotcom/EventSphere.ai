import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Gift, 
  Share2, 
  Check, 
  QrCode, 
  Heart, 
  Sparkles, 
  Zap, 
  ShieldCheck, 
  CheckCircle2,
  DollarSign
} from 'lucide-react';
import { api } from '../services/api';

export default function CrowdGiftingPool() {
  const [pool, setPool] = useState(null);
  const [contributorName, setContributorName] = useState('');
  const [amount, setAmount] = useState(1500);
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [autoDispatchAlert, setAutoDispatchAlert] = useState(null);

  useEffect(() => {
    loadPool();
  }, []);

  const loadPool = async () => {
    try {
      const data = await api.getCrowdPool('POOL-COLLEGE-FAREWELL');
      setPool(data);
    } catch (err) {
      console.error("Pool load error:", err);
    }
  };

  const handleContribute = async (e) => {
    e.preventDefault();
    if (!amount || amount <= 0) return;
    setIsSubmitting(true);

    try {
      const result = await api.contributeToPool('POOL-COLLEGE-FAREWELL', {
        contributorName: contributorName || "Batchmate Friend",
        amount: Number(amount),
        note: note || "Best wishes for the farewell!"
      });

      if (result?.success) {
        setPool(result.pool);
        setContributorName('');
        setNote('');
        if (result.autoDispatchNotification) {
          setAutoDispatchAlert(result.autoDispatchNotification);
        }
      }
    } catch (err) {
      alert("Contribution failed: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyShareLink = () => {
    if (pool?.shareableLink) {
      navigator.clipboard.writeText(pool.shareableLink);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  if (!pool) return <div className="p-8 text-center text-slate-400 text-xs">Loading Shared Event Pot...</div>;

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                Crowd-Gifting & Shared Event Pooling
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Say goodbye to awkward manual UPI spreadsheets. Friends pool money together into a verified escrow pot. Once 100% funded, vendors are automatically locked & dispatched.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={copyShareLink}
          className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-200 text-xs font-semibold flex items-center space-x-1.5 transition self-start sm:self-auto"
        >
          {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 text-pink-400" />}
          <span>{copiedLink ? 'Link Copied!' : 'Share Pool Link'}</span>
        </button>
      </div>

      {/* Target Met Notification Alert */}
      {autoDispatchAlert && (
        <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs font-bold flex items-center space-x-3 shadow-xl animate-fadeIn">
          <Zap className="w-5 h-5 text-emerald-400 fill-current" />
          <span>{autoDispatchAlert}</span>
        </div>
      )}

      {/* Main Grid: Pot Status & Contribution Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left 7 Cols: Progress Bar, Package Locked, & Live Contributor Feed */}
        <div className="lg:col-span-7 space-y-4">
          
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-pink-500/10 text-pink-400 border border-pink-500/20">
                  Active Group Pot
                </span>
                <h3 className="text-lg font-bold text-white mt-1.5">{pool.title}</h3>
                <p className="text-xs text-slate-400">Organized by {pool.organizerName} • Locked Package: {pool.packageTitle}</p>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-400 block">Target Budget</span>
                <span className="text-xl font-extrabold font-mono text-white">
                  ₹{pool.targetAmount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Visual Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-pink-400 flex items-center space-x-1">
                  <span>Collected: ₹{pool.collectedAmount.toLocaleString('en-IN')}</span>
                </span>
                <span className="text-emerald-400 font-mono">{pool.progressPercent}% Funded</span>
              </div>

              <div 
                role="progressbar"
                aria-valuenow={pool.progressPercent}
                aria-valuemin="0"
                aria-valuemax="100"
                aria-label={`Crowd pool funding progress: ${pool.progressPercent}% of ₹${pool.targetAmount.toLocaleString('en-IN')}`}
                className="h-4 w-full rounded-full bg-slate-950 border border-slate-800 p-0.5 overflow-hidden"
              >
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-amber-400 transition-all duration-700 shadow-lg shadow-pink-500/50"
                  style={{ width: `${Math.min(100, pool.progressPercent)}%` }}
                />
              </div>

              <div className="flex justify-between text-[11px] text-slate-400">
                <span>{pool.contributors.length} Friends Contributed</span>
                <span>
                  {pool.remainingAmount > 0 
                    ? `₹${pool.remainingAmount.toLocaleString('en-IN')} remaining to auto-dispatch` 
                    : 'Target Achieved! Order locked.'}
                </span>
              </div>
            </div>

            {/* Smart Escrow Protection Notice */}
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center space-x-2.5 text-xs text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>All contributions are securely held in Smart Escrow. Funds are only disbursed once decor and catering setup photos are approved.</span>
            </div>
          </div>

          {/* Contributors Feed */}
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-2">
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" />
              <span>Live Friend Contributions ({pool.contributors.length})</span>
            </h4>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {pool.contributors.map((c, i) => (
                <div 
                  key={i}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-white">{c.name}</span>
                      <span className="text-[10px] text-slate-500 font-mono">{c.time}</span>
                    </div>
                    {c.note && <p className="text-[11px] text-slate-400 italic">"{c.note}"</p>}
                  </div>

                  <span className="font-mono font-bold text-emerald-400 text-sm">
                    +₹{c.amount.toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right 5 Cols: Contribution Action Card */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center space-x-2">
              <QrCode className="w-4 h-4 text-rose-400" />
              <span>Chip In via UPI / Split</span>
            </h3>

            {/* Quick Amount Buttons */}
            <div className="grid grid-cols-3 gap-2">
              {[500, 1000, 2500].map(val => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setAmount(val)}
                  className={`py-2 rounded-xl text-xs font-mono font-bold transition border ${
                    amount === val 
                      ? 'bg-rose-500 text-white border-rose-500' 
                      : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  ₹{val}
                </button>
              ))}
            </div>

            <form onSubmit={handleContribute} className="space-y-3.5 text-xs">
              <div>
                <label htmlFor="contributor-name-input" className="text-slate-400 font-medium block mb-1">Your Name</label>
                <input
                  id="contributor-name-input"
                  type="text"
                  required
                  aria-required="true"
                  placeholder="e.g. Rahul Sharma"
                  value={contributorName}
                  onChange={(e) => setContributorName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label htmlFor="contribution-amount-input" className="text-slate-400 font-medium block mb-1">Contribution Amount (₹)</label>
                <input
                  id="contribution-amount-input"
                  type="number"
                  min="100"
                  required
                  aria-required="true"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label htmlFor="contribution-note-input" className="text-slate-400 font-medium block mb-1">Cheer Message / Note</label>
                <input
                  id="contribution-note-input"
                  type="text"
                  placeholder="e.g. Can't wait for DJ night! 🕺"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              {/* UPI ID Info */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 block uppercase">Simulated UPI Merchant ID:</span>
                <span className="font-mono text-rose-300 font-bold block">{pool.upiId}</span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-rose-600 via-rose-500 to-orange-500 hover:from-rose-500 hover:to-orange-400 text-white font-bold text-xs shadow-xl shadow-rose-900/30 flex items-center justify-center space-x-2 transition"
              >
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>{isSubmitting ? 'Processing UPI Payment...' : `Contribute ₹${amount} Now`}</span>
              </button>
            </form>

          </div>

        </div>

      </div>

    </div>
  );
}
