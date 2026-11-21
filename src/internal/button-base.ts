import {
  html,
  nothing,
  type PropertyDeclarations,
  type PropertyValues,
  type TemplateResult,
} from "lit";
import { SanctuaryElement } from "./sanctuary-element.js";

/** Visual emphasis variant of button controls. */
export type ButtonVariant = "filled" | "soft" | "outlined" | "ghost";

/** Semantic color intent of button controls. */
export type ButtonIntent = "accent" | "danger" | "warning" | "success" | "info";

/** Control size scale of button controls. */
export type ButtonSize = "sm" | "md" | "lg";

/** Native button behavior type when not rendered as a link. */
export type ButtonType = "button" | "submit" | "reset";

/**
 * Private shared base class for Sanctuary button controls (`<san-button>`, `<san-icon-button>`).
 *
 * Implements form association (FACE), link rendering mode, loading custom state,
 * disabled click suppression, and form submission/reset overrides.
 */
export abstract class ButtonBase extends SanctuaryElement {
  static formAssociated = true;

  static override shadowRootOptions: ShadowRootInit = {
    ...SanctuaryElement.shadowRootOptions,
    delegatesFocus: true,
  };

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

  /** Size preset controlling control dimensions and icon size. */
  declare size: ButtonSize;

  /** Uses fully rounded pill corners (`--san-radius-full`). */
  declare pill: boolean;

  /** Disables the button and removes it from interaction. */
  declare disabled: boolean;

  /** Shows a loading indicator, preserves dimensions, and blocks activation while staying focusable. */
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
    if (changedProperties.has("disabled")) {
      // Sync host attribute before render() so the browser's FACE
      // formDisabledCallback updates #formDisabled in the same update cycle.
      this.toggleAttribute("disabled", this.disabled);
    }
    if (changedProperties.has("loading")) {
      this.setCustomState("loading", this.loading);
    }
  }

  /** Effective disabled state combining host `disabled` and ancestor `<fieldset disabled>`. */
  protected get isDisabled(): boolean {
    return this.disabled || this.#formDisabled;
  }

  /** Accessible label forwarded to the internal `<button>` or `<a>` control. */
  protected get controlAriaLabel(): string | undefined {
    return undefined;
  }

  /** Renders the inner shadow DOM content inside the native `<button>` or `<a>`. */
  protected abstract renderContent(): TemplateResult;

  readonly #handleHostClick = (event: MouseEvent): void => {
    if (this.isDisabled || this.loading) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  };

  readonly #handleControlClick = (event: MouseEvent): void => {
    if (event.defaultPrevented || this.isDisabled || this.loading || this.href != null) {
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

  protected override render() {
    const disabled = this.isDisabled;
    const ariaLabel = this.controlAriaLabel;

    if (this.href != null) {
      const resolvedRel =
        this.rel ?? (this.target === "_blank" ? "noopener noreferrer" : undefined);

      // An <a> without href loses its implicit link role and becomes generic,
      // where aria-label is disallowed by ARIA (WCAG 4.1.2 / axe-core).
      return html`
        <a
          part="base"
          class="control"
          role=${disabled ? "link" : nothing}
          href=${disabled ? nothing : this.href}
          target=${this.target ?? nothing}
          rel=${resolvedRel ?? nothing}
          download=${this.download ?? nothing}
          tabindex=${disabled ? "-1" : nothing}
          aria-label=${ariaLabel ?? nothing}
          aria-disabled=${disabled || this.loading ? "true" : nothing}
          aria-busy=${this.loading ? "true" : nothing}
        >
          ${this.renderContent()}
        </a>
      `;
    }

    return html`
      <button
        part="base"
        class="control"
        type=${this.type}
        ?disabled=${disabled}
        aria-label=${ariaLabel ?? nothing}
        aria-disabled=${this.loading ? "true" : nothing}
        aria-busy=${this.loading ? "true" : nothing}
        @click=${this.#handleControlClick}
      >
        ${this.renderContent()}
      </button>
    `;
  }
}
