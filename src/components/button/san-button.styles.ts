import { css } from "lit";

/**
 * Styles for `<san-button>` bound exclusively to `@sanctuary-ds/tokens@0.4.0`.
 */
export const buttonStyles = css`
  :host {
    display: inline-flex;
    vertical-align: middle;
    -webkit-tap-highlight-color: transparent;

    /* Default intent: accent */
    --_intent-color: var(--san-accent);
    --_intent-ink: var(--san-accent-ink);
    --_intent-pane: var(--san-accent-pane);
    --_intent-on-pane: var(--san-accent-on-pane);
    --_intent-cast-md: var(--san-cast-md);

    --_glaze-bg: var(--san-glaze-bg);
    --_glaze-bg-hover: var(--san-glaze-bg-hover);
    --_glaze-fg: var(--san-glaze-fg);
    --_glaze-border: var(--san-glaze-border);
    --_glaze-sheen: var(--san-glaze-sheen);
    --_glaze-glow: var(--san-glaze-glow);
    --_glaze-blur: var(--san-glaze-blur);

    --_non-filled-fg: var(--san-text);

    /* Default size: md */
    --_height: var(--san-size-control-md);
    --_padding-block: var(--san-space-1-5);
    --_padding-inline: var(--san-space-4);
    --_radius: var(--san-radius-md);
    --_font: var(--san-type-label-lg);
    --_tracking: var(--san-type-label-lg-tracking);
    --_icon-size: var(--san-size-icon-md);

    /* Default variant: filled */
    --_bg: var(--_glaze-bg);
    --_bg-hover: var(--_glaze-bg-hover);
    --_fg: var(--_glaze-fg);
    --_border: var(--_glaze-border);
    --_border-hover: var(--_glaze-border);
    --_bg-image: var(--_glaze-sheen);
    --_backdrop-filter: var(--_glaze-blur);
    --_shadow: var(--_glaze-glow), var(--san-elevation-1);
    --_shadow-hover: var(--_intent-cast-md), var(--san-elevation-2);

    font: var(--san-button-font, var(--_font));
    letter-spacing: var(--_tracking);
    color: var(--san-button-fg, var(--_fg));
  }

  /* Intent mappings */
  :host([intent="danger"]) {
    --_intent-color: var(--san-danger);
    --_intent-ink: var(--san-danger-ink);
    --_intent-pane: var(--san-danger-pane);
    --_intent-on-pane: var(--san-danger-on-pane);
    --_intent-cast-md: var(--san-danger-cast-md);

    --_glaze-bg: var(--san-danger-glaze-bg);
    --_glaze-bg-hover: var(--san-danger-glaze-bg-hover);
    --_glaze-fg: var(--san-danger-glaze-fg);
    --_glaze-border: var(--san-danger-glaze-border);
    --_glaze-sheen: var(--san-danger-glaze-sheen);
    --_glaze-glow: var(--san-danger-glaze-glow);
    --_glaze-blur: var(--san-danger-glaze-blur);

    --_non-filled-fg: var(--san-danger-ink);
    --san-focus-ring-color: var(--san-danger);
    --san-focus-ring: var(--san-focus-ring-width) solid var(--san-focus-ring-color);
  }

  :host([intent="warning"]) {
    --_intent-color: var(--san-warning);
    --_intent-ink: var(--san-warning-ink);
    --_intent-pane: var(--san-warning-pane);
    --_intent-on-pane: var(--san-warning-on-pane);
    --_intent-cast-md: var(--san-warning-cast-md);

    --_glaze-bg: var(--san-warning-glaze-bg);
    --_glaze-bg-hover: var(--san-warning-glaze-bg-hover);
    --_glaze-fg: var(--san-warning-glaze-fg);
    --_glaze-border: var(--san-warning-glaze-border);
    --_glaze-sheen: var(--san-warning-glaze-sheen);
    --_glaze-glow: var(--san-warning-glaze-glow);
    --_glaze-blur: var(--san-warning-glaze-blur);

    --_non-filled-fg: var(--san-warning-ink);
    --san-focus-ring-color: var(--san-warning);
    --san-focus-ring: var(--san-focus-ring-width) solid var(--san-focus-ring-color);
  }

  :host([intent="success"]) {
    --_intent-color: var(--san-success);
    --_intent-ink: var(--san-success-ink);
    --_intent-pane: var(--san-success-pane);
    --_intent-on-pane: var(--san-success-on-pane);
    --_intent-cast-md: var(--san-success-cast-md);

    --_glaze-bg: var(--san-success-glaze-bg);
    --_glaze-bg-hover: var(--san-success-glaze-bg-hover);
    --_glaze-fg: var(--san-success-glaze-fg);
    --_glaze-border: var(--san-success-glaze-border);
    --_glaze-sheen: var(--san-success-glaze-sheen);
    --_glaze-glow: var(--san-success-glaze-glow);
    --_glaze-blur: var(--san-success-glaze-blur);

    --_non-filled-fg: var(--san-success-ink);
    --san-focus-ring-color: var(--san-success);
    --san-focus-ring: var(--san-focus-ring-width) solid var(--san-focus-ring-color);
  }

  :host([intent="info"]) {
    --_intent-color: var(--san-info);
    --_intent-ink: var(--san-info-ink);
    --_intent-pane: var(--san-info-pane);
    --_intent-on-pane: var(--san-info-on-pane);
    --_intent-cast-md: var(--san-info-cast-md);

    --_glaze-bg: var(--san-info-glaze-bg);
    --_glaze-bg-hover: var(--san-info-glaze-bg-hover);
    --_glaze-fg: var(--san-info-glaze-fg);
    --_glaze-border: var(--san-info-glaze-border);
    --_glaze-sheen: var(--san-info-glaze-sheen);
    --_glaze-glow: var(--san-info-glaze-glow);
    --_glaze-blur: var(--san-info-glaze-blur);

    --_non-filled-fg: var(--san-info-ink);
    --san-focus-ring-color: var(--san-info);
    --san-focus-ring: var(--san-focus-ring-width) solid var(--san-focus-ring-color);
  }

  /* Variant mappings */
  :host([variant="soft"]) {
    --_bg: var(--_intent-pane);
    --_bg-hover: var(--_intent-pane);
    --_fg: var(--_intent-on-pane);
    --_border: color-mix(in oklab, var(--_intent-color) 22%, transparent);
    --_border-hover: color-mix(in oklab, var(--_intent-color) 38%, transparent);
    --_bg-image: none;
    --_backdrop-filter: none;
    --_shadow: none;
    --_shadow-hover: none;
  }

  :host([variant="outlined"]) {
    --_bg: transparent;
    --_bg-hover: transparent;
    --_fg: var(--_non-filled-fg);
    --_border: var(--san-lead-strong);
    --_border-hover: var(--_intent-color);
    --_bg-image: none;
    --_backdrop-filter: none;
    --_shadow: none;
    --_shadow-hover: none;
  }

  :host([variant="ghost"]) {
    --_bg: transparent;
    --_bg-hover: transparent;
    --_fg: var(--_intent-ink);
    --_border: transparent;
    --_border-hover: transparent;
    --_bg-image: none;
    --_backdrop-filter: none;
    --_shadow: none;
    --_shadow-hover: none;
  }

  /* Size mappings */
  :host([size="sm"]) {
    --_height: var(--san-size-control-sm);
    --_padding-block: var(--san-space-1);
    --_padding-inline: var(--san-space-3);
    --_radius: var(--san-radius-sm);
    --_font: var(--san-type-label-md);
    --_tracking: var(--san-type-label-md-tracking);
    --_icon-size: var(--san-size-icon-sm);
  }

  :host([size="lg"]) {
    --_height: var(--san-size-control-lg);
    --_padding-block: var(--san-space-2-5);
    --_padding-inline: var(--san-space-5);
    --_radius: var(--san-radius-md);
    --_font: var(--san-type-title-md);
    --_tracking: var(--san-type-title-md-tracking);
    --_icon-size: var(--san-size-icon-lg);
  }

  :host([pill]) {
    --_radius: var(--san-radius-full);
  }

  /* Disabled mappings (host attribute or ancestor disabled fieldset) */
  :host([disabled]),
  :host(:disabled) {
    --_bg: var(--san-surface-disabled);
    --_bg-hover: var(--san-surface-disabled);
    --_fg: var(--san-text-disabled);
    --_border: var(--san-border-disabled);
    --_border-hover: var(--san-border-disabled);
    --_bg-image: none;
    --_backdrop-filter: none;
    --_shadow: none;
    --_shadow-hover: none;
  }

  :host([variant="outlined"]:is([disabled], :disabled)) {
    --_bg: transparent;
    --_bg-hover: transparent;
  }

  :host([variant="ghost"]:is([disabled], :disabled)) {
    --_bg: transparent;
    --_bg-hover: transparent;
    --_border: transparent;
    --_border-hover: transparent;
  }

  .control {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    min-inline-size: 0;
    min-block-size: var(--san-button-height, var(--_height));
    padding-block: var(--san-button-padding-block, var(--_padding-block));
    padding-inline: var(--san-button-padding-inline, var(--_padding-inline));
    gap: var(--san-button-gap, var(--san-space-2));
    margin: 0;
    border: var(--san-border-width-hairline) solid var(--san-button-border, var(--_border));
    border-radius: var(--san-button-radius, var(--_radius));
    background-color: var(--san-button-bg, var(--_bg));
    background-image: var(--_bg-image);
    backdrop-filter: var(--_backdrop-filter);
    box-shadow: var(--_shadow);
    color: inherit;
    font: inherit;
    letter-spacing: inherit;
    text-align: center;
    text-decoration: none;
    white-space: normal;
    appearance: none;
    cursor: pointer;
    user-select: none;
    transition:
      background-color var(--san-duration-fast) var(--san-ease-standard),
      border-color var(--san-duration-fast) var(--san-ease-standard),
      color var(--san-duration-fast) var(--san-ease-standard),
      box-shadow var(--san-duration-fast) var(--san-ease-standard),
      translate var(--san-duration-fast) var(--san-ease-standard);
  }

  .control::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background-color: transparent;
    pointer-events: none;
    transition: background-color var(--san-duration-fast) var(--san-ease-standard);
  }

  :host(:not([disabled]):not(:disabled):not(:state(loading))) .control:hover {
    background-color: var(--san-button-bg-hover, var(--_bg-hover));
    border-color: var(--san-button-border, var(--_border-hover));
    box-shadow: var(--_shadow-hover);
  }

  :host(:not([disabled]):not(:disabled):not(:state(loading)):is([variant="soft"], [variant="outlined"], [variant="ghost"]))
    .control:hover::before {
    background-color: var(--san-state-layer-hover);
  }

  :host(:not([disabled]):not(:disabled):not(:state(loading))) .control:active {
    translate: 0 1px;
    box-shadow: var(--_shadow);
    transition-duration: var(--san-duration-instant);
  }

  :host(:not([disabled]):not(:disabled):not(:state(loading))) .control:active::before {
    background-color: var(--san-state-layer-pressed);
  }

  :host(:is([disabled], :disabled)) .control {
    cursor: not-allowed;
  }

  :host(:state(loading)) .control {
    cursor: progress;
  }

  :host(:state(loading)) .start,
  :host(:state(loading)) .label,
  :host(:state(loading)) .end {
    opacity: 0;
  }

  .start,
  .end {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    font-size: var(--_icon-size);
    line-height: 1;
  }

  .start ::slotted(*),
  .end ::slotted(*) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    inline-size: var(--_icon-size);
    block-size: var(--_icon-size);
    flex-shrink: 0;
  }

  .label {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-inline-size: 0;
  }

  .spinner {
    position: absolute;
    inset-block-start: 50%;
    inset-inline-start: 50%;
    inline-size: var(--_icon-size);
    block-size: var(--_icon-size);
    transform: translate(-50%, -50%);
    border: var(--san-border-width-came) solid currentColor;
    border-block-start-color: transparent;
    border-radius: var(--san-radius-full);
    animation: san-button-spin var(--san-duration-procession) var(--san-ease-linear) infinite;
    pointer-events: none;
  }

  @keyframes san-button-spin {
    to {
      transform: translate(-50%, -50%) rotate(360deg);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .control,
    .control::before {
      transition: none;
    }

    .control:active {
      translate: none !important;
    }

    .spinner {
      animation: none;
    }
  }
`;
