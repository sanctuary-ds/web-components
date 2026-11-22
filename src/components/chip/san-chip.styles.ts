import { css } from "lit";

/**
 * Visual, geometry, glazing, and interactive state styles for `<san-chip>`
 * bound exclusively to `@sanctuary-ds/tokens@0.4.0`.
 */
export const chipStyles = css`
  :host {
    display: inline-flex;
    vertical-align: middle;
    max-inline-size: 100%;
    -webkit-tap-highlight-color: transparent;

    /* Shared border mix ratios */
    --_soft-border-mix: 24%;
    --_soft-border-hover-mix: 40%;
    --_outlined-border-mix: 48%;

    /* Default intent: neutral */
    --_intent-color: var(--san-text-muted);
    --_intent-ink: var(--san-text);
    --_intent-pane: var(--san-surface-raised-2);
    --_intent-on-pane: var(--san-text);
    --_soft-border: var(--san-lead);
    --_soft-border-hover: var(--san-lead-strong);
    --_outlined-border: var(--san-lead);
    --_outlined-border-hover: var(--san-lead-strong);

    --_glaze-bg: var(--san-surface-inverse);
    --_glaze-bg-hover: color-mix(in oklab, var(--san-surface-inverse) 88%, var(--san-surface));
    --_glaze-fg: var(--san-text-inverse);
    --_glaze-border: transparent;
    --_glaze-sheen: none;
    --_glaze-blur: none;

    /* Selected tinted glass pane (neutral uses accent pane) */
    --_selected-accent: var(--san-accent);
    --_selected-bg: var(--san-accent-pane);
    --_selected-bg-hover: color-mix(in oklab, var(--_selected-bg) 90%, var(--_selected-accent));
    --_selected-fg: var(--san-accent-on-pane);
    --_selected-border: color-mix(in oklab, var(--_selected-accent) 55%, transparent);
    --_selected-border-hover: color-mix(in oklab, var(--_selected-accent) 75%, transparent);

    /* Default size: md (28px) */
    --_height: 1.75rem;
    --_padding-inline: var(--san-space-2-5);
    --_gap: var(--san-space-1-5);
    --_radius: var(--san-radius-md);
    --_font: var(--san-type-label-md);
    --_tracking: var(--san-type-label-md-tracking);
    --_icon-size: 0.875rem;
    --_remove-size: 1.125rem;

    /* Default variant: outlined */
    --_bg: transparent;
    --_bg-hover: transparent;
    --_fg: var(--_intent-ink);
    --_border: var(--_outlined-border);
    --_border-hover: var(--_outlined-border-hover);
    --_bg-image: none;
    --_backdrop-filter: none;
    --_shadow: none;

    /* Tier-5 custom property wiring */
    --_chip-bg: var(--san-chip-bg, var(--_bg));
    --_chip-bg-hover: var(--san-chip-bg-hover, var(--san-chip-bg, var(--_bg-hover)));
    --_chip-fg: var(--san-chip-fg, var(--_fg));
    --_chip-border: var(--san-chip-border, var(--_border));
    --_chip-border-hover: var(--san-chip-border, var(--_border-hover));

    font: var(--san-chip-font, var(--_font));
    letter-spacing: var(--_tracking);
    color: var(--_chip-fg);
  }

  /* Intent mappings */
  :host(
      :is([intent="accent"], [intent="danger"], [intent="warning"], [intent="success"], [intent="info"])
    ) {
    --_soft-border: color-mix(in oklab, var(--_intent-color) var(--_soft-border-mix), transparent);
    --_soft-border-hover: color-mix(
      in oklab,
      var(--_intent-color) var(--_soft-border-hover-mix),
      transparent
    );
    --_outlined-border: color-mix(
      in oklab,
      var(--_intent-color) var(--_outlined-border-mix),
      transparent
    );
    --_outlined-border-hover: var(--_intent-color);
  }

  :host(:is([intent="danger"], [intent="warning"], [intent="success"], [intent="info"])) {
    --_selected-accent: var(--_intent-color);
    --_selected-bg: var(--_intent-pane);
    --_selected-fg: var(--_intent-on-pane);
  }

  :host([intent="accent"]) {
    --_intent-color: var(--san-accent);
    --_intent-ink: var(--san-accent-ink);
    --_intent-pane: var(--san-accent-pane);
    --_intent-on-pane: var(--san-accent-on-pane);

    --_glaze-bg: var(--san-glaze-bg);
    --_glaze-bg-hover: var(--san-glaze-bg-hover);
    --_glaze-fg: var(--san-glaze-fg);
    --_glaze-border: var(--san-glaze-border);
    --_glaze-sheen: var(--san-glaze-sheen);
    --_glaze-blur: var(--san-glaze-blur);
  }

  :host([intent="danger"]) {
    --_intent-color: var(--san-danger);
    --_intent-ink: var(--san-danger-ink);
    --_intent-pane: var(--san-danger-pane);
    --_intent-on-pane: var(--san-danger-on-pane);

    --_glaze-bg: var(--san-danger-glaze-bg);
    --_glaze-bg-hover: var(--san-danger-glaze-bg-hover);
    --_glaze-fg: var(--san-danger-glaze-fg);
    --_glaze-border: var(--san-danger-glaze-border);
    --_glaze-sheen: var(--san-danger-glaze-sheen);
    --_glaze-blur: var(--san-danger-glaze-blur);

    --san-focus-ring-color: var(--san-danger);
    --san-focus-ring: var(--san-focus-ring-width) solid var(--san-focus-ring-color);
  }

  :host([intent="warning"]) {
    --_intent-color: var(--san-warning);
    --_intent-ink: var(--san-warning-ink);
    --_intent-pane: var(--san-warning-pane);
    --_intent-on-pane: var(--san-warning-on-pane);

    --_glaze-bg: var(--san-warning-glaze-bg);
    --_glaze-bg-hover: var(--san-warning-glaze-bg-hover);
    --_glaze-fg: var(--san-warning-glaze-fg);
    --_glaze-border: var(--san-warning-glaze-border);
    --_glaze-sheen: var(--san-warning-glaze-sheen);
    --_glaze-blur: var(--san-warning-glaze-blur);

    --san-focus-ring-color: var(--san-warning);
    --san-focus-ring: var(--san-focus-ring-width) solid var(--san-focus-ring-color);
  }

  :host([intent="success"]) {
    --_intent-color: var(--san-success);
    --_intent-ink: var(--san-success-ink);
    --_intent-pane: var(--san-success-pane);
    --_intent-on-pane: var(--san-success-on-pane);

    --_glaze-bg: var(--san-success-glaze-bg);
    --_glaze-bg-hover: var(--san-success-glaze-bg-hover);
    --_glaze-fg: var(--san-success-glaze-fg);
    --_glaze-border: var(--san-success-glaze-border);
    --_glaze-sheen: var(--san-success-glaze-sheen);
    --_glaze-blur: var(--san-success-glaze-blur);

    --san-focus-ring-color: var(--san-success);
    --san-focus-ring: var(--san-focus-ring-width) solid var(--san-focus-ring-color);
  }

  :host([intent="info"]) {
    --_intent-color: var(--san-info);
    --_intent-ink: var(--san-info-ink);
    --_intent-pane: var(--san-info-pane);
    --_intent-on-pane: var(--san-info-on-pane);

    --_glaze-bg: var(--san-info-glaze-bg);
    --_glaze-bg-hover: var(--san-info-glaze-bg-hover);
    --_glaze-fg: var(--san-info-glaze-fg);
    --_glaze-border: var(--san-info-glaze-border);
    --_glaze-sheen: var(--san-info-glaze-sheen);
    --_glaze-blur: var(--san-info-glaze-blur);

    --san-focus-ring-color: var(--san-info);
    --san-focus-ring: var(--san-focus-ring-width) solid var(--san-focus-ring-color);
  }

  /* Variant mappings */
  :host([variant="soft"]) {
    --_bg: var(--_intent-pane);
    --_bg-hover: var(--_intent-pane);
    --_fg: var(--_intent-on-pane);
    --_border: var(--_soft-border);
    --_border-hover: var(--_soft-border-hover);
    --_bg-image: none;
    --_backdrop-filter: none;
    --_shadow: none;
  }

  :host([variant="filled"]) {
    --_bg: var(--_glaze-bg);
    --_bg-hover: var(--_glaze-bg-hover);
    --_fg: var(--_glaze-fg);
    --_border: var(--_glaze-border);
    --_border-hover: var(--_glaze-border);
    --_bg-image: var(--_glaze-sheen);
    --_backdrop-filter: var(--_glaze-blur);
    --_shadow: none;
  }

  /* Size mappings */
  :host([size="sm"]) {
    --_height: 1.5rem;
    --_padding-inline: var(--san-space-2);
    --_gap: var(--san-space-1);
    --_radius: var(--san-radius-sm);
    --_font: var(--san-type-label-sm);
    --_tracking: var(--san-type-label-sm-tracking);
    --_icon-size: 0.75rem;
    --_remove-size: 1rem;
  }

  :host([size="lg"]) {
    --_height: var(--san-size-control-sm);
    --_padding-inline: var(--san-space-3);
    --_gap: var(--san-space-2);
    --_radius: var(--san-radius-md);
    --_font: var(--san-type-label-lg);
    --_tracking: var(--san-type-label-lg-tracking);
    --_icon-size: var(--san-size-icon-sm);
    --_remove-size: 1.25rem;
  }

  :host([pill]) {
    --_radius: var(--san-radius-full);
  }

  /* Selected state: tinted Sanctuary glass pane */
  :host(:is([selectable][selected], :state(selected)):not([disabled])) {
    --_bg: var(--_selected-bg);
    --_bg-hover: var(--_selected-bg-hover);
    --_fg: var(--_selected-fg);
    --_border: var(--_selected-border);
    --_border-hover: var(--_selected-border-hover);
    --_bg-image: none;
    --_backdrop-filter: none;
    --_shadow: none;

    --_chip-bg: var(--san-chip-selected-bg, var(--_bg));
    --_chip-bg-hover: var(
      --san-chip-selected-bg-hover,
      var(--san-chip-selected-bg, var(--_bg-hover))
    );
    --_chip-fg: var(--san-chip-selected-fg, var(--_fg));
    --_chip-border: var(--san-chip-selected-border, var(--_border));
    --_chip-border-hover: var(--san-chip-selected-border, var(--_border-hover));
  }

  /* Disabled state */
  :host([disabled]) {
    --_bg: var(--san-surface-disabled);
    --_bg-hover: var(--san-surface-disabled);
    --_fg: var(--san-text-disabled);
    --_border: var(--san-border-disabled);
    --_border-hover: var(--san-border-disabled);
    --_bg-image: none;
    --_backdrop-filter: none;
    --_shadow: none;
  }

  :host([variant="outlined"][disabled]:not(:is([selectable][selected], :state(selected)))) {
    --_bg: transparent;
    --_bg-hover: transparent;
  }

  .base {
    position: relative;
    display: inline-flex;
    align-items: center;
    inline-size: 100%;
    min-inline-size: 0;
    min-block-size: var(--san-chip-height, var(--_height));
    border: var(--san-border-width-hairline) solid var(--_chip-border);
    border-radius: var(--san-chip-radius, var(--_radius));
    background-color: var(--_chip-bg);
    background-image: var(--_bg-image);
    backdrop-filter: var(--_backdrop-filter);
    box-shadow: var(--_shadow);
    color: inherit;
    font: inherit;
    letter-spacing: inherit;
    user-select: none;
    transition:
      background-color var(--san-duration-fast) var(--san-ease-standard),
      border-color var(--san-duration-fast) var(--san-ease-standard),
      color var(--san-duration-fast) var(--san-ease-standard),
      box-shadow var(--san-duration-fast) var(--san-ease-standard),
      translate var(--san-duration-fast) var(--san-ease-standard);
  }

  :host([removable]) .base {
    padding-inline-end: var(--san-space-1);
  }

  .action,
  .content {
    position: relative;
    display: inline-flex;
    align-items: center;
    flex: 1 1 auto;
    min-inline-size: 0;
    min-block-size: calc(var(--san-chip-height, var(--_height)) - 2 * var(--san-border-width-hairline));
    padding-block: 0;
    padding-inline: var(--san-chip-padding-inline, var(--_padding-inline));
    gap: var(--san-chip-gap, var(--_gap));
    border-radius: inherit;
    color: inherit;
    font: inherit;
    letter-spacing: inherit;
  }

  :host([removable]) .action,
  :host([removable]) .content {
    padding-inline-end: var(--san-space-1);
  }

  .action {
    margin: 0;
    border: 0;
    background: transparent;
    appearance: none;
    text-align: start;
    cursor: pointer;
  }

  .action::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background-color: transparent;
    pointer-events: none;
    transition: background-color var(--san-duration-fast) var(--san-ease-standard);
  }

  :host(:not([disabled])) .base:has(.action:hover) {
    background-color: var(--_chip-bg-hover);
    border-color: var(--_chip-border-hover);
  }

  :host(:not([disabled]):not([variant="filled"]):not(:state(selected)))
    .action:hover::before {
    background-color: var(--san-state-layer-hover);
  }

  :host(:not([disabled])) .base:has(.action:active) {
    translate: 0 1px;
    transition-duration: var(--san-duration-instant);
  }

  :host(:not([disabled])) .action:active::before {
    background-color: var(--san-state-layer-pressed);
  }

  :host([disabled]) .action,
  :host([disabled]) .remove {
    cursor: not-allowed;
  }

  .checkmark,
  .start,
  .end {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    font-size: var(--san-chip-icon-size, var(--_icon-size));
    line-height: 1;
  }

  .checkmark-icon {
    inline-size: var(--san-chip-icon-size, var(--_icon-size));
    block-size: var(--san-chip-icon-size, var(--_icon-size));
    flex-shrink: 0;
  }

  .start ::slotted(*),
  .end ::slotted(*) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    inline-size: var(--san-chip-icon-size, var(--_icon-size));
    block-size: var(--san-chip-icon-size, var(--_icon-size));
    flex-shrink: 0;
  }

  .label {
    display: block;
    flex: 1 1 auto;
    min-inline-size: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .remove {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    inline-size: var(--_remove-size);
    block-size: var(--_remove-size);
    margin: 0;
    padding: 0;
    border: 0;
    border-radius: var(--san-radius-full);
    background: transparent;
    color: inherit;
    appearance: none;
    cursor: pointer;
    transition: background-color var(--san-duration-fast) var(--san-ease-standard);
  }

  :host(:not([disabled])) .remove:hover {
    background-color: var(--san-state-layer-hover);
  }

  :host(:not([disabled])) .remove:active {
    background-color: var(--san-state-layer-pressed);
  }

  .remove-icon {
    inline-size: calc(var(--san-chip-icon-size, var(--_icon-size)) * 0.875);
    block-size: calc(var(--san-chip-icon-size, var(--_icon-size)) * 0.875);
    flex-shrink: 0;
  }

  @media (prefers-reduced-motion: reduce) {
    .base,
    .action::before,
    .remove {
      transition: none;
    }

    :host(:not([disabled])) .base:has(.action:active) {
      translate: none !important;
    }
  }

  @media (forced-colors: active) {
    .base {
      border-color: CanvasText;
    }

    :host(:is([selectable][selected], :state(selected)):not([disabled])) .base {
      forced-color-adjust: none;
      background-color: Highlight;
      color: HighlightText;
      border: var(--san-border-width-came) solid Highlight;
    }

    :host([disabled]) .base {
      border-color: GrayText;
      color: GrayText;
    }
  }
`;
