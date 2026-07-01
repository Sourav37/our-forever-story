import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

// Auto-discovery: drop .jpg/.png/.webp/.mp4 files into src/assets/gallery/
// and they'll appear here automatically.
const imageModules = import.meta.glob("/src/assets/gallery/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP}", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

const videoModules = import.meta.glob("/src/assets/gallery/*.{mp4,webm,mov,MP4,WEBM,MOV}", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

type MediaItem =
  | { type: "image"; src: string; key: string }
  | { type: "video"; src: string; key: string };

// Elegant placeholder tiles when no media has been uploaded yet.
const PLACEHOLDER_COUNT = 9;

export function GallerySection() {
  const media: MediaItem[] = useMemo(() => {
    const images: MediaItem[] = Object.entries(imageModules)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, src]) => ({ type: "image", src, key }));
    const videos: MediaItem[] = Object.entries(videoModules)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, src]) => ({ type: "video", src, key }));
    return [...images, ...videos];
  }, []);

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const slides = media.map((m) => ({ src: m.src, _kind: m.type })) as unknown as {
    src: string;
  }[];

  const hasMedia = media.length > 0;

  return (
    <section id="gallery" className="relative px-4 py-20 sm:px-6">
      <SectionHeading eyebrow="Our little universe" title="Moments, framed forever" />

      {hasMedia ? (
        <div className="mx-auto mt-10 max-w-6xl columns-2 gap-3 sm:columns-3 sm:gap-4 lg:columns-4">
          {media.map((item, i) => {
            // Alternate entrance directions for a lively mobile scroll feel.
            const variants = [
              { x: -40, y: 30, rotate: -4 },
              { x: 40, y: 30, rotate: 4 },
              { x: 0, y: 60, rotate: 0 },
              { x: -20, y: 40, rotate: 2 },
            ];
            const v = variants[i % variants.length];
            return (
            <motion.button
              key={item.key}
              initial={{ opacity: 0, x: v.x, y: v.y, rotate: v.rotate, scale: 0.85, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, x: 0, y: 0, rotate: 0, scale: 1, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.8, delay: (i % 6) * 0.08, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ scale: 1.04, rotate: v.rotate / 2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setOpenIndex(i)}
              className="glass mb-3 block w-full overflow-hidden rounded-2xl p-1 sm:mb-4"
            >
              {item.type === "image" ? (
                <img
                  src={item.src}
                  alt="A precious memory of us"
                  loading="lazy"
                  className="h-auto w-full rounded-xl object-cover"
                />
              ) : (
                <div className="relative">
                  <video
                    src={item.src}
                    muted
                    playsInline
                    preload="metadata"
                    className="h-auto w-full rounded-xl object-cover"
                  />
                  <div className="pointer-events-none absolute inset-0 grid place-items-center">
                    <div className="glass-strong grid h-12 w-12 place-items-center rounded-full text-rose">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="7 5 20 12 7 19 7 5" />
                      </svg>
                    </div>
                  </div>
                </div>
              )}
            </motion.button>
          );
          })}
        </div>
      ) : (
        <div className="mx-auto mt-10 max-w-6xl columns-2 gap-3 sm:columns-3 sm:gap-4 lg:columns-4">
          {Array.from({ length: PLACEHOLDER_COUNT }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.05 }}
              className="glass mb-3 flex w-full items-center justify-center rounded-2xl p-1 sm:mb-4"
              style={{ height: 120 + ((i * 37) % 140) }}
            >
              <span className="font-script text-3xl text-rose/60">❤</span>
            </motion.div>
          ))}
          <p className="mt-6 text-center font-serif-romantic text-sm text-plum/60">
            Drop your photos & videos into <code className="rounded bg-white/60 px-1.5 py-0.5 text-xs">src/assets/gallery/</code> to see them here.
          </p>
        </div>
      )}

      <Lightbox
        open={openIndex !== null}
        index={openIndex ?? 0}
        close={() => setOpenIndex(null)}
        slides={slides}
        render={{
          slide: ({ slide }) => {
            const s = slide as { src: string; _kind?: "image" | "video" };
            if (s._kind === "video") {
              return (
                <video
                  controls
                  autoPlay
                  playsInline
                  className="max-h-[85vh] max-w-[95vw] rounded-lg"
                  src={s.src}
                />
              );
            }
            return (
              <img
                src={s.src}
                alt=""
                className="max-h-[85vh] max-w-[95vw] rounded-lg object-contain"
              />
            );
          },
        }}
        styles={{ container: { backgroundColor: "rgba(40, 20, 40, 0.92)" } }}
      />
    </section>
  );
}

export function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      className="mx-auto max-w-2xl text-center"
    >
      <p className="font-script text-lg text-rose">{eyebrow}</p>
      <h2 className="text-gradient-rose mt-2 font-serif-romantic text-3xl font-semibold sm:text-4xl">
        {title}
      </h2>
      <div className="mx-auto mt-4 h-px w-16 bg-gradient-to-r from-transparent via-rose to-transparent" />
    </motion.div>
  );
}