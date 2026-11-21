import { css } from "lit";

/**
 * Layout and geometry styles for `<san-button>` bound to `@sanctuary-ds/tokens@0.4.0`.
 */
export const buttonStyles = css`
  :host {
    /* Default size: md */
    --_height: var(--san-size-control-md);
    --_padding-block: var(--san-space-1-5);
    --_padding-inline: var(--san-space-4);
    --_font: var(--san-type-label-lg);
    --_tracking: var(--san-type-label-lg-tracking);

    --_btn-bg: var(--san-button-bg, var(--_bg));
    --_btn-bg-hover: var(--san-button-bg-hover, var(--_bg-hover));
    --_btn-fg: var(--san-button-fg, var(--_fg));
    --_btn-border: var(--san-button-border, var(--_border));
    --_btn-border-hover: var(--san-button-border, var(--_border-hover));
    --_btn-radius: var(--san-button-radius, var(--_radius));

    font: var(--san-button-font, var(--_font));
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

  .control {
    min-block-size: var(--san-button-height, var(--_height));
    padding-block: var(--san-button-padding-block, var(--_padding-block));
    padding-inline: var(--san-button-padding-inline, var(--_padding-inline));
    gap: var(--san-button-gap, var(--san-space-2));
    text-align: center;
    white-space: normal;
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
`;
