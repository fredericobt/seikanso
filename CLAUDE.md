# seikanso

Astro blog template based on WordPress Kanso v1.0.5 (Rich Tabor).
Visual reference: https://rich.blog/

## Commands

- `npm run dev` — dev server (localhost:4321)
- `npm run build` — production build (postbuild runs pagefind)
- `npm run preview` — preview production build

## Architecture

- `src/content.config.ts` — Content collections (Astro v6 glob loaders, NOT `src/content/config.ts`)
- `src/content/posts/` — Sample markdown posts
- `src/pages/` — Routes (index, posts/[...page], tags/[tag], search, 404)
- `src/layouts/` — Base.astro (HTML shell), Post.astro, Page.astro
- `src/config/site.ts` — Site name, URL, navigation links
- `src/config/theme.ts` — Active palette + font selection, spacing/layout/fontSize tokens
- `src/config/palettes/` — 15 color palettes (default: paper)
- `src/components/ThemeStyles.astro` — Generates CSS custom properties from active palette
- `src/styles/global.css` — Full CSS reset + element styles

## Key Decisions

- Pure CSS with custom properties (no Tailwind)
- Flat URLs: `site.com/post-title` (posts and pages at same level)
- Self-hosted fonts (Inter, Geist Mono, Noto Serif)
- Search: Pagefind (static), Comments: Webmentions (webmention.io)
- Only tags (no categories)
- KaTeX for math rendering (remark-math + rehype-katex)

## Component API

- `LatestPost` — standalone, fetches latest post, section-3 card with excerpt
- `RecentPosts` — `excludeId?: string`, `limit?: number`, section-3 card
- `PostListItem` — `post` + `separator?: boolean` (default true) + `titleFontSize?: string`
- `PostCard` — `post`, used in archive pages, font-size-lg
- `TagCloud` — no internal label, parent controls heading
- `RelatedPosts` — uses PostListItem with `separator={false}`
- `Pagination` — `page: Page<unknown>` from Astro paginate()

## CSS Patterns

- `.section-3` = card with `border: 1px solid var(--color-3)` + `border-radius: var(--space-sm)`
- `.constrained` max-width = `calc(var(--content-width) + 2 * var(--space-md))` (WP is-layout-constrained pattern)
- WP spacing: `--spacing--10`=8px(xs), `--20`=16px(sm), `--30`=24px(md), `--40`=32px(lg), `--50`=48px(xl)

## Spacing Consistency Rules (WP → Astro)

WordPress block patterns use `blockGap` on parent groups to space children. In flow layout (`layout: "default"`), blockGap generates `margin-top` on children via `> * + *`. In flex layout, it generates `gap`. When converting WP patterns to Astro components, follow these rules:

1. **Label-to-card spacing**: Use `gap` on the parent flex container, NEVER `margin-bottom` on the label. The parent container must be `display: flex; flex-direction: column; gap: var(--space-sm)`. This matches WP's default blockGap of `--spacing--20` (16px).
2. **Inner card spacing**: Use `gap` on the card's flex container (e.g., `gap: var(--space-xs)` for `blockGap: --spacing--10`).
3. **Padding values**: Match WP's exact padding on section-3 cards. WP often uses pixel values for fine-tuning (e.g., `6px` top, `26px` bottom on RecentPosts card). Preserve these as-is — they account for child element padding to achieve correct total spacing.
4. **Section separation**: Use `margin-top` on section wrappers (not spacer divs).
5. **Separators**: Always `margin: 0` on `<hr>` elements inside list items.
6. **Never use `margin-bottom` on labels** to create label-to-content spacing — use `gap` on the parent instead.

## Workflow

- **This is the source of truth for all design/code changes**
- All changes are made here first, then copied to fredericobtcom (production site)
- Flow: branch here → PR → merge → copy changed files to fredericobtcom

## Git / GitHub

- Repo: `fredericobt/seikanso`
- Push to main blocked by ruleset — always use branch + PR
- `gh pr create` must specify `--repo fredericobt/seikanso --head fredericobt:<branch>`

## Gotchas

- Astro 6 requires Node.js >=22.12.0
- Pagefind UI does NOT read `?q=` URL params
- `:focus-visible` (not bare `:focus`) for interactive elements — WCAG C45
- Decap CMS: `media_folder: public/uploads`, `public_folder: /uploads`
