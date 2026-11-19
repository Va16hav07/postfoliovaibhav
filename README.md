# Vaibhav Kumawat · Portfolio

Personal portfolio: [va16hav.vercel.app](https://va16hav.vercel.app/)

Built with React, TypeScript, Tailwind CSS and Framer Motion. Supports light/dark themes, reduced motion, reduced transparency and increased contrast, bundled with Vite and deployed on Vercel.

## Run locally

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
```

## Editing content

All text, links, projects, experience, open source and skills live in **`src/data.ts`**. Edit that file; the components only handle layout.

| Piece | File |
|---|---|
| 3D work graph (nodes and links) | `src/components/WorkGraph.tsx` |
| Terminal commands | `src/components/Terminal.tsx` |
| GitHub activity (fetched at build time) | `scripts/fetch-github.mjs` → `src/generated/github.json` (`npm run github` to refresh) |
| "Now" section | `now` in `src/data.ts` |
| Accent colours | `src/components/accent.ts` + `src/index.css` |
| Binary cursor trail | `src/components/CursorTrail.tsx` |
| 404 page | `public/404.html` |
| ⌘K command palette | `src/components/CommandPalette.tsx` |
| Project case-study sheet | `src/components/ProjectSheet.tsx` |
| Incident Commander game | `src/components/IncidentGame.tsx` |
| Merge Runner maze game (levels at the top) | `src/components/MergeRunner.tsx` |
| Theme colours, type scale, materials | `src/index.css` |
| Spring settings | `src/components/motion.ts` |
| Page title, SEO and link-preview tags | `index.html` |

## Assets in `public/`

- `Vaibhav_Kumawat_Resume.pdf`: served by the Resume button. Replace it with the same file name.
- `photo-*.webp` / `photo-*.jpg`: photos in the About section's flickable stack (listed in `photos` in `src/data.ts`).
- `og-image.jpg`: 1200×630 link-preview image.
- `favicon.svg`: favicon.

### Project visuals

Each project falls back to GitHub's generated repository card. To show something real:

1. Record a short silent clip (6–10 s, 1280×640 or any 2:1 size, MP4/H.264, ideally under 2 MB).
2. Save it as `public/projects/<slug>.mp4`, plus an optional still as `public/projects/<slug>.jpg`.
3. In `src/data.ts`, add to that project: `media: { video: '/projects/<slug>.mp4', image: '/projects/<slug>.jpg' }`.

Videos play on hover in the grid and automatically inside the case study (not for visitors who prefer reduced motion). Slugs: `travel-planner`, `peak`, `aria`, `ojt-maker`, `terminal-devtool`, `equiply`.
