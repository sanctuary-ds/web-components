import { css } from "lit";

/**
 * Visual, geometry, and token styles for `<san-badge>`
 * bound exclusively to `@sanctuary-ds/tokens@0.4.0`.
 */
export const badgeStyles = css`
  :host {
    display: inline-flex;
    vertical-align: middle;

    /* Default intent: neutral */
    --_intent-color: var(--san-text-muted);
    --_intent-ink: var(--san-text);
    --_intent-pane: var(--san-surface-raised-2);
    --_intent-on-pane: var(--san-text);
    --_soft-border: var(--san-lead);
    --_outlined-border: var(--san-lead-strong);

    --_glaze-bg: var(--san-surface-inverse);
    --_glaze-fg: var(--san-text-inverse);
    --_glaze-border: transparent;
    --_glaze-sheen: none;
    --_glaze-glow: none;
    --_glaze-blur: none;

    /* Default size: md */
    --_height: 1.5rem;
    --_padding-inline: var(--san-space-2);
    --_gap: var(--san-space-1-5);
    --_radius: var(--san-radius-sm);
    --_font: var(--san-type-label-md);
    --_tracking: var(--san-type-label-md-tracking);
    --_icon-size: 0.875rem;
    --_dot-size: 0.5rem;

    /* Default variant: soft */
    --_bg: var(--_intent-pane);
    --_fg: var(--_intent-on-pane);
    --_border: var(--_soft-border);
    --_bg-image: none;
    --_backdrop-filter: none;
    --_shadow: none;
    --_dot-color: var(--_intent-color);

    font: var(--san-badge-font, var(--_font));
    letter-spacing: var(--_tracking);
    color: var(--san-badge-fg, var(--_fg));
  }

  /* Intent mappings */
  :host([intent="accent"]) {
    --_intent-color: var(--san-accent);
    --_intent-ink: var(--san-accent-ink);
    --_intent-pane: var(--san-accent-pane);
    --_intent-on-pane: var(--san-accent-on-pane);
    --_soft-border: color-mix(in oklab, var(--_intent-color) 24%, transparent);
    --_outlined-border: color-mix(in oklab, var(--_intent-color) 55%, transparent);

    --_glaze-bg: var(--san-glaze-bg);
    --_glaze-fg: var(--san-glaze-fg);
    --_glaze-border: var(--san-glaze-border);
    --_glaze-sheen: var(--san-glaze-sheen);
    --_glaze-glow: var(--san-glaze-glow);
    --_glaze-blur: var(--san-glaze-blur);
  }

  :host([intent="danger"]) {
    --_intent-color: var(--san-danger);
    --_intent-ink: var(--san-danger-ink);
    --_intent-pane: var(--san-danger-pane);
    --_intent-on-pane: var(--san-danger-on-pane);
    --_soft-border: color-mix(in oklab, var(--_intent-color) 24%, transparent);
    --_outlined-border: color-mix(in oklab, var(--_intent-color) 55%, transparent);

    --_glaze-bg: var(--san-danger-glaze-bg);
    --_glaze-fg: var(--san-danger-glaze-fg);
    --_glaze-border: var(--san-danger-glaze-border);
    --_glaze-sheen: var(--san-danger-glaze-sheen);
    --_glaze-glow: var(--san-danger-glaze-glow);
    --_glaze-blur: var(--san-danger-glaze-blur);
  }

  :host([intent="warning"]) {
    --_intent-color: var(--san-warning);
    --_intent-ink: var(--san-warning-ink);
    --_intent-pane: var(--san-warning-pane);
    --_intent-on-pane: var(--san-warning-on-pane);
    --_soft-border: color-mix(in oklab, var(--_intent-color) 24%, transparent);
    --_outlined-border: color-mix(in oklab, var(--_intent-color) 55%, transparent);

    --_glaze-bg: var(--san-warning-glaze-bg);
    --_glaze-fg: var(--san-warning-glaze-fg);
    --_glaze-border: var(--san-warning-glaze-border);
    --_glaze-sheen: var(--san-warning-glaze-sheen);
    --_glaze-glow: var(--san-warning-glaze-glow);
    --_glaze-blur: var(--san-warning-glaze-blur);
  }

  :host([intent="success"]) {
    --_intent-color: var(--san-success);
    --_intent-ink: var(--san-success-ink);
    --_intent-pane: var(--san-success-pane);
    --_intent-on-pane: var(--san-success-on-pane);
    --_soft-border: color-mix(in oklab, var(--_intent-color) 24%, transparent);
    --_outlined-border: color-mix(in oklab, var(--_intent-color) 55%, transparent);

    --_glaze-bg: var(--san-success-glaze-bg);
    --_glaze-fg: var(--san-success-glaze-fg);
    --_glaze-border: var(--san-success-glaze-border);
    --_glaze-sheen: var(--san-success-glaze-sheen);
    --_glaze-glow: var(--san-success-glaze-glow);
    --_glaze-blur: var(--san-success-glaze-blur);
  }

  :host([intent="info"]) {
    --_intent-color: var(--san-info);
    --_intent-ink: var(--san-info-ink);
    --_intent-pane: var(--san-info-pane);
    --_intent-on-pane: var(--san-info-on-pane);
    --_soft-border: color-mix(in oklab, var(--_intent-color) 24%, transparent);
    --_outlined-border: color-mix(in oklab, var(--_intent-color) 55%, transparent);

    --_glaze-bg: var(--san-info-glaze-bg);
    --_glaze-fg: var(--san-info-glaze-fg);
    --_glaze-border: var(--san-info-glaze-border);
    --_glaze-sheen: var(--san-info-glaze-sheen);
    --_glaze-glow: var(--san-info-glaze-glow);
    --_glaze-blur: var(--san-info-glaze-blur);
  }

  /* Variant mappings */
  :host([variant="filled"]) {
    --_bg: var(--_glaze-bg);
    --_fg: var(--_glaze-fg);
    --_border: var(--_glaze-border);
    --_bg-image: var(--_glaze-sheen);
    --_backdrop-filter: var(--_glaze-blur);
    --_shadow: var(--_glaze-glow);
  }

  :host([variant="outlined"]) {
    --_bg: transparent;
    --_fg: var(--_intent-ink);
    --_border: var(--_outlined-border);
    --_bg-image: none;
    --_backdrop-filter: none;
    --_shadow: none;
  }

  /* Size mappings */
  :host([size="sm"]) {
    --_height: 1.25rem;
    --_padding-inline: var(--san-space-1-5);
    --_gap: var(--san-space-1);
    --_radius: var(--san-radius-xs);
    --_font: var(--san-type-label-sm);
    --_tracking: var(--san-type-label-sm-tracking);
    --_icon-size: 0.75rem;
    --_dot-size: 0.375rem;
  }

  :host([size="lg"]) {
    --_height: 1.75rem;
    --_padding-inline: var(--san-space-2-5);
    --_gap: var(--san-space-1-5);
    --_radius: var(--san-radius-sm);
    --_font: var(--san-type-label-lg);
    --_tracking: var(--san-type-label-lg-tracking);
    --_icon-size: 1rem;
    --_dot-size: 0.5rem;
  }

  :host([pill]) {
    --_radius: var(--san-radius-full);
  }

  .base {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    inline-size: 100%;
    min-inline-size: 0;
    min-block-size: var(--san-badge-height, var(--_height));
    padding-block: 0;
    padding-inline: var(--san-badge-padding-inline, var(--_padding-inline));
    gap: var(--san-badge-gap, var(--_gap));
    border: var(--san-border-width-hairline) solid var(--san-badge-border, var(--_border));
    border-radius: var(--san-badge-radius, var(--_radius));
    background-color: var(--san-badge-bg, var(--_bg));
    background-image: var(--_bg-image);
    backdrop-filter: var(--_backdrop-filter);
    box-shadow: var(--_shadow);
    color: inherit;
    font: inherit;
    letter-spacing: inherit;
    user-select: none;
  }

  .dot {
    display: inline-block;
    flex-shrink: 0;
    inline-size: var(--san-badge-dot-size, var(--_dot-size));
    block-size: var(--san-badge-dot-size, var(--_dot-size));
    border-radius: var(--san-radius-full);
    background-color: var(--_dot-color);
  }

  :host([variant="filled"]:not(:state(dot-only))) .dot {
    background-color: currentColor;
  }

  .start,
  .end {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    font-size: var(--san-badge-icon-size, var(--_icon-size));
    line-height: 1;
  }

  .start ::slotted(*),
  .end ::slotted(*) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    inline-size: var(--san-badge-icon-size, var(--_icon-size));
    block-size: var(--san-badge-icon-size, var(--_icon-size));
    flex-shrink: 0;
  }

  .label {
    display: block;
    min-inline-size: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-variant-numeric: tabular-nums;
  }

  :host(:state(dot-only)) .base {
    inline-size: var(--san-badge-dot-size, var(--_dot-size));
    block-size: var(--san-badge-dot-size, var(--_dot-size));
    min-block-size: 0;
    padding: 0;
    gap: 0;
    border-width: 0;
    border-radius: var(--san-radius-full);
    background-color: transparent;
    background-image: none;
    backdrop-filter: none;
    box-shadow: none;
  }

  @media (forced-colors: active) {
    .base {
      border-color: CanvasText;
    }

    :host(:state(dot-only)) .base {
      border-width: 0;
    }

    .dot {
      forced-color-adjust: none;
      background-color: CanvasText;
    }
  }
`;
