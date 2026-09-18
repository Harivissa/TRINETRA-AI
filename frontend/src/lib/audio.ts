/**
 * Plays a sound effect for the loading engine. MUST be called synchronously
 * inside the actual click handler (before any `await`) — browsers only
 * allow audio.play() without a permission prompt when it's directly tied
 * to a user gesture. Calling this from a useEffect after the component
 * mounts (even if the mount was triggered by a click) is one render cycle
 * too late and gets silently blocked by autoplay policy — that was the bug.
 */
export function playLoadingAudio() {
  try {
    const audio = new Audio("/audio/loading.mp3");
    audio.volume = 0.7;
    audio.play().catch(() => {
      // no file at that path yet, or the browser blocked it anyway — fine
    });
  } catch {
    // Audio API unavailable for some reason — never let this break the analysis flow
  }
}
