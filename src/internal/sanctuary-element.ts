import { type CSSResultGroup, LitElement } from "lit";
import { resetStyles } from "../styles/reset.js";

/**
 * Base class for Sanctuary custom elements.
 *
 * Attaches `ElementInternals` once in the constructor and exposes helpers for
 * `CustomStateSet` (`:state(...)`) without shadowing any standard global
 * HTML or ARIA host attributes.
 */
export class SanctuaryElement extends LitElement {
  static override styles: CSSResultGroup = [resetStyles];

  readonly #internals: ElementInternals | null;

  constructor() {
    super();
    this.#internals = typeof this.attachInternals === "function" ? this.attachInternals() : null;
  }

  /**
   * ElementInternals instance attached to this host, or `null` in runtimes
   * that do not implement `attachInternals()`.
   */
  protected get internals(): ElementInternals | null {
    return this.#internals;
  }

  /**
   * Adds or removes a runtime custom state on `ElementInternals.states`,
   * matchable via `:state(<name>)` in CSS.
   */
  protected setCustomState(name: string, active: boolean): void {
    const states = this.#internals?.states;
    if (!states) {
      return;
    }

    if (active) {
      states.add(name);
    } else {
      states.delete(name);
    }
  }

  /**
   * Reports whether a runtime custom state is currently active on this host.
   */
  protected hasCustomState(name: string): boolean {
    return this.#internals?.states?.has(name) ?? false;
  }
}
