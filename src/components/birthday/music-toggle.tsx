import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

export function MusicToggle({ src, startPlayback = false }: { src: string | null; startPlayback?: boolean }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);

  useEffect(() => {
    if (!src || !startPlayback) return;

    const audio = new Audio(src);
    audio.loop = true;
    audio.muted = false;
    audio.volume = 0;
    audioRef.current = audio;

    let fadeInterval: any = null;

    const playAudio = async () => {
      try {
        await audio.play();
        setPlaying(true);
        setAutoplayBlocked(false);

        if (fadeInterval) clearInterval(fadeInterval);
        let vol = 0;
        fadeInterval = setInterval(() => {
          vol = Math.min(vol + 0.01, 0.35);
          audio.volume = vol;
          if (vol >= 0.35) {
            if (fadeInterval) clearInterval(fadeInterval);
          }
        }, 60);
      } catch (err) {
        console.warn("Failed to play audio:", err);
        setAutoplayBlocked(true);
      }
    };

    const handleEnded = () => {
      audio.currentTime = 0;
      audio.play().catch(() => {});
    };

    audio.addEventListener("ended", handleEnded);

    playAudio();

    return () => {
      if (fadeInterval) clearInterval(fadeInterval);
      audio.removeEventListener("ended", handleEnded);
      audio.pause();
      audioRef.current = null;
    };
  }, [src, startPlayback]);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (playing) {
      let vol = audio.volume;
      const id = setInterval(() => {
        vol = Math.max(vol - 0.04, 0);
        audio.volume = vol;
        if (vol <= 0) { clearInterval(id); audio.pause(); }
      }, 40);
      setPlaying(false);
    } else {
      audio.volume = 0;
      audio.muted = false;
      audio
        .play()
        .then(() => {
          setPlaying(true);
          setAutoplayBlocked(false);
          let vol = 0;
          const id = setInterval(() => {
            vol = Math.min(vol + 0.01, 0.35);
            audio.volume = vol;
            if (vol >= 0.35) clearInterval(id);
          }, 60);
        })
        .catch(() => {/* ignore */ });
    }
  };

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{
        opacity: 1,
        scale: autoplayBlocked ? [1, 1.12, 1] : 1,
      }}
      transition={{
        opacity: { delay: 0.8, duration: 0.5 },
        scale: autoplayBlocked
          ? { delay: 0.8, repeat: Infinity, duration: 1.4, ease: "easeInOut" }
          : { delay: 0.8, duration: 0.5 },
      }}
      onClick={toggle}
      aria-label={playing ? "Pause music" : "Play music"}
      title={autoplayBlocked ? "Click to play music 🎵" : undefined}
      className="glass fixed -right-2 top-3 z-50 grid h-11 w-11 place-items-center rounded-full text-rose shadow-lg shadow-rose/20 transition hover:scale-110 sm:right-4 sm:top-4 relative overflow-hidden"
    >
      {/* Pulsing glow ring when playing */}
      {playing && (
        <motion.span
          className="absolute inset-0 rounded-full border border-rose/50"
          animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeOut" }}
        />
      )}

      {/* Attention-grabbing ring when blocked */}
      {autoplayBlocked && (
        <motion.span
          className="absolute inset-0 rounded-full border-2 border-rose/70"
          animate={{ scale: [1, 1.4], opacity: [0.7, 0] }}
          transition={{ repeat: Infinity, duration: 1.2, ease: "easeOut" }}
        />
      )}

      {src ? (
        playing ? (
          /* Animated equalizer bars */
          <span className="flex items-end gap-[2.5px] h-4">
            {[0.4, 0.7, 1, 0.6, 0.85].map((max, i) => (
              <motion.span
                key={i}
                className="w-[3px] rounded-sm bg-rose"
                animate={{ scaleY: [0.3, max, 0.3] }}
                transition={{
                  repeat: Infinity,
                  duration: 0.7 + i * 0.1,
                  delay: i * 0.09,
                  ease: "easeInOut",
                }}
                style={{ originY: 1, height: "14px" }}
              />
            ))}
          </span>
        ) : (
          /* Play icon */
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="6 3 20 12 6 21 6 3" />
          </svg>
        )
      ) : (
        /* Music note icon when no src */
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18V5l12-2v13" />
          <circle cx="6" cy="18" r="3" />
          <circle cx="18" cy="16" r="3" />
        </svg>
      )}
    </motion.button>
  );
}