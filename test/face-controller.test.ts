import { css, html, nothing, type PropertyDeclarations } from "lit";
import { live } from "lit/directives/live.js";
import { afterEach, describe, expect, it, vi } from "vitest";
import { userEvent } from "vitest/browser";
import { defineElement, focusStyles, resetStyles } from "../src/index.js";
import { FormControlController } from "../src/internal/form-control-controller.js";
import { FormControlElement } from "../src/internal/form-control-element.js";
import { expectAccessible } from "./helpers/a11y.js";

class TestTextProbe extends FormControlElement {
  static override styles = [
    resetStyles,
    focusStyles,
    css`
      :host {
        display: inline-flex;
        flex-direction: column;
        gap: var(--san-space-1);
      }

      input {
        border: 1px solid var(--san-lead);
        color: var(--san-text);
        background: var(--san-surface);
        padding: var(--san-space-1) var(--san-space-2);
      }

      :host(:state(user-invalid)) input {
        border-color: var(--san-danger);
      }
    `,
  ];

  static override properties: PropertyDeclarations = {
    ...FormControlElement.properties,
    label: { type: String },
    value: { type: String },
    type: { type: String },
    minLength: { type: Number, attribute: "minlength" },
    pattern: { type: String },
    readOnly: { type: Boolean, attribute: "readonly", reflect: true },
  };

  declare label: string;
  declare value: string;
  declare type: string;
  declare minLength: number | undefined;
  declare pattern: string | undefined;
  declare readOnly: boolean;

  #defaultValue = "";
  associatedForms: Array<HTMLFormElement | null> = [];
  restoredCalls: Array<{
    state: string | File | FormData | null;
    mode: "restore" | "autocomplete";
  }> = [];

  constructor() {
    super();
    this.label = "Probe field";
    this.value = "";
    this.type = "text";
    this.readOnly = false;
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.#defaultValue = this.getAttribute("value") ?? this.value;
  }

  get defaultValue(): string {
    return this.#defaultValue;
  }

  set defaultValue(value: string) {
    this.#defaultValue = value;
  }

  get inputElement(): HTMLInputElement | null {
    return this.shadowRoot?.querySelector("input") ?? null;
  }

  get exposedIsDisabled(): boolean {
    return this.isDisabled;
  }

  get exposedShowError(): boolean {
    return this.showError;
  }

  resetValidationInteraction(): void {
    this.formControl.resetInteraction();
  }

  protected override get isReadOnly(): boolean {
    return this.readOnly;
  }

  protected override getFormValue(): string | null {
    return this.value;
  }

  protected override getFormValidity() {
    return FormControlController.fromNativeControl(this.inputElement);
  }

  protected override getValidationAnchor(): HTMLElement | null {
    return this.inputElement;
  }

  protected override resetFormControl(): void {
    this.value = this.#defaultValue;
  }

  protected override restoreFormState(
    state: string | File | FormData | null,
    mode: "restore" | "autocomplete",
  ): void {
    this.restoredCalls.push({ state, mode });
    if (typeof state === "string") {
      this.value = state;
    }
  }

  protected override onFormAssociated(form: HTMLFormElement | null): void {
    this.associatedForms.push(form);
  }

  readonly #handleInput = (event: Event): void => {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.formControl.markDirty();
    this.formControl.sync();
  };

  readonly #handleBlur = (): void => {
    this.formControl.markTouched();
  };

  protected override render() {
    return html`
      <label for="input">${this.label}</label>
      <input
        id="input"
        type=${this.type}
        .value=${live(this.value)}
        ?disabled=${this.isDisabled}
        ?required=${this.required}
        ?readonly=${this.readOnly}
        minlength=${this.minLength ?? nothing}
        pattern=${this.pattern ?? nothing}
        aria-invalid=${this.showError ? "true" : "false"}
        @input=${this.#handleInput}
        @blur=${this.#handleBlur}
      />
    `;
  }
}

class TestChoiceProbe extends FormControlElement {
  static override styles = [resetStyles, focusStyles];

  static override properties: PropertyDeclarations = {
    ...FormControlElement.properties,
    checked: { type: Boolean, reflect: true },
    value: { type: String },
    omitMessage: { type: Boolean },
    useDetachedAnchor: { type: Boolean },
  };

  declare checked: boolean;
  declare value: string;
  declare omitMessage: boolean;
  declare useDetachedAnchor: boolean;

  #defaultChecked = false;
  readonly #detachedAnchor = document.createElement("button");

