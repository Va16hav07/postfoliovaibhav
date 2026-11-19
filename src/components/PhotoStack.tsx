import { useState } from 'react';
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type PanInfo,
} from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { spring } from './motion';

export interface Photo {
  src: string; // base path without extension; .webp and .jpg exist
  alt: string;
  caption: string;
}

/**
 * A stack of photos you can flick through.
 * - The top card tracks the pointer 1:1 and tilts with horizontal travel.
 * - On release we project momentum forward (offset + velocity * time). If the projected
 *   landing point is far enough out, the card is thrown off with the release velocity
 *   and slides to the back of the stack; otherwise it springs home, carrying that velocity.
 */
export default function PhotoStack({ photos }: { photos: Photo[] }) {
  const [order, setOrder] = useState(() => photos.map((_, i) => i));
  const reduce = useReducedMotion();

  const sendToBack = () => setOrder((o) => [...o.slice(1), o[0]]);

  return (
    <div className="flex h-full flex-col">
      <div className="relative mx-auto aspect-[4/5] w-full max-w-[22rem] flex-1 select-none">
        {order
          .map((photoIndex, depth) => ({ photo: photos[photoIndex], depth }))
          .reverse() // render back-to-front so the top card is last in the DOM
          .map(({ photo, depth }) =>
            depth === 0 ? (
              <TopCard key={photo.src} photo={photo} onThrow={sendToBack} reduce={!!reduce} />
            ) : (
              <motion.div
                key={photo.src}
                className="absolute inset-0"
                initial={false}
                animate={{
                  scale: 1 - depth * 0.05,
                  y: depth * 14,
                  rotate: depth % 2 ? 3 : -3,
                  opacity: depth > 2 ? 0 : 1,
                }}
                transition={spring}
                aria-hidden
              >
                <Card photo={photo} />
              </motion.div>
            ),
          )}
      </div>

      <div className="mt-6 flex items-center justify-between gap-4">
        <p className="caption" aria-live="polite">
          {photos[order[0]].caption}
        </p>
        <motion.button
          type="button"
          onClick={sendToBack}
          whileTap={{ scale: 0.92 }}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-surface-2 px-3.5 py-1.5 text-sm font-medium text-ink-2 hover:text-ink"
        >
          Next photo
          <ArrowRight size={14} />
        </motion.button>
      </div>
    </div>
  );
}

function Card({ photo }: { photo: Photo }) {
  return (
    <div className="h-full w-full overflow-hidden rounded-[1.5rem] bg-surface-2 shadow-float ring-1 ring-line/10">
      <picture>
        <source srcSet={`${photo.src}.webp`} type="image/webp" />
        <img
          src={`${photo.src}.jpg`}
          alt={photo.alt}
          draggable={false}
          loading="lazy"
          className="pointer-events-none h-full w-full object-cover"
        />
      </picture>
    </div>
  );
}

function TopCard({ photo, onThrow, reduce }: { photo: Photo; onThrow: () => void; reduce: boolean }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-240, 240], [-14, 14]);

  const onDragEnd = async (_: unknown, info: PanInfo) => {
    // Where would the card come to rest if it kept its momentum?
    const projectedX = info.offset.x + info.velocity.x * 0.2;
    const projectedY = info.offset.y + info.velocity.y * 0.2;
    const thrown = Math.abs(projectedX) > 140 || Math.abs(projectedY) > 180;

    if (thrown && !reduce) {
      const angle = Math.atan2(projectedY, projectedX);
      const distance = 700;
      await Promise.all([
        animate(x, Math.cos(angle) * distance, { type: 'spring', bounce: 0, duration: 0.5, velocity: info.velocity.x }),
        animate(y, Math.sin(angle) * distance, { type: 'spring', bounce: 0, duration: 0.5, velocity: info.velocity.y }),
      ]);
      onThrow();
      return;
    }
    if (thrown) {
      onThrow();
      return;
    }
    // Not far enough: spring home, keeping the release velocity. A little bounce,
    // because the motion was started by a fling.
    animate(x, 0, { type: 'spring', bounce: 0.25, duration: 0.45, velocity: info.velocity.x });
    animate(y, 0, { type: 'spring', bounce: 0.25, duration: 0.45, velocity: info.velocity.y });
  };

  return (
    <motion.div
      className="absolute inset-0 z-10 cursor-grab touch-none active:cursor-grabbing"
      style={{ x, y, rotate }}
      initial={{ scale: 0.95, y: 14 }}
      animate={{ scale: 1, y: 0 }}
      transition={spring}
      drag
      dragMomentum={false}
      onDragEnd={onDragEnd}
      whileDrag={{ scale: 1.03 }}
    >
      <Card photo={photo} />
    </motion.div>
  );
}
