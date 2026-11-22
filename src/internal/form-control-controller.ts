import type { ReactiveController, ReactiveControllerHost } from "lit";

/** Value types accepted by `ElementInternals.setFormValue()`. */
export type FormValue = File | string | FormData | null;

/** Validity snapshot supplied by a form control host to `FormControlController`. */
export interface FormValidityInput {
  /** Native `ValidityStateFlags` (excluding `customError`, which the controller manages). */
  flags?: ValidityStateFlags | undefined;
  /** Validation message shown when any flag in `flags` is `true`. */
  message?: string | undefined;
  /** Focusable shadow-including descendant that receives focus on validation report. */
  anchor?: HTMLElement | undefined;
}

/** Configuration connecting a Lit custom element host to `FormControlController`. */
export interface FormControlControllerOptions {
  /** Returns the host's attached `ElementInternals`, or `null` if unavailable. */
  getInternals: () => ElementInternals | null;
  /** Adds or removes a `CustomStateSet` entry on the host (`:state(<name>)`). */
  setCustomState: (name: string, active: boolean) => void;
  /** Returns the value submitted to the owning `<form>` (`null` omits the entry). */
  getFormValue: () => FormValue;
  /** Optional state snapshot stored separately from submission value for browser restore. */
  getFormState?: (() => FormValue) | undefined;
  /** Returns whether the host's own `disabled` property is currently `true`. */
  isHostDisabled: () => boolean;
  /** Optional: returns whether the control is read-only (barred from constraint validation). */
  isReadOnly?: (() => boolean) | undefined;
  /** Computes built-in constraint validity for the control (excluding `customError`). */
  getValidity?: (() => FormValidityInput) | undefined;
  /** Fallback focusable anchor used when `getValidity()` does not provide one. */
  getValidationAnchor?: (() => HTMLElement | null | undefined) | undefined;
  /** Invoked when the owning `<form>` resets. */
  onReset?: (() => void) | undefined;
  /** Invoked when the browser restores form state (bfcache / autofill). */
  onStateRestore?:
    | ((state: string | File | FormData | null, mode: "restore" | "autocomplete") => void)
    | undefined;
  /** Invoked when the control's associated `<form>` changes. */
  onFormAssociated?: ((form: HTMLFormElement | null) => void) | undefined;
}

const DEFAULT_VALIDITY_STATE: ValidityState = Object.freeze({
  badInput: false,
  customError: false,
  patternMismatch: false,
  rangeOverflow: false,
  rangeUnderflow: false,
  stepMismatch: false,
  tooLong: false,
  tooShort: false,
  typeMismatch: false,
  valid: true,
  valueMissing: false,
});

const BUILT_IN_VALIDITY_KEYS = [
  "badInput",
  "patternMismatch",
  "rangeOverflow",
  "rangeUnderflow",
  "stepMismatch",
  "tooLong",
  "tooShort",
  "typeMismatch",
  "valueMissing",
] as const;

const FALLBACK_VALIDATION_MESSAGE = "Invalid value.";

/**
 * Shared Lit `ReactiveController` implementing Form-Associated Custom Element (FACE)
 * participation through `ElementInternals`.
 *
 * Responsibilities:
 * - Form value & state synchronization (`setFormValue`)
 * - Native & custom constraint validation (`setValidity`, `setCustomValidity`, `checkValidity`, `reportValidity`)
 * - Cross-browser interaction-aware states (`:state(invalid)`, `:state(user-invalid)`, `:state(user-valid)`)
 * - Ancestor `<fieldset disabled>` handling without mutating the host `disabled` attribute
 * - Form reset, state restore, and form association callbacks
 */
export class FormControlController implements ReactiveController {
  readonly #host: ReactiveControllerHost & HTMLElement;
  readonly #options: FormControlControllerOptions;

  #formDisabled = false;
  #customValidityMessage = "";
  #dirty = false;
  #touched = false;
  #showValidation = false;
  #suppressRevealOnInvalid = false;
  #isInvalid = false;
  #isUserInvalid = false;
  #isUserValid = false;

  /**
   * Extracts built-in `ValidityStateFlags`, `validationMessage`, and focus anchor
   * from a delegated native form control inside Shadow DOM.
   */
  static fromNativeControl(
    control: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null | undefined,
  ): FormValidityInput {
    if (!control) {
      return {};
    }

    const flags: ValidityStateFlags = {};
    for (const key of BUILT_IN_VALIDITY_KEYS) {
      if (control.validity[key]) {
        flags[key] = true;
      }
    }

    return {
      flags,
      message: control.validationMessage,
      anchor: control,
    };
  }

