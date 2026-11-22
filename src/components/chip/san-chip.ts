import {
  type CSSResultGroup,
  html,
  nothing,
  type PropertyDeclarations,
  type PropertyValues,
} from "lit";
import { SanctuaryElement } from "../../internal/sanctuary-element.js";
import { focusStyles } from "../../styles/focus.js";
import { resetStyles } from "../../styles/reset.js";
import { chipStyles } from "./san-chip.styles.js";

/** Visual emphasis variant of `<san-chip>`. */
export type ChipVariant = "outlined" | "soft" | "filled";

/** Semantic color intent of `<san-chip>`. */
export type ChipIntent = "neutral" | "accent" | "danger" | "warning" | "success" | "info";

/** Size scale of `<san-chip>`. */
export type ChipSize = "sm" | "md" | "lg";

function hasAssignedContent(slot: HTMLSlotElement): boolean {
  return slot.assignedNodes({ flatten: true }).some((node) => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      return true;
    }
    return node.nodeType === Node.TEXT_NODE && (node.textContent?.trim().length ?? 0) > 0;
  });
}

/**
 * Compact interactive, selectable, or removable tag built on Sanctuary tokens
 * and glazing axes. Passive non-interactive indicators belong in `<san-badge>`.
 *
 * @tagname san-chip
 * @summary Interactive filter or removable tag chip with sibling action and remove buttons.
 *
 * @slot - Default slot for the chip label text or inline content.
 * @slot start - Leading icon or adornment rendered before the label.
 * @slot end - Trailing icon or adornment rendered after the label.
 *
 * @csspart base - Outer chip container wrapping the action/content and optional remove button.
 * @csspart action - Native `<button type="button">` rendered when `selectable` is true.
 * @csspart start - Container wrapping the `start` slot.
 * @csspart label - Container wrapping the default slot.
 * @csspart end - Container wrapping the `end` slot.
 * @csspart remove - Sibling `<button type="button">` rendered when `removable` is true.
 *
 * @fires change - Dispatched when the user toggles selection on a `selectable` chip.
 * @fires remove - Dispatched (cancelable) when the user activates the remove button or presses `Backspace`/`Delete` on a `selectable` + `removable` chip.
 *
 * @cssprop [--san-chip-radius=var(--san-radius-md)] - Border radius of the chip (`--san-radius-sm` on `sm`, `--san-radius-full` when `pill` is set).
 * @cssprop [--san-chip-gap=var(--san-space-1-5)] - Spacing between `start`, `label`, and `end` parts (`--san-space-1` on `sm`, `--san-space-2` on `lg`).
 * @cssprop [--san-chip-height=var(--san-size-control-sm)] - Minimum block size (`min-block-size`) of the chip (`1.5rem` on `sm`, `2.5rem` on `lg`).
 * @cssprop [--san-chip-padding-inline=var(--san-space-3)] - Inline padding (`padding-inline`) of the chip content (`--san-space-2` on `sm`, `--san-space-4` on `lg`).
 * @cssprop [--san-chip-font=var(--san-type-label-lg)] - Typography shorthand for the chip label.
 * @cssprop [--san-chip-icon-size=var(--san-size-icon-sm)] - Inline and block size of slotted icons (`0.875rem` on `sm`, `--san-size-icon-md` on `lg`).
 * @cssprop [--san-chip-bg] - Override unselected background color.
 * @cssprop [--san-chip-bg-hover] - Override unselected hover background color.
 * @cssprop [--san-chip-fg] - Override unselected foreground color.
 * @cssprop [--san-chip-border] - Override unselected border color.
 * @cssprop [--san-chip-selected-bg] - Override selected background color.
 * @cssprop [--san-chip-selected-bg-hover] - Override selected hover background color.
 * @cssprop [--san-chip-selected-fg] - Override selected foreground color.
 * @cssprop [--san-chip-selected-border] - Override selected border color.
 */
export class SanChip extends SanctuaryElement {
  static override shadowRootOptions: ShadowRootInit = {
    ...SanctuaryElement.shadowRootOptions,
    delegatesFocus: true,
  };

  static override styles: CSSResultGroup = [resetStyles, focusStyles, chipStyles];

  static override properties: PropertyDeclarations = {
    variant: { type: String, reflect: true },
    intent: { type: String, reflect: true },
    size: { type: String, reflect: true },
    pill: { type: Boolean, reflect: true },
    selectable: { type: Boolean, reflect: true },
    selected: { type: Boolean, reflect: true },
    removable: { type: Boolean, reflect: true },
    removeLabel: { type: String, attribute: "remove-label" },
    value: { type: String, reflect: true },
    disabled: { type: Boolean, reflect: true },
  };

  /** Visual emphasis style of the chip (`"outlined"`, `"soft"`, or `"filled"`). */
  declare variant: ChipVariant;

  /** Semantic color intent applied to the chip. */
  declare intent: ChipIntent;

  /** Size preset controlling chip height, padding, typography, and icon sizing. */
  declare size: ChipSize;

  /** Uses fully rounded pill corners (`--san-radius-full`). */
  declare pill: boolean;

  /** Renders the chip content inside an interactive toggle `<button>` with `aria-pressed`. */
  declare selectable: boolean;

  /** Whether a selectable chip is currently selected (`:state(selected)` + illuminated glazing). */
  declare selected: boolean;

  /** Renders a sibling remove `<button>` that emits a cancelable `remove` event. */
  declare removable: boolean;

