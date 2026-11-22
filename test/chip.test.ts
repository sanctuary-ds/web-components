import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { page, userEvent } from "vitest/browser";
import "../src/components/chip/register.js";
import { SanChip } from "../src/components/chip/index.js";
import { SanChip as RootSanChip } from "../src/index.js";
import { expectAccessible } from "./helpers/a11y.js";

const SAMPLE_ICON = `<svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><circle cx="10" cy="10" r="6"/></svg>`;

function renderChip(htmlText: string): SanChip {
  const wrapper = document.createElement("div");
  wrapper.innerHTML = htmlText.trim();
  const el = wrapper.firstElementChild as SanChip;
  document.body.append(el);
  return el;
}

async function settleTransitions(el: Element): Promise<void> {
  // Flush computed styles so pending CSS transitions instantiate before finishing them.
  void getComputedStyle(el).borderColor;
  const animations = el.getAnimations();
  for (const animation of animations) {
    animation.finish();
  }
  await Promise.allSettled(animations.map((animation) => animation.finished));
}

function getPart<T extends Element = HTMLElement>(el: SanChip, part: string): T {
  const node = el.shadowRoot?.querySelector<T>(`[part='${part}']`);
  if (!node) {
    throw new Error(`Expected [part='${part}'] element in shadowRoot`);
  }
  return node;
}

