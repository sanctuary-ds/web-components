import {
  type CSSResultGroup,
  html,
  nothing,
  type PropertyDeclarations,
  type PropertyValues,
} from "lit";
import { SanctuaryElement } from "../../internal/sanctuary-element.js";
import { resetStyles } from "../../styles/reset.js";
import { badgeStyles } from "./san-badge.styles.js";

/** Visual emphasis variant of `<san-badge>`. */
export type BadgeVariant = "soft" | "filled" | "outlined";

/** Semantic color intent of `<san-badge>`. */
export type BadgeIntent = "neutral" | "accent" | "danger" | "warning" | "success" | "info";

/** Size scale of `<san-badge>`. */
export type BadgeSize = "sm" | "md" | "lg";

function hasAssignedContent(slot: HTMLSlotElement): boolean {
  return slot.assignedNodes({ flatten: true }).some((node) => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      return true;
    }
    return node.nodeType === Node.TEXT_NODE && (node.textContent?.trim().length ?? 0) > 0;
  });
}

function hasDefaultNodesContent(nodes: readonly Node[]): boolean {
  return nodes.some((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      return (node.textContent?.trim().length ?? 0) > 0;
    }
    if (node.nodeType === Node.ELEMENT_NODE) {
      return !(node as Element).hasAttribute("slot");
    }
    return false;
  });
}

function hasReadableTextNodes(nodes: readonly Node[]): boolean {
  return nodes.some((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      return (node.textContent?.trim().length ?? 0) > 0;
    }
    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as Element;
      if (el.getAttribute("aria-hidden") === "true") {
        return false;
      }
      return (el.textContent?.trim().length ?? 0) > 0;
    }
    return false;
  });
}

/**
 * Passive, non-interactive status, count, or metadata indicator built on
 * Sanctuary tokens and glazing axes. Interactive or removable items belong in `<san-chip>`.
 *
 * @tagname san-badge
 * @summary Non-interactive status and count badge with dot indicator, icon slots, and single-line truncation.
 *
 * @slot - Default slot for the badge label text or inline content.
 * @slot start - Leading icon or adornment rendered before the label.
 * @slot end - Trailing icon or adornment rendered after the label.
 *
 * @csspart base - Internal non-interactive `<span>` container.
 * @csspart dot - Leading status indicator dot shown when `dot` is set.
 * @csspart start - Container wrapping the `start` slot.
 * @csspart label - Container wrapping the default slot.
 * @csspart end - Container wrapping the `end` slot.
 *
 * @cssprop [--san-badge-radius=var(--san-radius-sm)] - Border radius of the badge (`--san-radius-xs` on `sm`, `--san-radius-full` when `pill` is set).
 * @cssprop [--san-badge-gap=var(--san-space-1-5)] - Spacing between `dot`, `start`, `label`, and `end` parts (`--san-space-1` on `sm`).
 * @cssprop [--san-badge-height=1.5rem] - Minimum block size (`min-block-size`) of the badge (`1.25rem` on `sm`, `1.75rem` on `lg`).
 * @cssprop [--san-badge-padding-inline=var(--san-space-2)] - Inline padding (`padding-inline`) of the badge (`--san-space-1-5` on `sm`, `--san-space-2-5` on `lg`).
 * @cssprop [--san-badge-font=var(--san-type-label-md)] - Typography shorthand for the badge label.
 * @cssprop [--san-badge-icon-size=0.875rem] - Inline and block size of slotted icons (`0.75rem` on `sm`, `1rem` on `lg`).
 * @cssprop [--san-badge-dot-size=0.5rem] - Inline and block size of the status dot (`0.375rem` on `sm`).
 * @cssprop [--san-badge-bg] - Override background color.
 * @cssprop [--san-badge-fg] - Override foreground color.
 * @cssprop [--san-badge-border] - Override border color.
 */
export class SanBadge extends SanctuaryElement {
  static override styles: CSSResultGroup = [resetStyles, badgeStyles];