  /** Accessible label for the remove button; defaults to `"Remove <label>"` or `"Remove"`. */
  declare removeLabel: string;

  /** Value identifier for filter and tag collections. */
  declare value: string;

  /** Disables interaction and applies disabled surface, border, and text tokens. */
  declare disabled: boolean;

  #hasStart = false;
  #hasEnd = false;

  constructor() {
    super();
    this.variant = "outlined";
    this.intent = "neutral";
    this.size = "md";
    this.pill = false;
    this.selectable = false;
    this.selected = false;
    this.removable = false;
    this.removeLabel = "";
    this.value = "";
    this.disabled = false;
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener("click", this.#handleHostClick, { capture: true });
  }

  override disconnectedCallback(): void {
    this.removeEventListener("click", this.#handleHostClick, { capture: true });
    super.disconnectedCallback();
  }

  protected override willUpdate(changedProperties: PropertyValues<this>): void {
    if (!this.hasUpdated) {
      this.#hasStart = Array.from(this.children).some(
        (child) => child.getAttribute("slot") === "start",
      );
      this.#hasEnd = Array.from(this.children).some(
        (child) => child.getAttribute("slot") === "end",
      );
    }

    if (changedProperties.has("selected")) {
      this.setCustomState("selected", this.selected);
    }
  }

  #getDefaultSlotNodes(): readonly Node[] {
    const defaultSlot = this.shadowRoot?.querySelector<HTMLSlotElement>("slot:not([name])");
    if (defaultSlot) {
      return defaultSlot.assignedNodes({ flatten: true });
    }
    return Array.from(this.childNodes).filter(
      (node) => node.nodeType !== Node.ELEMENT_NODE || !(node as Element).hasAttribute("slot"),
    );
  }

  #getRemoveAriaLabel(): string {
    const explicit = typeof this.removeLabel === "string" ? this.removeLabel.trim() : "";
    if (explicit.length > 0) {
      return explicit;
    }

    const defaultText = this.#getDefaultSlotNodes()
      .map((node) => node.textContent ?? "")
      .join("")
      .replace(/\s+/g, " ")
      .trim();

    return defaultText.length > 0 ? `Remove ${defaultText}` : "Remove";
  }

  readonly #handleHostClick = (event: MouseEvent): void => {
    if (this.disabled) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  };

  readonly #handleActionClick = (event: MouseEvent): void => {
    if (event.defaultPrevented || this.disabled || !this.selectable) {
      return;
    }

    this.selected = !this.selected;
    this.dispatchEvent(new Event("change", { bubbles: true, composed: true }));
  };

  readonly #handleActionKeyDown = (event: KeyboardEvent): void => {
    if (event.defaultPrevented || this.disabled || !this.selectable || !this.removable) {
      return;
    }
    if (event.altKey || event.ctrlKey || event.metaKey) {
      return;
    }
    if (event.key === "Backspace" || event.key === "Delete") {
      this.dispatchEvent(new Event("remove", { bubbles: true, composed: true, cancelable: true }));
    }
  };

  readonly #handleRemoveClick = (event: MouseEvent): void => {
    if (event.defaultPrevented || this.disabled || !this.removable) {
      return;
    }

    this.dispatchEvent(new Event("remove", { bubbles: true, composed: true, cancelable: true }));
  };

  readonly #handleDefaultSlotChange = (): void => {
    this.requestUpdate();
  };

  readonly #handleStartSlotChange = (event: Event): void => {
    const slot = event.currentTarget as HTMLSlotElement;
    const next = hasAssignedContent(slot);
    if (next !== this.#hasStart) {
      this.#hasStart = next;
      this.requestUpdate();
    }
  };

  readonly #handleEndSlotChange = (event: Event): void => {
    const slot = event.currentTarget as HTMLSlotElement;
    const next = hasAssignedContent(slot);
    if (next !== this.#hasEnd) {
      this.#hasEnd = next;
      this.requestUpdate();
    }
  };

  #renderSlots() {
    return html`
      <span part="start" class="start" ?hidden=${!this.#hasStart}>
        <slot name="start" @slotchange=${this.#handleStartSlotChange}></slot>
      </span>
      <span part="label" class="label">
        <slot @slotchange=${this.#handleDefaultSlotChange}></slot>
      </span>
      <span part="end" class="end" ?hidden=${!this.#hasEnd}>
        <slot name="end" @slotchange=${this.#handleEndSlotChange}></slot>
      </span>
    `;
  }

  protected override render() {
    const removeAriaLabel = this.removable ? this.#getRemoveAriaLabel() : nothing;

    return html`
      <span part="base" class="base">
        ${
          this.selectable
            ? html`
              <button
                part="action"
                class="action"
                type="button"
                aria-pressed=${this.selected ? "true" : "false"}
                ?disabled=${this.disabled}
                @click=${this.#handleActionClick}
                @keydown=${this.#handleActionKeyDown}
              >
                ${this.#renderSlots()}
              </button>
            `
            : html`<span class="content">${this.#renderSlots()}</span>`
        }
        ${
          this.removable
            ? html`
              <button
                part="remove"
                class="remove"
                type="button"
                aria-label=${removeAriaLabel}
                ?disabled=${this.disabled}
                @click=${this.#handleRemoveClick}
              >
                <svg
                  class="remove-icon"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.75"
                  stroke-linecap="round"
                  aria-hidden="true"
                >
                  <path d="M4.5 4.5l7 7M11.5 4.5l-7 7" />
                </svg>
              </button>
            `
            : nothing
        }
      </span>
    `;
  }
}
