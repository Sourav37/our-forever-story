import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { welcomeContent } from "@/data/birthday-content";

export function WelcomeSection({ onStart }: { onStart: () => void }) {
  const [nameIndex, setNameIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setNameIndex((i) => (i + 1) % welcomeContent.names.length);
    }, 2200);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center px-6 py-16 text-center">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, ease: "easeOut" }}
        className="glass-strong relative z-10 flex w-full max-w-md flex-col items-center gap-6 rounded-3xl px-6 py-10 sm:px-10 sm:py-12"
      >
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="font-script text-lg text-rose"
        >
          For the one who has my heart
        </motion.p>

        <h1 className="text-gradient-rose font-script text-5xl leading-tight sm:text-6xl">
          {welcomeContent.greeting}
          <span className="ml-1 text-rose">❤️</span>
        </h1>

        <div className="flex h-16 items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.span
              key={welcomeContent.names[nameIndex]}
              initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -14, filter: "blur(6px)" }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="font-serif-romantic text-4xl font-medium text-plum sm:text-5xl"
            >
              {welcomeContent.names[nameIndex]}
            </motion.span>
          </AnimatePresence>
        </div>

        <p className="max-w-sm text-balance font-serif-romantic text-base leading-relaxed text-plum/80 sm:text-lg">
          {welcomeContent.message}
        </p>

        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          onClick={onStart}
          className="mt-2 rounded-full bg-gradient-to-r from-rose to-plum px-8 py-3 font-serif-romantic text-base font-medium text-primary-foreground shadow-lg shadow-rose/30 transition hover:shadow-xl hover:shadow-rose/40"
        >
          {welcomeContent.ctaLabel}
        </motion.button>
      </motion.div>

      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-plum/50"
      >
        <span className="font-serif-romantic text-sm">scroll ↓</span>
      </motion.div>
    </section>
  );
}