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
import { buttonStyles } from "./san-button.styles.js";

/** Visual emphasis variant of `<san-button>`. */
export type ButtonVariant = "filled" | "soft" | "outlined" | "ghost";

/** Semantic color intent of `<san-button>`. */
export type ButtonIntent = "accent" | "danger" | "warning" | "success" | "info";

/** Control size scale of `<san-button>`. */
export type ButtonSize = "sm" | "md" | "lg";

/** Native button behavior type when not rendered as a link. */
export type ButtonType = "button" | "submit" | "reset";

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
export class SanButton extends SanctuaryElement {
  static formAssociated = true;

  static override shadowRootOptions: ShadowRootInit = {
    ...SanctuaryElement.shadowRootOptions,
    delegatesFocus: true,
  };

  static override styles: CSSResultGroup = [resetStyles, focusStyles, buttonStyles];

  static override properties: PropertyDeclarations = {
    variant: { type: String, reflect: true },
    intent: { type: String, reflect: true },
    size: { type: String, reflect: true },
    pill: { type: Boolean, reflect: true },
    disabled: { type: Boolean, reflect: true },
    loading: { type: Boolean, reflect: true },
    type: { type: String, reflect: true },
    name: { type: String, reflect: true },
    value: { type: String },
    href: { type: String },
    target: { type: String },
    rel: { type: String },
    download: { type: String },
    formAction: { type: String, attribute: "formaction" },
    formEnctype: { type: String, attribute: "formenctype" },
    formMethod: { type: String, attribute: "formmethod" },
    formNoValidate: { type: Boolean, attribute: "formnovalidate" },
    formTarget: { type: String, attribute: "formtarget" },
  };

  /**
   * Visual emphasis style of the button:
   * - `filled`: Primary call to action following the active glazing.
   * - `soft`: Medium-emphasis secondary action with tinted pane fill.
   * - `outlined`: Neutral bordered secondary action.
   * - `ghost`: Low-emphasis tertiary action.
   */
  declare variant: ButtonVariant;

  /** Semantic color intent applied to the button and its focus ring. */
  declare intent: ButtonIntent;

  /** Size preset controlling minimum block size, padding, and typography. */
  declare size: ButtonSize;

  /** Uses fully rounded pill corners (`--san-radius-full`). */
  declare pill: boolean;

  /** Disables the button and removes it from interaction. */
  declare disabled: boolean;

  /** Shows a loading indicator, preserves width, and blocks activation while staying focusable. */
  declare loading: boolean;

  /** Native button behavior within an associated form. */
  declare type: ButtonType;

  /** Field name submitted when this button submits a form. */
  declare name: string;

  /** Field value submitted when this button submits a form. */
  declare value: string;

  /** When set, renders an anchor (`<a>`) control instead of a `<button>`. */
  declare href: string | undefined;

  /** Anchor target window/frame when `href` is set. */
  declare target: string | undefined;

  /** Link relationship; defaults to `"noopener noreferrer"` when `target === "_blank"` and unset. */
  declare rel: string | undefined;

  /** Suggests downloading the linked URL instead of navigating when `href` is set. */
  declare download: string | undefined;

  /** Overrides the form's `action` URL when `type="submit"`. */
  declare formAction: string | undefined;

  /** Overrides the form's `enctype` when `type="submit"`. */
  declare formEnctype: string | undefined;

  /** Overrides the form's `method` when `type="submit"`. */
  declare formMethod: string | undefined;

  /** Skips constraint validation when `type="submit"`. */
  declare formNoValidate: boolean;

  /** Overrides the form's `target` when `type="submit"`. */
  declare formTarget: string | undefined;

  #formDisabled = false;
  #hasStart = false;
  #hasEnd = false;

  constructor() {
    super();
    this.variant = "filled";
    this.intent = "accent";
    this.size = "md";
    this.pill = false;
    this.disabled = false;
    this.loading = false;
    this.type = "button";
    this.name = "";
    this.value = "";
    this.formNoValidate = false;
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener("click", this.#handleHostClick, { capture: true });
  }

  override disconnectedCallback(): void {
    this.removeEventListener("click", this.#handleHostClick, { capture: true });
    super.disconnectedCallback();
  }

  /**
   * Called by the browser when an ancestor `<fieldset>` toggles `disabled`.
   * Disables the internal control without mutating the host `disabled` attribute.
   */
  formDisabledCallback(disabled: boolean): void {
    this.#formDisabled = disabled;
    this.requestUpdate();
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

    if (changedProperties.has("loading")) {
      this.setCustomState("loading", this.loading);
    }
  }

  get #isDisabled(): boolean {
    return this.disabled || this.#formDisabled;
  }

  readonly #handleHostClick = (event: MouseEvent): void => {
    if (this.#isDisabled || this.loading) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  };

  readonly #handleControlClick = (event: MouseEvent): void => {
    if (event.defaultPrevented || this.#isDisabled || this.loading || this.href != null) {
      return;
    }

    const form = this.internals?.form;
    if (!form) {
      return;
    }

    if (this.type === "reset") {
      form.reset();
      return;
    }

    if (this.type === "submit") {
      this.#submitForm(form);
    }
  };

  #submitForm(form: HTMLFormElement): void {
    if (this.name) {
      this.internals?.setFormValue(this.value);
    }

    const restoreAttributes: Array<() => void> = [];
    const applyOverride = (attr: string, value: string | null | undefined) => {
      if (value == null) {
        return;
      }
      const hadAttr = form.hasAttribute(attr);
      const prev = form.getAttribute(attr);
      form.setAttribute(attr, value);
      restoreAttributes.push(() => {
        if (hadAttr && prev !== null) {
          form.setAttribute(attr, prev);
        } else {
          form.removeAttribute(attr);
        }
      });
    };

    applyOverride("action", this.formAction);
    applyOverride("enctype", this.formEnctype);
    applyOverride("method", this.formMethod);
    applyOverride("target", this.formTarget);

    if (this.formNoValidate) {
      const hadNoValidate = form.hasAttribute("novalidate");
      form.setAttribute("novalidate", "");
      restoreAttributes.push(() => {
        if (!hadNoValidate) {
          form.removeAttribute("novalidate");
        }
      });
    }

    try {
      form.requestSubmit();
    } finally {
      for (const restore of restoreAttributes) {
        restore();
      }
      if (this.name) {
        queueMicrotask(() => {
          this.internals?.setFormValue(null);
        });
      }
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

  #renderContent() {
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

  protected override render() {
    const disabled = this.#isDisabled;

    if (this.href != null) {
      const resolvedRel =
        this.rel ?? (this.target === "_blank" ? "noopener noreferrer" : undefined);

      return html`
        <a
          part="base"
          class="control"
          href=${disabled ? nothing : this.href}
          target=${this.target ?? nothing}
          rel=${resolvedRel ?? nothing}
          download=${this.download ?? nothing}
          tabindex=${disabled ? "-1" : nothing}
          aria-disabled=${disabled || this.loading ? "true" : nothing}
          aria-busy=${this.loading ? "true" : nothing}
        >
          ${this.#renderContent()}
        </a>
      `;
    }

    return html`
      <button
        part="base"
        class="control"
        type=${this.type}
        ?disabled=${disabled}
        aria-disabled=${this.loading ? "true" : nothing}
        aria-busy=${this.loading ? "true" : nothing}
        @click=${this.#handleControlClick}
      >
        ${this.#renderContent()}
      </button>
    `;
  }
}
