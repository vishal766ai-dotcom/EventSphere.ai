import React, { useState, useEffect } from 'react';
import { Tag, Sparkles, Check, Copy, Percent, Gift } from 'lucide-react';
import { api } from '../services/api';

export default function OffersVouchersBanner({ onApplyCode }) {
  const [offers, setOffers] = useState([]);
  const [copiedCode, setCopiedCode] = useState(null);

  useEffect(() => {
    loadOffers();
  }, []);

  const loadOffers = async () => {
    try {
      const data = await api.getOffers();
      if (data?.offers) setOffers(data.offers);
    } catch (err) {
      console.error("Offers error:", err);
    }
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    if (onApplyCode) onApplyCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-slate-900 via-rose-950/20 to-slate-900 border border-slate-800 shadow-xl space-y-3 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Tag className="w-4 h-4 text-rose-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-white">
            Exclusive Celebration Offers & Vouchers
          </h3>
        </div>
        <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
          INSTANT CHECKOUT SAVINGS
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {offers.map((offer) => {
          const isCopied = copiedCode === offer.code;
          return (
            <div
              key={offer.code}
              className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between space-y-2 hover:border-rose-500/40 transition group"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-mono">
                    {offer.code}
                  </span>
                  <span className="text-[10px] font-semibold text-amber-400">
                    {offer.badge}
                  </span>
                </div>
                <h4 className="font-bold text-xs text-white">{offer.title}</h4>
                <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5 leading-snug">
                  {offer.description}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[10px] text-slate-500 font-mono">Min ₹{offer.minOrderValue}</span>
                <button
                  onClick={() => handleCopyCode(offer.code)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center space-x-1 transition ${
                    isCopied
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-800 hover:bg-rose-500 text-slate-200 hover:text-white'
                  }`}
                >
                  {isCopied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{isCopied ? 'Applied!' : 'Copy Code'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
