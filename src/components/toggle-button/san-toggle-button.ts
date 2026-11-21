import {
  type CSSResultGroup,
  html,
  nothing,
  type PropertyDeclarations,
  type PropertyValues,
} from "lit";
import type { ButtonIntent, ButtonSize } from "../../internal/button-base.js";
import { buttonSharedStyles } from "../../internal/button-shared.styles.js";
import { SanctuaryElement } from "../../internal/sanctuary-element.js";
import { focusStyles } from "../../styles/focus.js";
import { resetStyles } from "../../styles/reset.js";
import { toggleButtonStyles } from "./san-toggle-button.styles.js";

/** Unpressed visual emphasis variant of `<san-toggle-button>`. */
export type ToggleButtonVariant = "outlined" | "soft" | "ghost";

/** Semantic color intent of `<san-toggle-button>`. */
export type ToggleButtonIntent = ButtonIntent;

/** Control size scale of `<san-toggle-button>`. */
export type ToggleButtonSize = ButtonSize;

function hasAssignedContent(slot: HTMLSlotElement): boolean {
  return slot.assignedNodes({ flatten: true }).some((node) => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      return true;
    }
    return node.nodeType === Node.TEXT_NODE && (node.textContent?.trim().length ?? 0) > 0;
  });
}

function isIconOnlyNodes(nodes: readonly Node[]): boolean {
  let elementCount = 0;

  for (const node of nodes) {
    if (node.nodeType === Node.TEXT_NODE && (node.textContent?.trim().length ?? 0) > 0) {
      return false;
    }
    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as Element;
      if (el.hasAttribute("slot")) {
        continue;
      }
      elementCount += 1;
      if (el.tagName.toLowerCase() !== "svg" && (el.textContent?.trim().length ?? 0) > 0) {
        return false;
      }
    }
  }

  return elementCount === 1;
}

/**
 * Accessible stateful toggle button (`aria-pressed`) supporting text, icon+text,
 * and automatic 1:1 square icon-only layout when the default slot holds only an icon.
 *
 * @tagname san-toggle-button
 * @summary Stateful pressed button control with Sanctuary glazing feedback and automatic icon-only sizing.
 *
 * @slot - Default slot for the button label, or a single direct icon element (such as `<svg>`) for automatic 1:1 square icon-only layout.
 * @slot start - Leading icon or adornment rendered before the label.
 * @slot end - Trailing icon or adornment rendered after the label.
 *
 * @csspart base - Internal native `<button type="button">` element.
 * @csspart start - Container wrapping the `start` slot.
 * @csspart label - Container wrapping the default slot.
 * @csspart end - Container wrapping the `end` slot.
 *
 * @fires change - Dispatched when the user toggles the pressed state.
 *
 * @cssprop [--san-toggle-button-radius=var(--san-radius-md)] - Border radius of the control (`--san-radius-sm` on `sm`, `--san-radius-full` when `pill` is set).
 * @cssprop [--san-toggle-button-gap=var(--san-space-2)] - Spacing between `start`, `label`, and `end` slots.
 * @cssprop [--san-toggle-button-height=var(--san-size-control-md)] - Minimum block size (`min-block-size`) or square size in icon-only state.
 * @cssprop [--san-toggle-button-padding-inline=var(--san-space-4)] - Inline padding (`padding-inline`) in label mode.
 * @cssprop [--san-toggle-button-padding-block=var(--san-space-1-5)] - Block padding (`padding-block`) in label mode.
 * @cssprop [--san-toggle-button-font=var(--san-type-label-lg)] - Typography shorthand for the toggle button label.
 * @cssprop [--san-toggle-button-icon-size=var(--san-size-icon-md)] - Inline and block size of slotted icons.
 * @cssprop [--san-toggle-button-bg] - Override unpressed background color.
 * @cssprop [--san-toggle-button-bg-hover] - Override unpressed hover background color.
 * @cssprop [--san-toggle-button-fg] - Override unpressed foreground color.
 * @cssprop [--san-toggle-button-border] - Override unpressed border color.
 * @cssprop [--san-toggle-button-pressed-bg] - Override pressed background color.
 * @cssprop [--san-toggle-button-pressed-bg-hover] - Override pressed hover background color.
 * @cssprop [--san-toggle-button-pressed-fg] - Override pressed foreground color.
 * @cssprop [--san-toggle-button-pressed-border] - Override pressed border color.
 */
export class SanToggleButton extends SanctuaryElement {
  static override shadowRootOptions: ShadowRootInit = {
    ...SanctuaryElement.shadowRootOptions,
    delegatesFocus: true,
  };

  static override styles: CSSResultGroup = [
    resetStyles,
    focusStyles,
    buttonSharedStyles,
    toggleButtonStyles,
  ];

  static override properties: PropertyDeclarations = {
    pressed: { type: Boolean, reflect: true },
    variant: { type: String, reflect: true },
    intent: { type: String, reflect: true },
    size: { type: String, reflect: true },
    pill: { type: Boolean, reflect: true },
    label: { type: String },
    value: { type: String, reflect: true },
    disabled: { type: Boolean, reflect: true },
  };

  /** Whether the toggle button is currently pressed (`aria-pressed="true"` and `:state(pressed)`). */
  declare pressed: boolean;