  constructor(host: ReactiveControllerHost & HTMLElement, options: FormControlControllerOptions) {
    this.#host = host;
    this.#options = options;
    host.addController(this);
  }

  /** Whether an ancestor `<fieldset disabled>` currently disables this control. */
  get formDisabled(): boolean {
    return this.#formDisabled;
  }

  /** Effective disabled state combining host `disabled` and ancestor `<fieldset disabled>`. */
  get isDisabled(): boolean {
    return this.#options.isHostDisabled() || this.#formDisabled;
  }

  /** Whether the user has edited the control since mount or last form reset. */
  get dirty(): boolean {
    return this.#dirty;
  }

  /** Whether the user has blurred or committed the control since mount or last form reset. */
  get touched(): boolean {
    return this.#touched;
  }

  /** Whether the control currently violates constraint validation (regardless of interaction). */
  get invalid(): boolean {
    return this.#isInvalid;
  }

  /** Whether the control is invalid and validation feedback should be visible to the user. */
  get userInvalid(): boolean {
    return this.#isUserInvalid;
  }

  /** Whether the control is valid after user interaction/submission. */
  get userValid(): boolean {
    return this.#isUserValid;
  }

  /** Owning `<form>` element, or `null` when unassociated. */
  get form(): HTMLFormElement | null {
    return this.#options.getInternals()?.form ?? null;
  }

  /** Current `ValidityState` from `ElementInternals`. */
  get validity(): ValidityState {
    return this.#options.getInternals()?.validity ?? DEFAULT_VALIDITY_STATE;
  }

  /** Current validation message from `ElementInternals`. */
  get validationMessage(): string {
    return this.#options.getInternals()?.validationMessage ?? "";
  }

  /** Whether the control is a candidate for constraint validation. */
  get willValidate(): boolean {
    if (this.isDisabled || this.#options.isReadOnly?.()) {
      return false;
    }
    return this.#options.getInternals()?.willValidate ?? false;
  }

  hostConnected(): void {
    this.#host.addEventListener("invalid", this.#handleHostInvalid);
  }

  hostDisconnected(): void {
    this.#host.removeEventListener("invalid", this.#handleHostInvalid);
  }

  hostUpdated(): void {
    const prevUserInvalid = this.#isUserInvalid;
    this.sync();
    if (this.#isUserInvalid !== prevUserInvalid) {
      this.#host.requestUpdate();
    }
  }

  /** Checks validity and fires `invalid` if invalid without prematurely revealing `:state(user-invalid)`. */
  checkValidity(): boolean {
    this.syncValidity();
    const internals = this.#options.getInternals();
    if (!internals || typeof internals.checkValidity !== "function") {
      return true;
    }

    this.#suppressRevealOnInvalid = true;
    try {
      return internals.checkValidity();
    } finally {
      this.#suppressRevealOnInvalid = false;
    }
  }

  /** Checks validity, reveals `:state(user-invalid)` on failure, and reports to the user. */
  reportValidity(): boolean {
    this.syncValidity();
    const internals = this.#options.getInternals();
    if (!internals || typeof internals.reportValidity !== "function") {
      return true;
    }

    const valid = internals.reportValidity();
    if (!valid) {
      this.#revealValidation();
    }
    return valid;
  }

  /** Sets or clears a custom constraint validation error message. */
  setCustomValidity(message: string): void {
    this.#customValidityMessage = message;
    const prevUserInvalid = this.#isUserInvalid;
    this.syncValidity();
    if (this.#isUserInvalid !== prevUserInvalid) {
      this.#host.requestUpdate();
    }
  }

  /** Records user input on text-like controls; recovers live if validation is already visible. */
  markDirty(): void {
    this.#dirty = true;
    if (this.#showValidation) {
      const prevUserInvalid = this.#isUserInvalid;
      this.syncValidity();
      if (this.#isUserInvalid !== prevUserInvalid) {
        this.#host.requestUpdate();
      }
    }
  }

  /** Records blur on text-like controls; reveals validation if the user already edited the field. */
  markTouched(): void {
    this.#touched = true;
    if (this.#dirty) {
      this.#revealValidation();
    }
  }

  /** Records an immediate committed interaction (checkbox, radio, switch) and reveals validation. */
  markCommitted(): void {
    this.#dirty = true;
    this.#touched = true;
    this.#revealValidation();
  }

  /** Resets interaction-tracking flags and clears `:state(user-invalid)` / `:state(user-valid)`. */
  resetInteraction(): void {
    const changed = this.#dirty || this.#touched || this.#showValidation;
    this.#dirty = false;
    this.#touched = false;
    this.#showValidation = false;
    this.#updateCustomStates();
    if (changed) {
      this.#host.requestUpdate();
    }
  }

