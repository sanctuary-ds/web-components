import { type CSSResultGroup, html, type PropertyDeclarations, type PropertyValues } from "lit";
import { SanctuaryElement } from "../../internal/sanctuary-element.js";
import { resetStyles } from "../../styles/reset.js";
import type {
  SanToggleButton,
  ToggleButtonIntent,
  ToggleButtonSize,
  ToggleButtonVariant,
} from "../toggle-button/index.js";
import { toggleButtonGroupStyles } from "./san-toggle-button-group.styles.js";

/** Selection coordination mode of `<san-toggle-button-group>`. */
export type ToggleButtonGroupSelection = "single" | "multiple";

/** Layout and keyboard navigation axis of `<san-toggle-button-group>`. */
export type ToggleButtonGroupOrientation = "horizontal" | "vertical";

const supportsInternalsAria =
  typeof ElementInternals !== "undefined" && "role" in ElementInternals.prototype;

const hasNativeFocusGroup =
  typeof HTMLElement !== "undefined" && "focusGroup" in HTMLElement.prototype;

function isToggleButton(element: Element): element is SanToggleButton {
  return element.tagName.toLowerCase() === "san-toggle-button";
}

function getButtonValue(button: SanToggleButton): string {
  const raw =
    typeof button.value === "string" ? button.value : (button.getAttribute("value") ?? "");
  return raw;
}

/**
 * Accessible composite toolbar coordinating single or multiple `<san-toggle-button>`
 * children with roving keyboard navigation, shared appearance propagation, and
 * attached segmented or separated toolbar layouts.
 *
 * @tagname san-toggle-button-group
 * @summary Composite toggle button toolbar supporting single/multiple selection, mandatory mode, RTL-aware arrow navigation, and attached or separated layouts.
 *
 * @slot - Default slot accepting `<san-toggle-button>` controls.
 *
 * @csspart base - Flex container wrapping the slotted toggle buttons.
 *
 * @fires change - Dispatched when user interaction changes the group's selection.
 *
 * @cssprop [--san-toggle-button-group-radius=var(--san-radius-md)] - Outer corner radius in attached mode (`--san-radius-sm` on `sm`, `--san-radius-full` when `pill` is set).
 * @cssprop [--san-toggle-button-group-gap=var(--san-space-2)] - Spacing between buttons when `separated` is enabled.
 */
export class SanToggleButtonGroup extends SanctuaryElement {
  static override styles: CSSResultGroup = [resetStyles, toggleButtonGroupStyles];

  static override properties: PropertyDeclarations = {
    selection: { type: String, reflect: true },
    mandatory: { type: Boolean, reflect: true },
    value: { type: String },
    values: { attribute: false },
    variant: { type: String, reflect: true },
    intent: { type: String, reflect: true },
    size: { type: String, reflect: true },
    pill: { type: Boolean, reflect: true },
    orientation: { type: String, reflect: true },
    separated: { type: Boolean, reflect: true },
    disabled: { type: Boolean, reflect: true },
    label: { type: String },
  };

  /** Selection mode: `"single"` (at most one active) or `"multiple"` (any number active). */
  declare selection: ToggleButtonGroupSelection;

  /** Prevents user clicks from deselecting the last remaining pressed button. */
  declare mandatory: boolean;

  /** Active value in `"single"` mode, or the first selected value in `"multiple"` mode. */
  declare value: string;

  /** Ordered list of currently selected non-empty `<san-toggle-button>` values. */
  declare values: string[];

  /** Visual emphasis variant propagated to managed `<san-toggle-button>` children. */
  declare variant: ToggleButtonVariant;

  /** Semantic color intent propagated to managed `<san-toggle-button>` children. */
  declare intent: ToggleButtonIntent;

  /** Control size preset propagated to managed `<san-toggle-button>` children. */
  declare size: ToggleButtonSize;

  /** Applies pill outer corners in attached mode, or propagates `pill` to each button when `separated`. */
  declare pill: boolean;

  /** Layout and arrow-key navigation axis (`"horizontal"` or `"vertical"`). */
  declare orientation: ToggleButtonGroupOrientation;

