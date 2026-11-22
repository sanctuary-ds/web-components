import { css } from "lit";

/**
 * Surface hierarchy, container-query responsive layout, interactive elevation,
 * and selection styles for `<san-card>` bound exclusively to `@sanctuary-ds/tokens@0.4.0`.
 */
export const cardStyles = css`
  :host {
    display: block;
    container-type: inline-size;

    /* Default padding: md */
    --_padding: var(--san-space-5);
    --_gap: var(--san-space-3);
    --_radius: var(--san-radius-lg);

    /* Default variant: outlined */
    --_bg: var(--san-surface-raised-1);
    --_border: var(--san-lead);
    --_border-hover: var(--san-lead-strong);
    --_shadow: var(--san-elevation-0);
    --_hover-shadow: var(--san-elevation-1);
    --_selected-shadow: 0 0 0 1px var(--san-accent);
    --_selected-hover-shadow: 0 0 0 1px var(--san-accent), var(--san-elevation-1);

    /* Tier-5 custom property wiring */
    --_card-bg: var(--san-card-bg, var(--_bg));
    --_card-fg: var(--san-card-fg, var(--san-text));
    --_card-border: var(--san-card-border, var(--_border));
    --_card-border-hover: var(--san-card-border-hover, var(--_border-hover));
    --_card-radius: var(--san-card-radius, var(--_radius));
    --_card-padding: var(--san-card-padding, var(--_padding));
    --_card-gap: var(--san-card-gap, var(--_gap));
    --_card-shadow: var(--san-card-shadow, var(--_shadow));
    --_card-media-size: var(--san-card-media-size, 14rem);

    color: var(--_card-fg);
  }

  /* Variant mappings */
  :host([variant="elevated"]) {
    --_bg: var(--san-surface-raised-2);
    --_border: var(--san-lead-soft);
    --_border-hover: var(--san-lead);
    --_shadow: var(--san-elevation-2);
    --_hover-shadow: var(--san-elevation-3);
    --_selected-shadow: 0 0 0 1px var(--san-accent), var(--san-card-shadow, var(--_shadow));
    --_selected-hover-shadow:
      0 0 0 1px var(--san-accent), var(--san-card-shadow, var(--_hover-shadow));
  }

  :host([variant="filled"]) {
    --_bg: var(--san-surface-sunken);
    --_border: transparent;
    --_border-hover: var(--san-lead-soft);
    --_shadow: var(--san-elevation-0);
    --_hover-shadow: var(--san-elevation-1);
  }

  /* Padding mappings */
  :host([padding="none"]) {
    --_padding: 0;
  }

  :host([padding="sm"]) {
    --_padding: var(--san-space-3);
  }

  :host([padding="lg"]) {
    --_padding: var(--san-space-6);
  }

  .card {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    grid-template-rows: auto auto minmax(0, 1fr) auto;
    min-inline-size: 0;
    border: var(--san-border-width-hairline) solid var(--_card-border);
    border-radius: var(--_card-radius);
    background-color: var(--_card-bg);
    box-shadow: var(--_card-shadow);
    color: inherit;
    overflow: hidden;
    transition:
      background-color var(--san-duration-fast) var(--san-ease-standard),
      border-color var(--san-duration-fast) var(--san-ease-standard),
      box-shadow var(--san-duration-fast) var(--san-ease-standard),
      translate var(--san-duration-fast) var(--san-ease-standard);
  }

  :host([interactive]) .card:hover {
    border-color: var(--_card-border-hover);
    box-shadow: var(--san-card-shadow, var(--_hover-shadow));
  }

  :host([interactive][variant="elevated"]) .card:hover {
    translate: 0 -1px;
  }

  :host([interactive]) .card:focus-within {
    outline: var(--san-focus-ring);
    outline-offset: var(--san-focus-ring-offset, 0.125rem);
  }

  :host(:is([selected], :state(selected))) .card {
    border-color: var(--san-accent);
    box-shadow: var(--_selected-shadow);
  }

  :host([interactive]:is([selected], :state(selected))) .card:hover {
    border-color: var(--san-accent);
    box-shadow: var(--_selected-hover-shadow);
  }

  .media {
    grid-column: 1;
    grid-row: 1;
    min-inline-size: 0;
    min-block-size: 0;
    overflow: hidden;
  }

  .media ::slotted(:is(img, picture, video, svg)) {
    display: block;
    inline-size: 100%;
    max-inline-size: 100%;
    block-size: auto;
    object-fit: cover;
  }

  .header {
    grid-column: 1;
    grid-row: 2;
    min-inline-size: 0;
    padding-inline: var(--_card-padding);
  }

  .body {
    grid-column: 1;
    grid-row: 3;
    min-inline-size: 0;
    padding-inline: var(--_card-padding);
  }

  .footer {
    grid-column: 1;
    grid-row: 4;
    min-inline-size: 0;
    padding-inline: var(--_card-padding);
  }

  /* Block padding on first and last visible content regions (excluding media) */
  .header:not([hidden]),
  .header[hidden] + .body:not([hidden]),
  .header[hidden] + .body[hidden] + .footer:not([hidden]) {
    padding-block-start: var(--_card-padding);
  }

  .footer:not([hidden]),
  .body:not([hidden]):has(+ .footer[hidden]),
  .header:not([hidden]):has(+ .body[hidden] + .footer[hidden]) {
    padding-block-end: var(--_card-padding);
  }

  /* Inter-region spacing & footer divider */
  .header:not([hidden]) + .body:not([hidden]) {
    padding-block-start: var(--_card-gap);
  }

  :is(.header:not([hidden]), .body:not([hidden])) ~ .footer:not([hidden]) {
    margin-block-start: var(--_card-gap);
    padding-block-start: var(--_card-gap);
    border-block-start: var(--san-border-width-hairline) solid var(--san-lead-soft);
  }

  /* Horizontal layout (only when media is slotted) */
  :host([layout="horizontal"]:state(has-media)) .card {
    grid-template-columns: var(--_card-media-size) minmax(0, 1fr);
    grid-template-rows: auto minmax(0, 1fr) auto;
  }

  :host([layout="horizontal"]:state(has-media)) .media {
    grid-column: 1;
    grid-row: 1 / -1;
    align-self: stretch;
    block-size: 100%;
  }

  :host([layout="horizontal"]:state(has-media)) .media ::slotted(:is(img, picture, video, svg)) {
    block-size: 100%;
  }

  :host([layout="horizontal"]:state(has-media)) .header {
    grid-column: 2;
    grid-row: 1;
  }

  :host([layout="horizontal"]:state(has-media)) .body {
    grid-column: 2;
    grid-row: 2;
  }

  :host([layout="horizontal"]:state(has-media)) .footer {
    grid-column: 2;
    grid-row: 3;
  }

  /* Container-query adaptive horizontal layout (only when media is slotted) */
  @container (inline-size >= 30rem) {
    :host([layout="auto"]:state(has-media)) .card {
      grid-template-columns: var(--_card-media-size) minmax(0, 1fr);
      grid-template-rows: auto minmax(0, 1fr) auto;
    }

    :host([layout="auto"]:state(has-media)) .media {
      grid-column: 1;
      grid-row: 1 / -1;
      align-self: stretch;
      block-size: 100%;
    }

    :host([layout="auto"]:state(has-media)) .media ::slotted(:is(img, picture, video, svg)) {
      block-size: 100%;
    }

    :host([layout="auto"]:state(has-media)) .header {
      grid-column: 2;
      grid-row: 1;
    }

    :host([layout="auto"]:state(has-media)) .body {
      grid-column: 2;
      grid-row: 2;
    }

    :host([layout="auto"]:state(has-media)) .footer {
      grid-column: 2;
      grid-row: 3;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .card {
      transition: none;
    }

    :host([interactive][variant="elevated"]) .card:hover {
      translate: none !important;
    }
  }

  @media (forced-colors: active) {
    .card {
      border-color: CanvasText;
    }

    :host(:is([selected], :state(selected))) .card {
      border-color: Highlight;
      box-shadow: 0 0 0 1px Highlight;
    }

    :host([interactive]) .card:focus-within {
      outline-color: Highlight;
    }
  }
`;
