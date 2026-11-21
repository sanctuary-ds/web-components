import { type CSSResultGroup, html, type PropertyValues, type TemplateResult } from "lit";
import {
  ButtonBase,
  type ButtonIntent as SharedButtonIntent,
  type ButtonSize as SharedButtonSize,
  type ButtonType as SharedButtonType,
  type ButtonVariant as SharedButtonVariant,
} from "../../internal/button-base.js";
import { buttonSharedStyles } from "../../internal/button-shared.styles.js";
import { focusStyles } from "../../styles/focus.js";
import { resetStyles } from "../../styles/reset.js";
import { buttonStyles } from "./san-button.styles.js";

/** Visual emphasis variant of `<san-button>`. */
export type ButtonVariant = SharedButtonVariant;

/** Semantic color intent of `<san-button>`. */
export type ButtonIntent = SharedButtonIntent;

/** Control size scale of `<san-button>`. */
export type ButtonSize = SharedButtonSize;

/** Native button behavior type when not rendered as a link. */
export type ButtonType = SharedButtonType;

function hasAssignedContent(slot: HTMLSlotElement): boolean {
  return slot.assignedNodes({ flatten: true }).some((node) => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      return true;
    }
    return node.nodeType === Node.TEXT_NODE && (node.textContent?.trim().length ?? 0) > 0;
  });
}

/**
 * Accessible, form-associated action button and link control built on
 * Sanctuary tokens and glazing axes.
 *
 * @tagname san-button
 * @summary Interactive button and link primitive with form association and glazing support.
 *
 * @slot - Default slot for the button label.
 * @slot start - Leading icon or adornment rendered before the label.
 * @slot end - Trailing icon or adornment rendered after the label.
 *
 * @csspart base - Internal native `<button>` or `<a>` element.
 * @csspart start - Container wrapping the `start` slot.
 * @csspart label - Container wrapping the default label slot.
 * @csspart end - Container wrapping the `end` slot.
 * @csspart spinner - Centered loading indicator shown when `loading` is active.
 *
 * @cssprop [--san-button-radius=var(--san-radius-md)] - Border radius of the control (`--san-radius-sm` on `sm`, `--san-radius-full` when `pill` is set).
 * @cssprop [--san-button-gap=var(--san-space-2)] - Spacing between `start`, `label`, and `end` slots.
 * @cssprop [--san-button-height=var(--san-size-control-md)] - Minimum block size (`min-block-size`) of the control.
 * @cssprop [--san-button-padding-inline=var(--san-space-4)] - Inline padding (`padding-inline`) of the control.
 * @cssprop [--san-button-padding-block=var(--san-space-1-5)] - Block padding (`padding-block`) of the control.
 * @cssprop [--san-button-font=var(--san-type-label-lg)] - Typography shorthand for the button label.
 * @cssprop [--san-button-bg] - Override background color.
 * @cssprop [--san-button-bg-hover] - Override hover background color.
 * @cssprop [--san-button-fg] - Override foreground text and icon color.
 * @cssprop [--san-button-border] - Override border color.
 */
export class SanButton extends ButtonBase {
  static override styles: CSSResultGroup = [
    resetStyles,
    focusStyles,
    buttonSharedStyles,
    buttonStyles,
  ];

  #hasStart = false;
  #hasEnd = false;

  protected override willUpdate(changedProperties: PropertyValues<this>): void {
    super.willUpdate(changedProperties);

    if (!this.hasUpdated) {
      this.#hasStart = Array.from(this.children).some(
        (child) => child.getAttribute("slot") === "start",
      );
      this.#hasEnd = Array.from(this.children).some(
        (child) => child.getAttribute("slot") === "end",
      );
    }
  }

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

  protected override renderContent(): TemplateResult {
    return html`
      <span part="start" class="start" ?hidden=${!this.#hasStart}>
        <slot name="start" @slotchange=${this.#handleStartSlotChange}></slot>
      </span>
      <span part="label" class="label">
        <slot></slot>
      </span>
      <span part="end" class="end" ?hidden=${!this.#hasEnd}>
        <slot name="end" @slotchange=${this.#handleEndSlotChange}></slot>
      </span>
      <span part="spinner" class="spinner" aria-hidden="true" ?hidden=${!this.loading}></span>
    `;
  }
}
