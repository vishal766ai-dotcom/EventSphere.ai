import React, { useState, useEffect, useRef } from 'react';
import { 
  Sliders, 
  Upload, 
  Sparkles, 
  Check, 
  RefreshCw, 
  Camera, 
  ShieldCheck, 
  Eye, 
  Ruler, 
  Palette,
  Maximize2
} from 'lucide-react';
import { api } from '../services/api';

export default function LivingRoomVisualizer({ onSelectTheme }) {
  const [sampleRooms, setSampleRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [userUploadedImage, setUserUploadedImage] = useState(null);
  const [packages, setPackages] = useState([]);
  const [activePackageId, setActivePackageId] = useState('PKG-NEON-GLOW');
  const [scale, setScale] = useState(1.0);
  const [posX, setPosX] = useState(0);
  const [posY, setPosY] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [stylistFeedback, setStylistFeedback] = useState(null);
  
  const canvasRef = useRef(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [roomsRes, pkgsRes] = await Promise.all([
        api.getSampleRooms(),
        api.getPackages()
      ]);
      if (roomsRes) {
        setSampleRooms(roomsRes);
        setSelectedRoom(roomsRes[0]);
      }
      if (pkgsRes?.packages) {
        setPackages(pkgsRes.packages);
        setActivePackageId(pkgsRes.packages[0].id);
      }
    } catch (err) {
      console.error("Visualizer data loading error:", err);
    }
  };

  useEffect(() => {
    renderCanvasComposite();
    runAiAnalysis();
  }, [selectedRoom, userUploadedImage, activePackageId, scale, posX, posY]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUserUploadedImage(event.target.result);
        setSelectedRoom({
          id: "CUSTOM-UPLOAD",
          label: "Your Uploaded Living Room Wall",
          imageUrl: event.target.result,
          dimensions: "10x12 ft (Estimated)"
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const runAiAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const activePkg = packages.find(p => p.id === activePackageId) || packages[0];
      const roomDesc = selectedRoom ? `${selectedRoom.label} (${selectedRoom.wallColor || 'Living Room Wall'})` : "Living room wall";
      const result = await api.analyzeFitting({
        wallDescription: roomDesc,
        selectedPackageId: activePkg?.id || 'PKG-NEON-GLOW'
      });
      if (result) {
        setStylistFeedback(result.stylistEvaluation);
      }
    } catch (err) {
      console.error("AI Analysis error:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const renderCanvasComposite = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const activePkg = packages.find(p => p.id === activePackageId) || packages[0];
    const bgUrl = userUploadedImage || selectedRoom?.imageUrl;

    if (!bgUrl) return;

    const bgImg = new Image();
    bgImg.crossOrigin = 'anonymous';
    bgImg.src = bgUrl;
    bgImg.onload = () => {
      canvas.width = 800;
      canvas.height = 500;

      // Draw background room photo
      ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

      // Darken slightly for high-impact neon & contrast
      ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Overlay honest decor photo composited onto wall
      if (activePkg?.honestPhoto?.imageUrl) {
        const decorImg = new Image();
        decorImg.crossOrigin = 'anonymous';
        decorImg.src = activePkg.honestPhoto.imageUrl;
        decorImg.onload = () => {
          const baseW = 340 * scale;
          const baseH = 240 * scale;
          const x = (canvas.width - baseW) / 2 + posX;
          const y = (canvas.height - baseH) / 2 + posY + 20;

          // Shadow under decor arch
          ctx.save();
          ctx.shadowColor = 'rgba(0,0,0,0.6)';
          ctx.shadowBlur = 25;
          ctx.shadowOffsetY = 15;

          // Draw rounded clipping mask for decor
          ctx.beginPath();
          ctx.roundRect(x, y, baseW, baseH, 12);
          ctx.clip();
          ctx.drawImage(decorImg, x, y, baseW, baseH);
          ctx.restore();

          // Draw blueprint dimension annotation frame
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 2;
          ctx.setLineDash([6, 4]);
          ctx.strokeRect(x, y, baseW, baseH);
          ctx.setLineDash([]);

          // Dimension badge
          ctx.fillStyle = '#0f172a';
          ctx.fillRect(x + baseW/2 - 60, y - 24, 120, 20);
          ctx.strokeStyle = '#38bdf8';
          ctx.strokeRect(x + baseW/2 - 60, y - 24, 120, 20);
          ctx.fillStyle = '#38bdf8';
          ctx.font = 'bold 11px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(`WIDTH: ${activePkg.blueprint?.width || '8.5 ft'}`, x + baseW/2, y - 10);

          // Zero-damage frame indicator badge
          ctx.fillStyle = '#064e3b';
          ctx.fillRect(x + 10, y + baseH - 28, 170, 20);
          ctx.fillStyle = '#34d399';
          ctx.font = 'bold 10px sans-serif';
          ctx.textAlign = 'left';
          ctx.fillText(`✓ FREESTANDING METAL FRAME`, x + 16, y + baseH - 14);
        };
        decorImg.onerror = () => {
          // Graceful fallback to architectural blueprint vector if network image delayed
          const baseW = 340 * scale;
          const baseH = 240 * scale;
          const x = (canvas.width - baseW) / 2 + posX;
          const y = (canvas.height - baseH) / 2 + posY + 20;

          ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
          ctx.roundRect(x, y, baseW, baseH, 12);
          ctx.fill();
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 2;
          ctx.strokeRect(x, y, baseW, baseH);

          ctx.fillStyle = '#38bdf8';
          ctx.font = 'bold 14px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(`📐 ${activePkg.title}`, x + baseW/2, y + baseH/2 - 10);
          ctx.font = '11px sans-serif';
          ctx.fillStyle = '#94a3b8';
          ctx.fillText(`${activePkg.blueprint?.width} x ${activePkg.blueprint?.height} (Freestanding Metal Frame)`, x + baseW/2, y + baseH/2 + 15);
        };
      }
    };
  };

  const activePkg = packages.find(p => p.id === activePackageId) || packages[0];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              "Upload Your Living Room" — AI Photo Fitting
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              No complicated 3D modeling required. Upload a quick phone photo of your plain wall to see exact blueprints and real setups scaled directly onto your apartment space.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left 8 Cols: Canvas Display & Adjustment Controls */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Room Selection & Upload Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 p-3 rounded-2xl border border-slate-800">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-slate-400">Select Room:</span>
              {sampleRooms.map(room => (
                <button
                  key={room.id}
                  onClick={() => {
                    setUserUploadedImage(null);
                    setSelectedRoom(room);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                    selectedRoom?.id === room.id && !userUploadedImage
                      ? 'bg-rose-500 text-white font-semibold'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {room.dimensions} ({room.wallColor?.split('/')[0] || 'Room'})
                </button>
              ))}
            </div>

            {/* Custom Photo Upload Input */}
            <label className="cursor-pointer px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-orange-500 hover:from-rose-500 hover:to-orange-400 text-white text-xs font-bold flex items-center space-x-1.5 transition">
              <Upload className="w-3.5 h-3.5" />
              <span>Upload My Wall Photo</span>
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleFileUpload} 
              />
            </label>
          </div>

          {/* Canvas Viewport */}
          <div className="rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 relative shadow-2xl">
            <canvas 
              ref={canvasRef} 
              className="w-full h-auto block" 
            />

            {/* Scale & Position Sliders Overlay */}
            <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700/80 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center space-x-2">
                <span className="text-slate-400">Adjust Scale:</span>
                <input
                  type="range"
                  min="0.7"
                  max="1.3"
                  step="0.05"
                  value={scale}
                  onChange={(e) => setScale(parseFloat(e.target.value))}
                  className="w-24 accent-rose-500"
                />
                <span className="font-mono text-white text-[10px]">{Math.round(scale * 100)}%</span>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-slate-400">Shift Left/Right:</span>
                <input
                  type="range"
                  min="-150"
                  max="150"
                  step="10"
                  value={posX}
                  onChange={(e) => setPosX(parseInt(e.target.value))}
                  className="w-24 accent-sky-400"
                />
              </div>

              <button
                onClick={() => { setScale(1.0); setPosX(0); setPosY(0); }}
                className="px-2 py-1 rounded bg-slate-800 text-slate-300 hover:text-white text-[11px] flex items-center space-x-1"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>
          </div>

        </div>

        {/* Right 4 Cols: Decor Theme Fitting Selector & AI Stylist Advice */}
        <div className="lg:col-span-4 space-y-4">
          
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>Choose Decor Theme</span>
              <span className="text-rose-400 font-mono">1-CLICK COMPOSITE</span>
            </h3>

            <div className="space-y-2">
              {packages.map(pkg => {
                const isSelected = activePackageId === pkg.id;
                return (
                  <button
                    key={pkg.id}
                    onClick={() => setActivePackageId(pkg.id)}
                    className={`w-full text-left p-3 rounded-xl border transition flex items-center space-x-3 ${
                      isSelected
                        ? 'bg-rose-500/10 border-rose-500 text-white shadow-md shadow-rose-950/20'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-lg overflow-hidden border border-slate-800 flex-shrink-0">
                      <img src={pkg.honestPhoto?.imageUrl} alt={pkg.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold truncate">{pkg.title}</h4>
                      <div className="flex items-center space-x-2 text-[10px] text-slate-400 mt-0.5">
                        <span className="font-mono">{pkg.blueprint?.width}</span>
                        <span>•</span>
                        <span className="text-emerald-400">₹{pkg.basePrice?.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-rose-400 flex-shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* AI Architectural Stylist Feedback */}
          <div className="p-4 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 space-y-3 text-xs">
            <div className="flex items-center space-x-2 text-rose-400 font-bold">
              <Sparkles className="w-4 h-4" />
              <span>AI Spatial Fitting Analysis</span>
            </div>

            <div className="text-slate-300 leading-relaxed whitespace-pre-line text-[11px]">
              {stylistFeedback || "Calculating wall clearance and lighting contrast..."}
            </div>

            <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center space-x-2 text-emerald-300 text-[10px]">
              <ShieldCheck className="w-4 h-4 flex-shrink-0 text-emerald-400" />
              <span>Free-standing frame certified. ₹2,000 paint warranty applies to this layout.</span>
            </div>

            <button
              onClick={() => onSelectTheme && onSelectTheme(activePkg)}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-orange-500 hover:from-rose-500 hover:to-orange-400 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-rose-950/30 transition"
            >
              <span>Confirm & Book This Theme</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