  static override properties: PropertyDeclarations = {
    variant: { type: String, reflect: true },
    intent: { type: String, reflect: true },
    size: { type: String, reflect: true },
    pill: { type: Boolean, reflect: true },
    dot: { type: Boolean, reflect: true },
    label: { type: String },
  };

  /** Visual emphasis style of the badge (`"soft"`, `"filled"`, or `"outlined"`). */
  declare variant: BadgeVariant;

  /** Semantic color intent applied to the badge. */
  declare intent: BadgeIntent;

  /** Size preset controlling badge dimensions, typography, icon size, and dot size. */
  declare size: BadgeSize;

  /** Uses fully rounded pill corners (`--san-radius-full`). */
  declare pill: boolean;

  /** Renders a leading status indicator dot, or a compact circular dot when all slots are empty. */
  declare dot: boolean;

  /** Accessible label exposed via `ElementInternals` (`role="img"` + `aria-label`) on dot-only or non-text badges. */
  declare label: string;

  #hasStart = false;
  #hasEnd = false;
  #isDotOnly = false;
  #isNonText = false;
  #managedFallbackRole = false;
  #managedFallbackAriaLabel = false;

  constructor() {
    super();
    this.variant = "soft";
    this.intent = "neutral";
    this.size = "md";
    this.pill = false;
    this.dot = false;
    this.label = "";
  }

