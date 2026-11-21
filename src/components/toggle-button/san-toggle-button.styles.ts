import { css } from "lit";

/**
 * Layout, geometry, and pressed-state styles for `<san-toggle-button>`
 * bound exclusively to `@sanctuary-ds/tokens@0.4.0`.
 */
export const toggleButtonStyles = css`
  :host {
    /* Default variant: outlined */
    --_bg: transparent;
    --_bg-hover: transparent;
    --_fg: var(--_non-filled-fg);
    --_border: var(--san-lead-strong);
    --_border-hover: var(--_intent-color);
    --_bg-image: none;
    --_backdrop-filter: none;
    --_shadow: none;
    --_shadow-hover: none;

    /* Default size: md */
    --_height: var(--san-size-control-md);
    --_padding-block: var(--san-space-1-5);
    --_padding-inline: var(--san-space-4);
    --_font: var(--san-type-label-lg);
    --_tracking: var(--san-type-label-lg-tracking);

    /* Tier-5 custom property wiring */
    --_btn-bg: var(--san-toggle-button-bg, var(--_bg));
    --_btn-bg-hover: var(--san-toggle-button-bg-hover, var(--_bg-hover));
    --_btn-fg: var(--san-toggle-button-fg, var(--_fg));
    --_btn-border: var(--san-toggle-button-border, var(--_border));
    --_btn-border-hover: var(--san-toggle-button-border, var(--_border-hover));
    --_btn-radius: var(--san-toggle-button-radius, var(--_radius));

    font: var(--san-toggle-button-font, var(--_font));
    letter-spacing: var(--_tracking);
  }

  /* Size mappings */
  :host([size="sm"]) {
    --_height: var(--san-size-control-sm);
    --_padding-block: var(--san-space-1);
    --_padding-inline: var(--san-space-3);
    --_font: var(--san-type-label-md);
    --_tracking: var(--san-type-label-md-tracking);
  }

  :host([size="lg"]) {
    --_height: var(--san-size-control-lg);
    --_padding-block: var(--san-space-2-5);
    --_padding-inline: var(--san-space-5);
    --_font: var(--san-type-title-md);
    --_tracking: var(--san-type-title-md-tracking);
  }

  /* Pressed state: illuminated Sanctuary glazing across all flavors & glazings */
  :host(:is([pressed], :state(pressed)):not([disabled])) {
    --_bg: var(--_glaze-bg);
    --_bg-hover: var(--_glaze-bg-hover);
    --_fg: var(--_glaze-fg);
    --_border: var(--_glaze-border);
    --_border-hover: var(--_glaze-border);
    --_bg-image: var(--_glaze-sheen);
    --_backdrop-filter: var(--_glaze-blur);
    --_shadow: var(--_glaze-glow), var(--san-elevation-1);
    --_shadow-hover: var(--_intent-cast-md), var(--san-elevation-2);

    --_btn-bg: var(--san-toggle-button-pressed-bg, var(--_bg));
    --_btn-bg-hover: var(--san-toggle-button-pressed-bg-hover, var(--_bg-hover));
    --_btn-fg: var(--san-toggle-button-pressed-fg, var(--_fg));
    --_btn-border: var(--san-toggle-button-pressed-border, var(--_border));
    --_btn-border-hover: var(--san-toggle-button-pressed-border, var(--_border-hover));
  }

  /* Disabled + pressed keeps a subtle filled disabled surface so pressed state stays distinguishable */
  :host(:is([pressed], :state(pressed))[disabled]) {
    --_bg: var(--san-surface-disabled);
    --_bg-hover: var(--san-surface-disabled);
    --_fg: var(--san-text-disabled);
    --_border: var(--san-border-disabled);
    --_border-hover: var(--san-border-disabled);
  }

  .control {
    min-inline-size: var(--san-toggle-button-height, var(--_height));
    min-block-size: var(--san-toggle-button-height, var(--_height));
    padding-block: var(--san-toggle-button-padding-block, var(--_padding-block));
    padding-inline: var(--san-toggle-button-padding-inline, var(--_padding-inline));
    gap: var(--san-toggle-button-gap, var(--san-space-2));
    border-start-start-radius: var(--_san-toggle-button-radius-ss, var(--_btn-radius, var(--_radius)));
    border-start-end-radius: var(--_san-toggle-button-radius-se, var(--_btn-radius, var(--_radius)));
    border-end-start-radius: var(--_san-toggle-button-radius-es, var(--_btn-radius, var(--_radius)));
    border-end-end-radius: var(--_san-toggle-button-radius-ee, var(--_btn-radius, var(--_radius)));
    text-align: center;
    white-space: normal;
  }

  /* Glazed pressed surface already uses --_glaze-bg-hover; avoid double darkening via state layer */
  :host(:is([pressed], :state(pressed)):not([disabled])) .control:hover::before {
    background-color: transparent;
  }

  .start,
  .end {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    font-size: var(--san-toggle-button-icon-size, var(--_icon-size));
    line-height: 1;
  }

  .start ::slotted(*),
  .end ::slotted(*) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    inline-size: var(--san-toggle-button-icon-size, var(--_icon-size));
    block-size: var(--san-toggle-button-icon-size, var(--_icon-size));
    flex-shrink: 0;
  }

  .label {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-inline-size: 0;
  }

  /* Auto-detected icon-only state: strict 1:1 square dimensions matching <san-icon-button> */
  :host(:state(icon-only)) .control {
    inline-size: var(--san-toggle-button-height, var(--_height));
    block-size: var(--san-toggle-button-height, var(--_height));
    padding: 0;
    gap: 0;
  }

  :host(:state(icon-only)) .label {
    font-size: var(--san-toggle-button-icon-size, var(--_icon-size));
    line-height: 1;
  }

  :host(:state(icon-only)) .label ::slotted(*) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    inline-size: var(--san-toggle-button-icon-size, var(--_icon-size));
    block-size: var(--san-toggle-button-icon-size, var(--_icon-size));
    flex-shrink: 0;
  }

  @media (forced-colors: active) {
    :host(:is([pressed], :state(pressed)):not([disabled])) .control {
      forced-color-adjust: none;
      background-color: Highlight;
      color: HighlightText;
      border: var(--san-border-width-came) solid Highlight;
    }
  }
`;
