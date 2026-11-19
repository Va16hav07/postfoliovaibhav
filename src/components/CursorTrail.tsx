import { useEffect, useRef } from 'react';

/**
 * A trail of 1s and 0s that the mouse leaves behind.
 * Desktop pointers only; off for reduced motion and when the visitor turns it off (⌘K).
 * One fixed canvas; the loop stops completely when there's nothing to draw.
 */
interface Bit {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rot: number;
  char: '0' | '1';
  born: number;
  size: number;
}

const LIFE = 900; // ms
const SPACING = 14; // px of travel between bits
const MAX = 90;

export default function CursorTrail() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const enabled = () => fine.matches && !reduce.matches && localStorage.getItem('cursor-trail') !== 'off';

    let bits: Bit[] = [];
    let raf = 0;
    let lastX = -1;
    let lastY = -1;
    let travel = 0;
    let color = '';

    const readColor = () => {
      color = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim().split(/\s+/).join(',');
    };
    readColor();
    const mo = new MutationObserver(readColor);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-accent'] });

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const frame = (now: number) => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      bits = bits.filter((b) => now - b.born < LIFE);
      for (const b of bits) {
        const t = (now - b.born) / LIFE; // 0 → 1
        const ease = 1 - (1 - t) * (1 - t);
        const x = b.x + b.vx * ease;
        const y = b.y + b.vy * ease + 18 * t * t; // a little gravity, like falling code
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(b.rot * ease);
        ctx.globalAlpha = (1 - t) * 0.85;
        ctx.fillStyle = `rgb(${color})`;
        ctx.font = `600 ${b.size}px ui-monospace, "SF Mono", Menlo, monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(b.char, 0, 0);
        ctx.restore();
      }
      raf = bits.length ? requestAnimationFrame(frame) : 0;
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' || !enabled()) return;
      if (lastX < 0) {
        lastX = e.clientX;
        lastY = e.clientY;
        return;
      }
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      travel += Math.hypot(dx, dy);
      lastX = e.clientX;
      lastY = e.clientY;
      if (travel < SPACING) return;
      travel = 0;
      const now = performance.now();
      bits.push({
        x: e.clientX + (Math.random() - 0.5) * 6,
        y: e.clientY + (Math.random() - 0.5) * 6,
        // drift slightly opposite to the motion, so the trail streams behind the cursor
        vx: -dx * 0.6 + (Math.random() - 0.5) * 14,
        vy: -dy * 0.6 + (Math.random() - 0.5) * 14,
        rot: (Math.random() - 0.5) * 1.2,
        char: Math.random() < 0.5 ? '0' : '1',
        born: now,
        size: 11 + Math.random() * 5,
      });
      if (bits.length > MAX) bits.splice(0, bits.length - MAX);
      if (!raf) raf = requestAnimationFrame(frame);
    };

    const onLeave = () => {
      lastX = -1;
      lastY = -1;
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    return () => {
      cancelAnimationFrame(raf);
      mo.disconnect();
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className="pointer-events-none fixed inset-0 z-[95]" />;
}
