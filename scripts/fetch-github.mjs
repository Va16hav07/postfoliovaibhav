// Fetches public GitHub activity at build time and writes src/generated/github.json.
// Visitors never hit GitHub. If anything fails, the existing snapshot is kept.
import { readFile, writeFile } from 'node:fs/promises';

const USER = 'Va16hav07';
const OUT = new URL('../src/generated/github.json', import.meta.url);
const headers = { 'User-Agent': 'portfolio-build', Accept: 'text/html' };
if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

async function contributions() {
  const res = await fetch(`https://github.com/users/${USER}/contributions`, { headers });
  if (!res.ok) throw new Error(`contributions HTTP ${res.status}`);
  const html = await res.text();
  const counts = new Map();
  for (const m of html.matchAll(/<tool-tip[^>]*for="(contribution-day-component-[\d-]+)"[^>]*>([^<]*)<\/tool-tip>/g)) {
    const n = m[2].match(/^(\d+) contribution/);
    counts.set(m[1], n ? Number(n[1]) : 0);
  }
  const days = [];
  for (const m of html.matchAll(/data-date="(\d{4}-\d{2}-\d{2})"\s+id="(contribution-day-component-[\d-]+)"\s+data-level="(\d)"/g)) {
    days.push({ date: m[1], level: Number(m[3]), count: counts.get(m[2]) ?? 0 });
  }
  if (days.length < 300) throw new Error(`only parsed ${days.length} days`);
  days.sort((a, b) => a.date.localeCompare(b.date));
  return { days, total: days.reduce((n, d) => n + d.count, 0) };
}

async function latestPr() {
  const q = encodeURIComponent(`author:${USER} type:pr is:merged -user:${USER}`);
  const res = await fetch(`https://api.github.com/search/issues?q=${q}&sort=updated&order=desc&per_page=10`, {
    headers: { ...headers, Accept: 'application/vnd.github+json' },
  });
  if (!res.ok) throw new Error(`search HTTP ${res.status}`);
  const data = await res.json();
  const items = (data.items ?? [])
    .filter((i) => i.pull_request?.merged_at)
    .sort((a, b) => b.pull_request.merged_at.localeCompare(a.pull_request.merged_at));
  const pr = items[0];
  if (!pr) return null;
  return {
    title: pr.title.trim(),
    repo: pr.repository_url.split('/').slice(-2).join('/'),
    url: pr.html_url,
    mergedAt: pr.pull_request.merged_at,
  };
}

try {
  const [c, pr] = await Promise.all([contributions(), latestPr()]);
  const snapshot = { user: USER, updatedAt: new Date().toISOString(), total: c.total, days: c.days, latestPr: pr };
  await writeFile(OUT, JSON.stringify(snapshot) + '\n');
  console.log(`github.json: ${c.days.length} days, ${c.total} contributions, latest PR: ${pr?.title ?? 'none'}`);
} catch (err) {
  try {
    await readFile(OUT);
    console.warn(`GitHub fetch failed (${err.message}); keeping the existing snapshot.`);
  } catch {
    console.warn(`GitHub fetch failed (${err.message}); writing an empty snapshot.`);
    await writeFile(OUT, JSON.stringify({ user: USER, updatedAt: null, total: 0, days: [], latestPr: null }) + '\n');
  }
}
