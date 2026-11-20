import { css } from "lit";

/**
 * Shared `:focus-visible` indicator bound to Sanctuary 0.4+ focus tokens.
 *
 * Uses `outline` rather than `box-shadow` so focus indicators remain legible on
 * every surface tier (`surface-sunken` through `surface-raised-4`) and survive
 * `@media (forced-colors: active)`.
 */
export const focusStyles = css`
  :focus-visible {
    outline: var(--san-focus-ring, 0.125rem solid currentColor);
    outline-offset: var(--san-focus-ring-offset, 0.125rem);
  }

  :focus:not(:focus-visible) {
    outline: none;
  }

  @media (forced-colors: active) {
    :focus-visible {
      outline-color: Highlight;
    }
  }
`;
