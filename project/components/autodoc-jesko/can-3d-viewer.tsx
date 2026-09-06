'use client';

import { useRef, useEffect, useState } from 'react';
import { RotateCw, Volume2, VolumeX, Activity, Cpu, Wrench, Sparkles, ShieldAlert, Gauge } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Jesko3DCanViewer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);
  const [soundPlaying, setSoundPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize WebGL/Canvas metallic engine cylinder visualization
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const width = 160;
      const height = 260;

      ctx.save();
      ctx.translate(centerX, centerY);

      // Rotate light reflections based on state
      const currentRot = (rotation * Math.PI) / 180;

      // Draw glowing outer aura
      const auraGradient = ctx.createRadialGradient(0, 0, 40, 0, 0, 180);
      auraGradient.addColorStop(0, 'rgba(197, 168, 128, 0.25)');
      auraGradient.addColorStop(0.5, 'rgba(197, 168, 128, 0.08)');
      auraGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = auraGradient;
      ctx.beginPath();
      ctx.arc(0, 0, 190, 0, Math.PI * 2);
      ctx.fill();

      // Main metallic cylinder body
      ctx.save();
      ctx.rotate(currentRot * 0.1);

      // Metallic cylinder gradient
      const bodyGrad = ctx.createLinearGradient(-width / 2, 0, width / 2, 0);
      bodyGrad.addColorStop(0, '#101319');
      bodyGrad.addColorStop(0.2, '#1E232E');
      bodyGrad.addColorStop(0.4, '#C5A880');
      bodyGrad.addColorStop(0.5, '#FFF0DB');
      bodyGrad.addColorStop(0.65, '#C5A880');
      bodyGrad.addColorStop(0.8, '#1A1E27');
      bodyGrad.addColorStop(1, '#0C0E12');

      ctx.fillStyle = bodyGrad;
      ctx.beginPath();
      ctx.roundRect(-width / 2, -height / 2, width, height, 24);
      ctx.fill();

      // Gold Metallic Trim Rings
      ctx.strokeStyle = '#C5A880';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Horizontal Engine Rib Lines
      ctx.strokeStyle = 'rgba(197, 168, 128, 0.4)';
      ctx.lineWidth = 1.5;
      for (let y = -height / 2 + 30; y < height / 2 - 20; y += 25) {
        ctx.beginPath();
        ctx.moveTo(-width / 2 + 10, y);
        ctx.lineTo(width / 2 - 10, y);
        ctx.stroke();
      }

      // Front Emblem (AUTODOC V8 TURBO)
      ctx.fillStyle = '#090B0E';
      ctx.beginPath();
      ctx.arc(0, -20, 36, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#C5A880';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Emblem Inner Glow
      ctx.fillStyle = '#C5A880';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('AUTODOC', 0, -24);
      ctx.fillStyle = '#E2C799';
      ctx.font = 'bold 9px sans-serif';
      ctx.fillText('V8 TELEMETRY', 0, -10);

      // Digital Pulse LED Indicator
      const ledGlow = Math.sin(Date.now() / 250) * 0.4 + 0.6;
      ctx.fillStyle = `rgba(197, 168, 128, ${ledGlow})`;
      ctx.beginPath();
      ctx.arc(0, 10, 5, 0, Math.PI * 2);
      ctx.fill();

      // Engine Specs Badge
      ctx.fillStyle = 'rgba(197, 168, 128, 0.15)';
      ctx.roundRect(-50, 45, 100, 24, 6);
      ctx.fill();
      ctx.strokeStyle = 'rgba(197, 168, 128, 0.4)';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.fillStyle = '#FFF0DB';
      ctx.font = 'bold 10px sans-serif';
      ctx.fillText('OBD-II LIVE SCAN', 0, 60);

      ctx.restore();
      ctx.restore();

      if (autoRotate && !isDragging) {
        setRotation((prev) => (prev + 0.6) % 360);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [rotation, autoRotate, isDragging]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStartX(e.clientX);
    setAutoRotate(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStartX;
    setRotation((prev) => (prev + deltaX * 0.8) % 360);
    setDragStartX(e.clientX);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const toggleSound = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio('https://cdn.freesound.org/previews/516/516843_6142149-lq.mp3');
      audioRef.current.volume = 0.3;
    }

    if (soundPlaying) {
      audioRef.current.pause();
      setSoundPlaying(false);
    } else {
      audioRef.current.play().catch(() => {});
      setSoundPlaying(true);
    }
  };

  return (
    <div className="relative mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* 3-Column Layout: Left Spec Card, Center Interactive 3D Rotator, Right Description Card */}
      <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
        
        {/* Left Column: Spec Highlights */}
        <div className="lg:col-span-4 space-y-6">
          <div className="jesko-card-surface rounded-2xl p-6 relative overflow-hidden">
            <div className="flex items-center gap-2 text-[#C5A880] text-xs font-sans-luxury font-bold tracking-widest uppercase mb-3">
              <Cpu className="h-4 w-4" />
              <span>Diagnostic Telemetry</span>
            </div>
            <h3 className="font-serif-luxury text-2xl font-bold gold-gradient-text">
              V8 AutoDoc Scanner
            </h3>
            <p className="mt-1 text-xs text-[#8E96A4] font-sans-luxury">
              330-Point Cloud Telemetry Scan with Zero sugarcoated quotes.
            </p>

            <div className="mt-6 border-t border-[#C5A880]/10 pt-4 space-y-3">
              <div className="flex items-center justify-between text-xs font-sans-luxury">
                <span className="text-[#8E96A4]">ECU Protocol</span>
                <span className="text-[#FFF0DB] font-semibold">OBD-II High Velocity</span>
              </div>
              <div className="flex items-center justify-between text-xs font-sans-luxury">
                <span className="text-[#8E96A4]">Quote Guarantee</span>
                <span className="text-[#C5A880] font-semibold">100% Itemized Parts & Labor</span>
              </div>
              <div className="flex items-center justify-between text-xs font-sans-luxury">
                <span className="text-[#8E96A4]">Inspection Time</span>
                <span className="text-[#FFF0DB] font-semibold">Under 15 Minutes</span>
              </div>
            </div>

            <div className="mt-6 rounded-xl bg-[#090B0E]/80 border border-[#C5A880]/20 p-3 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#C5A880]/15 text-[#C5A880]">
                <Gauge className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[11px] font-sans-luxury font-semibold text-[#FFF0DB]">
                  Live Torque & Engine Calibration
                </p>
                <p className="text-[10px] text-[#8E96A4]">
                  Continuous fault code detection
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Center Column: Interactive 3D Canvas Rotator */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center text-center">
          <div
            className="relative cursor-grab active:cursor-grabbing group flex items-center justify-center"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {/* Canvas */}
            <canvas
              ref={canvasRef}
              width={340}
              height={360}
              className="touch-none transition-transform duration-300 group-hover:scale-105"
            />

            {/* Drag Instruction Badge Overlay */}
            <div className="pointer-events-none absolute bottom-4 rounded-full border border-[#C5A880]/30 bg-[#090B0E]/90 px-4 py-1.5 text-[11px] font-sans-luxury font-medium text-[#C5A880] backdrop-blur-md shadow-xl flex items-center gap-2">
              <RotateCw className="h-3 w-3 animate-spin text-[#C5A880]" />
              <span>Drag to Rotate 3D Engine</span>
            </div>
          </div>

          {/* Interactive Rotator Controls */}
          <div className="mt-4 flex items-center gap-3">
            <Button
              onClick={() => {
                setAutoRotate(!autoRotate);
                setRotation((prev) => prev + 90);
              }}
              variant="outline"
              size="sm"
              className="border-[#C5A880]/30 text-[#C5A880] hover:bg-[#C5A880]/10 hover:border-[#C5A880] text-xs font-sans-luxury font-semibold rounded-full px-4"
            >
              <RotateCw className="mr-1.5 h-3.5 w-3.5" />
              Rotate AutoDoc
            </Button>

            <Button
              onClick={toggleSound}
              variant="outline"
              size="sm"
              className="border-[#C5A880]/30 text-[#C5A880] hover:bg-[#C5A880]/10 text-xs font-sans-luxury font-semibold rounded-full px-3"
            >
              {soundPlaying ? (
                <Volume2 className="h-3.5 w-3.5 text-[#C5A880] animate-pulse" />
              ) : (
                <VolumeX className="h-3.5 w-3.5 text-[#8E96A4]" />
              )}
            </Button>
          </div>
        </div>

        {/* Right Column: Executive Description */}
        <div className="lg:col-span-4 space-y-6">
          <div className="jesko-card-surface rounded-2xl p-6 relative overflow-hidden">
            <div className="flex items-center gap-2 text-[#C5A880] text-xs font-sans-luxury font-bold tracking-widest uppercase mb-3">
              <Sparkles className="h-4 w-4" />
              <span>Executive Marketplace</span>
            </div>
            <h3 className="font-serif-luxury text-2xl font-bold gold-gradient-text">
              Precision Repair Network
            </h3>
            <p className="mt-3 text-xs text-[#8E96A4] font-sans-luxury leading-relaxed">
              AutoDoc is the premier open diagnostic platform connecting drivers directly with verified master mechanics. Designed with full telemetry transparency, itemized quote bidding, and immutable digital repair logs.
            </p>

            <div className="mt-6 flex items-center justify-between pt-4 border-t border-[#C5A880]/10">
              <div className="text-left">
                <span className="block font-serif-luxury text-2xl font-bold text-[#FFF0DB]">
                  100%
                </span>
                <span className="text-[10px] uppercase tracking-wider text-[#8E96A4]">
                  Verified Shops
                </span>
              </div>
              <div className="text-left">
                <span className="block font-serif-luxury text-2xl font-bold text-[#C5A880]">
                  &lt; 2 Min
                </span>
                <span className="text-[10px] uppercase tracking-wider text-[#8E96A4]">
                  Quote Matching
                </span>
              </div>
              <div className="text-left">
                <span className="block font-serif-luxury text-2xl font-bold text-[#FFF0DB]">
                  4.9★
                </span>
                <span className="text-[10px] uppercase tracking-wider text-[#8E96A4]">
                  Driver Rating
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
