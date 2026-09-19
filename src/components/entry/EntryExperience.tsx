import { useEffect, useRef, useState, useCallback } from "react";
import { ArrowRight, Volume2, VolumeX, Eye, Shield, Globe } from "lucide-react";

interface EntryExperienceProps {
  onComplete: () => void;
  isReplay?: boolean;
}

export default function EntryExperience({ onComplete, isReplay = false }: EntryExperienceProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const [isEntering, setIsEntering] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [hasSoundTrack, setHasSoundTrack] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const [progress, setProgress] = useState(0);

  // Check if first visit or replay
  useEffect(() => {
    if (!isReplay) {
      try {
        const seen = localStorage.getItem("trinetra_intro_completed");
        if (seen === "true") {
          onComplete();
          return;
        }
      } catch {
        // Ignore localStorage error
      }
    }
  }, [isReplay, onComplete]);

  // Attempt video playback
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Explicitly enforce muted properties on DOM node for strict browser autoplay policies
    video.muted = true;
    video.defaultMuted = true;

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        video.muted = true;
        video.play().catch(() => {
          // Autoplay fully blocked; graceful fallback mode
          setVideoFailed(true);
        });
      });
    }
  }, []);

  const handleEnter = useCallback(() => {
    if (isEntering) return;
    setIsEntering(true);
    try {
      localStorage.setItem("trinetra_intro_completed", "true");
    } catch {
      // Ignore storage error
    }
    // Smooth fade-out duration (650ms)
    window.setTimeout(() => {
      onComplete();
    }, 650);
  }, [isEntering, onComplete]);

  // Keyboard shortcut listener: Enter or Space to enter
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleEnter();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleEnter]);

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (video && video.duration) {
      setProgress((video.currentTime / video.duration) * 100);
    }
  };

  const handleVideoEnded = () => {
    setVideoEnded(true);
  };

  const toggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    const nextMuted = !video.muted;
    video.muted = nextMuted;
    setIsMuted(nextMuted);
    if (!nextMuted) setHasSoundTrack(true);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col justify-between bg-[#050608] text-neutral-100 overflow-hidden select-none transition-opacity duration-700 ease-out ${
        isEntering ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      role="region"
      aria-label="Trinetra Cinematic Intelligence Entry"
    >
      {/* 1. Cinematic Background Video */}
      <video
        ref={videoRef}
        playsInline
        autoPlay
        muted
        preload="auto"
        onLoadedData={() => setVideoLoaded(true)}
        onCanPlay={() => setVideoLoaded(true)}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleVideoEnded}
        onError={() => setVideoFailed(true)}
        className={`absolute inset-0 size-full object-cover transition-opacity duration-1000 ${
          videoLoaded && !videoFailed ? "opacity-90" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Standard Vite public directory root asset path */}
        <source src="/trinetra-hero.mp4" type="video/mp4" />
      </video>

      {/* Fallback ambient tactical grid if video is loading or stalled */}
      {(!videoLoaded || videoFailed) && (
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `radial-gradient(#ff9933 1px, transparent 1px), radial-gradient(#262626 1px, transparent 1px)`,
              backgroundSize: "48px 48px",
              backgroundPosition: "0 0, 24px 24px",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/90" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[640px] rounded-full bg-trinetra-saffron/5 blur-[120px]" />
        </div>
      )}

      {/* Atmospheric Vignette & Contrast Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#050608] via-transparent to-[#050608]/70" />
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_120px_rgba(0,0,0,0.85)]" />

      {/* 2. Top Command Bar HUD */}
      <header className="relative z-20 flex items-center justify-between px-6 py-6 sm:px-10 sm:py-8">
        <div className="flex items-center gap-3">
          <div className="size-7 rounded border border-trinetra-saffron/70 bg-trinetra-saffron/10 flex items-center justify-center text-trinetra-saffron font-bold text-xs tracking-wider">
            त्र
          </div>
          <div>
            <div className="font-display text-lg font-semibold tracking-widest text-neutral-100 flex items-center gap-2">
              TRINETRA <span className="text-trinetra-saffron text-xs font-mono font-normal tracking-wider">OS // 1.0</span>
            </div>
            <div className="font-mono text-[9px] uppercase tracking-[0.25em] text-neutral-400">
              Strategic Geopolitical Intelligence Platform
            </div>
          </div>
        </div>

        {/* Top Right Controls: Audio Toggle & Quick Enter */}
        <div className="flex items-center gap-3">
          {videoLoaded && !videoFailed && (
            <button
              onClick={toggleSound}
              className="p-2 rounded border border-white/10 bg-black/40 hover:bg-black/70 hover:border-trinetra-saffron/60 text-neutral-400 hover:text-white transition-all text-xs flex items-center gap-1.5 backdrop-blur cursor-pointer"
              title={isMuted ? "Unmute Audio Briefing" : "Mute Audio"}
            >
              {isMuted ? <VolumeX className="size-3.5" /> : <Volume2 className="size-3.5 text-trinetra-saffron" />}
              <span className="hidden sm:inline font-mono text-[10px] tracking-wider uppercase">
                {isMuted ? "Audio Off" : "Audio Active"}
              </span>
            </button>
          )}

          <button
            onClick={handleEnter}
            className="px-3.5 py-1.5 rounded border border-white/15 bg-black/50 hover:border-trinetra-saffron/60 text-neutral-300 hover:text-white text-xs font-mono tracking-wider transition-all backdrop-blur flex items-center gap-1.5 cursor-pointer"
          >
            <span>Skip Briefing</span>
            <ArrowRight className="size-3 text-trinetra-saffron" />
          </button>
        </div>
      </header>

      {/* 3. Center Reticle & Conceptual Statement */}
      <main className="relative z-20 mx-auto max-w-4xl px-6 text-center my-auto">
        <div className="inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.3em] text-trinetra-saffron border border-trinetra-saffron/30 px-3 py-1 rounded bg-black/60 backdrop-blur mb-6 uppercase">
          <Eye className="size-3 animate-pulse text-trinetra-saffron" />
          Command Center Initialization
        </div>

        <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-light text-neutral-50 tracking-tight mb-4 leading-none">
          TRINETRA
        </h1>

        <p className="font-mono text-xs sm:text-sm tracking-[0.25em] uppercase text-neutral-400 max-w-2xl mx-auto mb-8">
          Observe <span className="text-trinetra-saffron">•</span> Connect <span className="text-trinetra-saffron">•</span> Anticipate
        </p>

        <p className="text-sm sm:text-base text-neutral-300 max-w-xl mx-auto mb-10 leading-relaxed font-light">
          Synthesizing multi-domain sovereign actors, strategic alliances, trade chokepoints, and bilateral rivalry resilience into a unified intelligence environment.
        </p>

        {/* Primary Command Center Call To Action */}
        <div className="flex flex-col items-center justify-center gap-3">
          <button
            onClick={handleEnter}
            className="px-8 py-3.5 rounded bg-trinetra-saffron text-black font-semibold text-xs sm:text-sm tracking-wider uppercase hover:bg-[#ffaa4d] transition-all flex items-center justify-center gap-2.5 shadow-xl shadow-trinetra-saffron/20 group cursor-pointer"
          >
            <span>Enter Trinetra Platform</span>
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </button>
          <div className="font-mono text-[10px] text-neutral-400 tracking-widest uppercase">
            Press <kbd className="px-1.5 py-0.5 rounded bg-neutral-800 border border-neutral-700 text-neutral-300">Enter ↵</kbd> or click to begin
          </div>
        </div>
      </main>

      {/* 4. Bottom Telemetry & Progress Ribbon */}
      <footer className="relative z-20 px-6 py-6 sm:px-10 sm:py-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10 bg-[#050608]/70 backdrop-blur">
        <div className="flex items-center gap-6 font-mono text-[11px] text-neutral-400">
          <div className="flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-neutral-300">INTELLIGENCE GRID: ACTIVE</span>
          </div>
          <div className="hidden md:inline text-neutral-400">
            SOVEREIGN PROFILES: VERIFIED
          </div>
          <div className="hidden lg:inline text-neutral-400">
            CHOKEPOINT ATLAS: ONLINE
          </div>
        </div>

        {/* Video progress indicator if video is running */}
        <div className="w-full sm:w-64 flex items-center gap-3">
          <div className="flex-1 h-1 bg-neutral-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-trinetra-saffron transition-all duration-300 ease-out"
              style={{ width: `${Math.max(progress, videoLoaded ? 15 : 0)}%` }}
            />
          </div>
          <span className="font-mono text-[10px] text-neutral-400 tracking-wider">
            {videoEnded ? "READY" : `${Math.round(progress)}%`}
          </span>
        </div>
      </footer>
    </div>
  );
}
