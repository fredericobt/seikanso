# Plano de Migração: Kanso WordPress → Astro

## Contexto

O repositório `/home/user/astro-kanso` contém o tema WordPress Kanso v1.0.5 (Rich Tabor). O objetivo é migrar o design completo para Astro, mantendo fidelidade visual perfeita ao original, mas com código mínimo e limpo. Uma tentativa anterior falhou por divergência visual.

**Decisões do usuário:**
- Manter WordPress em `/wp-reference` para consulta
- Paleta padrão: 01-paper (light)
- Tipografia padrão: Inter (sans-serif)
- Busca: Pagefind
- Webmentions no lugar de comentários
- Apenas tags (sem categories)
- Sem newsletter
- Compatível com Decap CMS (login via GitHub)
- URLs flat: `site.com/titulo-do-post` (posts e páginas no mesmo nível)

---

## Fase 1: Estrutura do Projeto

### 1.1 Mover arquivos WordPress para referência
```
mv assets parts patterns styles templates theme.json style.css functions.php → wp-reference/
mv blueprint.json blueprint-content.xml readme.txt composer.json phpcs.xml.dist theme-zip.sh → wp-reference/
```

### 1.2 Inicializar projeto Astro
```
npm create astro@latest . -- --template minimal
```

### 1.3 Estrutura final do Astro
```
src/
├── config/
│   ├── site.ts              # Nome do site, URL, descrição, navegação
│   ├── theme.ts              # Paleta ativa + tipografia ativa (importa de palettes/)
│   ├── palettes/             # 15 paletas de cores (1 arquivo TS por paleta)
│   │   ├── paper.ts
│   │   ├── focus.ts
│   │   ├── blush.ts
│   │   ├── calm.ts
│   │   ├── calm-dark.ts
│   │   ├── ash.ts
│   │   ├── ash-dark.ts
│   │   ├── paper-dark.ts
│   │   ├── onyx.ts
│   │   ├── focus-dark.ts
│   │   ├── pitch.ts
│   │   ├── blue.ts
│   │   ├── green.ts
│   │   ├── red.ts
│   │   └── yellow.ts
│   └── fonts/                # 3 configurações de tipografia
│       ├── inter.ts          # (padrão)
│       ├── monospace.ts
│       └── serif.ts
├── content/
│   ├── config.ts             # Schemas Zod para posts e páginas
│   ├── posts/                # Markdown/MDX blog posts
│   └── pages/                # Markdown/MDX páginas estáticas (about, etc.)
├── layouts/
│   ├── Base.astro            # HTML shell, meta, fonts, global CSS, <slot/>
│   ├── Post.astro            # Layout para single post (herda Base)
│   └── Page.astro            # Layout para páginas estáticas (herda Base)
├── components/
│   ├── Header.astro          # Logo/título + navegação horizontal
│   ├── HeaderCover.astro     # Header cover (section-1 background)
│   ├── HeaderVertical.astro  # Header vertical (logo centrado + nav)
│   ├── Footer.astro          # Navegação vertical no footer
│   ├── Navigation.astro      # Links de navegação (lê de site.ts)
│   ├── PostCard.astro        # Título + conteúdo + data (para feed/index)
│   ├── PostListItem.astro    # Título + data em linha (para listas compactas)
│   ├── LatestPost.astro      # Card destaque do post mais recente
│   ├── RecentPosts.astro     # Lista com separadores + "View all" button
│   ├── RelatedPosts.astro    # "You may also enjoy…" (lista no single)
│   ├── TagCloud.astro        # Tags como pills clicáveis
│   ├── ToolCards.astro       # Grid de cards (min 12rem)
│   ├── WorkExperience.astro  # Timeline de experiência profissional
│   ├── Pagination.astro      # Prev/números/Next
│   ├── Search.astro          # Pagefind search input
│   ├── Webmentions.astro     # Likes, replies, reposts via webmention.io
│   └── ThemeStyles.astro     # Gera CSS custom properties da paleta ativa
├── pages/
│   ├── index.astro           # Home (LatestPost + RecentPosts + TagCloud + ToolCards)
│   ├── [...slug].astro       # Rota dinâmica flat para posts E páginas (site.com/titulo)
│   ├── tags/
│   │   └── [tag].astro       # Posts filtrados por tag
│   ├── search.astro          # Página de busca (Pagefind)
│   └── 404.astro             # "Whoops, that page is gone."
├── styles/
│   └── global.css            # Reset, tipografia, elementos, dark mode, acessibilidade
└── assets/
    └── fonts/                # Copiados de wp-reference/assets/fonts/
        ├── inter/
        ├── geist-mono/
        └── noto-serif/
```

