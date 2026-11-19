import { useEffect, useRef } from 'react';
import type { Project } from '../data';

/**
 * Shows a project's real recording or screenshot when one exists,
 * and falls back to GitHub's generated repository card otherwise.
 * Videos are muted, inline and only play while `playing` is true.
 */
export default function ProjectVisual({
  project,
  playing,
  className = '',
}: {
  project: Project;
  playing: boolean;
  className?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const fallback = `https://opengraph.githubassets.com/1/${project.repo}`;
  const poster = project.media?.image ?? fallback;

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (playing && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      v.play().catch(() => undefined);
    } else {
      v.pause();
    }
  }, [playing]);

  if (project.media?.video) {
    return (
      <video
        ref={videoRef}
        src={project.media.video}
        poster={poster}
        muted
        loop
        playsInline
        preload="none"
        aria-label={`${project.title} demo recording`}
        className={`h-full w-full object-cover ${className}`}
      />
    );
  }

  return (
    <img
      src={poster}
      alt={project.media?.image ? `${project.title} screenshot` : ''}
      loading="lazy"
      className={`h-full w-full object-cover ${className}`}
      onError={(e) => {
        if (e.currentTarget.src !== fallback) e.currentTarget.src = fallback;
        else e.currentTarget.style.display = 'none';
      }}
    />
  );
}