  /** Switches from an attached segmented bar to a spaced toolbar using `--san-toggle-button-group-gap`. */
  declare separated: boolean;

  /** Disables all managed toggle buttons while preserving individually disabled buttons when re-enabled. */
  declare disabled: boolean;

  /** Accessible name for the `role="toolbar"` container when host `aria-label` or `aria-labelledby` is not provided. */
  declare label: string;

  readonly #groupDisabledButtons = new WeakSet<SanToggleButton>();
  #activeTabStop: SanToggleButton | null = null;
  #lastSyncedValue = "";
  #lastSyncedValues: string[] = [];
  #warnedMissingLabel = false;

  constructor() {
    super();
    this.selection = "single";
    this.mandatory = false;
    this.value = "";
    this.values = [];
    this.variant = "outlined";
    this.intent = "accent";
    this.size = "md";
    this.pill = false;
    this.orientation = "horizontal";
    this.separated = false;
    this.disabled = false;
    this.label = "";
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener("click", this.#handleHostClickCapture, { capture: true });
    if (!hasNativeFocusGroup) {
      this.addEventListener("focusin", this.#handleFocusIn);
      this.addEventListener("keydown", this.#handleKeyDown);
    }
  }

  override disconnectedCallback(): void {
    this.removeEventListener("click", this.#handleHostClickCapture, { capture: true });
    if (!hasNativeFocusGroup) {
      this.removeEventListener("focusin", this.#handleFocusIn);
      this.removeEventListener("keydown", this.#handleKeyDown);
    }
    super.disconnectedCallback();
  }

  protected override willUpdate(changedProperties: PropertyValues<this>): void {
    this.#syncToolbarSemantics();

    const isInitial = !this.hasUpdated;
    const buttons = this.#getButtons();

    if (
      isInitial ||
      changedProperties.has("variant") ||
      changedProperties.has("intent") ||
      changedProperties.has("size") ||
      changedProperties.has("pill") ||
      changedProperties.has("separated") ||
      changedProperties.has("disabled")
    ) {
      this.#syncChildPresentation(buttons);
    }

    const valuesExternallyChanged =
      changedProperties.has("values") && this.values !== this.#lastSyncedValues;
    const valueExternallyChanged =
      changedProperties.has("value") && this.value !== this.#lastSyncedValue;

    if (isInitial) {
      this.#syncInitialSelection(buttons);
    } else if (valuesExternallyChanged) {
      this.#applyValuesToButtons(buttons, this.values);
    } else if (valueExternallyChanged) {
      const targetValues =
        typeof this.value === "string" && this.value.length > 0 ? [this.value] : [];
      this.#applyValuesToButtons(buttons, targetValues);
    } else if (changedProperties.has("selection") && this.selection === "single") {
      this.#enforceSingleSelection(buttons);
      this.#syncSelectionFromButtons(buttons);
    }

    if (!hasNativeFocusGroup) {
      this.#syncTabIndexes(buttons);
    }
  }

  protected override updated(changedProperties: PropertyValues<this>): void {
    super.updated(changedProperties);
    this.#warnIfUnlabelled();
  }

  #getButtons(): SanToggleButton[] {
    const slot = this.shadowRoot?.querySelector<HTMLSlotElement>("slot:not([name])");
    const elements = slot ? slot.assignedElements({ flatten: true }) : Array.from(this.children);
    return elements.filter(isToggleButton);
  }

  #findButtonFromEvent(event: Event): SanToggleButton | null {
    const buttons = new Set(this.#getButtons());
    for (const node of event.composedPath()) {
      if (node instanceof Element && isToggleButton(node) && buttons.has(node)) {
        return node;
      }
    }
    return null;
  }

  #syncToolbarSemantics(): void {
    const orientation = this.orientation === "vertical" ? "vertical" : "horizontal";
    const trimmedLabel = typeof this.label === "string" ? this.label.trim() : "";

    if (supportsInternalsAria && this.internals) {
      this.internals.role = "toolbar";
      this.internals.ariaOrientation = orientation;
      this.internals.ariaLabel = trimmedLabel ? this.label : null;
      return;
    }

    if (!this.hasAttribute("role")) {
      this.setAttribute("role", "toolbar");
    }
    this.setAttribute("aria-orientation", orientation);
    if (trimmedLabel) {
      this.setAttribute("aria-label", this.label);
    }
  }

  #warnIfUnlabelled(): void {
    const hasLabel = typeof this.label === "string" && this.label.trim().length > 0;
    if (
      !this.#warnedMissingLabel &&
      !hasLabel &&
      !this.hasAttribute("aria-label") &&
      !this.hasAttribute("aria-labelledby")
    ) {
      this.#warnedMissingLabel = true;
      console.warn(
        "<san-toggle-button-group> requires a non-empty `label` (or host `aria-label` / `aria-labelledby`) for its toolbar role (WCAG 4.1.2).",
      );
    }
  }

  #syncChildPresentation(buttons: readonly SanToggleButton[]): void {
    for (const button of buttons) {
      button.variant = this.variant;
      button.intent = this.intent;
      button.size = this.size;
      button.pill = this.separated ? this.pill : false;

      if (this.disabled) {
        if (!button.disabled) {
          this.#groupDisabledButtons.add(button);
          button.disabled = true;
        }
      } else if (this.#groupDisabledButtons.has(button)) {
        this.#groupDisabledButtons.delete(button);
        button.disabled = false;
      }
    }
  }

  #syncInitialSelection(buttons: readonly SanToggleButton[]): void {
    const hasExplicitValue = typeof this.value === "string" && this.value.length > 0;
    const hasExplicitValues = Array.isArray(this.values) && this.values.length > 0;

    if (hasExplicitValue) {
      this.#applyValuesToButtons(buttons, [this.value]);
      return;
    }

    if (hasExplicitValues) {
      this.#applyValuesToButtons(buttons, this.values);
      return;
    }

    if (this.selection === "single") {
      this.#enforceSingleSelection(buttons);
    }
    this.#syncSelectionFromButtons(buttons);
  }

  #applyValuesToButtons(
    buttons: readonly SanToggleButton[],
    requestedValues: readonly string[],
  ): void {
    const allowed = new Set(
      (Array.isArray(requestedValues) ? requestedValues : []).filter(
        (entry): entry is string => typeof entry === "string" && entry.length > 0,
      ),
    );

    let matchedSingle = false;
    for (const button of buttons) {
      const btnValue = getButtonValue(button);
      let shouldPress = btnValue.length > 0 && allowed.has(btnValue);
      if (shouldPress && this.selection === "single") {
        if (matchedSingle) {
          shouldPress = false;
        } else {
          matchedSingle = true;
        }
      }
      if (button.pressed !== shouldPress) {
        button.pressed = shouldPress;
      }
    }

    this.#syncSelectionFromButtons(buttons);
  }

