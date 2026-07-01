import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

export function MusicToggle({ src }: { src: string | null }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!src) return;
    const audio = new Audio(src);
    audio.loop = true;
    audio.volume = 0.4;
    audioRef.current = audio;
    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, [src]);

  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      try {
        await audio.play();
        setPlaying(true);
      } catch {
        // Browser blocked autoplay; ignored.
      }
    }
  };

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1, rotate: 360 }}
      transition={{
        opacity: { delay: 1.2, duration: 0.6 },
        scale: { delay: 1.2, duration: 0.6 },
        rotate: { repeat: Infinity, ease: "linear", duration: 12 },
      }}
      onClick={toggle}
      aria-label={playing ? "Pause music" : "Play music"}
      className="glass fixed right-3 top-3 z-50 grid h-11 w-11 place-items-center rounded-full text-rose shadow-lg shadow-rose/20 transition hover:scale-110 sm:right-4 sm:top-4"
    >
      {src ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {playing ? (
            <>
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </>
          ) : (
            <polygon points="6 3 20 12 6 21 6 3" />
          )}
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18V5l12-2v13" />
          <circle cx="6" cy="18" r="3" />
          <circle cx="18" cy="16" r="3" />
        </svg>
      )}
    </motion.button>
  );
}