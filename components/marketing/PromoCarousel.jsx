"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Btn from "@/components/ui/Btn";
import { ArrowLeftIcon, ArrowRightIcon } from "@/components/ui/icons";

const INTERVAL = 6000;

function reducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export default function PromoCarousel({ banners = [] }) {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const [imgError, setImgError] = useState({});
  const count = banners.length;

  const go = useCallback((n) => setIdx((i) => (n + count) % count), [count]);

  useEffect(() => {
    if (count <= 1 || paused || reducedMotion()) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % count), INTERVAL);
    return () => clearInterval(t);
  }, [count, paused]);

  if (count === 0) return null;

  const b = banners[idx];
  const single = count === 1;

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Promosi Ramean"
      className="relative w-full bg-gradient-to-r from-primary to-[#15315f] text-white overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="max-w-[1240px] mx-auto px-10 py-10 grid grid-cols-2 gap-10 items-center min-h-[260px] max-md:grid-cols-1 max-md:py-8 max-md:px-6">
        <div>
          <h2 className="font-heading font-bold text-[34px] leading-[1.15] tracking-[-0.5px] mb-3 max-md:text-[26px]">
            {b.title}
          </h2>
          {b.subtitle && (
            <p className="text-white/80 text-[15px] leading-relaxed mb-6 font-body max-w-[440px]">
              {b.subtitle}
            </p>
          )}
          {b.ctaLabel && b.ctaHref && (
            <Link href={b.ctaHref}>
              <Btn variant="yellow" size="lg">
                {b.ctaLabel}
              </Btn>
            </Link>
          )}
        </div>
        <div className="h-[200px] rounded-lg overflow-hidden bg-white/5 max-md:h-[150px]">
          {b.imagePath && !imgError[idx] && (
            <img
              src={b.imagePath}
              alt=""
              className="w-full h-full object-cover"
              onError={() => setImgError((e) => ({ ...e, [idx]: true }))}
            />
          )}
        </div>
      </div>

      {!single && (
        <>
          <button
            type="button"
            onClick={() => go(idx - 1)}
            aria-label="Slide sebelumnya"
            className="absolute left-3 top-1/2 -translate-y-1/2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white"
          >
            <ArrowLeftIcon />
          </button>
          <button
            type="button"
            onClick={() => go(idx + 1)}
            aria-label="Slide berikutnya"
            className="absolute right-3 top-1/2 -translate-y-1/2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white"
          >
            <ArrowRightIcon />
          </button>

          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-1">
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
                  className={`block w-2.5 h-2.5 rounded-full ${
                    i === idx ? "bg-yellow" : "bg-white/40"
                  }`}
                />
              </button>
            ))}
          </div>

          <span className="absolute bottom-4 right-4 text-[11px] text-white/70 font-body">
            Slide {idx + 1}/{count}
          </span>
          <div aria-live="polite" className="sr-only">
            Slide {idx + 1} dari {count}
          </div>
        </>
      )}
    </section>
  );
}
