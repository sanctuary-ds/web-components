# `@sanctuary-ds/web-components`

Framework-agnostic Lit 3 Web Components built on [`@sanctuary-ds/tokens`](https://github.com/sanctuary-ds/tokens).

## Installation

```bash
pnpm add @sanctuary-ds/web-components @sanctuary-ds/tokens
```

Load the Sanctuary token stylesheet once in your application entry point:

```ts
import "@sanctuary-ds/tokens/css";
```

Set the active flavor, accent, or glazing on `<html>` or any subtree:

```html
<html data-san-flavor="compline" data-san-accent="cobalt" data-san-glazing="pot-metal">
```

## Subpath exports

Every component will expose two tree-shakable entry points:

- `@sanctuary-ds/web-components/<component>` — side-effect-free class export for programmatic use or custom registration.
- `@sanctuary-ds/web-components/<component>/register` — registers the custom element idempotently via `defineElement()`.

Foundation utilities are exported from `@sanctuary-ds/web-components` and `@sanctuary-ds/web-components/styles`.

## Development

Requires **Node.js `^26.0.0`** and **pnpm**.

```bash
pnpm install
pnpm exec playwright install chromium
pnpm run check
pnpm run storybook
```

| Script               | Purpose                                                                  |
| -------------------- | ------------------------------------------------------------------------ |
| `pnpm run build`     | Compile TypeScript (`src/`) to `dist/` with declarations                 |
| `pnpm run typecheck` | Run strict TypeScript check across source, tests, scripts, and Storybook |
| `pnpm run lint`      | Run Biome and minimal ESLint (`lit`/`wc`) checks                         |
| `pnpm test`          | Run Vitest Browser Mode tests in headless Chromium with `axe-core`       |
| `pnpm run cem`       | Generate `custom-elements.json`                                          |
| `pnpm run api`       | Regenerate `api/web-components.api.txt`                                  |
| `pnpm run api:check` | Verify committed API report matches current package and CEM              |
| `pnpm run storybook` | Launch the Storybook component workbench                                 |

## Releasing

Releases are automated with `release-please` and published to npm through GitHub Actions OIDC Trusted Publishing with SLSA provenance.

## License

[MIT](LICENSE)
