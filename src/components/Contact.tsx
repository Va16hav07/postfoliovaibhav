import { useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, ArrowUpRight, Check, Send } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { profile } from '../data';
import { Reveal, Section } from './ui';
import { Magnetic } from './effects';
import { press } from './motion';

type Status = { kind: 'idle' | 'sending' | 'sent' | 'error'; message?: string };

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<Status>({ kind: 'idle' });

  const update = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus({ kind: 'sending' });
    try {
      // EmailJS public identifiers (safe to ship in client code).
      await emailjs.send(
        'service_22x7bka',
        'template_qpwzp3c',
        { from_name: form.name, from_email: form.email, message: form.message },
        'JW6xs8hFmH49Yb0YQ',
      );
      setStatus({ kind: 'sent', message: "Thanks. Your message is on its way and I'll reply soon." });
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      console.error('Contact form error:', err);
      setStatus({ kind: 'error', message: `That didn't send. Please email me at ${profile.email}.` });
    }
  };

  const sending = status.kind === 'sending';

  return (
    <Section id="contact" eyebrow="Contact" title="Let's build something.">
      <div className="grid gap-5 lg:grid-cols-[1fr_1.4fr]">
        <Reveal>
          <div className="card flex h-full flex-col justify-between gap-6 p-6 sm:gap-10 sm:p-8">
            <div>
              <p className="text-ink-2">Have a role, a project or a question? The fastest way to reach me is email.</p>
              <a
                href={`mailto:${profile.email}`}
                className="mt-4 block text-[1.125rem] font-semibold tracking-tight text-accent hover:underline sm:text-2xl"
              >
                {profile.email.split('@')[0]}
                <wbr />@{profile.email.split('@')[1]}
              </a>
            </div>
            <ul className="flex flex-wrap gap-x-5 gap-y-2 sm:block sm:space-y-2">
              {[
                ['GitHub', profile.links.github],
                ['LinkedIn', profile.links.linkedin],
                ['X', profile.links.x],
              ].map(([label, href]) => (
                <li key={label}>
                  <a href={href} target="_blank" rel="noopener noreferrer" className="link">
                    {label}
                    <ArrowUpRight size={15} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal delay={0.06}>
          <form onSubmit={submit} className="card space-y-4 p-6 sm:p-8">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-ink-2">Name</span>
                <input name="name" value={form.name} onChange={update} required autoComplete="name" className="field" />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-ink-2">Email</span>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={update}
                  required
                  autoComplete="email"
                  className="field"
                />
              </label>
            </div>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-ink-2">Message</span>
              <textarea
                name="message"
                value={form.message}
                onChange={update}
                required
                rows={5}
                className="field resize-none"
              />
            </label>

            <div className="flex flex-wrap items-center gap-4">
              <span className="w-full sm:w-auto">
                <Magnetic className="block sm:inline-block">
                  <motion.button type="submit" disabled={sending} className="btn-primary w-full disabled:opacity-60 sm:w-auto" {...press}>
                    {sending ? 'Sending…' : 'Send message'}
                    {!sending && <Send size={15} />}
                  </motion.button>
                </Magnetic>
              </span>
              <p aria-live="polite" className="text-sm">
                {status.kind === 'sent' && (
                  <span className="inline-flex items-center gap-1.5 text-success">
                    <Check size={16} /> {status.message}
                  </span>
                )}
                {status.kind === 'error' && (
                  <span className="inline-flex items-center gap-1.5 text-[#ff3b30]">
                    <AlertCircle size={16} /> {status.message}
                  </span>
                )}
              </p>
            </div>
          </form>
        </Reveal>
      </div>
    </Section>
  );
}