describe("<san-chip>", () => {
  beforeEach(() => {
    document.body.style.background = "var(--san-surface)";
    document.body.style.color = "var(--san-text)";
  });

  afterEach(() => {
    vi.restoreAllMocks();
    document.body.innerHTML = "";
    document.body.style.removeProperty("background");
    document.body.style.removeProperty("color");
    document.documentElement.removeAttribute("data-san-flavor");
    document.documentElement.removeAttribute("data-san-glazing");
    document.documentElement.removeAttribute("data-san-accent");
  });

  it("exports SanChip from root and subpath and registers san-chip", () => {
    expect(RootSanChip).toBe(SanChip);
    expect(customElements.get("san-chip")).toBe(SanChip);
  });

  it("defaults to outlined, neutral, md and renders non-interactive content when static", async () => {
    const el = renderChip(`<san-chip value="design">Design</san-chip>`);
    await el.updateComplete;

    expect(el.variant).toBe("outlined");
    expect(el.intent).toBe("neutral");
    expect(el.size).toBe("md");
    expect(el.pill).toBe(false);
    expect(el.selectable).toBe(false);
    expect(el.selected).toBe(false);
    expect(el.removable).toBe(false);
    expect(el.removeLabel).toBe("");
    expect(el.value).toBe("design");
    expect(el.disabled).toBe(false);

    expect(el.getAttribute("variant")).toBe("outlined");
    expect(el.getAttribute("intent")).toBe("neutral");
    expect(el.getAttribute("size")).toBe("md");
    expect(el.getAttribute("value")).toBe("design");
    expect(el.hasAttribute("pill")).toBe(false);
    expect(el.hasAttribute("selectable")).toBe(false);
    expect(el.hasAttribute("selected")).toBe(false);
    expect(el.hasAttribute("removable")).toBe(false);
    expect(el.hasAttribute("disabled")).toBe(false);
    expect(el.matches(":state(selected)")).toBe(false);

    const base = getPart(el, "base");
    expect(base.tagName).toBe("SPAN");
    expect(el.shadowRoot?.querySelector("button")).toBeNull();
    expect(el.shadowRoot?.querySelector("[part='action']")).toBeNull();
    expect(el.shadowRoot?.querySelector("[part='remove']")).toBeNull();

    el.focus();
    expect(el.shadowRoot?.activeElement).toBeNull();

    await expectAccessible(el);
  });

  it("renders sibling action and remove buttons without nesting buttons across modes", async () => {
    const selectableOnly = renderChip(`<san-chip selectable>Filter</san-chip>`);
    const removableOnly = renderChip(`<san-chip removable>Tag</san-chip>`);
    const both = renderChip(`<san-chip selectable removable>Both</san-chip>`);
    await Promise.all([
      selectableOnly.updateComplete,
      removableOnly.updateComplete,
      both.updateComplete,
    ]);

    const actionOnlyBtn = getPart<HTMLButtonElement>(selectableOnly, "action");
    expect(actionOnlyBtn.tagName).toBe("BUTTON");
    expect(actionOnlyBtn.type).toBe("button");
    expect(actionOnlyBtn.getAttribute("aria-pressed")).toBe("false");
    expect(selectableOnly.shadowRoot?.querySelector("[part='remove']")).toBeNull();
    selectableOnly.focus();
    expect(selectableOnly.shadowRoot?.activeElement).toBe(actionOnlyBtn);
    await expectAccessible(selectableOnly);

    const removeOnlyBtn = getPart<HTMLButtonElement>(removableOnly, "remove");
    expect(removeOnlyBtn.tagName).toBe("BUTTON");
    expect(removeOnlyBtn.type).toBe("button");
    expect(removableOnly.shadowRoot?.querySelector("[part='action']")).toBeNull();
    expect(removeOnlyBtn.querySelector("svg[aria-hidden='true']")).not.toBeNull();
    removableOnly.focus();
    expect(removableOnly.shadowRoot?.activeElement).toBe(removeOnlyBtn);
    await expectAccessible(removableOnly);

    const bothBase = getPart(both, "base");
    const bothAction = getPart<HTMLButtonElement>(both, "action");
    const bothRemove = getPart<HTMLButtonElement>(both, "remove");
    expect(both.shadowRoot?.querySelector("button button")).toBeNull();
    expect(bothAction.parentElement).toBe(bothBase);
    expect(bothRemove.parentElement).toBe(bothBase);
    expect(bothAction.contains(bothRemove)).toBe(false);
    expect(bothRemove.contains(bothAction)).toBe(false);
    await expectAccessible(both);
  });

  it("toggles selected, :state(selected), aria-pressed, and emits change only on user activation", async () => {
    const el = renderChip(`<san-chip selectable value="lit">Lit</san-chip>`);
    await el.updateComplete;

    const changes: Array<{ selected: boolean; bubbles: boolean; composed: boolean }> = [];
    document.body.addEventListener("change", (event) => {
      if (event.target === el) {
        changes.push({
          selected: el.selected,
          bubbles: event.bubbles,
          composed: event.composed,
        });
      }
    });

    const action = getPart<HTMLButtonElement>(el, "action");
    await userEvent.click(action);
    await el.updateComplete;

    expect(el.selected).toBe(true);
    expect(el.hasAttribute("selected")).toBe(true);
    expect(el.matches(":state(selected)")).toBe(true);
    expect(action.getAttribute("aria-pressed")).toBe("true");
    expect(changes).toEqual([{ selected: true, bubbles: true, composed: true }]);

    await userEvent.click(action);
    await el.updateComplete;

    expect(el.selected).toBe(false);
    expect(el.hasAttribute("selected")).toBe(false);
    expect(el.matches(":state(selected)")).toBe(false);
    expect(action.getAttribute("aria-pressed")).toBe("false");
    expect(changes).toHaveLength(2);

    // Programmatic changes must not emit change
    el.selected = true;
    await el.updateComplete;
    expect(el.matches(":state(selected)")).toBe(true);
    expect(action.getAttribute("aria-pressed")).toBe("true");
    expect(changes).toHaveLength(2);
  });

  it("gates :state(selected) and [part='checkmark'] to selectable chips without a start slot", async () => {
    const nonSelectable = renderChip(`<san-chip selected>Static</san-chip>`);
    await nonSelectable.updateComplete;

    expect(nonSelectable.selected).toBe(true);
    expect(nonSelectable.matches(":state(selected)")).toBe(false);
    expect(nonSelectable.shadowRoot?.querySelector("[part='checkmark']")).toBeNull();
    expect(getComputedStyle(getPart(nonSelectable, "base")).backgroundColor).toBe(
      "rgba(0, 0, 0, 0)",
    );

    const selectable = renderChip(`<san-chip selectable>Filter</san-chip>`);
    await selectable.updateComplete;
    expect(selectable.shadowRoot?.querySelector("[part='checkmark']")).toBeNull();

    selectable.selected = true;
    await selectable.updateComplete;
    const action = getPart<HTMLButtonElement>(selectable, "action");
    const checkmark = action.querySelector("[part='checkmark']");
    expect(checkmark).not.toBeNull();
    expect(checkmark?.getAttribute("aria-hidden")).toBe("true");
    expect(checkmark?.querySelector("svg")).not.toBeNull();

    const startIcon = document.createElement("span");
    startIcon.slot = "start";
    startIcon.textContent = "*";
    selectable.append(startIcon);
    await Promise.resolve();
    await selectable.updateComplete;
    expect(selectable.shadowRoot?.querySelector("[part='checkmark']")).toBeNull();

    startIcon.remove();
    await Promise.resolve();
    await selectable.updateComplete;
    expect(selectable.shadowRoot?.querySelector("[part='checkmark']")).not.toBeNull();

    selectable.selectable = false;
    await selectable.updateComplete;
    expect(selectable.matches(":state(selected)")).toBe(false);
    expect(selectable.shadowRoot?.querySelector("[part='checkmark']")).toBeNull();
  });

  it("suppresses selection and click propagation when disabled or preventDefault() is called", async () => {
    const disabledEl = renderChip(`<san-chip selectable disabled>Locked</san-chip>`);
    await disabledEl.updateComplete;

    const disabledClickSpy = vi.fn();
    const disabledChangeSpy = vi.fn();
    disabledEl.addEventListener("click", disabledClickSpy);
    disabledEl.addEventListener("change", disabledChangeSpy);

    disabledEl.click();
    await disabledEl.updateComplete;
    expect(disabledEl.selected).toBe(false);
    expect(disabledClickSpy).not.toHaveBeenCalled();
    expect(disabledChangeSpy).not.toHaveBeenCalled();
    expect(getPart<HTMLButtonElement>(disabledEl, "action").disabled).toBe(true);

    const cancelledEl = renderChip(`<san-chip selectable>Guarded</san-chip>`);
    await cancelledEl.updateComplete;

    const cancelledChangeSpy = vi.fn();
    cancelledEl.addEventListener("change", cancelledChangeSpy);
    cancelledEl.addEventListener("click", (event) => event.preventDefault(), { capture: true });

    await userEvent.click(getPart<HTMLButtonElement>(cancelledEl, "action"));
    await cancelledEl.updateComplete;
    expect(cancelledEl.selected).toBe(false);
    expect(cancelledChangeSpy).not.toHaveBeenCalled();
  });

  it("dispatches bubbling, composed, cancelable remove without auto-removing DOM node", async () => {
    const el = renderChip(`<san-chip selectable removable>TypeScript</san-chip>`);
    await el.updateComplete;

    const removals: Array<{ bubbles: boolean; composed: boolean; cancelable: boolean }> = [];
    const changeSpy = vi.fn();
    el.addEventListener("change", changeSpy);
    document.body.addEventListener("remove", (event) => {
      if (event.target === el) {
        removals.push({
          bubbles: event.bubbles,
          composed: event.composed,
          cancelable: event.cancelable,
        });
      }
    });

    const removeBtn = getPart<HTMLButtonElement>(el, "remove");
    await userEvent.click(removeBtn);
    await el.updateComplete;

    expect(removals).toEqual([{ bubbles: true, composed: true, cancelable: true }]);
    expect(el.isConnected).toBe(true);
    expect(el.selected).toBe(false);
    expect(changeSpy).not.toHaveBeenCalled();

    // Keyboard Backspace and Delete while focused on [part="action"]
    const actionBtn = getPart<HTMLButtonElement>(el, "action");
    actionBtn.focus();
    await userEvent.keyboard("{Backspace}");
    await userEvent.keyboard("{Delete}");
    expect(removals).toHaveLength(3);
    expect(el.isConnected).toBe(true);

    // Disabled suppresses remove via click and keyboard
    el.disabled = true;
    await el.updateComplete;
    expect(removeBtn.disabled).toBe(true);
    el.click();
    actionBtn.dispatchEvent(new KeyboardEvent("keydown", { key: "Delete", bubbles: true }));
    expect(removals).toHaveLength(3);
  });

  it("computes removeLabel fallback and guards null/undefined overrides", async () => {
    const withText = renderChip(`<san-chip removable>  TypeScript  </san-chip>`);
    const withComment = renderChip(`<san-chip removable><!-- internal -->TypeScript</san-chip>`);
    const withoutText = renderChip(`<san-chip removable>${SAMPLE_ICON}</san-chip>`);
    const custom = renderChip(
      `<san-chip removable remove-label="Delete filter">TypeScript</san-chip>`,
    );
    await Promise.all([
      withText.updateComplete,
      withComment.updateComplete,
      withoutText.updateComplete,
      custom.updateComplete,
    ]);

    expect(getPart(withText, "remove").getAttribute("aria-label")).toBe("Remove TypeScript");
    expect(getPart(withComment, "remove").getAttribute("aria-label")).toBe("Remove TypeScript");
    expect(getPart(withoutText, "remove").getAttribute("aria-label")).toBe("Remove");
    expect(getPart(custom, "remove").getAttribute("aria-label")).toBe("Delete filter");

    // Dynamic default slot update updates fallback label
    withText.textContent = "Lit";
    await Promise.resolve();
    await withText.updateComplete;
    expect(getPart(withText, "remove").getAttribute("aria-label")).toBe("Remove Lit");

    // Removing remove-label (null) or setting undefined must not throw
    custom.removeAttribute("remove-label");
    await custom.updateComplete;
    expect(getPart(custom, "remove").getAttribute("aria-label")).toBe("Remove TypeScript");

    (custom as unknown as { removeLabel: string | undefined }).removeLabel = undefined;
    await custom.updateComplete;
    expect(getPart(custom, "remove").getAttribute("aria-label")).toBe("Remove TypeScript");
  });

  it("passes axe-core across all 3 variants x 6 intents in lauds and compline, unselected and selected", async () => {
    const variants = ["outlined", "soft", "filled"] as const;
    const intents = ["neutral", "accent", "danger", "warning", "success", "info"] as const;

    for (const flavor of ["lauds", "compline"] as const) {
      document.documentElement.setAttribute("data-san-flavor", flavor);

      for (const variant of variants) {
        const bgSet = new Set<string>();
        const fgSet = new Set<string>();

        for (const intent of intents) {
          const el = renderChip(
            `<san-chip selectable variant="${variant}" intent="${intent}">${intent}</san-chip>`,
          );
          await el.updateComplete;

          const base = getPart(el, "base");
          const unselectedStyles = getComputedStyle(base);
          const unselectedBg = unselectedStyles.backgroundColor;
          const unselectedBorder = unselectedStyles.borderColor;
          bgSet.add(unselectedBg);
          fgSet.add(unselectedStyles.color);

          if (variant === "outlined") {
            expect(unselectedBg).toBe("rgba(0, 0, 0, 0)");
          } else {
            expect(unselectedBg).not.toBe("rgba(0, 0, 0, 0)");
          }
          if (variant === "filled") {
            expect(unselectedStyles.boxShadow).toBe("none");
          }

          await expectAccessible(el);

          el.selected = true;
          await el.updateComplete;
          await settleTransitions(base);
          const selectedStyles = getComputedStyle(base);
          const selectedBg = selectedStyles.backgroundColor;
          expect(selectedBg).not.toBe("rgba(0, 0, 0, 0)");
          expect(selectedStyles.boxShadow).toBe("none");
          expect(selectedStyles.backgroundImage).toBe("none");
          if (variant !== "soft" || intent === "neutral") {
            expect(selectedBg).not.toBe(unselectedBg);
          } else {
            expect(selectedStyles.borderColor).not.toBe(unselectedBorder);
          }

          await expectAccessible(el);
          el.remove();
        }

        if (variant === "outlined") {
          expect(fgSet.size).toBeGreaterThanOrEqual(5);
        } else {
          expect(bgSet.size).toBe(intents.length);
        }
      }
    }
  });

  it("supports sm, md, lg sizes, pill radius, and direct start/end SVG bounding boxes", async () => {
    const sm = renderChip(
      `<san-chip size="sm"><svg slot="start" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><circle cx="10" cy="10" r="6"/></svg>Small</san-chip>`,
    );
    const md = renderChip(`<san-chip size="md">Medium</san-chip>`);
    const lg = renderChip(
      `<san-chip size="lg" pill>Large<svg slot="end" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><circle cx="10" cy="10" r="6"/></svg></san-chip>`,
    );
    await Promise.all([sm.updateComplete, md.updateComplete, lg.updateComplete]);

    expect(sm.getBoundingClientRect().height).toBeCloseTo(24, 0);
    expect(md.getBoundingClientRect().height).toBeCloseTo(28, 0);
    expect(lg.getBoundingClientRect().height).toBeCloseTo(32, 0);
    expect(
      Number.parseFloat(getComputedStyle(getPart(lg, "base")).borderRadius),
    ).toBeGreaterThanOrEqual(999);

    const startSvg = sm.querySelector("svg[slot='start']") as SVGSVGElement;
    const endSvg = lg.querySelector("svg[slot='end']") as SVGSVGElement;
    expect(startSvg.getBoundingClientRect().width).toBeCloseTo(12, 0);
    expect(endSvg.getBoundingClientRect().width).toBeCloseTo(16, 0);
  });

  it("truncates long labels to a single line with ellipsis under max-inline-size", async () => {
    const el = renderChip(
      `<san-chip selectable removable style="max-inline-size: 9rem;">Very long Sanctuary chip label 1234567890</san-chip>`,
    );
    await el.updateComplete;

    const labelEl = getPart(el, "label");
    const labelStyles = getComputedStyle(labelEl);
    expect(labelStyles.whiteSpace).toBe("nowrap");
    expect(labelStyles.overflow).toBe("hidden");
    expect(labelStyles.textOverflow).toBe("ellipsis");
    expect(el.getBoundingClientRect().height).toBeCloseTo(28, 0);
    expect(el.getBoundingClientRect().width).toBeLessThanOrEqual(145);
    expect(labelEl.scrollWidth).toBeGreaterThan(labelEl.clientWidth);
  });

  it("toggles via keyboard Space and Enter and shows :focus-visible outline on action and remove", async () => {
    const el = renderChip(`<san-chip selectable removable>Keyboard</san-chip>`);
    await el.updateComplete;

    const changeSpy = vi.fn();
    el.addEventListener("change", changeSpy);

    await page.getByRole("button", { name: "Keyboard" }).element();
    await userEvent.tab();

    const action = getPart<HTMLButtonElement>(el, "action");
    const remove = getPart<HTMLButtonElement>(el, "remove");
    expect(el.shadowRoot?.activeElement).toBe(action);
    expect(action.matches(":focus-visible")).toBe(true);
    expect(getComputedStyle(action).outlineStyle).toBe("solid");

    await userEvent.keyboard("{Space}");
    await el.updateComplete;
    expect(el.selected).toBe(true);
    expect(changeSpy).toHaveBeenCalledTimes(1);

    await userEvent.keyboard("{Enter}");
    await el.updateComplete;
    expect(el.selected).toBe(false);
    expect(changeSpy).toHaveBeenCalledTimes(2);

    await userEvent.tab();
    expect(el.shadowRoot?.activeElement).toBe(remove);
    expect(remove.matches(":focus-visible")).toBe(true);
    expect(getComputedStyle(remove).outlineStyle).toBe("solid");
  });

  it("applies Tier-5 CSS custom property overrides for unselected and selected states", async () => {
    const el = renderChip(
      `<san-chip selectable style="
        --san-chip-bg: rgb(10, 20, 30);
        --san-chip-fg: rgb(240, 245, 250);
        --san-chip-border: rgb(100, 110, 120);
        --san-chip-selected-bg: rgb(30, 60, 90);
        --san-chip-selected-fg: rgb(255, 255, 255);
        --san-chip-selected-border: rgb(150, 180, 210);
        --san-chip-radius: 10px;
        --san-chip-height: 36px;
        --san-chip-padding-inline: 18px;
        --san-chip-gap: 10px;
        --san-chip-icon-size: 18px;
      "><svg slot="start" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><circle cx="10" cy="10" r="6"/></svg>Custom</san-chip>`,
    );
    await el.updateComplete;

    const base = getPart(el, "base");
    const action = getPart(el, "action");
    const baseStyles = getComputedStyle(base);
    const actionStyles = getComputedStyle(action);
    expect(baseStyles.backgroundColor).toBe("rgb(10, 20, 30)");
    expect(baseStyles.color).toBe("rgb(240, 245, 250)");
    expect(baseStyles.borderColor).toBe("rgb(100, 110, 120)");
    expect(baseStyles.borderRadius).toBe("10px");
    expect(baseStyles.minBlockSize).toBe("36px");
    expect(actionStyles.paddingInline).toBe("18px");
    expect(actionStyles.gap).toBe("10px");

    const svg = el.querySelector("svg[slot='start']") as SVGSVGElement;
    expect(svg.getBoundingClientRect().width).toBeCloseTo(18, 0);

    el.selected = true;
    await el.updateComplete;
    await settleTransitions(base);
    const selectedStyles = getComputedStyle(base);
    expect(selectedStyles.backgroundColor).toBe("rgb(30, 60, 90)");
    expect(selectedStyles.color).toBe("rgb(255, 255, 255)");
    expect(selectedStyles.borderColor).toBe("rgb(150, 180, 210)");
  });
});
