import React, { useEffect, useRef, useState } from "react";

type VideoItem = { id: string; src: string; caption?: string };

type Props = {
  items: VideoItem[];
};

/**
 * Vertical, full-height feed. Auto play/pause on visibility.
 * Swipe/scroll to move. Works on mobile + desktop.
 */
const VideoFeed: React.FC<Props> = ({ items }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const vidRefs = useRef<Map<string, HTMLVideoElement>>(new Map());
  const [active, setActive] = useState<string | null>(items[0]?.id ?? null);

  useEffect(() => {
    if (!containerRef.current) return;
    const io = new IntersectionObserver(
      (entries) => {
        let max: { id: string; ratio: number } | null = null;
        for (const e of entries) {
          const id = (e.target as HTMLElement).dataset.id!;
          if (!max || e.intersectionRatio > max.ratio) {
            max = { id, ratio: e.intersectionRatio };
          }
        }
        if (max) setActive(max.id);
      },
      { root: containerRef.current, threshold: [0.25, 0.5, 0.75] }
    );

    const nodes = containerRef.current.querySelectorAll("[data-videocard='1']");
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, [items.length]);

  useEffect(() => {
    // Play active, pause others
    vidRefs.current.forEach((v, id) => {
      if (id === active) {
        v.play().catch(() => {});
      } else {
        v.pause();
        v.currentTime = v.currentTime; // no-op to keep frame
      }
    });
  }, [active]);

  return (
    <div ref={containerRef} className="relative h-[calc(100vh-120px)] overflow-y-scroll snap-y snap-mandatory">
      {items.map((item) => (
        <section
          key={item.id}
          data-id={item.id}
          data-videocard="1"
          className="h-[calc(100vh-120px)] snap-start relative flex items-center justify-center"
        >
          <video
            ref={(el) => { if (el) vidRefs.current.set(item.id, el); }}
            src={item.src}
            className="h-full w-auto max-w-full rounded-2xl"
            muted
            playsInline
            loop
            preload="metadata"
            onClick={(e) => {
              const v = e.currentTarget;
              if (v.paused) v.play(); else v.pause();
            }}
          />
          {item.caption && (
            <div className="absolute bottom-6 left-6 right-6 text-white/95 text-sm bg-black/30 backdrop-blur-md px-3 py-2 rounded-xl">
              {item.caption}
            </div>
          )}
        </section>
      ))}
    </div>
  );
};

export default VideoFeed;

