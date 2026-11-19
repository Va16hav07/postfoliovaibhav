import { now } from '../data';
import { Reveal, Section } from './ui';

export default function Now() {
  return (
    <Section id="now" eyebrow={`Now · updated ${now.updated}`} title="What I'm up to.">
      <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
        {now.items.map((item, i) => (
          <Reveal key={item.label} delay={(i % 2) * 0.06}>
            <div className="card flex h-full gap-4 p-6">
              <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-accent" aria-hidden />
              <div>
                <h3 className="text-[0.9375rem] font-semibold">{item.label}</h3>
                <p className="mt-1 leading-relaxed text-ink-2">{item.text}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