  constructor() {
    super();
    this.checked = false;
    this.value = "on";
    this.omitMessage = false;
    this.useDetachedAnchor = false;
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.#defaultChecked = this.hasAttribute("checked") || this.checked;
  }

  get buttonElement(): HTMLButtonElement | null {
    return this.shadowRoot?.querySelector("button") ?? null;
  }

  toggleByUser(): void {
    if (this.isDisabled) {
      return;
    }
    this.checked = !this.checked;
    this.formControl.markCommitted();
    this.formControl.sync();
  }

  protected override getFormValue(): string | null {
    return this.checked ? this.value : null;
  }

  protected override getFormState(): string | null {
    return this.checked ? "checked" : "unchecked";
  }

  protected override getFormValidity() {
    if (this.required && !this.checked) {
      return {
        flags: { valueMissing: true },
        message: this.omitMessage ? "" : "Please accept this option.",
        anchor: this.useDetachedAnchor ? this.#detachedAnchor : (this.buttonElement ?? undefined),
      };
    }
    return { flags: {} };
  }

  protected override getValidationAnchor(): HTMLElement | null {
    return this.buttonElement;
  }

  protected override resetFormControl(): void {
    this.checked = this.#defaultChecked;
  }

  protected override restoreFormState(state: string | File | FormData | null): void {
    this.checked = state === "checked";
  }

  protected override render() {
    return html`
      <button
        type="button"
        role="switch"
        aria-checked=${this.checked ? "true" : "false"}
        ?disabled=${this.isDisabled}
        @click=${() => this.toggleByUser()}
      >
        Toggle option
      </button>
    `;
  }
}

const TEXT_TAG = "san-test-text-probe";
const CHOICE_TAG = "san-test-choice-probe";
defineElement(TEXT_TAG, TestTextProbe);
defineElement(CHOICE_TAG, TestChoiceProbe);