  #enforceSingleSelection(buttons: readonly SanToggleButton[], preferred?: SanToggleButton): void {
    let kept = preferred?.pressed ? preferred : null;
    for (const button of buttons) {
      if (!button.pressed) {
        continue;
      }
      if (!kept) {
        kept = button;
      } else if (button !== kept) {
        button.pressed = false;
      }
    }
  }

  #syncSelectionFromButtons(buttons: readonly SanToggleButton[]): void {
    const nextValues: string[] = [];
    for (const button of buttons) {
      if (button.pressed) {
        const btnValue = getButtonValue(button);
        if (btnValue.length > 0) {
          nextValues.push(btnValue);
        }
      }
    }

    const nextValue = nextValues[0] ?? "";
    const valuesChanged =
      !Array.isArray(this.values) ||
      this.values.length !== nextValues.length ||
      this.values.some((entry, index) => entry !== nextValues[index]);

    if (this.value !== nextValue || valuesChanged) {
      this.#lastSyncedValue = nextValue;
      this.#lastSyncedValues = nextValues;
      this.value = nextValue;
      this.values = nextValues;
    } else {
      this.#lastSyncedValue = this.value;
      this.#lastSyncedValues = this.values;
    }
  }

  #syncTabIndexes(buttons: readonly SanToggleButton[]): void {
    const enabled = buttons.filter((button) => !button.disabled);
    if (enabled.length === 0) {
      this.#activeTabStop = null;
      for (const button of buttons) {
        button.tabIndex = -1;
      }
      return;
    }

    if (!this.#activeTabStop || !enabled.includes(this.#activeTabStop)) {
      this.#activeTabStop = enabled.find((button) => button.pressed) ?? enabled[0] ?? null;
    }

    for (const button of buttons) {
      button.tabIndex = button === this.#activeTabStop ? 0 : -1;
    }
  }

  readonly #handleHostClickCapture = (event: MouseEvent): void => {
    if (this.disabled) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }

    if (!this.mandatory) {
      return;
    }

    const button = this.#findButtonFromEvent(event);
    if (!button || button.disabled || !button.pressed) {
      return;
    }

    const pressedCount = this.#getButtons().filter((item) => item.pressed).length;
    if (pressedCount <= 1) {
      event.preventDefault();
    }
  };

  readonly #handleChildChange = (event: Event): void => {
    const button = this.#findButtonFromEvent(event);
    if (!button) {
      return;
    }

    event.stopPropagation();

    const buttons = this.#getButtons();
    if (this.selection === "single" && button.pressed) {
      this.#enforceSingleSelection(buttons, button);
    }

    this.#syncSelectionFromButtons(buttons);
    if (!hasNativeFocusGroup && !button.disabled) {
      this.#activeTabStop = button;
      this.#syncTabIndexes(buttons);
    }

    this.dispatchEvent(new Event("change", { bubbles: true, composed: true }));
  };

  readonly #handleSlotChange = (): void => {
    const buttons = this.#getButtons();
    this.#syncChildPresentation(buttons);
    if (this.selection === "single") {
      this.#enforceSingleSelection(buttons);
    }
    this.#syncSelectionFromButtons(buttons);
    if (!hasNativeFocusGroup) {
      this.#syncTabIndexes(buttons);
    }
  };

  readonly #handleFocusIn = (event: FocusEvent): void => {
    const button = this.#findButtonFromEvent(event);
    if (!button || button.disabled) {
      return;
    }
    this.#activeTabStop = button;
    this.#syncTabIndexes(this.#getButtons());
  };

  readonly #handleKeyDown = (event: KeyboardEvent): void => {
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) {
      return;
    }

    const buttons = this.#getButtons();
    const enabled = buttons.filter((button) => !button.disabled);
    if (enabled.length === 0) {
      return;
    }

    const current = this.#findButtonFromEvent(event);
    const currentIndex = current ? enabled.indexOf(current) : -1;
    if (currentIndex === -1) {
      return;
    }

    const vertical = this.orientation === "vertical";
    const rtl = getComputedStyle(this).direction === "rtl";

    let nextIndex: number | null = null;
    if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = enabled.length - 1;
    } else if (vertical) {
      if (event.key === "ArrowDown") {
        nextIndex = (currentIndex + 1) % enabled.length;
      } else if (event.key === "ArrowUp") {
        nextIndex = (currentIndex - 1 + enabled.length) % enabled.length;
      }
    } else {
      const forward = rtl ? "ArrowLeft" : "ArrowRight";
      const backward = rtl ? "ArrowRight" : "ArrowLeft";
      if (event.key === forward) {
        nextIndex = (currentIndex + 1) % enabled.length;
      } else if (event.key === backward) {
        nextIndex = (currentIndex - 1 + enabled.length) % enabled.length;
      }
    }

    if (nextIndex === null) {
      return;
    }

    const target = enabled[nextIndex];
    if (!target) {
      return;
    }

    event.preventDefault();
    this.#activeTabStop = target;
    this.#syncTabIndexes(buttons);
    target.focus();
  };

  protected override render() {
    const focusgroup = this.orientation === "vertical" ? "toolbar wrap block" : "toolbar wrap";

    return html`
      <div part="base" class="group" focusgroup=${focusgroup}>
        <slot
          @slotchange=${this.#handleSlotChange}
          @change=${this.#handleChildChange}
        ></slot>
      </div>
    `;
  }
}
