import { css } from "lit";

/**
 * Layout and square geometry styles for `<san-icon-button>`
 * bound exclusively to `@sanctuary-ds/tokens@0.4.0`.
 */
export const iconButtonStyles = css`
  :host {
    /* Default size: md (40x40 square) */
    --_size: var(--san-size-control-md);

    --_btn-bg: var(--san-icon-button-bg, var(--_bg));
    --_btn-bg-hover: var(--san-icon-button-bg-hover, var(--_bg-hover));
    --_btn-fg: var(--san-icon-button-fg, var(--_fg));
    --_btn-border: var(--san-icon-button-border, var(--_border));
    --_btn-border-hover: var(--san-icon-button-border, var(--_border-hover));
    --_btn-radius: var(--san-icon-button-radius, var(--_radius));
  }

  /* Square size mappings */
  :host([size="sm"]) {
    --_size: var(--san-size-control-sm);
  }

  :host([size="lg"]) {
    --_size: var(--san-size-control-lg);
  }

  .control {
    inline-size: var(--san-icon-button-size, var(--_size));
    block-size: var(--san-icon-button-size, var(--_size));
    padding: 0;
    flex-shrink: 0;
  }

  .icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    font-size: var(--san-icon-button-icon-size, var(--_icon-size));
    line-height: 1;
  }

  .icon ::slotted(*) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    inline-size: var(--san-icon-button-icon-size, var(--_icon-size));
    block-size: var(--san-icon-button-icon-size, var(--_icon-size));
    flex-shrink: 0;
  }

  :host(:state(loading)) .icon {
    opacity: 0;
  }

  .spinner {
    inline-size: var(--san-icon-button-icon-size, var(--_icon-size));
    block-size: var(--san-icon-button-icon-size, var(--_icon-size));
  }
`;