---

## Fase 2: Sistema de Design (Design Tokens)

### 2.1 Paleta de cores como CSS Custom Properties

Cada paleta define apenas **2 cores âncora** (theme-1 e theme-6). As 4 intermediárias são calculadas com `color-mix()`:

```css
:root {
  --color-1: hsl(0 4% 93%);           /* Fundo (paper) */
  --color-2: color-mix(in srgb, var(--color-1) 93%, var(--color-6) 7%);
  --color-3: color-mix(in srgb, var(--color-1) 90%, var(--color-6) 10%);
  --color-4: color-mix(in srgb, var(--color-1) 80%, var(--color-6) 20%);
  --color-5: color-mix(in srgb, var(--color-1) 36%, var(--color-6) 64%);
  --color-6: hsl(230 8% 13%);         /* Texto (paper) */
}
```

**Para paletas com accent (blue, green, red, yellow):** adicionamos `--color-accent`.

**Dark mode** (mesma paleta, cores invertidas):
```css
.theme-dark {
  --color-1: var(--color-1-dark);  /* = theme-6 original */
  --color-2: ...inversão...
  /* etc */
}
```

### 2.2 Arquivo de paleta (exemplo: `src/config/palettes/paper.ts`)
```ts
export const paper = {
  name: "Paper",
  light: { color1: "hsl(0 4% 93%)", color6: "hsl(230 8% 13%)" },
  dark: { color1: "var(--color-6)", color6: "var(--color-1)" },
  mixRatios: { color2: [93, 7], color3: [90, 10], color4: [80, 20], color5: [36, 64] },
  darkMixRatios: { color2: [4, 96], color3: [12, 88], color4: [25, 75], color5: [45, 55] },
}
```

### 2.3 `ThemeStyles.astro` — Componente que gera CSS
Lê a paleta ativa de `theme.ts` e gera as custom properties no `<style is:global>`.

### 2.4 Tipografia

Configuração por arquivo TS com: fontFamily, fontSizes (fluid), heading weights/line-heights, overrides de elementos. O componente `Base.astro` injeta `@font-face` e aplica via custom properties.

**Default (Inter):** `font-family: "Inter", sans-serif`, body 0.925rem, headings weight 550
**Monospace:** `font-family: "Geist Mono", monospace`, smaller sizes, uppercase nav/dates
**Serif:** `font-family: "Noto Serif", serif`

### 2.5 Espaçamento (constantes CSS)
```css
--space-xs: 8px; --space-sm: 16px; --space-md: 24px; --space-lg: 32px;
--space-xl: 48px; --space-2xl: 60px; --space-3xl: 72px;
```

### 2.6 Layout
```css
--content-width: 440px; --wide-width: 640px;
```

### 2.7 Block/Section Styles (CSS classes)
- `.section-1`: bg=color-6, text=color-4 (dark inverted)
- `.section-2`: bg=color-2 (subtle highlight)
- `.section-3`: bg=color-1, border 1px color-3, border-radius 16px
- `.text-title`: font-size x-large, weight 550
- `.text-subtitle`: font-size medium, color-5, weight 400
- `.framed`: border + inner border-radius para imagens

---

## Fase 3: Layouts

### 3.1 `Base.astro`
- `<!DOCTYPE html>`, `<html lang>`, `<head>` com meta SEO, `@font-face`, `<ThemeStyles/>`
- `<body>` com `-webkit-font-smoothing: antialiased`
- Slot para conteúdo
- Props: `title`, `description`, `image?`

### 3.2 `Post.astro`
- Herda `Base.astro`
- `<Header/>`, `<main>`: título h1, data, conteúdo markdown, `<Webmentions/>`, `<RelatedPosts/>`, `<Footer/>`
- Mapeia exatamente o `templates/single.html` do WordPress

### 3.3 `Page.astro`
- Herda `Base.astro`
- `<Header/>`, `<main>`: título, conteúdo, `<Footer/>`

---

## Fase 4: Componentes (mapeamento WP → Astro)

