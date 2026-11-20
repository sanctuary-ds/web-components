import { css } from "lit";

/**
 * Base host and box-model reset shared across Sanctuary components.
 *
 * Keeps `[hidden]` authoritative even when a component declares an explicit
 * `display` value on `:host`, preventing hidden hosts from remaining visible
 * or focusable in the accessibility tree.
 */
export const resetStyles = css`
  :host {
    box-sizing: border-box;
  }

  :host([hidden]),
  [hidden] {
    display: none !important;
  }

  *,
  *::before,
  *::after {
    box-sizing: inherit;
  }
`;
