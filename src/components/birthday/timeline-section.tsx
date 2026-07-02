import { motion } from "framer-motion";
import { timelineMoments } from "@/data/birthday-content";
import { SectionHeading } from "./gallery-section";

export function TimelineSection() {
  return (
    <section className="relative px-4 py-10 sm:px-6">
      <SectionHeading eyebrow="Our story, so far" title="Little moments, big forever" />

      <div className="relative mx-auto mt-14 max-w-2xl">
        <div
          aria-hidden
          className="absolute left-3 top-0 h-full w-px bg-gradient-to-b from-rose/60 via-lavender to-transparent sm:left-1/2 sm:-translate-x-1/2"
        />
        <ul className="space-y-10">
          {timelineMoments.map((m, i) => (
            <motion.li
              key={m.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: 0.05 * i }}
              className={`relative pl-10 sm:w-1/2 sm:pl-0 ${i % 2 === 0 ? "sm:pr-10 sm:text-right" : "sm:ml-auto sm:pl-10"
                }`}
            >
              <span
                aria-hidden
                className="absolute left-1 top-4 grid h-5 w-5 place-items-center rounded-full bg-gradient-to-br from-rose to-plum text-[10px] text-white shadow-md shadow-rose/40 sm:left-auto sm:right-[-10px] sm:top-3"
                style={i % 2 === 1 ? { left: -10, right: "auto" } : undefined}
              >
                ❤
              </span>
              <div className="glass rounded-2xl p-4 text-left sm:inline-block sm:p-5 sm:text-inherit">
                <p className="font-script text-base text-rose">{m.date}</p>
                <h3 className="mt-1 font-serif-romantic text-xl font-semibold text-plum">{m.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-plum/75">{m.description}</p>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}