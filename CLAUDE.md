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
- **Session 5: COMPLETE** — Webmentions, Decap CMS, Sitemap + RSS
  - DONE: Webmentions.astro (fetch build-time de webmention.io — likes, reposts, replies), integrado em Post.astro
  - DONE: Decap CMS (public/admin/index.html + config.yml — backend GitHub, collections posts + pages)
  - DONE: rss.xml.ts (@astrojs/rss, posts ordenados, já instalado), sitemap já configurado desde S4
  - DONE: Base.astro com RSS autodiscovery + link rel="webmention" condicional (só se webmentionDomain estiver configurado em site.ts)
  - NOTE: Para ativar webmentions, preencher `webmentionDomain` em src/config/site.ts com o domínio registrado no webmention.io
  - NOTE: Para ativar Decap CMS em produção, configurar OAuth app no GitHub (ou Netlify Identity)
- **Session 6: COMPLETE** — Header variants, ToolCards, WorkExperience, all 15 palettes
  - DONE: HeaderCover.astro (section-1 full-width + hero text centrado), HeaderVertical.astro (logo + nav centrados)
  - DONE: ToolCards.astro (grid minmax 12rem, section-3 cards, props: items + label)
  - DONE: WorkExperience.astro (33%/66% columns, gap lg entre itens, responsive mobile)
  - DONE: 14 paletas novas em config/palettes/ — focus, blush, calm, calm-dark, ash, ash-dark, paper-dark, onyx, focus-dark, pitch, blue, green, red, yellow (todas com dark mode)
  - NOTE: Tipografias (inter/monospace/serif) já estavam definidas em theme.ts como fontPresets — arquivos separados em config/fonts/ não são necessários
  - NOTE: Para trocar paleta: alterar `activePalette` em src/config/theme.ts; para componentes de header alternativos, substituir Header.astro por HeaderCover ou HeaderVertical nas layouts
- **Session 7: COMPLETE** — Polish, token validation, accessibility
  - DONE: Token validation — todos os tokens (spacing, font sizes, layout, transition) conferidos contra theme.json ✅
  - DONE: Base.astro — canonical URL, OG meta (og:type, og:url, og:title, og:description, og:image), Twitter card meta
  - DONE: Skip link "Skip to content" → #main-content em todas as páginas
  - DONE: Navigation.astro — aria-label="Main navigation"
  - DONE: Post.astro + Page.astro — conteúdo em <article> (ativa regras de espaçamento do global.css: article > * + *)
  - DONE: HeaderCover.astro — border-radius: 0 (fiel ao WP border-radius: 0px no is-style-section-1 full-width)
  - DONE: id="main-content" em todos os <main> (index, search, tags, posts, 404, Post, Page)

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

## Git / GitHub
- `gh pr create` defaults to upstream (richtabor/kanso) — always use `--repo fredericobt/astro-kanso --head fredericobt:<branch>`

## Search (Pagefind)
- Pagefind UI does NOT read `?q=` URL params — search is accessed via nav link only, no inline forms

## Decap CMS
- `media_folder: public/uploads`, `public_folder: /uploads` — files in `src/` are not publicly served

## Accessibility
- Use `:focus-visible` (not bare `:focus`) for skip links and interactive elements — WCAG Technique C45
