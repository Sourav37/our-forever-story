import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { welcomeContent } from "@/data/birthday-content";

export function StickyHeader() {
  const [visible, setVisible] = useState(false);
  const [nameIndex, setNameIndex] = useState(0);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setNameIndex((i) => (i + 1) % welcomeContent.names.length);
    }, 2600);
    return () => clearInterval(id);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.header
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -60, opacity: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="glass-strong fixed inset-x-0 top-0 z-40 flex items-center justify-center gap-2 px-14 py-2.5 text-center sm:px-20 sm:py-3"
        >
          <span className="font-script text-lg text-rose sm:text-xl">
            Happy Birthday
          </span>
          <span className="text-rose">❤️</span>
          <AnimatePresence mode="wait">
            <motion.span
              key={welcomeContent.names[nameIndex]}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.4 }}
              className="truncate font-serif-romantic text-base font-medium text-plum sm:text-lg"
            >
              {welcomeContent.names[nameIndex]}
            </motion.span>
          </AnimatePresence>
        </motion.header>
      )}
    </AnimatePresence>
  );
}