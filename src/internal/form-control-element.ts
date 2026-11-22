import type { PropertyDeclarations, PropertyValues } from "lit";
import {
  FormControlController,
  type FormValidityInput,
  type FormValue,
} from "./form-control-controller.js";
import { SanctuaryElement } from "./sanctuary-element.js";

/**
 * Private shared base class for Sanctuary Form-Associated Custom Elements (FACE).
 *
 * Bridges browser FACE lifecycle callbacks (`formAssociatedCallback`,
 * `formDisabledCallback`, `formResetCallback`, `formStateRestoreCallback`) and
 * standard HTML constraint validation APIs (`form`, `validity`, `validationMessage`,
 * `willValidate`, `checkValidity()`, `reportValidity()`, `setCustomValidity()`)
 * to `FormControlController`.
 */
export abstract class FormControlElement extends SanctuaryElement {
  static formAssociated = true;

  static override shadowRootOptions: ShadowRootInit = {
    ...SanctuaryElement.shadowRootOptions,
    delegatesFocus: true,
  };

  static override properties: PropertyDeclarations = {
    name: { type: String, reflect: true },
    disabled: { type: Boolean, reflect: true },
    required: { type: Boolean, reflect: true },
  };

  /** Field name submitted with the owning `<form>`. */
  declare name: string;

  /** Disables the control, removes it from form submission, and bars constraint validation. */
  declare disabled: boolean;

  /** Requires a value or selection before the owning `<form>` can be submitted. */
  declare required: boolean;

  /** Internal FACE reactive controller managing form value, validation, and lifecycle state. */
  protected readonly formControl: FormControlController;

  constructor() {
    super();
    this.name = "";
    this.disabled = false;
    this.required = false;

    this.formControl = new FormControlController(this, {
      getInternals: () => this.internals,
      setCustomState: (name, active) => this.setCustomState(name, active),
      getFormValue: () => this.getFormValue(),
      getFormState: () => this.getFormState(),
      isHostDisabled: () => this.disabled,
      isReadOnly: () => this.isReadOnly,
      getValidity: () => this.getFormValidity(),
      getValidationAnchor: () => this.getValidationAnchor(),
      onReset: () => this.resetFormControl(),
      onStateRestore: (state, mode) => this.restoreFormState(state, mode),
      onFormAssociated: (form) => this.onFormAssociated(form),
    });
  }

  /** Owning `<form>` element, or `null` when not associated with a form. */
  get form(): HTMLFormElement | null {
    return this.formControl.form;
  }

  /** Current `ValidityState` of the control. */
  get validity(): ValidityState {
    return this.formControl.validity;
  }

  /** Current constraint validation message, or an empty string when valid. */
  get validationMessage(): string {
    return this.formControl.validationMessage;
  }

  /** Whether the control participates in constraint validation. */
  get willValidate(): boolean {
    return this.formControl.willValidate;
  }

  /** Checks constraint validity and dispatches `invalid` if invalid without forcing error UI. */
  checkValidity(): boolean {
    return this.formControl.checkValidity();
  }

  /** Checks constraint validity, reveals validation UI on failure, and reports to the user. */
  reportValidity(): boolean {
    return this.formControl.reportValidity();
  }

  /** Sets a custom validation error message, or clears it when passed an empty string. */
  setCustomValidity(message: string): void {
    this.formControl.setCustomValidity(message);
  }

  /** Called by the browser when the control's owning `<form>` changes. */
  formAssociatedCallback(form: HTMLFormElement | null): void {
    this.formControl.handleFormAssociated(form);
  }

  /**
   * Called by the browser when an ancestor `<fieldset>` toggles `disabled`.
   * Disables the internal control without mutating the host `disabled` attribute.
   */
  formDisabledCallback(disabled: boolean): void {
    this.formControl.handleFormDisabled(disabled);
  }

  /** Called by the browser when the owning `<form>` resets. */
  formResetCallback(): void {
    this.formControl.handleFormReset();
  }

  /** Called by the browser to restore form control state (bfcache / autofill). */
  formStateRestoreCallback(
    state: string | File | FormData | null,
    mode: "restore" | "autocomplete",
  ): void {
    this.formControl.handleFormStateRestore(state, mode);
  }

  protected override willUpdate(changedProperties: PropertyValues<this>): void {
    if (changedProperties.has("disabled")) {
      // Sync host attribute before render() so the browser's FACE
      // formDisabledCallback updates formDisabled in the same update cycle.
      this.toggleAttribute("disabled", this.disabled);
    }
  }

  /** Effective disabled state combining host `disabled` and ancestor `<fieldset disabled>`. */
  protected get isDisabled(): boolean {
    return this.formControl.isDisabled;
  }

  /** Whether the control is currently read-only and barred from constraint validation. */
  protected get isReadOnly(): boolean {
    return false;
  }

  /** Whether validation errors should currently be displayed (interaction-aware). */
  protected get showError(): boolean {
    return this.formControl.userInvalid;
  }

  /** Returns the current form submission value (`null` omits the field from `FormData`). */
  protected abstract getFormValue(): FormValue;

  /** Optional state snapshot stored separately from submission value for browser restore. */
  protected getFormState(): FormValue {
    return this.getFormValue();
  }

  /** Returns built-in constraint validity flags, message, and focus anchor. */
  protected getFormValidity(): FormValidityInput {
    return {};
  }

  /** Returns the focusable shadow element to anchor native validation popups. */
  protected getValidationAnchor(): HTMLElement | null {
    return null;
  }

  /** Restores the control's value or checked state when its owning `<form>` resets. */
  protected abstract resetFormControl(): void;

  /** Restores state supplied by `formStateRestoreCallback`. */
  protected restoreFormState(
    _state: string | File | FormData | null,
    _mode: "restore" | "autocomplete",
  ): void {}

  /** Optional hook invoked when the control's associated `<form>` changes. */
  protected onFormAssociated(_form: HTMLFormElement | null): void {}
}
