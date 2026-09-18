import { useEffect, useRef, useState } from "react";

interface Props {
  onComplete: () => void;
}

export default function EntryExperience({ onComplete }: Props) {
  const [visible, setVisible] = useState(true);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const completedRef = useRef(false);

  const complete = () => {
    if (completedRef.current) return;
    completedRef.current = true;
    try { sessionStorage.setItem("trinetra-entry-seen", "1"); } catch { /* no-op */ }
    setVisible(false);
    onComplete();
  };

  useEffect(() => {
    try {
      if (sessionStorage.getItem("trinetra-entry-seen") === "1") {
        complete();
        return;
      }
    } catch { /* continue safely */ }

    const video = videoRef.current;
    if (!video) return;
    const timeout = window.setTimeout(() => setFailed(true), 14000);
    const play = video.play();
    play?.catch(() => setFailed(true));
    return () => window.clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (failed) return;
    const video = videoRef.current;
    if (!video) return;
    const onEnded = () => complete();
    video.addEventListener("ended", onEnded);
    return () => video.removeEventListener("ended", onEnded);
  }, [failed]);

  useEffect(() => {
    if (!failed) return;
    const timeout = window.setTimeout(complete, 2200);
    return () => window.clearTimeout(timeout);
  }, [failed]);

  if (!visible) return null;

  return (
    <div className="trinetra-entry trinetra-entry--video" aria-label="Entering Trinetra AI">
      {!failed ? (
        <video
          ref={videoRef}
          className={`trinetra-entry__video ${ready ? "is-ready" : ""}`}
          src="/video/trinetra-hero.mp4"
          poster="/trinetra-earth.png"
          autoPlay
          muted
          playsInline
          preload="auto"
          onCanPlay={() => setReady(true)}
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="trinetra-entry__fallback" role="status">
          <div className="entry-fallback-mark"><b /><b /><b /></div>
          <h1>TRINETRA <em>AI</em></h1>
          <p>THE GEOPOLITICAL INTELLIGENCE PLATFORM</p>
        </div>
      )}
      {!ready && !failed && <div className="trinetra-entry__blackout" aria-hidden="true" />}
      {failed && <button className="trinetra-entry__skip" onClick={complete}>Enter platform</button>}
    </div>
  );
}
