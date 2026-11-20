# Roadmap

The Lit 3 Web Components library for Sanctuary, published as [`@sanctuary-ds/web-components`](https://www.npmjs.com/package/@sanctuary-ds/web-components). Every component consumes [`@sanctuary-ds/tokens`](https://github.com/sanctuary-ds/tokens) through inherited CSS custom properties without requiring a JavaScript theme provider.

Cross-repository contracts live in [`tokens/docs/ecosystem.md`](https://github.com/sanctuary-ds/tokens/blob/main/docs/ecosystem.md).

## Scope

| In this repository                                                                                     | Elsewhere                                                                                                                       |
| ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------- |
| Lit 3 custom elements (`<san-*>`) and shared styles/controllers in `src/`                              | Color maths, palette, DTCG tokens and `sanctuary.css`: [`tokens`](https://github.com/sanctuary-ds/tokens)                       |
| Custom Elements Manifest (`custom-elements.json`) and public API report (`api/web-components.api.txt`) | Public docs, playground and design language: [`sanctuary-ds.github.io`](https://github.com/sanctuary-ds/sanctuary-ds.github.io) |
| Browser tests (Vitest + Playwright + `axe-core`) and Storybook workbench                               | Desktop application themes: [`ports`](https://github.com/sanctuary-ds/ports)                                                    |

## Principles

- **Single package, tree-shakable subpaths.** Components ship from `@sanctuary-ds/web-components/<component>` (side-effect-free class export) and `@sanctuary-ds/web-components/<component>/register` (idempotent custom element registration).
- **Semantic tokens only.** Components read semantic, glazing, cast, and focus tokens (`--san-accent`, `--san-glaze-*`, `--san-<status>-glaze-*`, `--san-focus-ring`, `--san-surface-*`, `--san-type-*`). Pigments are never read directly.
- **Tier-5 component tokens.** Each component exposes local custom properties (for example `--san-button-radius`) defaulting to Sanctuary system tokens so consumers can customize without forking.
- **Glazing is a system axis.** Components honor the active `data-san-glazing` (`pot-metal`, `flashed`, `grisaille`), `data-san-flavor` (`lauds`, `vespers`, `compline`, `matins`), and `data-san-accent` from the host or any ancestor.
- **Accessibility is part of the contract.** Every component uses `:focus-visible` with `--san-focus-ring` and `--san-focus-ring-offset` (preserving `forced-colors: active`), honors `prefers-reduced-motion`, wraps native controls or uses `ElementInternals` ARIA/FACE APIs properly, never conveys status by color alone, and passes `axe-core` in real Chromium.
- **The contract is written down.** `custom-elements.json` and `api/web-components.api.txt` guard the public surface in CI.

## Contract with `@sanctuary-ds/tokens`

- `devDependencies` pins an exact `@sanctuary-ds/tokens` version (`0.4.0`), updated in a dedicated commit.
- `peerDependencies` declares the compatible `@sanctuary-ds/tokens` range (`>=0.4.0 <1.0.0`) so applications load `sanctuary.css` once at the document root.
- Missing tokens are proposed and added in `sanctuary-ds/tokens`, never patched locally.

## Phases

### Phase 0: Foundation (internal)

- [x] Single-package architecture with strict TypeScript (TC39 standard decorators), Lit 3, Node 26 Active LTS, and `pnpm`.
- [x] Base primitives (`SanctuaryElement`, idempotent `defineElement`, shared `resetStyles` and `focusStyles`) validated against `@sanctuary-ds/tokens@0.4.0`.
- [x] Quality gates: Biome, minimal ESLint (`lit`/`wc`), Vitest Browser Mode (Playwright Chromium) + `axe-core`, CEM analyzer, committed API report (`api/web-components.api.txt`), and Storybook workbench.
- [x] CI, plain-sentence PR title check, and `release-please` + npm OIDC Trusted Publishing workflows aligned with `sanctuary-ds/tokens`.

### Phase 1: Actions & feedback (`0.1.0`)

- [ ] `<san-button>` (actions, intents, glazing, native form integration)
- [ ] `<san-icon-button>`
- [ ] `<san-chip>` / `<san-badge>`
- [ ] `<san-card>`

### Phase 2: Form controls (`0.2.0`)

- [ ] Shared Form-Associated Custom Element (FACE) controller (`ElementInternals`, constraint validation, form reset/disable)
- [ ] `<san-text-field>`
- [ ] `<san-checkbox>`
- [ ] `<san-radio>` / `<san-radio-group>`
- [ ] `<san-switch>`

### Phase 3: Navigation & overlays (`0.3.0`)

- [ ] `<san-tabs>` / `<san-tab>` / `<san-tab-panel>`
- [ ] `<san-menu>` / `<san-menu-item>` (native Popover / Anchor Positioning)
- [ ] `<san-dialog>` (native `<dialog>` + Top Layer)
- [ ] `<san-tooltip>` (Popover `hint` + accessible fallback)

### Phase 4: Stabilization & `1.0.0`

- [ ] Proven in `sanctuary-ds.github.io` `/components` documentation and live interactive demos.
- [ ] Full Playwright + `axe-core` matrix across `lauds` and `compline` flavors, `forced-colors: active`, and keyboard navigation.
- [ ] Stable public API report with zero unannounced breaking changes.

## Working agreement

- Commits are signed and follow Conventional Commits (`type(scope): subject`), with no emoji.
- Work happens on a branch per phase or work unit and merges through a pull request with a plain-sentence title.
- Feature pull requests never raise the package version; the `release-please` pull request does.
