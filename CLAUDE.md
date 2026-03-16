# Kanso WordPress → Astro Migration

## Status

This is an active migration of the WordPress theme Kanso v1.0.5 (Rich Tabor) to Astro.
The full migration plan is at: `wp-reference/MIGRATION-PLAN.md`

**Always read `wp-reference/MIGRATION-PLAN.md` before starting any work.**

## Progress

- **Session 1: COMPLETE** — Project structure, design tokens, palettes, ThemeStyles.astro, global.css, Base.astro layout, fonts, test index page
- **Session 2: COMPLETE** — Layouts + Components Base
  - DONE: Navigation.astro, Header.astro, Footer.astro, Post.astro layout, Page.astro layout, Content Collections (src/content.config.ts with Astro v6 glob loaders, sample posts/pages), `[...slug].astro` flat URL routing, build verified (4 pages)
  - NOTE: Astro v6 requires content config at `src/content.config.ts` (not `src/content/config.ts`) with explicit `glob()` loaders
- **Session 3: COMPLETE** — Home page + Post components
  - DONE: PostCard.astro, PostListItem.astro, LatestPost.astro, RecentPosts.astro, TagCloud.astro, index.astro (home page completa com tagline + LatestPost + RecentPosts + TagCloud), 4 novos posts de exemplo, build verificado (8 páginas)
- **Session 4: COMPLETE** — Tags page, Pagination, RelatedPosts, Search (Pagefind), 404
  - DONE: tags/[tag].astro, posts/[...page].astro (paginated all-posts), Pagination.astro, RelatedPosts.astro, Search.astro, search.astro, 404.astro
  - DONE: pagefind installed, postbuild script, Post.astro updated with RelatedPosts
  - DONE: Revised Session 3 components — PostCard/PostListItem com CollectionEntry API, TagCloud sem label interno (pill shape 100px), LatestPost autônomo (font-size-md), RecentPosts com excludeId, RelatedPosts usa PostListItem com separator=false + font-size-lg
  - NOTE: 10 sample posts (2 originais + 4 sessão 3 + 4 sessão 4); build produz 20+ páginas
- **Session 5: PENDING** — Webmentions, Decap CMS, Sitemap + RSS
- **Session 6: PENDING** — Header variants, ToolCards, WorkExperience, all 15 palettes, 3 typography configs
- **Session 7: PENDING** — Polish, token validation, accessibility, Lighthouse audit

## Key Decisions

- WordPress reference files are in `wp-reference/` — consult them for visual fidelity
- Default palette: 01-paper (light), default font: Inter (sans-serif)
- Search: Pagefind (static), Comments: Webmentions (webmention.io)
- Only tags (no categories), no newsletter
- Decap CMS compatible (GitHub login)
- Flat URLs: `site.com/post-title` (posts and pages at same level)
- Pure CSS with custom properties (no Tailwind)
- Self-hosted fonts (Inter, Geist Mono, Noto Serif)

## WP Spacing Mapping

WP `--spacing--10` = 8px (xs), `--20` = 16px (sm), `--30` = 24px (md), `--40` = 32px (lg), `--50` = 48px (xl), `--60` = 60px (2xl), `--70` = 72px (3xl)

## Architecture

- `src/config/site.ts` — Site name, URL, navigation links
- `src/config/theme.ts` — Active palette + font selection, spacing/layout/fontSize tokens
- `src/config/palettes/` — Color palette files (currently only paper.ts)
- `src/components/ThemeStyles.astro` — Generates CSS custom properties from active palette
- `src/styles/global.css` — Full CSS reset + element styles (migrated from WP style.css)
- `src/layouts/Base.astro` — HTML shell with fonts, meta, ThemeStyles, global.css

## Component API Notes

- `PostCard` — recebe `post: CollectionEntry<"posts">`, usado em archive (/posts, tags). font-size-lg.
- `PostListItem` — recebe `post: CollectionEntry<"posts">` + `separator?: boolean` (default true) + `titleFontSize?: string`. Separador hr incluído no componente.
- `TagCloud` — sem label interno. O pai controla o label (ex: "Topics" em index.astro).
- `LatestPost` — autônomo, font-size-md (fiel ao WP posts-latest.php fontSize: "medium").
- `RecentPosts` — `excludeId?: string` para evitar duplicar o LatestPost. `limit?: number`.
- `RelatedPosts` — usa PostListItem com `separator={false}` + `titleFontSize="var(--font-size-lg)"`.
- `Pagination` — recebe `page: Page<unknown>` do Astro paginate(). URLs derivadas de `page.url.first`.
