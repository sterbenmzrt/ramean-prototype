"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowLeftIcon, ArrowRightIcon } from "@/components/ui/icons";

const INTERVAL = 6000;

function reducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

// Satu slide: gambar penuh (klik → ctaHref) atau fallback gradient + judul.
function Slide({ banner, active, errored, onError }) {
  const inner = (
    <div
      className={`relative rounded-2xl overflow-hidden aspect-[1448/520] bg-gradient-to-br from-primary to-[#15315f] shadow-sm transition-[opacity,transform] duration-500 ${
        active ? "opacity-100 scale-100" : "opacity-45 scale-[0.94]"
      }`}
    >
      {banner.imagePath && !errored ? (
        <img
          src={banner.imagePath}
          alt={banner.title || ""}
          className="w-full h-full object-cover"
          onError={onError}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center px-10 text-center">
          <span className="font-heading font-bold text-white text-[30px] leading-tight tracking-[-0.5px] max-md:text-xl">
            {banner.title}
          </span>
        </div>
      )}
    </div>
  );

  if (active && banner.ctaHref) {
    return (
      <Link href={banner.ctaHref} aria-label={banner.title || "Promo"} className="block">
        {inner}
      </Link>
    );
  }
  return inner;
}

export default function PromoCarousel({ banners = [] }) {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const [imgError, setImgError] = useState({});
  const count = banners.length;
  const single = count === 1;

  const go = useCallback((n) => setIdx((i) => (n + count) % count), [count]);

  useEffect(() => {
    if (count <= 1 || paused || reducedMotion()) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % count), INTERVAL);
    return () => clearInterval(t);
  }, [count, paused]);

  if (count === 0) return null;

  // Lebar tiap slide (% dari container) + offset agar slide aktif di tengah dengan
  // tetangga "mengintip" di sisi (gaya Steam featured / lapakgaming).
  const slideW = single ? 100 : 84;
  const peek = (100 - slideW) / 2;

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Promosi Ramean"
      className="w-full bg-bg py-7"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="max-w-[1280px] mx-auto px-4 relative">
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(calc(${peek}% - ${idx * slideW}%))` }}
          >
            {banners.map((b, i) => (
              <div
                key={b.id}
                className="shrink-0 px-2"
                style={{ width: `${slideW}%` }}
                aria-hidden={i !== idx}
              >
                <Slide
                  banner={b}
                  active={i === idx}
                  errored={!!imgError[i]}
                  onError={() => setImgError((e) => ({ ...e, [i]: true }))}
                />
              </div>
            ))}
          </div>
        </div>

        {!single && (
          <>
            <button
              type="button"
              onClick={() => go(idx - 1)}
              aria-label="Slide sebelumnya"
              className="absolute left-6 top-1/2 -translate-y-1/2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full bg-white border border-border shadow-md text-primary hover:bg-bg max-md:left-2"
            >
              <ArrowLeftIcon />
            </button>
            <button
              type="button"
              onClick={() => go(idx + 1)}
              aria-label="Slide berikutnya"
              className="absolute right-6 top-1/2 -translate-y-1/2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full bg-white border border-border shadow-md text-primary hover:bg-bg max-md:right-2"
            >
              <ArrowRightIcon />
            </button>

            <div className="flex items-center justify-center gap-1 mt-4">
              {banners.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIdx(i)}
                  aria-label={`Ke slide ${i + 1}`}
                  aria-current={i === idx ? "true" : undefined}
                  className="min-w-[44px] min-h-[44px] flex items-center justify-center"
                >
                  <span
                    className={`block h-2 rounded-full transition-all ${
                      i === idx ? "w-6 bg-primary" : "w-2 bg-border"
                    }`}
                  />
                </button>
              ))}
            </div>

            <div aria-live="polite" className="sr-only">
              Slide {idx + 1} dari {count}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
