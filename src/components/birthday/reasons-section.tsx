import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, EffectCards, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-cards";
import "swiper/css/pagination";
import { reasonsToLove } from "@/data/birthday-content";
import { SectionHeading } from "./gallery-section";

export function ReasonsSection() {
  return (
    <section className="relative px-4 py-10 sm:px-6">
      <SectionHeading eyebrow="A few of a thousand" title="Reasons I love you" />

      <div className="mx-auto mt-12 w-full max-w-xs sm:max-w-sm">
        <Swiper
          effect="cards"
          grabCursor
          modules={[EffectCards, Pagination, Autoplay]}
          pagination={{ clickable: true }}
          autoplay={{ delay: 3500, disableOnInteraction: false }}
          loop
          className="reasons-swiper"
        >
          {reasonsToLove.map((reason, i) => (
            <SwiperSlide key={i} className="!rounded-3xl">
              <div className="glass-strong flex h-72 flex-col items-center justify-center gap-4 rounded-3xl p-8 text-center sm:h-80">
                <span className="font-script text-4xl text-rose">#{i + 1}</span>
                <p className="font-serif-romantic text-xl leading-snug text-plum sm:text-2xl">
                  {reason}
                </p>
                <span className="mt-2 text-rose">❤</span>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <p className="mt-6 text-center font-serif-romantic text-sm text-plum/60">
          swipe →
        </p>
      </div>
    </section>
  );
}