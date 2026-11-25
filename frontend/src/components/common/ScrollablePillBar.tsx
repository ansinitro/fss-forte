"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
  bgGradientColor?: "zinc-50" | "white" | "zinc-900";
  showIndicator?: boolean;
  activeItemIndex?: number;
}

export const ScrollablePillBar: React.FC<Props> = ({
  children,
  className = "",
  innerClassName = "",
  bgGradientColor = "zinc-50",
  showIndicator = true,
  activeItemIndex,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [thumbWidthPercent, setThumbWidthPercent] = useState(30);
  const [isOverflowing, setIsOverflowing] = useState(false);

  // Mouse drag-to-scroll state
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeftPos = useRef(0);
  const hasDragged = useRef(false);

  const checkScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;

    const { scrollLeft, scrollWidth, clientWidth } = el;
    const overflowing = Math.ceil(scrollWidth) > Math.ceil(clientWidth) + 1;
    setIsOverflowing(overflowing);
    setCanScrollLeft(scrollLeft > 2);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 2);

    if (overflowing) {
      const maxScroll = scrollWidth - clientWidth;
      const progress = maxScroll > 0 ? (scrollLeft / maxScroll) * 100 : 0;
      setScrollProgress(Math.min(100, Math.max(0, progress)));
      const visibleRatio = Math.min(1, clientWidth / scrollWidth);
      setThumbWidthPercent(Math.max(18, Math.min(80, visibleRatio * 100)));
    }
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    checkScroll();
    const handleScroll = () => checkScroll();
    el.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", checkScroll);

    // Multi-phase check for dynamic font rendering and hydration
    const timer1 = setTimeout(checkScroll, 50);
    const timer2 = setTimeout(checkScroll, 250);

    if (typeof document !== "undefined" && "fonts" in document) {
      document.fonts.ready.then(() => checkScroll()).catch(() => {});
    }

    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(() => checkScroll());
      ro.observe(el);
      // Also observe children if any
      Array.from(el.children).forEach((child) => ro?.observe(child));
    }

    // Natural horizontal mouse-wheel scrolling
    const handleWheel = (e: WheelEvent) => {
      if (el.scrollWidth <= el.clientWidth) return;
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        const atStart = el.scrollLeft <= 0;
        const atEnd = el.scrollLeft >= el.scrollWidth - el.clientWidth - 1;
        if ((e.deltaY > 0 && !atEnd) || (e.deltaY < 0 && !atStart)) {
          e.preventDefault();
          el.scrollLeft += e.deltaY;
        }
      }
    };
    el.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      el.removeEventListener("scroll", handleScroll);
      el.removeEventListener("wheel", handleWheel);
      window.removeEventListener("resize", checkScroll);
      ro?.disconnect();
    };
  }, [checkScroll]);

  // Auto-scroll active item into view
  useEffect(() => {
    if (activeItemIndex === undefined || !containerRef.current) return;
    const el = containerRef.current;
    const children = el.children;
    if (children && children[activeItemIndex]) {
      const target = children[activeItemIndex] as HTMLElement;
      target.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [activeItemIndex]);

  const scrollByAmount = (delta: number) => {
    const el = containerRef.current;
    if (!el) return;
    el.scrollBy({ left: delta, behavior: "smooth" });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const el = containerRef.current;
    if (!el) return;
    isDragging.current = true;
    hasDragged.current = false;
    startX.current = e.pageX - el.offsetLeft;
    scrollLeftPos.current = el.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !containerRef.current) return;
    const el = containerRef.current;
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    if (Math.abs(walk) > 4) {
      hasDragged.current = true;
      e.preventDefault();
      el.scrollLeft = scrollLeftPos.current - walk;
    }
  };

  const stopDragging = () => {
    isDragging.current = false;
  };

  const gradientClasses = {
    "zinc-50": {
      left: "from-[#F7F6F6] via-[#F7F6F6]/95 to-transparent",
      right: "from-[#F7F6F6] via-[#F7F6F6]/95 to-transparent",
    },
    white: {
      left: "from-white via-white/95 to-transparent",
      right: "from-white via-white/95 to-transparent",
    },
    "zinc-900": {
      left: "from-zinc-900 via-zinc-900/90 to-transparent",
      right: "from-zinc-900 via-zinc-900/90 to-transparent",
    },
  }[bgGradientColor];

  return (
    <div className={`w-full ${className}`}>
      {/* Pills track with centered chevrons and gradient fade masks */}
      <div className="relative group/scroll flex items-center">
        {/* Left Chevron Button & Gradient Mask */}
        {canScrollLeft && (
          <>
            <div
              className={`pointer-events-none absolute left-0 top-0 bottom-0 w-12 sm:w-16 bg-gradient-to-r ${gradientClasses.left} z-10 transition-opacity`}
            />
            <button
              type="button"
              onClick={() => scrollByAmount(-260)}
              className="absolute left-0 sm:left-1 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white text-[#A31551] shadow-lg border border-[#F99184]/40 hover:bg-[#FDF2F7] hover:scale-110 active:scale-95 flex items-center justify-center transition-all cursor-pointer"
              aria-label="Артқа жылжыту / Прокрутить влево"
              title="Прокрутить влево"
            >
              <ChevronLeft className="w-4.5 h-4.5" />
            </button>
          </>
        )}

        {/* Scrollable Container */}
        <div
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={stopDragging}
          onMouseLeave={stopDragging}
          className={`w-full flex items-center gap-2 overflow-x-auto scrollbar-none select-none py-1 scroll-smooth ${innerClassName}`}
          style={{ scrollBehavior: "smooth" }}
        >
          {children}
        </div>

        {/* Right Chevron Button & Gradient Mask */}
        {canScrollRight && (
          <>
            <div
              className={`pointer-events-none absolute right-0 top-0 bottom-0 w-12 sm:w-16 bg-gradient-to-l ${gradientClasses.right} z-10 transition-opacity`}
            />
            <button
              type="button"
              onClick={() => scrollByAmount(260)}
              className="absolute right-0 sm:right-1 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white text-[#A31551] shadow-lg border border-[#F99184]/40 hover:bg-[#FDF2F7] hover:scale-110 active:scale-95 flex items-center justify-center transition-all cursor-pointer"
              aria-label="Алға жылжыту / Прокрутить вправо"
              title="Прокрутить вправо"
            >
              <ChevronRight className="w-4.5 h-4.5" />
            </button>
          </>
        )}
      </div>

      {/* Micro Scroll Indicator Bar (Visible when overflowing) */}
      {showIndicator && isOverflowing && (
        <div className="w-full px-4 pt-2 pb-0.5 flex items-center justify-center">
          <div className="w-24 sm:w-32 h-1 bg-zinc-200/80 rounded-full overflow-hidden relative">
            <div
              className="h-full bg-gradient-to-r from-[#4A0221] via-[#A31551] to-[#FC9385] rounded-full transition-all duration-150"
              style={{
                width: `${thumbWidthPercent}%`,
                transform: `translateX(${(scrollProgress * (100 - thumbWidthPercent)) / 100}%)`,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