| WordPress Pattern/Part | Astro Component | Notas |
|---|---|---|
| `parts/header.html` | `Header.astro` | Logo + título + nav horizontal |
| `patterns/header-cover.php` | `HeaderCover.astro` | Section-1 bg + hero text |
| `patterns/header-vertical.php` | `HeaderVertical.astro` | Logo centrado + nav |
| `parts/footer.html` | `Footer.astro` | Nav vertical |
| `parts/post.html` | `PostCard.astro` | Título linkado + conteúdo + data |
| `patterns/posts-latest.php` | `LatestPost.astro` | 1 post em section-3 card |
| `patterns/posts-recent.php` | `RecentPosts.astro` | Lista 5 posts + separadores + botão |
| `patterns/posts-list.php` | `RelatedPosts.astro` | "You may also enjoy…" |
| `patterns/query-feed.php` | `PostCard.astro` (variante) | Avatar + autor + data + conteúdo |
| `patterns/cards-tools.php` | `ToolCards.astro` | Grid min-12rem com section-3 cards |
| `patterns/text-work-experience.php` | `WorkExperience.astro` | Columns 33%/66% timeline |
| Tag cloud (theme.json) | `TagCloud.astro` | Pills com border, transition, scale |
| Pagination (templates) | `Pagination.astro` | Prev/números/Next |
| Search (404.html) | `Search.astro` | Input Pagefind |
| Comments (single.html) | `Webmentions.astro` | webmention.io API |

**Patterns NÃO migrados:** newsletter-inline, newsletter-inline-dark, newsletter-landing-page, newsletter-landing-page-dark.

**Query patterns** (query-default, query-journal, query-photoblog, query-w-featured-image): São variações do loop de posts. Serão implementados como props/modos do PostCard ou como variantes de layout na page de archive, conforme necessidade futura.

---

## Fase 5: CSS Global (`src/styles/global.css`)

Migração direta do `style.css` do WordPress, removendo prefixos `.wp-block-*` e simplificando:

- Font smoothing
- Dark mode toggle (`.theme-dark` swaps custom properties)
- Tipografia: `strong { font-weight: 550 }`, headings `text-wrap: balance`
- Espaçamento extra antes de headings após parágrafos
- Listas: `list-style-type: circle`, `padding-inline-start: var(--space-sm)`
- Inline code: border, border-radius, font-size 85%
- Links: `text-underline-offset: 2px`
- Botões: transition 200ms, hover, border-radius
- Forms: inputs estilizados, focus-visible outline
- Imagens: border-radius 16px, `.framed` style
- Quotes: left border, italic, cite styling
- Code blocks: bg color-2, border-radius, overflow scroll
- Separators: 1px top border, color-3
- Acessibilidade: `prefers-reduced-motion: reduce`

---

## Fase 6: Content Collections + URLs Flat

### `src/content/config.ts`
```ts
import { defineCollection, z } from "astro:content";

const posts = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    publishDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    image: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

const pages = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
  }),
});

export const collections = { posts, pages };
```

### URLs flat: `site.com/titulo`
Posts e páginas compartilham o mesmo nível de URL. O arquivo `src/pages/[...slug].astro` resolve ambas as collections:

```ts
// src/pages/[...slug].astro
export async function getStaticPaths() {
  const posts = await getCollection("posts");
  const pages = await getCollection("pages");
  return [
    ...posts.map(p => ({ params: { slug: p.id }, props: { entry: p, type: "post" } })),
    ...pages.map(p => ({ params: { slug: p.id }, props: { entry: p, type: "page" } })),
  ];
}
```
Renderiza com `Post.astro` ou `Page.astro` conforme o `type`.

---

## Fase 7: Páginas

### 7.1 `index.astro` (Home)
Mapeia `patterns/page-home.php`:
- Site tagline
- `<LatestPost/>` (1 post mais recente em card section-3)
- `<RecentPosts/>` (5 posts em lista com separadores + botão "View all posts →")
- `<TagCloud/>`
- `<ToolCards/>` (grid 2x2 de cards)

### 7.2 `[...slug].astro` (Post ou Página — URL flat)
Rota dinâmica que resolve tanto posts quanto páginas:
- Posts → renderiza com `Post.astro`: título h1, data, conteúdo, `<Webmentions/>`, `<RelatedPosts/>`
- Páginas → renderiza com `Page.astro`: título, conteúdo

### 7.3 `tags/[tag].astro`
Mapeia `templates/archive.html`:
- Título da tag + lista de posts filtrados + paginação

