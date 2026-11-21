import { css } from "lit";

/**
 * Layout, attached seam collapsing, logical outer corner rounding, and z-index
 * layering styles for `<san-toggle-button-group>` bound exclusively to
 * `@sanctuary-ds/tokens@0.4.0`.
 */
export const toggleButtonGroupStyles = css`
  :host {
    display: inline-flex;
    vertical-align: middle;

    --_radius: var(--san-radius-md);
    --_group-radius: var(--san-toggle-button-group-radius, var(--_radius));
  }

  :host([size="sm"]) {
    --_radius: var(--san-radius-sm);
  }

  :host([size="lg"]) {
    --_radius: var(--san-radius-md);
  }

  :host([pill]) {
    --_radius: var(--san-radius-full);
  }

  .group {
    display: inline-flex;
    flex-direction: row;
    align-items: stretch;
    gap: 0;
  }

  :host([orientation="vertical"]) .group {
    flex-direction: column;
  }

  :host([separated]) .group {
    gap: var(--san-toggle-button-group-gap, var(--san-space-2));
  }

  /* Attached mode: collapse inner corners and elevate active/hovered/focused seams */
  :host(:not([separated])) ::slotted(san-toggle-button) {
    position: relative;
    z-index: 0;
    --_san-toggle-button-radius-ss: 0px;
    --_san-toggle-button-radius-se: 0px;
    --_san-toggle-button-radius-es: 0px;
    --_san-toggle-button-radius-ee: 0px;
  }

  :host(:not([separated])) ::slotted(san-toggle-button[pressed]) {
    z-index: 1;
  }

  :host(:not([separated])) ::slotted(san-toggle-button:hover) {
    z-index: 2;
  }

  :host(:not([separated])) ::slotted(san-toggle-button:focus-within) {
    z-index: 3;
  }

  /* Horizontal attached outer corners (logical properties mirror automatically in RTL) */
  :host(:not([separated]):not([orientation="vertical"]))
    ::slotted(san-toggle-button:first-of-type) {
    --_san-toggle-button-radius-ss: var(--_group-radius);
    --_san-toggle-button-radius-es: var(--_group-radius);
  }

  :host(:not([separated]):not([orientation="vertical"]))
    ::slotted(san-toggle-button:last-of-type) {
    --_san-toggle-button-radius-se: var(--_group-radius);
    --_san-toggle-button-radius-ee: var(--_group-radius);
  }

  :host(:not([separated]):not([orientation="vertical"]))
    ::slotted(san-toggle-button:not(:first-of-type)) {
    margin-inline-start: calc(-1 * var(--san-border-width-hairline));
  }

  /* Vertical attached outer corners and collapsed block seams */
  :host(:not([separated])[orientation="vertical"]) ::slotted(san-toggle-button:first-of-type) {
    --_san-toggle-button-radius-ss: var(--_group-radius);
    --_san-toggle-button-radius-se: var(--_group-radius);
  }

  :host(:not([separated])[orientation="vertical"]) ::slotted(san-toggle-button:last-of-type) {
    --_san-toggle-button-radius-es: var(--_group-radius);
    --_san-toggle-button-radius-ee: var(--_group-radius);
  }

  :host(:not([separated])[orientation="vertical"])
    ::slotted(san-toggle-button:not(:first-of-type)) {
    margin-block-start: calc(-1 * var(--san-border-width-hairline));
  }
`;
