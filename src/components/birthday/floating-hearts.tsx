import { useMemo } from "react";

// Ambient floating hearts + sparkles rendered behind content. Pure CSS animation.
export function FloatingHearts({ count = 14 }: { count?: number }) {
  const hearts = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 12,
        duration: 12 + Math.random() * 10,
        size: 12 + Math.random() * 18,
        opacity: 0.35 + Math.random() * 0.35,
        char: Math.random() > 0.4 ? "❤" : "✦",
      })),
    [count],
  );

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {hearts.map((h) => (
        <span
          key={h.id}
          className="absolute bottom-0 text-rose"
          style={{
            left: `${h.left}%`,
            fontSize: `${h.size}px`,
            opacity: h.opacity,
            animation: `float-heart ${h.duration}s linear ${h.delay}s infinite`,
            color: h.char === "✦" ? "oklch(0.82 0.06 305)" : undefined,
          }}
        >
          {h.char}
        </span>
      ))}
    </div>
  );
}