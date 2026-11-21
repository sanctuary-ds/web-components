import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { page, userEvent } from "vitest/browser";
import "../src/components/toggle-button/register.js";
import { SanToggleButton } from "../src/components/toggle-button/index.js";
import { SanToggleButton as RootSanToggleButton } from "../src/index.js";
import { expectAccessible } from "./helpers/a11y.js";

const SAMPLE_ICON = `<svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M10 2l2.4 5 5.6.8-4 3.9.9 5.5L10 14.6 5.1 17.2 6 11.7 2 7.8l5.6-.8L10 2z"/></svg>`;

function renderToggle(htmlText: string): SanToggleButton {
  const wrapper = document.createElement("div");
  wrapper.innerHTML = htmlText.trim();
  const el = wrapper.firstElementChild as SanToggleButton;
  document.body.append(el);
  return el;
}

function getControl(el: SanToggleButton): HTMLButtonElement {
  const control = el.shadowRoot?.querySelector<HTMLButtonElement>("[part='base']");
  if (!control) {
    throw new Error("Expected [part='base'] control in shadowRoot");
  }
  return control;
}

describe("<san-toggle-button>", () => {
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

  it("exports SanToggleButton from root and subpath and registers san-toggle-button", () => {
    expect(RootSanToggleButton).toBe(SanToggleButton);
    expect(customElements.get("san-toggle-button")).toBe(SanToggleButton);
  });

  it("defaults to outlined, accent, md, unpressed with delegatesFocus and button type", async () => {
    const el = renderToggle(`<san-toggle-button value="bold">Bold</san-toggle-button>`);
    await el.updateComplete;

    expect(el.pressed).toBe(false);
    expect(el.variant).toBe("outlined");
    expect(el.intent).toBe("accent");
    expect(el.size).toBe("md");
    expect(el.pill).toBe(false);
    expect(el.disabled).toBe(false);
    expect(el.value).toBe("bold");
    expect(el.getAttribute("value")).toBe("bold");
    expect(el.matches(":state(icon-only)")).toBe(false);

    const control = getControl(el);
    expect(control.tagName).toBe("BUTTON");
    expect(control.type).toBe("button");
    expect(control.getAttribute("aria-pressed")).toBe("false");
    expect(el.matches(":state(pressed)")).toBe(false);

    el.focus();
    expect(el.shadowRoot?.activeElement).toBe(control);

    await expectAccessible(el);
  });

  it("toggles pressed state, :state(pressed), aria-pressed, and dispatches bubbling composed change only on user interaction", async () => {
    const el = renderToggle(`<san-toggle-button>Pin</san-toggle-button>`);
    await el.updateComplete;

    const changes: Array<{ pressed: boolean; composed: boolean; bubbles: boolean }> = [];
    document.body.addEventListener("change", (event) => {
      if (event.target === el) {
        changes.push({
          pressed: el.pressed,
          composed: event.composed,
          bubbles: event.bubbles,
        });
      }
    });

    await userEvent.click(el);
    await el.updateComplete;

    expect(el.pressed).toBe(true);
    expect(el.hasAttribute("pressed")).toBe(true);
    expect(el.matches(":state(pressed)")).toBe(true);
    expect(getControl(el).getAttribute("aria-pressed")).toBe("true");
    expect(changes).toEqual([{ pressed: true, composed: true, bubbles: true }]);

    await userEvent.click(el);
    await el.updateComplete;

    expect(el.pressed).toBe(false);
    expect(el.hasAttribute("pressed")).toBe(false);
    expect(el.matches(":state(pressed)")).toBe(false);
    expect(getControl(el).getAttribute("aria-pressed")).toBe("false");
    expect(changes).toHaveLength(2);

    // Programmatic property changes must update state without emitting change
    el.pressed = true;
    await el.updateComplete;
    expect(el.matches(":state(pressed)")).toBe(true);
    expect(getControl(el).getAttribute("aria-pressed")).toBe("true");
    expect(changes).toHaveLength(2);
  });

  it("suppresses toggling when disabled or when click default is prevented", async () => {
    const disabledEl = renderToggle(`<san-toggle-button disabled>Muted</san-toggle-button>`);
    await disabledEl.updateComplete;

    const disabledClickSpy = vi.fn();
    const disabledChangeSpy = vi.fn();
    disabledEl.addEventListener("click", disabledClickSpy);
    disabledEl.addEventListener("change", disabledChangeSpy);

    disabledEl.click();
    await disabledEl.updateComplete;
    expect(disabledEl.pressed).toBe(false);
    expect(disabledClickSpy).not.toHaveBeenCalled();
    expect(disabledChangeSpy).not.toHaveBeenCalled();
    expect(getControl(disabledEl).disabled).toBe(true);

    const cancelledEl = renderToggle(`<san-toggle-button>Guard</san-toggle-button>`);
    await cancelledEl.updateComplete;

    const cancelledChangeSpy = vi.fn();
    cancelledEl.addEventListener("change", cancelledChangeSpy);
    cancelledEl.addEventListener("click", (event) => event.preventDefault(), { capture: true });

    await userEvent.click(cancelledEl);
    await cancelledEl.updateComplete;
    expect(cancelledEl.pressed).toBe(false);
    expect(cancelledChangeSpy).not.toHaveBeenCalled();
  });

  it("renders distinct unpressed vs pressed visuals across variants and passes axe-core in compline and lauds", async () => {
    const variants = ["outlined", "soft", "ghost"] as const;

    for (const flavor of ["compline", "lauds"] as const) {
      document.documentElement.setAttribute("data-san-flavor", flavor);

      for (const variant of variants) {
        const el = renderToggle(
          `<san-toggle-button variant="${variant}">${variant}</san-toggle-button>`,
        );
        await el.updateComplete;

        const unpressedBg = getComputedStyle(getControl(el)).backgroundColor;
        await expectAccessible(el);

        el.pressed = true;
        await el.updateComplete;

        const pressedBg = getComputedStyle(getControl(el)).backgroundColor;
        expect(pressedBg).not.toBe("rgba(0, 0, 0, 0)");
        expect(pressedBg).not.toBe(unpressedBg);
        await expectAccessible(el);

        el.remove();
      }
    }
  });

  it("remaps intent colors and focus-ring-color inside Shadow DOM when pressed", async () => {
    const intents = ["accent", "danger", "warning", "success", "info"] as const;
    const pressedBgs = new Set<string>();

    for (const intent of intents) {
      const el = renderToggle(
        `<san-toggle-button intent="${intent}" pressed>${intent}</san-toggle-button>`,
      );
      await el.updateComplete;

      pressedBgs.add(getComputedStyle(getControl(el)).backgroundColor);

      if (intent !== "accent") {
        const expectedColor = getComputedStyle(document.documentElement)
          .getPropertyValue(`--san-${intent}`)
          .trim();
        const hostFocusColor = getComputedStyle(el)
          .getPropertyValue("--san-focus-ring-color")
          .trim();
        expect(hostFocusColor).toBe(expectedColor);
      }

      await expectAccessible(el);
    }

    expect(pressedBgs.size).toBe(intents.length);
  });

  it("supports sm, md, lg sizes, pill radius, multi-line wrapping, and direct start/end SVG slots", async () => {
    const sm = renderToggle(`<san-toggle-button size="sm">Small</san-toggle-button>`);
    const md = renderToggle(`<san-toggle-button size="md">Medium</san-toggle-button>`);
    const lg = renderToggle(`<san-toggle-button size="lg" pill>Large</san-toggle-button>`);
    const withIcons = renderToggle(
      `<san-toggle-button><svg slot="start" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><circle cx="10" cy="10" r="6"/></svg>Pinned<svg slot="end" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><circle cx="10" cy="10" r="6"/></svg></san-toggle-button>`,
    );
    const wrapped = renderToggle(
      `<san-toggle-button style="max-inline-size: 9rem;">Long multi-line enterprise toggle label that wraps smoothly</san-toggle-button>`,
    );

    await Promise.all([
      sm.updateComplete,
      md.updateComplete,
      lg.updateComplete,
      withIcons.updateComplete,
      wrapped.updateComplete,
    ]);

    expect(sm.getBoundingClientRect().height).toBeCloseTo(32, 0);
    expect(md.getBoundingClientRect().height).toBeCloseTo(40, 0);
    expect(lg.getBoundingClientRect().height).toBeCloseTo(48, 0);
    expect(wrapped.getBoundingClientRect().height).toBeGreaterThan(40);
    expect(Number.parseFloat(getComputedStyle(getControl(lg)).borderRadius)).toBeGreaterThanOrEqual(
      999,
    );

    const startSvg = withIcons.querySelector("svg[slot='start']") as SVGSVGElement;
    const endSvg = withIcons.querySelector("svg[slot='end']") as SVGSVGElement;
    expect(startSvg.getBoundingClientRect().width).toBeGreaterThanOrEqual(16);
    expect(endSvg.getBoundingClientRect().width).toBeGreaterThanOrEqual(16);
  });

  it("auto-detects 1:1 square icon-only mode from slotted icon, warns once when unlabelled, and guards null/undefined label", async () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    const unlabelled = renderToggle(`<san-toggle-button>${SAMPLE_ICON}</san-toggle-button>`);
    await unlabelled.updateComplete;
    expect(unlabelled.matches(":state(icon-only)")).toBe(true);
    expect(warnSpy).toHaveBeenCalledOnce();
    expect(warnSpy.mock.calls[0]?.[0]).toContain("san-toggle-button");

    // Re-rendering does not duplicate the warning
    unlabelled.size = "lg";
    await unlabelled.updateComplete;
    expect(warnSpy).toHaveBeenCalledOnce();
    warnSpy.mockClear();

    // Text inside a child element must not trigger icon-only mode
    const spanText = renderToggle(`<san-toggle-button><span>Bold</span></san-toggle-button>`);
    await spanText.updateComplete;
    expect(spanText.matches(":state(icon-only)")).toBe(false);
    expect(warnSpy).not.toHaveBeenCalled();

    const sm = renderToggle(
      `<san-toggle-button size="sm" label="Bold">${SAMPLE_ICON}</san-toggle-button>`,
    );
    const md = renderToggle(
      `<san-toggle-button size="md" label="Italic">${SAMPLE_ICON}</san-toggle-button>`,
    );
    const lg = renderToggle(
      `<san-toggle-button size="lg" label="Underline">${SAMPLE_ICON}</san-toggle-button>`,
    );
    await Promise.all([sm.updateComplete, md.updateComplete, lg.updateComplete]);

    expect(warnSpy).not.toHaveBeenCalled();

    for (const [el, expected] of [
      [sm, 32],
      [md, 40],
      [lg, 48],
    ] as const) {
      expect(el.matches(":state(icon-only)")).toBe(true);
      const rect = el.getBoundingClientRect();
      expect(rect.width).toBeCloseTo(expected, 0);
      expect(rect.height).toBeCloseTo(expected, 0);
      const svg = el.querySelector("svg") as SVGSVGElement;
      expect(svg.getBoundingClientRect().width).toBeGreaterThanOrEqual(14);
      await expectAccessible(el);
    }

    // Dynamic slot transition: adding text clears :state(icon-only); removing it restores it
    md.append(document.createTextNode("Italic"));
    await md.updateComplete;
    expect(md.matches(":state(icon-only)")).toBe(false);
    md.lastChild?.remove();
    await md.updateComplete;
    expect(md.matches(":state(icon-only)")).toBe(true);

    // Removing label attribute (Lit assigns null) or setting undefined must not throw
    md.removeAttribute("label");
    await md.updateComplete;
    expect(getControl(md).hasAttribute("aria-label")).toBe(false);
    expect(warnSpy).toHaveBeenCalledOnce();

    (md as unknown as { label: string | undefined }).label = undefined;
    await md.updateComplete;
    expect(getControl(md).hasAttribute("aria-label")).toBe(false);

    md.label = "Restore italic";
    await md.updateComplete;
    expect(getControl(md).getAttribute("aria-label")).toBe("Restore italic");
    await expectAccessible(md);
  });

  it("toggles via keyboard (Space and Enter) and shows :focus-visible outline", async () => {
    const el = renderToggle(`<san-toggle-button>Keyboard toggle</san-toggle-button>`);
    await el.updateComplete;

    const changeSpy = vi.fn();
    el.addEventListener("change", changeSpy);

    await page.getByRole("button", { name: "Keyboard toggle" }).element();
    await userEvent.tab();

    const control = getControl(el);
    expect(el.shadowRoot?.activeElement).toBe(control);
    expect(control.matches(":focus-visible")).toBe(true);
    expect(getComputedStyle(control).outlineStyle).toBe("solid");

    await userEvent.keyboard("{Space}");
    await el.updateComplete;
    expect(el.pressed).toBe(true);
    expect(changeSpy).toHaveBeenCalledTimes(1);

    await userEvent.keyboard("{Enter}");
    await el.updateComplete;
    expect(el.pressed).toBe(false);
    expect(changeSpy).toHaveBeenCalledTimes(2);
  });
});
