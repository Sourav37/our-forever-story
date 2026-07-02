import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";


import { FloatingHearts } from "@/components/birthday/floating-hearts";
import { MusicToggle } from "@/components/birthday/music-toggle";
import { StickyHeader } from "@/components/birthday/sticky-header";
import { WelcomeSection } from "@/components/birthday/welcome-section";
import { GallerySection } from "@/components/birthday/gallery-section";
import { TimelineSection } from "@/components/birthday/timeline-section";
import { LetterSection } from "@/components/birthday/letter-section";
import { ReasonsSection } from "@/components/birthday/reasons-section";
import { FinaleSection } from "@/components/birthday/finale-section";
import { backgroundMusicSrc } from "@/data/birthday-content";



export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const [loaderState, setLoaderState] = useState<"loading" | "ready">("loading");

  const journeyRef = useRef<HTMLDivElement>(null);
  const scrollToJourney = () => {
    journeyRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };


  // Prevent scrolling while loading
  useEffect(() => {
    if (loaderState !== "ready") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [loaderState]);

  return (
    <>


      {/* Main site content, visible when ready */}
      <main className="relative overflow-hidden min-h-screen bg-gradient-to-b from-lavender/25 via-white to-lavender/15">
        <FloatingHearts />
        <StickyHeader />
        <MusicToggle src={backgroundMusicSrc} startPlayback={true} />
        <WelcomeSection onStart={scrollToJourney} />
        <div ref={journeyRef} />
        <GallerySection onLoadingComplete={() => setLoaderState("ready")} />
        <TimelineSection />
        <LetterSection />
        <ReasonsSection />
        <FinaleSection />
      </main>
    </>
  );
}
