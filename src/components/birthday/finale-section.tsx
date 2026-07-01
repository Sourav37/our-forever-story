import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import confetti from "canvas-confetti";
import { finaleContent } from "@/data/birthday-content";

export function FinaleSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-120px" });
  const [fired, setFired] = useState(false);

  useEffect(() => {
    if (!inView || fired) return;
    setFired(true);
    const fire = (opts: confetti.Options) =>
      confetti({
        particleCount: 60,
        spread: 70,
        startVelocity: 45,
        ticks: 200,
        colors: ["#f7c5cc", "#e8a5b0", "#d8b4e2", "#fff1e6", "#c98da8"],
        ...opts,
      });
    fire({ origin: { x: 0.2, y: 0.7 }, angle: 60 });
    fire({ origin: { x: 0.8, y: 0.7 }, angle: 120 });
    const t = setTimeout(() => fire({ origin: { x: 0.5, y: 0.6 }, spread: 120 }), 400);
    return () => clearTimeout(t);
  }, [inView, fired]);

  const relight = () => {
    confetti({
      particleCount: 120,
      spread: 100,
      origin: { x: 0.5, y: 0.6 },
      colors: ["#f7c5cc", "#e8a5b0", "#d8b4e2", "#fff1e6", "#c98da8"],
    });
  };

  return (
    <section
      ref={ref}
      className="relative flex min-h-screen flex-col items-center justify-center px-6 py-24 text-center"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9 }}
        className="glass-strong flex w-full max-w-md flex-col items-center gap-8 rounded-3xl px-6 py-12 sm:px-10"
      >
        <BirthdayCake onClick={relight} />

        <h2 className="text-gradient-rose font-script text-4xl leading-tight sm:text-5xl">
          {finaleContent.title}
        </h2>

        <p className="font-serif-romantic text-lg text-plum/80">
          Every candle is a wish I make for you.
          <br />
          Every star is a promise I keep.
        </p>

        <div className="mt-2">
          <p className="font-script text-2xl text-rose">{finaleContent.signature}</p>
          <p className="mt-2 text-xs uppercase tracking-[0.3em] text-plum/60">with all my love ❤</p>
        </div>

        <button
          onClick={relight}
          className="mt-2 rounded-full border border-rose/40 bg-white/50 px-6 py-2 text-sm font-medium text-plum backdrop-blur transition hover:bg-white/70"
        >
          Make another wish ✨
        </button>
      </motion.div>
    </section>
  );
}

function BirthdayCake({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label="Light the candles"
      className="group relative h-40 w-48 outline-none"
    >
      {/* Plate */}
      <div className="absolute bottom-0 left-1/2 h-2 w-44 -translate-x-1/2 rounded-full bg-plum/20 blur-[1px]" />
      {/* Bottom tier */}
      <div className="absolute bottom-2 left-1/2 h-14 w-40 -translate-x-1/2 rounded-xl bg-gradient-to-b from-blush to-rose/70 shadow-inner">
        <div className="absolute inset-x-2 top-1 flex justify-between text-xs text-white/80">
          {"• • • • • • •".split(" ").map((d, i) => (
            <span key={i}>{d}</span>
          ))}
        </div>
      </div>
      {/* Top tier */}
      <div className="absolute bottom-16 left-1/2 h-10 w-28 -translate-x-1/2 rounded-lg bg-gradient-to-b from-white to-blush shadow-inner" />
      {/* Frosting drip */}
      <div className="absolute bottom-[6.25rem] left-1/2 h-3 w-28 -translate-x-1/2 rounded-b-full bg-white/90" />
      {/* Candles */}
      {[-24, 0, 24].map((x) => (
        <div key={x} className="absolute bottom-[6.5rem] left-1/2" style={{ transform: `translateX(${x - 4}px)` }}>
          <div className="h-6 w-2 rounded-sm bg-gradient-to-b from-lavender to-rose" />
          <div
            className="absolute -top-3 left-1/2 h-4 w-3 -translate-x-1/2 rounded-full bg-gradient-to-b from-yellow-200 via-orange-300 to-rose"
            style={{ animation: "candle-flicker 1.2s ease-in-out infinite", transformOrigin: "bottom center" }}
          />
          <div className="absolute -top-4 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-white/80 blur-[1px]" />
        </div>
      ))}
    </button>
  );
}