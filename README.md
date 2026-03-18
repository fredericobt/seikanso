# Seikanso — 星簡素

An Astro port of [Kanso](https://github.com/richtabor/kanso), the minimalist WordPress block theme by Rich Tabor.

**Kanso** (簡素) is one of the seven principles of Zen aesthetics — simplicity, the elimination of clutter. **Sei** (星) means star. Seikanso is a static site built around that same philosophy.

## Features

- Clean, distraction-free reading experience faithful to the original Kanso design
- 15 color palettes (paper, paper-dark, blush, calm, calm-dark, ash, ash-dark, onyx, pitch, focus, focus-dark, blue, green, red, yellow)
- 3 font variants: sans-serif (Inter), monospace (Geist Mono), serif (Noto Serif)
- 3 header variants: default, cover (full-width hero), vertical (centered logo + nav)
- Static search via [Pagefind](https://pagefind.app)
- Webmentions via [webmention.io](https://webmention.io)
- RSS feed + sitemap
- [Decap CMS](https://decapcms.org) ready (GitHub backend)
- Pure CSS with custom properties — no Tailwind, no utility classes
- Self-hosted fonts

## Getting Started

### Prerequisites

- Node.js 22+

### Install

```sh
git clone https://github.com/fredericobt/seikanso.git
cd seikanso
npm install
```

### Develop

```sh
npm run dev
```

### Build

```sh
npm run build
```

The `postbuild` script runs Pagefind automatically to index the site for search.

### Preview

```sh
npm run preview
```

## Configuration

All site-level settings are in `src/config/`:

| File | Purpose |
|------|---------|
| `site.ts` | Site name, URL, navigation links, webmention domain |
| `theme.ts` | Active palette, font preset, spacing and layout tokens |
| `palettes/` | 15 color palette files |

To switch palette, change `activePalette` in `src/config/theme.ts`.

## CMS

Decap CMS is available at `/admin/`. To enable it in production, configure a GitHub OAuth app or Netlify Identity on your deployment.

## Credits

Original WordPress theme by [Rich Tabor](https://github.com/richtabor/kanso) — used as visual reference only.