### 7.5 `search.astro`
- Pagefind UI + resultado

### 7.6 `404.astro`
Mapeia `templates/404.html`:
- "Whoops, that page is gone." centralizado, min-height 70vh
- Search input

---

## Fase 8: Webmentions

- `<link rel="webmention">` no `<head>` (Base.astro)
- `Webmentions.astro`: fetch de webmention.io API no build-time
- Exibe: replies (avatar + nome + data + texto), likes (avatares inline), reposts
- Configurável via `site.ts` (domínio para webmention.io)

---

## Fase 9: Busca (Pagefind)

- Instalar: `npm install pagefind`
- postbuild script: `pagefind --site dist`
- `data-pagefind-body` no conteúdo principal
- `data-pagefind-filter="tag"` nos tags
- Component `Search.astro` com Pagefind UI

---

## Fase 10: Decap CMS

### 10.1 Arquivos de admin
```
public/
  admin/
    index.html    # Carrega Decap CMS via CDN
    config.yml    # Configuração do CMS
```

### 10.2 `public/admin/index.html`
```html
<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Content Manager</title>
</head>
<body>
  <script src="https://unpkg.com/decap-cms@^3.0.0/dist/decap-cms.js"></script>
</body>
</html>
```

### 10.3 `public/admin/config.yml`
```yaml
backend:
  name: github
  repo: fredericobt/astro-kanso    # Repositório do usuário
  branch: main

media_folder: src/assets/uploads
public_folder: /src/assets/uploads

collections:
  - name: posts
    label: Posts
    folder: src/content/posts
    create: true
    delete: true
    format: frontmatter
    slug: "{{slug}}"
    fields:
      - { label: "Title", name: "title", widget: "string" }
      - { label: "Description", name: "description", widget: "string", required: false }
      - { label: "Publish Date", name: "publishDate", widget: "datetime" }
      - { label: "Updated Date", name: "updatedDate", widget: "datetime", required: false }
      - { label: "Tags", name: "tags", widget: "list", default: [] }
      - { label: "Image", name: "image", widget: "image", required: false }
      - { label: "Draft", name: "draft", widget: "boolean", default: false }
      - { label: "Body", name: "body", widget: "markdown" }

  - name: pages
    label: Pages
    folder: src/content/pages
    create: true
    delete: true
    format: frontmatter
    slug: "{{slug}}"
    fields:
      - { label: "Title", name: "title", widget: "string" }
      - { label: "Description", name: "description", widget: "string", required: false }
      - { label: "Body", name: "body", widget: "markdown" }
```

### 10.4 Autenticação
O backend `github` requer um OAuth app registrado no GitHub. Para deploy em Netlify, basta usar Netlify Identity + Git Gateway. Para outros hosts (Vercel, Cloudflare), usar a integração `astro-decap-cms-oauth` ou configurar um OAuth proxy externo.

---

## Fase 11: Sitemap + RSS

### 11.1 Sitemap
```bash
npx astro add sitemap
```
Configuração em `astro.config.mjs`:
```ts
import sitemap from "@astrojs/sitemap";
export default defineConfig({
  site: "https://fredericobt.com",
  integrations: [sitemap()],
});
```
Gera `sitemap-index.xml` automaticamente. Pronto para Google Search Console.

### 11.2 RSS Feed (bônus)
```bash
npm install @astrojs/rss
```
Criar `src/pages/rss.xml.ts` que gera feed RSS dos posts. Útil para leitores e indexação.

---

## Fase 12: Dependências

```json
{
  "dependencies": {
    "astro": "latest",
    "@astrojs/sitemap": "latest",
    "@astrojs/rss": "latest"
  },
  "devDependencies": {
    "pagefind": "latest"
  }
}
```

Sem Tailwind. CSS puro com custom properties para manter o espírito minimalista do Kanso.
Decap CMS carregado via CDN (sem dependência npm).

### Fontes
- **Self-hosted** (locais, sem CDN externo)
- **Inter**: baixar `.woff2` direto de https://github.com/rsms/inter/releases/tag/v4.1 (já otimizado)
- **Geist Mono**: já está em `.woff2` no repo
- **Noto Serif**: converter de `.ttf` para `.woff2` (ou buscar woff2 no Google Fonts repository)
- `font-display: swap` + `<link rel="preload">` para performance máxima

---

## Divisão em Sessões

