/**
 * Registers a custom element idempotently and safely across SSR, HMR, and
 * micro-frontend bundles.
 *
 * - No-ops outside a browser `customElements` registry.
 * - No-ops when the same constructor is already registered under `tagName`.
 * - Warns instead of throwing if a different constructor already claimed `tagName`.
 */
export function defineElement(tagName: string, elementClass: CustomElementConstructor): void {
  if (typeof customElements === "undefined") {
    return;
  }

  const existing = customElements.get(tagName);
  if (!existing) {
    customElements.define(tagName, elementClass);
    return;
  }

  if (existing !== elementClass) {
    console.warn(
      `[@sanctuary-ds/web-components] Custom element "${tagName}" is already defined by a different class.`,
    );
  }
}