  /** Synchronizes both the submitted form value and constraint validity with `ElementInternals`. */
  sync(): void {
    this.syncValue();
    this.syncValidity();
  }

  /** Synchronizes the submitted form value (and optional state) via `ElementInternals.setFormValue()`. */
  syncValue(): void {
    const internals = this.#options.getInternals();
    if (!internals || typeof internals.setFormValue !== "function") {
      return;
    }

    const value = this.isDisabled ? null : this.#options.getFormValue();
    if (this.#options.getFormState) {
      const state = this.isDisabled ? null : this.#options.getFormState();
      internals.setFormValue(value, state);
    } else {
      internals.setFormValue(value);
    }
  }

  /** Synchronizes constraint validation flags, message, anchor, and custom CSS states. */
  syncValidity(): void {
    const internals = this.#options.getInternals();
    const barred = this.isDisabled || Boolean(this.#options.isReadOnly?.());

    if (barred) {
      if (internals && typeof internals.setValidity === "function") {
        internals.setValidity({});
      }
      this.#isInvalid = false;
      this.#updateCustomStates();
      return;
    }

    const input = this.#options.getValidity?.() ?? {};
    const mergedFlags: ValidityStateFlags = {};
    let hasError = false;

    if (input.flags) {
      for (const key of BUILT_IN_VALIDITY_KEYS) {
        if (input.flags[key]) {
          mergedFlags[key] = true;
          hasError = true;
        }
      }
    }

    if (this.#customValidityMessage.length > 0) {
      mergedFlags.customError = true;
      hasError = true;
    }

    if (internals && typeof internals.setValidity === "function") {
      if (!hasError) {
        internals.setValidity({});
      } else {
        const message =
          this.#customValidityMessage || input.message?.trim() || FALLBACK_VALIDATION_MESSAGE;
        const anchor = this.#resolveValidAnchor(
          input.anchor ?? this.#options.getValidationAnchor?.(),
        );
        if (anchor) {
          internals.setValidity(mergedFlags, message, anchor);
        } else {
          internals.setValidity(mergedFlags, message);
        }
      }
    }

    this.#isInvalid = hasError;
    this.#updateCustomStates();
  }

  /** Forwards `formAssociatedCallback` from the custom element host. */
  handleFormAssociated(form: HTMLFormElement | null): void {
    this.#options.onFormAssociated?.(form);
  }

  /**
   * Forwards `formDisabledCallback` from the custom element host.
   * Never mutates the host's own `disabled` attribute so ancestor `<fieldset>` toggles recover cleanly.
   */
  handleFormDisabled(disabled: boolean): void {
    this.#formDisabled = disabled;
    this.sync();
    this.#host.requestUpdate();
  }

  /** Forwards `formResetCallback` from the custom element host. */
  handleFormReset(): void {
    this.#dirty = false;
    this.#touched = false;
    this.#showValidation = false;
    this.#options.onReset?.();
    this.sync();
    this.#host.requestUpdate();
  }

  /** Forwards `formStateRestoreCallback` from the custom element host. */
  handleFormStateRestore(
    state: string | File | FormData | null,
    mode: "restore" | "autocomplete",
  ): void {
    this.#options.onStateRestore?.(state, mode);
    this.sync();
    this.#host.requestUpdate();
  }

  readonly #handleHostInvalid = (): void => {
    if (this.#suppressRevealOnInvalid) {
      return;
    }
    this.#revealValidation();
  };

  #revealValidation(): void {
    const prevUserInvalid = this.#isUserInvalid;
    const prevUserValid = this.#isUserValid;
    this.#showValidation = true;
    this.syncValidity();
    if (this.#isUserInvalid !== prevUserInvalid || this.#isUserValid !== prevUserValid) {
      this.#host.requestUpdate();
    }
  }

  #updateCustomStates(): void {
    const barred = this.isDisabled || Boolean(this.#options.isReadOnly?.());
    const invalid = !barred && this.#isInvalid;
    const userInvalid = !barred && this.#showValidation && invalid;
    const userValid = !barred && this.#showValidation && !invalid;

    this.#isUserInvalid = userInvalid;
    this.#isUserValid = userValid;

    this.#options.setCustomState("invalid", invalid);
    this.#options.setCustomState("user-invalid", userInvalid);
    this.#options.setCustomState("user-valid", userValid);
  }

  #resolveValidAnchor(candidate: HTMLElement | null | undefined): HTMLElement | undefined {
    if (!candidate?.isConnected) {
      return undefined;
    }
    if (this.#host.shadowRoot?.contains(candidate) || this.#host.contains(candidate)) {
      return candidate;
    }
    return undefined;
  }
}