### Sessão 1: Estrutura + Design Tokens (Fases 1-2)
- Mover WP para `wp-reference/`
- Inicializar projeto Astro + `astro.config.mjs`
- Copiar/baixar fontes para `src/assets/fonts/`
- Criar sistema de design tokens: `config/site.ts`, `config/theme.ts`, paleta paper
- Criar `ThemeStyles.astro`
- Criar `global.css` (migrar `style.css`)
- **Entrega**: projeto Astro roda com `npm run dev`, tokens CSS funcionando

### Sessão 2: Layouts + Componentes Base (Fases 3-4 parcial)
- Criar `Base.astro` layout
- Criar `Header.astro` + `Footer.astro` + `Navigation.astro`
- Criar content collections (posts + pages) + conteúdos de exemplo
- Criar `Post.astro` + `Page.astro` layouts
- Criar `[...slug].astro` (URLs flat)
- **Entrega**: é possível ver um post e uma página com header/footer

### Sessão 3: Home + Componentes de Posts (Fase 4 restante + Fase 7 parcial)
- Criar `PostCard.astro`, `PostListItem.astro`
- Criar `LatestPost.astro`, `RecentPosts.astro`
- Criar `TagCloud.astro`
- Criar `index.astro` (home page completa)
- **Entrega**: home page funcional com posts reais

### Sessão 4: Páginas restantes (Fase 7 restante)
- Criar `tags/[tag].astro` + `Pagination.astro`
- Criar `RelatedPosts.astro`
- Criar `search.astro` + `Search.astro` + Pagefind
- Criar `404.astro`
- **Entrega**: todas as páginas funcionais

### Sessão 5: Features (Fases 8-10)
- Criar `Webmentions.astro`
- Configurar Decap CMS (`public/admin/`)
- Configurar sitemap + RSS
- **Entrega**: CMS, webmentions, sitemap, RSS

### Sessão 6: Variantes de Design (Fases 4 variantes + paletas + tipografias)
- Criar `HeaderCover.astro`, `HeaderVertical.astro`
- Criar `ToolCards.astro`, `WorkExperience.astro`
- Migrar todas as 15 paletas para `config/palettes/`
- Migrar 3 tipografias para `config/fonts/`
- **Entrega**: sistema de design completo, todas as variantes

### Sessão 7: Polimento + Verificação
- Validação de todos os tokens vs. theme.json
- Testes de acessibilidade
- Lighthouse audit
- Ajustes finais
- **Entrega**: site pronto para deploy

---

## Verificação

### Testes funcionais
1. `npm run dev` — verificar que todas as páginas renderizam sem erros
2. `npm run build` — build limpo, sem warnings
3. Navegar todas as rotas: home, post, página, tag, search, 404
4. Decap CMS: acessar `/admin/` e verificar que carrega

### Comparação visual (abordagem robusta)
O WordPress Playground não gera um site com conteúdo fiel para comparação. Em vez disso:
1. **Referência direta ao código-fonte**: cada componente Astro será construído traduzindo meticulosamente os tokens do `theme.json` e os estilos do `style.css`. A fidelidade vem da tradução precisa dos design tokens, não de comparação visual
2. **Validação de tokens**: criar um checklist verificando que cada custom property CSS (`--color-1` a `--color-6`, espaçamentos, font sizes, shadows, transitions) corresponde exatamente ao valor definido no `theme.json`
3. **Posts de exemplo com conteúdo real**: criar posts de teste que exercitem todos os elementos (headings, listas, code blocks, quotes, imagens, separadores) para validar que a tipografia e espaçamento estão corretos
4. **Comparação com rich.blog**: se possível, capturar screenshots manuais do site rich.blog para referência visual durante o desenvolvimento
5. **Revisão iterativa com o usuário**: após cada fase, compartilhar o progresso para feedback visual antes de seguir

### Testes de design system
6. Testar troca de paleta: alterar `theme.ts` para cada uma das 15 paletas e verificar
7. Testar troca de tipografia: alternar entre inter, monospace, serif
8. Testar dark mode: `.theme-dark` class toggle

### Qualidade
9. Verificar responsividade em mobile/tablet/desktop
10. Verificar acessibilidade: focus states, `prefers-reduced-motion`, contraste WCAG
11. Lighthouse: alvo 100 em Performance, Accessibility, Best Practices, SEO
12. Validar sitemap.xml gerado
13. Validar RSS feed