describe("Shared FACE controller (FormControlController & FormControlElement)", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("submits values in FormData, tracks form association, and omits unchecked/null values", async () => {
    const form = document.createElement("form");
    const field = document.createElement(TEXT_TAG) as TestTextProbe;
    field.name = "username";
    field.value = "sanctuary";

    const choice = document.createElement(CHOICE_TAG) as TestChoiceProbe;
    choice.name = "terms";
    choice.value = "accepted";

    form.append(field, choice);
    document.body.append(form);
    await Promise.all([field.updateComplete, choice.updateComplete]);

    expect(field.form).toBe(form);
    expect(field.associatedForms).toContain(form);

    let data = new FormData(form);
    expect(data.get("username")).toBe("sanctuary");
    expect(data.has("terms")).toBe(false);

    choice.toggleByUser();
    await choice.updateComplete;

    data = new FormData(form);
    expect(data.get("terms")).toBe("accepted");

    field.remove();
    expect(field.form).toBeNull();
    expect(field.associatedForms.at(-1)).toBeNull();
  });

  it("responds to ancestor <fieldset disabled> without mutating host disabled attribute", async () => {
    const form = document.createElement("form");
    const fieldset = document.createElement("fieldset");
    const field = document.createElement(TEXT_TAG) as TestTextProbe;
    field.name = "email";
    field.required = true;
    field.value = "";

    fieldset.append(field);
    form.append(fieldset);
    document.body.append(form);
    await field.updateComplete;

    expect(field.validity.valueMissing).toBe(true);
    expect(field.exposedIsDisabled).toBe(false);

    fieldset.disabled = true;
    await field.updateComplete;

    expect(field.disabled).toBe(false);
    expect(field.hasAttribute("disabled")).toBe(false);
    expect(field.matches(":disabled")).toBe(true);
    expect(field.exposedIsDisabled).toBe(true);
    expect(field.inputElement?.disabled).toBe(true);
    expect(field.validity.valid).toBe(true);
    expect(field.matches(":state(invalid)")).toBe(false);
    expect(new FormData(form).has("email")).toBe(false);

    fieldset.disabled = false;
    await field.updateComplete;

    expect(field.disabled).toBe(false);
    expect(field.matches(":disabled")).toBe(false);
    expect(field.exposedIsDisabled).toBe(false);
    expect(field.inputElement?.disabled).toBe(false);
    expect(field.validity.valueMissing).toBe(true);
    expect(field.matches(":state(invalid)")).toBe(true);
  });

  it("bars disabled and readOnly controls from constraint validation", async () => {
    const form = document.createElement("form");
    const submitSpy = vi.fn((event: SubmitEvent) => event.preventDefault());
    form.addEventListener("submit", submitSpy);

    const field = document.createElement(TEXT_TAG) as TestTextProbe;
    field.name = "code";
    field.required = true;
    field.value = "";

    form.append(field);
    document.body.append(form);
    await field.updateComplete;

    expect(field.validity.valid).toBe(false);

    field.readOnly = true;
    await field.updateComplete;
    expect(field.validity.valid).toBe(true);
    expect(field.matches(":state(invalid)")).toBe(false);

    form.requestSubmit();
    expect(submitSpy).toHaveBeenCalledOnce();

    field.readOnly = false;
    await field.updateComplete;
    expect(field.validity.valid).toBe(false);

    field.disabled = true;
    await field.updateComplete;
    expect(field.validity.valid).toBe(true);

    form.requestSubmit();
    expect(submitSpy).toHaveBeenCalledTimes(2);
  });

  it("delegates native constraint validation, merges setCustomValidity, and focuses anchor on submit", async () => {
    const form = document.createElement("form");
    const submitSpy = vi.fn((event: SubmitEvent) => event.preventDefault());
    form.addEventListener("submit", submitSpy);

    const field = document.createElement(TEXT_TAG) as TestTextProbe;
    field.name = "email";
    field.type = "email";
    field.required = true;

    form.append(field);
    document.body.append(form);
    await field.updateComplete;

    // Empty required field blocks submission and focuses shadow anchor
    form.requestSubmit();
    expect(submitSpy).not.toHaveBeenCalled();
    expect(field.validity.valueMissing).toBe(true);
    expect(field.validationMessage).not.toBe("");
    expect(document.activeElement).toBe(field);
    expect(field.shadowRoot?.activeElement).toBe(field.inputElement);

    // Invalid email triggers typeMismatch
    const input = field.inputElement as HTMLInputElement;
    input.value = "not-an-email";
    input.dispatchEvent(new InputEvent("input", { bubbles: true, composed: true }));
    await field.updateComplete;

    expect(field.validity.valueMissing).toBe(false);
    expect(field.validity.typeMismatch).toBe(true);

    // Valid email clears built-in flags
    input.value = "user@sanctuary.dev";
    input.dispatchEvent(new InputEvent("input", { bubbles: true, composed: true }));
    await field.updateComplete;
    expect(field.validity.valid).toBe(true);

    // Custom validity blocks submission and merges cleanly
    field.setCustomValidity("This email is already taken.");
    expect(field.validity.customError).toBe(true);
    expect(field.validity.valid).toBe(false);
    expect(field.validationMessage).toBe("This email is already taken.");

    form.requestSubmit();
    expect(submitSpy).not.toHaveBeenCalled();

    // Clearing custom validity allows submission
    field.setCustomValidity("");
    expect(field.validity.valid).toBe(true);
    expect(field.validationMessage).toBe("");

    form.requestSubmit();
    expect(submitSpy).toHaveBeenCalledOnce();
  });

  it("tracks interaction-aware :state(user-invalid) and :state(user-valid) without premature errors", async () => {
    const form = document.createElement("form");
    const field = document.createElement(TEXT_TAG) as TestTextProbe;
    field.name = "email";
    field.type = "email";
    field.required = true;

    form.append(field);
    document.body.append(form);
    await field.updateComplete;

    // Neutral on initial mount despite being invalid
    expect(field.matches(":state(invalid)")).toBe(true);
    expect(field.matches(":state(user-invalid)")).toBe(false);
    expect(field.matches(":state(user-valid)")).toBe(false);
    expect(field.exposedShowError).toBe(false);

    // Programmatic checkValidity fires invalid without revealing user-invalid prematurely
    const invalidSpy = vi.fn();
    field.addEventListener("invalid", invalidSpy);
    expect(field.checkValidity()).toBe(false);
    expect(invalidSpy).toHaveBeenCalledOnce();
    expect(field.matches(":state(user-invalid)")).toBe(false);

    // Typing an invalid value before blur does not prematurely show user-invalid
    const input = field.inputElement as HTMLInputElement;
    input.value = "bad";
    input.dispatchEvent(new InputEvent("input", { bubbles: true, composed: true }));
    await field.updateComplete;
    expect(field.matches(":state(user-invalid)")).toBe(false);

    // Blurring after editing reveals user-invalid
    input.dispatchEvent(new FocusEvent("blur"));
    await field.updateComplete;
    expect(field.matches(":state(user-invalid)")).toBe(true);
    expect(field.exposedShowError).toBe(true);

    // Correcting the value recovers live while typing
    input.value = "valid@sanctuary.dev";
    input.dispatchEvent(new InputEvent("input", { bubbles: true, composed: true }));
    await field.updateComplete;
    expect(field.matches(":state(user-invalid)")).toBe(false);
    expect(field.matches(":state(user-valid)")).toBe(true);
    expect(field.exposedShowError).toBe(false);

    // Form reset clears user-valid/user-invalid and restores defaultValue
    form.reset();
    await field.updateComplete;
    expect(field.value).toBe("");
    expect(field.matches(":state(user-invalid)")).toBe(false);
    expect(field.matches(":state(user-valid)")).toBe(false);
    expect(field.matches(":state(invalid)")).toBe(true);

    // reportValidity reveals user-invalid on untouched invalid field
    expect(field.reportValidity()).toBe(false);
    await field.updateComplete;
    expect(field.matches(":state(user-invalid)")).toBe(true);

    // resetInteraction() clears user-invalid/user-valid without mutating value
    field.resetValidationInteraction();
    await field.updateComplete;
    expect(field.matches(":state(user-invalid)")).toBe(false);
    expect(field.matches(":state(user-valid)")).toBe(false);
    expect(field.exposedShowError).toBe(false);
    expect(field.matches(":state(invalid)")).toBe(true);
  });

  it("propagates native patternMismatch and tooShort constraints through fromNativeControl", async () => {
    const form = document.createElement("form");
    const field = document.createElement(TEXT_TAG) as TestTextProbe;
    field.name = "code";
    field.pattern = "[A-Z]{3}";
    field.minLength = 3;

    form.append(field);
    document.body.append(form);
    await field.updateComplete;

    const input = field.inputElement as HTMLInputElement;
    input.focus();
    await userEvent.type(input, "ab");
    await field.updateComplete;

    expect(field.validity.tooShort).toBe(true);
    expect(field.validity.patternMismatch).toBe(true);
    expect(field.validity.valid).toBe(false);

    await userEvent.clear(input);
    await userEvent.type(input, "ABC");
    await field.updateComplete;

    expect(field.validity.tooShort).toBe(false);
    expect(field.validity.patternMismatch).toBe(false);
    expect(field.validity.valid).toBe(true);
  });

  it("supports custom ValidityStateFlags, immediate commit on discrete controls, safe fallbacks, and state restore", async () => {
    const form = document.createElement("form");
    const choice = document.createElement(CHOICE_TAG) as TestChoiceProbe;
    choice.name = "agree";
    choice.required = true;

    form.append(choice);
    document.body.append(form);
    await choice.updateComplete;

    expect(choice.validity.valueMissing).toBe(true);
    expect(choice.validationMessage).toBe("Please accept this option.");
    expect(choice.matches(":state(user-invalid)")).toBe(false);

    // Checking commits and transitions immediately to user-valid
    choice.toggleByUser();
    await choice.updateComplete;
    expect(choice.validity.valid).toBe(true);
    expect(choice.matches(":state(user-valid)")).toBe(true);
    expect(choice.matches(":state(user-invalid)")).toBe(false);

    // Unchecking a required discrete control immediately reveals user-invalid
    choice.toggleByUser();
    await choice.updateComplete;
    expect(choice.validity.valueMissing).toBe(true);
    expect(choice.matches(":state(user-invalid)")).toBe(true);

    // Guard against empty message and detached anchor (must not throw TypeError / NotFoundError)
    // and fall back to getValidationAnchor() so focus still lands on the connected inner control
    choice.omitMessage = true;
    choice.useDetachedAnchor = true;
    await choice.updateComplete;
    expect(choice.validity.valueMissing).toBe(true);
    expect(choice.validationMessage).not.toBe("");
    form.requestSubmit();
    expect(document.activeElement).toBe(choice);
    expect(choice.shadowRoot?.activeElement).toBe(choice.buttonElement);

    // formStateRestoreCallback restores state and syncs FormData + validity
    choice.formStateRestoreCallback("checked", "restore");
    await choice.updateComplete;
    expect(choice.checked).toBe(true);
    expect(choice.validity.valid).toBe(true);
    expect(new FormData(form).get("agree")).toBe("on");
  });

  it("passes axe-core accessibility checks", async () => {
    const form = document.createElement("form");
    const field = document.createElement(TEXT_TAG) as TestTextProbe;
    field.name = "full-name";
    field.label = "Full name";

    const choice = document.createElement(CHOICE_TAG) as TestChoiceProbe;
    choice.name = "notifications";

    form.append(field, choice);
    document.body.append(form);
    await Promise.all([field.updateComplete, choice.updateComplete]);

    await expectAccessible(form);
  });
});
