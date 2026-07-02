import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shuffle, Pause, ArrowDownWideNarrow, ArrowUpWideNarrow } from "lucide-react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

// Auto-discovery: drop .jpg/.png/.webp/.mp4 files into src/assets/gallery/
// and they'll appear here automatically.
// CDN-backed assets: photos/videos live as .asset.json pointer files.
type AssetPointer = {
  url: string;
  content_type?: string;
  original_filename?: string;
  created_at?: string;
};

const imageModules = import.meta.glob(
  "/src/assets/gallery/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP}.asset.json",
  { eager: true, import: "default" },
) as Record<string, AssetPointer>;

const videoModules = import.meta.glob(
  "/src/assets/gallery/*.{mp4,webm,mov,MP4,WEBM,MOV}.asset.json",
  { eager: true, import: "default" },
) as Record<string, AssetPointer>;

type MediaItem =
  | { type: "image"; src: string; key: string; createdAt: number }
  | { type: "video"; src: string; key: string; createdAt: number };

// Elegant placeholder tiles when no media has been uploaded yet.
const PLACEHOLDER_COUNT = 9;

// Deterministic shuffle so refreshes produce the same order for a given seed.
function seededShuffle<T>(items: T[], seed: number): T[] {
  const arr = items.slice();
  let s = seed || 1;
  for (let i = arr.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function GallerySection() {
  const allMedia: MediaItem[] = useMemo(() => {
    const toItem = (
      type: "image" | "video",
      key: string,
      ptr: AssetPointer,
    ): MediaItem => ({
      type,
      key,
      src: ptr.url,
      createdAt: ptr.created_at ? Date.parse(ptr.created_at) : 0,
    });
    const images = Object.entries(imageModules).map(([k, p]) => toItem("image", k, p));
    const videos = Object.entries(videoModules).map(([k, p]) => toItem("video", k, p));
    return [...images, ...videos];
  }, []);

  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [shuffleOn, setShuffleOn] = useState(false);
  const [shuffleSeed, setShuffleSeed] = useState(1);
  const [loadedCount, setLoadedCount] = useState(0);

  const sortedMedia = useMemo(() => {
    const sorted = allMedia.slice().sort((a, b) => {
      if (a.createdAt !== b.createdAt) {
        return sortOrder === "newest"
          ? b.createdAt - a.createdAt
          : a.createdAt - b.createdAt;
      }
      return a.key.localeCompare(b.key);
    });
    return sorted;
  }, [allMedia, sortOrder]);

  const media = useMemo(() => {
    return shuffleOn ? seededShuffle(sortedMedia, shuffleSeed) : sortedMedia;
  }, [sortedMedia, shuffleOn, shuffleSeed]);

  // Auto-reshuffle every 3s while enabled.
  useEffect(() => {
    if (!shuffleOn) return;
    const id = setInterval(() => {
      setShuffleSeed((s) => s + 1);
    }, 3000);
    return () => clearInterval(id);
  }, [shuffleOn]);

  const totalImages = allMedia.filter((m) => m.type === "image").length;
  const progress = totalImages === 0 ? 100 : Math.min(100, Math.round((loadedCount / totalImages) * 100));
  const isLoading = totalImages > 0 && loadedCount < totalImages;

  const slides = media.map((m) => ({ src: m.src, _kind: m.type })) as unknown as {
    src: string;
  }[];

  const hasMedia = media.length > 0;

  return (
    <section id="gallery" className="relative px-4 py-20 sm:px-6">
      <SectionHeading eyebrow="Our little universe" title="Moments, framed forever" />

      {hasMedia && (
        <div className="mx-auto mt-8 flex max-w-6xl flex-wrap items-center justify-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => setSortOrder((s) => (s === "newest" ? "oldest" : "newest"))}
            className="glass inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium text-plum shadow-sm transition hover:scale-105 sm:text-sm"
            aria-label="Toggle sort order"
          >
            {sortOrder === "newest" ? (
              <ArrowDownWideNarrow className="h-4 w-4 text-rose" />
            ) : (
              <ArrowUpWideNarrow className="h-4 w-4 text-rose" />
            )}
            {sortOrder === "newest" ? "Newest first" : "Oldest first"}
          </button>
          <button
            type="button"
            onClick={() => setShuffleOn((v) => !v)}
            aria-pressed={shuffleOn}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium shadow-sm transition hover:scale-105 sm:text-sm ${
              shuffleOn
                ? "bg-gradient-to-r from-rose to-plum text-white"
                : "glass text-plum"
            }`}
          >
            {shuffleOn ? (
              <>
                <Pause className="h-4 w-4" /> Stop shuffle
              </>
            ) : (
              <>
                <Shuffle className="h-4 w-4 text-rose" /> Auto-shuffle
              </>
            )}
          </button>
        </div>
      )}

      {hasMedia && isLoading && (
        <div className="mx-auto mt-6 max-w-md px-2">
          <div className="flex items-center justify-between text-xs text-plum/70">
            <span className="font-script text-base text-rose">Loading memories…</span>
            <span className="tabular-nums">{progress}%</span>
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/50">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-rose via-lavender to-plum"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>
        </div>
      )}

      {hasMedia ? (
        <div className="relative mx-auto mt-8 max-w-6xl">
          {isLoading && (
            <div className="pointer-events-none absolute inset-0 columns-2 gap-3 sm:columns-3 sm:gap-4 lg:columns-4">
              {Array.from({ length: Math.min(PLACEHOLDER_COUNT, media.length) }).map((_, i) => (
                <div
                  key={i}
                  className="glass mb-3 w-full animate-pulse rounded-2xl bg-white/40 p-1 sm:mb-4"
                  style={{ height: 140 + ((i * 53) % 160) }}
                />
              ))}
            </div>
          )}
          <motion.div
            layout
            className="columns-2 gap-3 sm:columns-3 sm:gap-4 lg:columns-4"
          >
            <AnimatePresence>
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
              layout
              initial={{ opacity: 0, x: v.x, y: v.y, rotate: v.rotate, scale: 0.85, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, x: 0, y: 0, rotate: 0, scale: 1, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.8,
                delay: (i % 6) * 0.08,
                ease: [0.16, 1, 0.3, 1],
                layout: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
              }}
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
                  onLoad={() => setLoadedCount((c) => c + 1)}
                  onError={() => setLoadedCount((c) => c + 1)}
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
            </AnimatePresence>
          </motion.div>
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