  /** Unpressed visual emphasis style: `"outlined"`, `"soft"`, or `"ghost"`. */
  declare variant: ToggleButtonVariant;

  /** Semantic color intent applied to the pressed surface, border, and focus ring. */
  declare intent: ToggleButtonIntent;

  /** Size preset controlling height, padding, typography, and icon scale. */
  declare size: ToggleButtonSize;

  /** Uses fully rounded pill corners (`--san-radius-full`). */
  declare pill: boolean;

  /** Accessible label mapped to `aria-label` on the internal `<button>` (required when icon-only). */
  declare label: string;

  /** Optional value identifying this toggle button inside a `<san-toggle-button-group>`. */
  declare value: string;

  /** Disables interaction and applies disabled surface and text tokens. */
  declare disabled: boolean;

  #hasStart = false;
  #hasEnd = false;
  #isIconOnly = false;
  #warnedMissingLabel = false;

  constructor() {
    super();
    this.pressed = false;
    this.variant = "outlined";
    this.intent = "accent";
    this.size = "md";
    this.pill = false;
    this.label = "";
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
      this.#syncIconOnlyState(Array.from(this.childNodes));
    }

    if (changedProperties.has("pressed")) {
      this.setCustomState("pressed", this.pressed);
    }
  }

  protected override updated(changedProperties: PropertyValues<this>): void {
    super.updated(changedProperties);
    this.#warnIfUnlabelledIconOnly();
  }

  #syncIconOnlyState(defaultNodes: readonly Node[]): void {
    const next = !this.#hasStart && !this.#hasEnd && isIconOnlyNodes(defaultNodes);
    if (next !== this.#isIconOnly) {
      this.#isIconOnly = next;
      this.setCustomState("icon-only", next);
      if (this.hasUpdated) {
        this.#warnIfUnlabelledIconOnly();
      }
    }
  }

  #warnIfUnlabelledIconOnly(): void {
    const hasLabel = typeof this.label === "string" && this.label.trim().length > 0;
    if (
      this.#isIconOnly &&
      !this.#warnedMissingLabel &&
      !hasLabel &&
      !this.hasAttribute("aria-label") &&
      !this.hasAttribute("aria-labelledby")
    ) {
      this.#warnedMissingLabel = true;
      console.warn(
        "<san-toggle-button> requires a non-empty `label` (or host `aria-label` / `aria-labelledby`) when rendered with only an icon (WCAG 4.1.2).",
      );
    }
  }

  #getDefaultSlotNodes(): Node[] {
    const defaultSlot = this.shadowRoot?.querySelector<HTMLSlotElement>("slot:not([name])");
    return defaultSlot ? defaultSlot.assignedNodes({ flatten: true }) : Array.from(this.childNodes);
  }

  #getControlAriaLabel(): string | undefined {
    const trimmedLabel = typeof this.label === "string" ? this.label.trim() : "";
    if (trimmedLabel) {
      return this.label;
    }
    const hostAriaLabel = this.getAttribute("aria-label");
    return hostAriaLabel?.trim() ? hostAriaLabel : undefined;
  }

  readonly #handleHostClick = (event: MouseEvent): void => {
    if (this.disabled) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  };

  readonly #handleControlClick = (event: MouseEvent): void => {
    if (event.defaultPrevented || this.disabled) {
      return;
    }

    this.pressed = !this.pressed;
    this.dispatchEvent(new Event("change", { bubbles: true, composed: true }));
  };

  readonly #handleDefaultSlotChange = (event: Event): void => {
    const slot = event.currentTarget as HTMLSlotElement;
    this.#syncIconOnlyState(slot.assignedNodes({ flatten: true }));
  };

  readonly #handleStartSlotChange = (event: Event): void => {
    const slot = event.currentTarget as HTMLSlotElement;
    const next = hasAssignedContent(slot);
    if (next !== this.#hasStart) {
      this.#hasStart = next;
      this.#syncIconOnlyState(this.#getDefaultSlotNodes());
      this.requestUpdate();
    }
  };

  readonly #handleEndSlotChange = (event: Event): void => {
    const slot = event.currentTarget as HTMLSlotElement;
    const next = hasAssignedContent(slot);
    if (next !== this.#hasEnd) {
      this.#hasEnd = next;
      this.#syncIconOnlyState(this.#getDefaultSlotNodes());
      this.requestUpdate();
    }
  };

  protected override render() {
    const ariaLabel = this.#getControlAriaLabel();

    return html`
      <button
        part="base"
        class="control"
        type="button"
        ?disabled=${this.disabled}
        aria-pressed=${this.pressed ? "true" : "false"}
        aria-label=${ariaLabel ?? nothing}
        @click=${this.#handleControlClick}
      >
        <span part="start" class="start" ?hidden=${!this.#hasStart}>
          <slot name="start" @slotchange=${this.#handleStartSlotChange}></slot>
        </span>
        <span part="label" class="label">
          <slot @slotchange=${this.#handleDefaultSlotChange}></slot>
        </span>
        <span part="end" class="end" ?hidden=${!this.#hasEnd}>
          <slot name="end" @slotchange=${this.#handleEndSlotChange}></slot>
        </span>
      </button>
    `;
  }
}
