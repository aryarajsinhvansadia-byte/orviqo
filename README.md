# ORVIQO

The marketing site for **ORVIQO** — an independent digital studio building premium
websites, AI solutions, SEO and brand identities for ambitious companies worldwide.

> The quiet kind of famous.

## Stack

- **Next.js** (App Router) with static export (`output: "export"`)
- **TypeScript** + **Tailwind CSS v4**
- **Motion** for animation · **Lenis** for smooth scroll
- Fully static — no server, no database

## Develop

```bash
npm install
npm run dev        # http://localhost:3002
```

## Build

```bash
npm run build      # generates the static site into out/
```

## Deploy

Pushing to `main` triggers a GitHub Actions workflow
([`deploy-hostinger.yml`](.github/workflows/deploy-hostinger.yml)) that builds the
static site and force-pushes the contents of `out/` to the `hostinger` branch.
Hostinger's Git integration serves that branch.

## Content

Everything editable lives in `src/lib/`:

| File          | Holds                                            |
| ------------- | ------------------------------------------------ |
| `site.ts`     | Studio name, email, socials, navigation          |
| `services.ts` | The five service offerings                       |
| `projects.ts` | Portfolio projects & case studies                |
| `posts.ts`    | Journal essays                                   |
| `content.ts`  | Metrics, principles, process, testimonials, FAQs |

> **Before launch:** the case studies, testimonials and metrics are illustrative
> samples and must be replaced with real ORVIQO work.