  protected override willUpdate(changedProperties: PropertyValues<this>): void {
    if (!this.hasUpdated) {
      this.#hasStart = Array.from(this.children).some(
        (child) => child.getAttribute("slot") === "start",
      );
      this.#hasEnd = Array.from(this.children).some(
        (child) => child.getAttribute("slot") === "end",
      );
      this.#syncSlotStates(this.#getAllLightNodes());
    } else if (changedProperties.has("dot")) {
      this.#syncSlotStates(this.#getAllLightNodes());
    }

    if (!this.hasUpdated || changedProperties.has("dot") || changedProperties.has("label")) {
      this.#syncAccessibility();
    }
  }

  #getAllLightNodes(): {
    defaultNodes: readonly Node[];
    startNodes: readonly Node[];
    endNodes: readonly Node[];
  } {
    const defaultSlot = this.shadowRoot?.querySelector<HTMLSlotElement>("slot:not([name])");
    const startSlot = this.shadowRoot?.querySelector<HTMLSlotElement>("slot[name='start']");
    const endSlot = this.shadowRoot?.querySelector<HTMLSlotElement>("slot[name='end']");

    if (defaultSlot && startSlot && endSlot) {
      return {
        defaultNodes: defaultSlot.assignedNodes({ flatten: true }),
        startNodes: startSlot.assignedNodes({ flatten: true }),
        endNodes: endSlot.assignedNodes({ flatten: true }),
      };
    }

    const childNodes = Array.from(this.childNodes);
    return {
      defaultNodes: childNodes.filter(
        (node) => node.nodeType !== Node.ELEMENT_NODE || !(node as Element).hasAttribute("slot"),
      ),
      startNodes: childNodes.filter(
        (node) =>
          node.nodeType === Node.ELEMENT_NODE && (node as Element).getAttribute("slot") === "start",
      ),
      endNodes: childNodes.filter(
        (node) =>
          node.nodeType === Node.ELEMENT_NODE && (node as Element).getAttribute("slot") === "end",
      ),
    };
  }

  #syncSlotStates(nodes: {
    defaultNodes: readonly Node[];
    startNodes: readonly Node[];
    endNodes: readonly Node[];
  }): void {
    const hasDefault = hasDefaultNodesContent(nodes.defaultNodes);
    const nextDotOnly = this.dot && !this.#hasStart && !this.#hasEnd && !hasDefault;
    if (nextDotOnly !== this.#isDotOnly) {
      this.#isDotOnly = nextDotOnly;
      this.setCustomState("dot-only", nextDotOnly);
    }

    this.#isNonText =
      !hasReadableTextNodes(nodes.defaultNodes) &&
      !hasReadableTextNodes(nodes.startNodes) &&
      !hasReadableTextNodes(nodes.endNodes);
  }

  #getTrimmedLabel(): string {
    return typeof this.label === "string" ? this.label.trim() : "";
  }

  #hasUserHostAriaName(): boolean {
    const ariaLabel = this.#managedFallbackAriaLabel
      ? undefined
      : this.getAttribute("aria-label")?.trim();
    const ariaLabelledBy = this.getAttribute("aria-labelledby")?.trim();
    return Boolean(ariaLabel || ariaLabelledBy);
  }

  #syncAccessibility(): void {
    const trimmedLabel = this.#getTrimmedLabel();
    const hasExplicitLabel = trimmedLabel.length > 0;
    const shouldExposeImgRole =
      (this.#isDotOnly && (hasExplicitLabel || this.#hasUserHostAriaName())) ||
      (this.#isNonText && hasExplicitLabel);
    const nextAriaLabel =
      (this.#isDotOnly || this.#isNonText) && hasExplicitLabel ? this.label : null;

    const internals = this.internals;
    if (internals && "role" in internals && "ariaLabel" in internals) {
      internals.role = shouldExposeImgRole ? "img" : null;
      internals.ariaLabel = nextAriaLabel;
      return;
    }

    if (shouldExposeImgRole) {
      if (!this.hasAttribute("role")) {
        this.setAttribute("role", "img");
        this.#managedFallbackRole = true;
      }
    } else if (this.#managedFallbackRole) {
      this.removeAttribute("role");
      this.#managedFallbackRole = false;
    }

    if (nextAriaLabel !== null) {
      if (!this.hasAttribute("aria-label") || this.#managedFallbackAriaLabel) {
        this.setAttribute("aria-label", nextAriaLabel);
        this.#managedFallbackAriaLabel = true;
      }
    } else if (this.#managedFallbackAriaLabel) {
      this.removeAttribute("aria-label");
      this.#managedFallbackAriaLabel = false;
    }
  }

  readonly #handleDefaultSlotChange = (): void => {
    this.#syncSlotStates(this.#getAllLightNodes());
    this.#syncAccessibility();
    this.requestUpdate();
  };

  readonly #handleStartSlotChange = (event: Event): void => {
    const slot = event.currentTarget as HTMLSlotElement;
    this.#hasStart = hasAssignedContent(slot);
    this.#syncSlotStates(this.#getAllLightNodes());
    this.#syncAccessibility();
    this.requestUpdate();
  };

  readonly #handleEndSlotChange = (event: Event): void => {
    const slot = event.currentTarget as HTMLSlotElement;
    this.#hasEnd = hasAssignedContent(slot);
    this.#syncSlotStates(this.#getAllLightNodes());
    this.#syncAccessibility();
    this.requestUpdate();
  };

  protected override render() {
    const isDecorativeDotOnly =
      this.#isDotOnly && this.#getTrimmedLabel().length === 0 && !this.#hasUserHostAriaName();

    return html`
      <span
        part="base"
        class="base"
        aria-hidden=${isDecorativeDotOnly ? "true" : nothing}
      >
        <span part="dot" class="dot" aria-hidden="true" ?hidden=${!this.dot}></span>
        <span part="start" class="start" ?hidden=${!this.#hasStart}>
          <slot name="start" @slotchange=${this.#handleStartSlotChange}></slot>
        </span>
        <span part="label" class="label" ?hidden=${this.#isDotOnly}>
          <slot @slotchange=${this.#handleDefaultSlotChange}></slot>
        </span>
        <span part="end" class="end" ?hidden=${!this.#hasEnd}>
          <slot name="end" @slotchange=${this.#handleEndSlotChange}></slot>
        </span>
      </span>
    `;
  }
}
