import {
  type CSSResultGroup,
  html,
  type PropertyDeclarations,
  type PropertyValues,
  type TemplateResult,
} from "lit";
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
import { iconButtonStyles } from "./san-icon-button.styles.js";

/** Visual emphasis variant of `<san-icon-button>`. */
export type ButtonVariant = SharedButtonVariant;

/** Semantic color intent of `<san-icon-button>`. */
export type ButtonIntent = SharedButtonIntent;

/** Control size scale of `<san-icon-button>`. */
export type ButtonSize = SharedButtonSize;

/** Native button behavior type when not rendered as a link. */
export type ButtonType = SharedButtonType;

/**
 * Accessible, square icon-only action button and link control built on
 * Sanctuary tokens and glazing axes. Stateful toggles belong in `<san-toggle-button>`.
 *
 * @tagname san-icon-button
 * @summary Square icon button and link primitive with accessible label contract and form association.
 *
 * @slot - Default slot for the icon element (typically a direct `<svg>`).
 *
 * @csspart base - Internal native `<button>` or `<a>` element.
 * @csspart icon - Container wrapping the default icon slot.
 * @csspart spinner - Centered loading indicator shown when `loading` is active.
 *
 * @cssprop [--san-icon-button-size=var(--san-size-control-md)] - Square inline and block size of the control (`--san-size-control-sm` on `sm`, `--san-size-control-lg` on `lg`).
 * @cssprop [--san-icon-button-icon-size=var(--san-size-icon-md)] - Inline and block size of the slotted icon (`--san-size-icon-sm` on `sm`, `--san-size-icon-lg` on `lg`).
 * @cssprop [--san-icon-button-radius=var(--san-radius-md)] - Border radius of the control (`--san-radius-sm` on `sm`, `--san-radius-full` when `pill` is set).
 * @cssprop [--san-icon-button-bg] - Override background color.
 * @cssprop [--san-icon-button-bg-hover] - Override hover background color.
 * @cssprop [--san-icon-button-fg] - Override foreground icon color.
 * @cssprop [--san-icon-button-border] - Override border color.
 */
export class SanIconButton extends ButtonBase {
  static override styles: CSSResultGroup = [
    resetStyles,
    focusStyles,
    buttonSharedStyles,
    iconButtonStyles,
  ];

  static override properties: PropertyDeclarations = {
    ...ButtonBase.properties,
    label: { type: String },
  };

  /** Accessible label forwarded to `aria-label` on the internal `<button>` or `<a>` control. */
  declare label: string;

  #warnedMissingLabel = false;

  constructor() {
    super();
    this.variant = "ghost";
    this.label = "";
  }

  protected override get controlAriaLabel(): string | undefined {
    if (this.label.trim()) {
      return this.label;
    }
    const hostAriaLabel = this.getAttribute("aria-label");
    return hostAriaLabel?.trim() ? hostAriaLabel : undefined;
  }

  protected override updated(changedProperties: PropertyValues<this>): void {
    super.updated(changedProperties);

    if (
      !this.#warnedMissingLabel &&
      !this.label.trim() &&
      !this.hasAttribute("aria-label") &&
      !this.hasAttribute("aria-labelledby")
    ) {
      this.#warnedMissingLabel = true;
      console.warn(
        "<san-icon-button> requires a non-empty `label` (or host `aria-label` / `aria-labelledby`) for accessibility (WCAG 4.1.2).",
      );
    }
  }

  protected override renderContent(): TemplateResult {
    return html`
      <span part="icon" class="icon">
        <slot></slot>
      </span>
      <span part="spinner" class="spinner" aria-hidden="true" ?hidden=${!this.loading}></span>
    `;
  }
}
