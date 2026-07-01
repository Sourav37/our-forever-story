import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { loveLetter } from "@/data/birthday-content";
import { SectionHeading } from "./gallery-section";

export function LetterSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [typed, setTyped] = useState("");

  useEffect(() => {
    if (!inView) return;
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setTyped(loveLetter.slice(0, i));
      if (i >= loveLetter.length) clearInterval(id);
    }, 22);
    return () => clearInterval(id);
  }, [inView]);

  return (
    <section className="relative px-4 py-20 sm:px-6">
      <SectionHeading eyebrow="A letter, from me to you" title="Words from my heart" />

      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="glass-strong mx-auto mt-10 max-w-xl rounded-3xl p-7 sm:p-10"
      >
        <pre className="whitespace-pre-wrap font-serif-romantic text-base leading-relaxed text-plum sm:text-lg">
          {typed}
          {typed.length < loveLetter.length && (
            <span
              aria-hidden
              className="inline-block w-[2px] translate-y-1 bg-rose"
              style={{ height: "1em", animation: "typewriter-caret 0.9s steps(1) infinite" }}
            />
          )}
        </pre>
      </motion.div>
    </section>
  );
}