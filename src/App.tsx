import { lazy, Suspense, useEffect, useState } from 'react';
import { AnimatePresence, MotionConfig } from 'framer-motion';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Projects from './components/Projects';
import Experience from './components/Experience';
import OpenSource from './components/OpenSource';
import Now from './components/Now';
import Terminal from './components/Terminal';
import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';
import CommandPalette from './components/CommandPalette';
import CursorTrail from './components/CursorTrail';
import Intro from './components/Intro';
import { SkillStatus } from './components/SkillFilter';
import { Section } from './components/ui';

const IncidentGame = lazy(() => import('./components/IncidentGame'));
const MergeRunner = lazy(() => import('./components/MergeRunner'));

export type GameId = 'incident' | 'merge';

export default function App() {
  const [game, setGame] = useState<GameId | null>(null);

  useEffect(() => {
    // Any component can open a game: window.dispatchEvent(new CustomEvent('open-game', { detail: 'merge' }))
    const open = (e: Event) => setGame(((e as CustomEvent).detail as GameId) ?? 'incident');
    window.addEventListener('open-game', open);
    // Deep link from the 404 page or anywhere else: /?play=merge or /?play=incident
    const play = new URLSearchParams(window.location.search).get('play');
    if (play === 'merge' || play === 'incident') {
      setGame(play);
      history.replaceState(null, '', window.location.pathname + window.location.hash);
    }
    return () => window.removeEventListener('open-game', open);
  }, []);

  return (
    // Springs and slides become simple fades for visitors who ask for reduced motion.
    <MotionConfig reducedMotion="user">
      <a
        href="#work"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-accent-ink"
      >
        Skip to content
      </a>
      <Navigation />
      <main>
        <Hero />
        <Projects />
        <Experience />
        <OpenSource />
        <Now />
        <Section
          id="terminal"
          eyebrow="For developers"
          title="Prefer the command line?"
          intro="Explore the same portfolio from a terminal. Tab completes, arrow keys walk your history."
        >
          <div className="mx-auto max-w-3xl">
            <Terminal />
          </div>
        </Section>
        <About />
        <Contact />
      </main>
      <Footer />
      <CommandPalette />
      <CursorTrail />
      <SkillStatus />
      <Intro />
      <Suspense fallback={null}>
        <AnimatePresence>
          {game === 'incident' && <IncidentGame key="incident" onClose={() => setGame(null)} />}
          {game === 'merge' && <MergeRunner key="merge" onClose={() => setGame(null)} />}
        </AnimatePresence>
      </Suspense>
    </MotionConfig>
  );
}
