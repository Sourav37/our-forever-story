import { createFileRoute } from "@tanstack/react-router";
import { useRef } from "react";
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
  const journeyRef = useRef<HTMLDivElement>(null);

  const scrollToJourney = () => {
    journeyRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main className="relative overflow-hidden">
      <FloatingHearts />
      <StickyHeader />
      <MusicToggle src={backgroundMusicSrc} />

      <div className="relative z-10">
        <WelcomeSection onStart={scrollToJourney} />
        <div ref={journeyRef} />
        <GallerySection />
        <TimelineSection />
        <LetterSection />
        <ReasonsSection />
        <FinaleSection />
      </div>
    </main>
  );
}
