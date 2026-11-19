import { Award, GraduationCap } from 'lucide-react';
import { achievements, education, photos, skills } from '../data';
import PhotoStack from './PhotoStack';
import { SkillChip } from './SkillFilter';
import { Reveal, Section } from './ui';

export default function About() {
  return (
    <Section id="about" eyebrow="About" title="Engineer, student, builder.">
      <div className="grid gap-4 sm:gap-5 md:grid-cols-6">
        <Reveal className="md:col-span-2">
          <div className="card h-full p-5 sm:p-6">
            <PhotoStack photos={photos} />
          </div>
        </Reveal>

        <Reveal className="md:col-span-4" delay={0.06}>
          <div className="card flex h-full flex-col justify-center p-6 sm:p-10">
            <p className="text-[1.3125rem] leading-relaxed tracking-tight sm:text-2xl">
              I'm a Computer Science (AI/ML) student in Bengaluru who likes shipping things people actually use.
            </p>
            <p className="mt-5 leading-relaxed text-ink-2">
              I've built React Native apps that are live on the App Store and Play Store, added OpenTelemetry tracing to
              KubeStellar, and contributed to Hugging Face Diffusers. Most of my side projects are AI agents: voice
              assistants, multi-agent planners and tool-using LLMs. I'm drawn to the point where a model meets a real
              product.
            </p>
          </div>
        </Reveal>

        <Reveal className="md:col-span-3">
          <div className="card h-full p-6 sm:p-8">
            <GraduationCap className="text-accent" size={24} />
            <h3 className="title mt-4">{education.degree}</h3>
            <p className="mt-1 text-ink-2">{education.school}</p>
            <p className="caption mt-1">{education.period}</p>
          </div>
        </Reveal>

        <Reveal className="md:col-span-3" delay={0.06}>
          <div className="card h-full p-6 sm:p-8">
            <Award className="text-accent" size={24} />
            <ul className="mt-4 space-y-3">
              {achievements.map((a) => (
                <li key={a} className="leading-relaxed text-ink-2">
                  {a}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal className="md:col-span-6">
          <div className="card grid grid-cols-2 gap-6 p-6 sm:gap-8 sm:p-8 lg:grid-cols-4">
            <p className="caption col-span-full -mb-2">Tap a skill to highlight every project, role and contribution that used it.</p>
            {skills.map((g) => (
              <div key={g.group}>
                <h3 className="text-[0.9375rem] font-semibold">{g.group}</h3>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {g.items.map((s) => (
                    <SkillChip key={s} skill={s} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
