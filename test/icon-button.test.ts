import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { page, userEvent } from "vitest/browser";
import "../src/components/icon-button/register.js";
import { SanIconButton } from "../src/components/icon-button/index.js";
import { SanIconButton as RootSanIconButton } from "../src/index.js";
import { expectAccessible } from "./helpers/a11y.js";

const SAMPLE_ICON = `<svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M10 2l2.4 5 5.6.8-4 3.9.9 5.5L10 14.6 5.1 17.2 6 11.7 2 7.8l5.6-.8L10 2z"/></svg>`;

function renderIconButton(htmlText: string): SanIconButton {
  const wrapper = document.createElement("div");
  wrapper.innerHTML = htmlText.trim();
  const el = wrapper.firstElementChild as SanIconButton;
  document.body.append(el);
  return el;
}

function getControl(btn: SanIconButton): HTMLElement {
  const control = btn.shadowRoot?.querySelector<HTMLElement>("[part='base']");
  if (!control) {
    throw new Error("Expected [part='base'] control in shadowRoot");
  }
  return control;
}

describe("<san-icon-button>", () => {
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

  it("exports SanIconButton from root and component subpath and registers san-icon-button", () => {
    expect(RootSanIconButton).toBe(SanIconButton);
    expect(customElements.get("san-icon-button")).toBe(SanIconButton);
  });

  it("defaults to ghost, accent, md, type=button with delegatesFocus and host attributes intact", async () => {
    const btn = renderIconButton(
      `<san-icon-button id="star-btn" title="Star item" label="Star item">${SAMPLE_ICON}</san-icon-button>`,
    );
    await btn.updateComplete;

    expect(btn.variant).toBe("ghost");
    expect(btn.intent).toBe("accent");
    expect(btn.size).toBe("md");
    expect(btn.type).toBe("button");
    expect(btn.pill).toBe(false);
    expect(btn.disabled).toBe(false);
    expect(btn.loading).toBe(false);
    expect(btn.label).toBe("Star item");

    expect(btn.id).toBe("star-btn");
    expect(btn.title).toBe("Star item");

    const control = getControl(btn);
    expect(control.tagName).toBe("BUTTON");
    expect(control.getAttribute("type")).toBe("button");
    expect(control.getAttribute("aria-label")).toBe("Star item");
    expect(control.hasAttribute("aria-pressed")).toBe(false);

    btn.focus();
    expect(btn.shadowRoot?.activeElement).toBe(control);

    await expectAccessible(btn);
  });

  it("enforces 1:1 square geometry, Sanctuary radii, Tier-5 custom properties, parts, and slotted SVG sizing", async () => {
    const sm = renderIconButton(
      `<san-icon-button size="sm" label="Small">${SAMPLE_ICON}</san-icon-button>`,
    );
    const md = renderIconButton(
      `<san-icon-button size="md" label="Medium">${SAMPLE_ICON}</san-icon-button>`,
    );
    const lg = renderIconButton(
      `<san-icon-button size="lg" label="Large">${SAMPLE_ICON}</san-icon-button>`,
    );
    const pill = renderIconButton(
      `<san-icon-button pill label="Pill">${SAMPLE_ICON}</san-icon-button>`,
    );
    await Promise.all([
      sm.updateComplete,
      md.updateComplete,
      lg.updateComplete,
      pill.updateComplete,
    ]);

    const smRect = getControl(sm).getBoundingClientRect();
    const mdRect = getControl(md).getBoundingClientRect();
    const lgRect = getControl(lg).getBoundingClientRect();

    expect(smRect.width).toBeCloseTo(32, 0);
    expect(smRect.height).toBeCloseTo(32, 0);
    expect(mdRect.width).toBeCloseTo(40, 0);
    expect(mdRect.height).toBeCloseTo(40, 0);
    expect(lgRect.width).toBeCloseTo(48, 0);
    expect(lgRect.height).toBeCloseTo(48, 0);

    expect(getComputedStyle(getControl(sm)).borderTopLeftRadius).toBe("4px");
    expect(getComputedStyle(getControl(md)).borderTopLeftRadius).toBe("8px");
    expect(getComputedStyle(getControl(lg)).borderTopLeftRadius).toBe("8px");
    expect(
      Number.parseFloat(getComputedStyle(getControl(pill)).borderTopLeftRadius),
    ).toBeGreaterThan(100);

    const svg = md.querySelector("svg");
    expect(svg).not.toBeNull();
    if (svg) {
      const svgRect = svg.getBoundingClientRect();
      expect(svgRect.width).toBeGreaterThanOrEqual(16);
      expect(svgRect.height).toBeGreaterThanOrEqual(16);
      expect(svgRect.width).toBeCloseTo(svgRect.height, 0);
    }

    const custom = renderIconButton(`
      <san-icon-button
        label="Custom"
        variant="outlined"
        style="
          --san-icon-button-size: 56px;
          --san-icon-button-icon-size: 28px;
          --san-icon-button-radius: 12px;
          --san-icon-button-bg: rgb(10, 20, 30);
          --san-icon-button-fg: rgb(240, 245, 250);
          --san-icon-button-border: rgb(80, 90, 100);
        "
      >${SAMPLE_ICON}</san-icon-button>
    `);
    await custom.updateComplete;

    expect(custom.shadowRoot?.querySelector("[part='base']")).not.toBeNull();
    expect(custom.shadowRoot?.querySelector("[part='icon']")).not.toBeNull();
    expect(custom.shadowRoot?.querySelector("[part='spinner']")).not.toBeNull();

    const customControl = getControl(custom);
    const customRect = customControl.getBoundingClientRect();
    expect(customRect.width).toBeCloseTo(56, 0);
    expect(customRect.height).toBeCloseTo(56, 0);

    const customSvg = custom.querySelector("svg");
    expect(customSvg?.getBoundingClientRect().width).toBeCloseTo(28, 0);

    const cs = getComputedStyle(customControl);
    expect(cs.backgroundColor).toBe("rgb(10, 20, 30)");
    expect(cs.color).toBe("rgb(240, 245, 250)");
    expect(cs.borderColor).toBe("rgb(80, 90, 100)");
    expect(cs.borderTopLeftRadius).toBe("12px");
  });

  it("renders all 4 variants, 5 intents, and 3 glazings across compline and lauds with 0 axe-core violations", async () => {
    const variants = ["filled", "soft", "outlined", "ghost"] as const;
    const intents = ["accent", "danger", "warning", "success", "info"] as const;

    for (const flavor of ["compline", "lauds"] as const) {
      document.documentElement.setAttribute("data-san-flavor", flavor);

      for (const variant of variants) {
        const btn = renderIconButton(
          `<san-icon-button variant="${variant}" label="${flavor} ${variant}">${SAMPLE_ICON}</san-icon-button>`,
        );
        await btn.updateComplete;
        await expectAccessible(btn);
        btn.remove();
      }

      const glazingBgs = new Set<string>();
      for (const glazing of ["pot-metal", "flashed", "grisaille"] as const) {
        document.documentElement.setAttribute("data-san-glazing", glazing);
        const btn = renderIconButton(
          `<san-icon-button variant="filled" label="${flavor} ${glazing}">${SAMPLE_ICON}</san-icon-button>`,
        );
        await btn.updateComplete;
        glazingBgs.add(getComputedStyle(getControl(btn)).backgroundColor);
        await expectAccessible(btn);
        btn.remove();
      }
      expect(glazingBgs.size).toBe(3);
      document.documentElement.removeAttribute("data-san-glazing");
    }

    const intentBgs = new Set<string>();
    for (const intent of intents) {
      const btn = renderIconButton(
        `<san-icon-button variant="filled" intent="${intent}" label="${intent}">${SAMPLE_ICON}</san-icon-button>`,
      );
      await btn.updateComplete;
      intentBgs.add(getComputedStyle(getControl(btn)).backgroundColor);

      if (intent !== "accent") {
        const expectedColor = getComputedStyle(document.documentElement)
          .getPropertyValue(`--san-${intent}`)
          .trim();
        const hostFocusColor = getComputedStyle(btn)
          .getPropertyValue("--san-focus-ring-color")
          .trim();
        expect(hostFocusColor).toBe(expectedColor);
      }
      await expectAccessible(btn);
    }
    expect(intentBgs.size).toBe(intents.length);
  });

  it("enforces label -> aria-label contract and logs a one-time console.warn when unlabelled", async () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    const unlabelled = renderIconButton(`<san-icon-button>${SAMPLE_ICON}</san-icon-button>`);
    await unlabelled.updateComplete;
    expect(warnSpy).toHaveBeenCalledOnce();
    expect(warnSpy.mock.calls[0]?.[0]).toContain("san-icon-button");

    // Re-rendering the same unlabelled instance does not repeat the warning
    unlabelled.size = "lg";
    await unlabelled.updateComplete;
    expect(warnSpy).toHaveBeenCalledOnce();

    warnSpy.mockClear();

    const withLabel = renderIconButton(
      `<san-icon-button label="Close dialog">${SAMPLE_ICON}</san-icon-button>`,
    );
    const withHostAriaLabel = renderIconButton(
      `<san-icon-button aria-label="Close panel">${SAMPLE_ICON}</san-icon-button>`,
    );
    const heading = document.createElement("span");
    heading.id = "ext-label";
    heading.textContent = "External label";
    document.body.append(heading);
    const withHostAriaLabelledBy = renderIconButton(
      `<san-icon-button aria-labelledby="ext-label">${SAMPLE_ICON}</san-icon-button>`,
    );
    await Promise.all([
      withLabel.updateComplete,
      withHostAriaLabel.updateComplete,
      withHostAriaLabelledBy.updateComplete,
    ]);

    expect(warnSpy).not.toHaveBeenCalled();
    expect(getControl(withLabel).getAttribute("aria-label")).toBe("Close dialog");
    expect(getControl(withHostAriaLabel).getAttribute("aria-label")).toBe("Close panel");
    await expectAccessible(withLabel);
  });

  it("renders link mode with href, safe target=_blank rel, and returns to button when href is removed", async () => {
    const link = renderIconButton(
      `<san-icon-button href="https://example.com" target="_blank" label="Open docs">${SAMPLE_ICON}</san-icon-button>`,
    );
    await link.updateComplete;

    const anchor = getControl(link);
    expect(anchor.tagName).toBe("A");
    expect(anchor.getAttribute("href")).toBe("https://example.com");
    expect(anchor.getAttribute("rel")).toBe("noopener noreferrer");
    expect(anchor.getAttribute("aria-label")).toBe("Open docs");
    expect(anchor.hasAttribute("role")).toBe(false);
    await expectAccessible(link);

    link.removeAttribute("href");
    await link.updateComplete;
    expect(getControl(link).tagName).toBe("BUTTON");
  });

  it("sets role='link' on disabled links and removes role cleanly when re-enabled", async () => {
    const disabledLink = renderIconButton(
      `<san-icon-button href="https://example.com" disabled label="Disabled link">${SAMPLE_ICON}</san-icon-button>`,
    );
    await disabledLink.updateComplete;

    const anchor = getControl(disabledLink);
    expect(anchor.tagName).toBe("A");
    expect(anchor.hasAttribute("href")).toBe(false);
    expect(anchor.getAttribute("role")).toBe("link");
    expect(anchor.getAttribute("aria-disabled")).toBe("true");
    expect(anchor.getAttribute("tabindex")).toBe("-1");
    await expectAccessible(disabledLink);

    disabledLink.disabled = false;
    await disabledLink.updateComplete;

    expect(anchor.getAttribute("href")).toBe("https://example.com");
    expect(anchor.hasAttribute("role")).toBe(false);
    expect(anchor.hasAttribute("aria-disabled")).toBe(false);
    expect(anchor.hasAttribute("tabindex")).toBe(false);
    await expectAccessible(disabledLink);
  });

  it("integrates with <form> for submit, reset, <fieldset disabled>, and removed formaction nullish safety", async () => {
    const form = document.createElement("form");
    form.setAttribute("action", "/original");
    form.innerHTML = `
      <input name="query" value="initial" />
      <fieldset>
        <san-icon-button type="submit" name="intent" value="send" formaction="/override" label="Send">${SAMPLE_ICON}</san-icon-button>
        <san-icon-button type="reset" label="Clear">${SAMPLE_ICON}</san-icon-button>
      </fieldset>
    `;
    document.body.append(form);

    const input = form.querySelector("input");
    const fieldset = form.querySelector("fieldset");
    const [submitBtn, resetBtn] = Array.from(
      form.querySelectorAll("san-icon-button"),
    ) as SanIconButton[];
    if (!input || !fieldset || !submitBtn || !resetBtn) {
      throw new Error("Expected form elements to exist");
    }

    await Promise.all([submitBtn.updateComplete, resetBtn.updateComplete]);

    let observedAction: string | null = null;
    let submittedIntent: FormDataEntryValue | null = null;
    const submitSpy = vi.fn((event: SubmitEvent) => {
      event.preventDefault();
      observedAction = form.getAttribute("action");
      submittedIntent = new FormData(form).get("intent");
    });
    form.addEventListener("submit", submitSpy);

    await userEvent.click(submitBtn);
    expect(submitSpy).toHaveBeenCalledOnce();
    expect(observedAction).toBe("/override");
    expect(submittedIntent).toBe("send");
    expect(form.getAttribute("action")).toBe("/original");

    // Removing formaction must not write "null" onto the form
    submitBtn.removeAttribute("formaction");
    await submitBtn.updateComplete;
    await userEvent.click(submitBtn);
    expect(submitSpy).toHaveBeenCalledTimes(2);
    expect(observedAction).toBe("/original");

    // Reset button resets form input
    input.value = "modified";
    await userEvent.click(resetBtn);
    expect(input.value).toBe("initial");

    // Fieldset disabled disables internal control without mutating host disabled
    fieldset.disabled = true;
    await submitBtn.updateComplete;
    expect((getControl(submitBtn) as HTMLButtonElement).disabled).toBe(true);
    expect(submitBtn.hasAttribute("disabled")).toBe(false);
    submitBtn.click();
    expect(submitSpy).toHaveBeenCalledTimes(2);
  });

  it("handles loading state with :state(loading), aria-busy, focusability, click blocking, and 1:1 size preservation", async () => {
    const btn = renderIconButton(
      `<san-icon-button variant="filled" label="Refresh">${SAMPLE_ICON}</san-icon-button>`,
    );
    await btn.updateComplete;

    const idleRect = btn.getBoundingClientRect();
    const clickSpy = vi.fn();
    btn.addEventListener("click", clickSpy);

    btn.loading = true;
    await btn.updateComplete;

    expect(btn.matches(":state(loading)")).toBe(true);
    const control = getControl(btn) as HTMLButtonElement;
    expect(control.disabled).toBe(false);
    expect(control.getAttribute("aria-busy")).toBe("true");
    expect(control.getAttribute("aria-disabled")).toBe("true");

    btn.focus();
    expect(btn.shadowRoot?.activeElement).toBe(control);

    await userEvent.click(btn);
    btn.click();
    expect(clickSpy).not.toHaveBeenCalled();

    const loadingRect = btn.getBoundingClientRect();
    expect(Math.abs(loadingRect.width - idleRect.width)).toBeLessThanOrEqual(0.5);
    expect(Math.abs(loadingRect.height - idleRect.height)).toBeLessThanOrEqual(0.5);

    const iconPart = btn.shadowRoot?.querySelector<HTMLElement>("[part='icon']");
    const spinner = btn.shadowRoot?.querySelector<HTMLElement>("[part='spinner']");
    expect(iconPart).not.toBeNull();
    expect(spinner).not.toBeNull();
    if (iconPart && spinner) {
      expect(getComputedStyle(iconPart).opacity).toBe("0");
      expect(getComputedStyle(spinner).display).not.toBe("none");
    }

    await expectAccessible(btn);

    btn.loading = false;
    await btn.updateComplete;
    await userEvent.click(btn);
    expect(clickSpy).toHaveBeenCalledOnce();
  });

  it("shows :focus-visible outline when focused via keyboard", async () => {
    const btn = renderIconButton(
      `<san-icon-button label="Keyboard focus">${SAMPLE_ICON}</san-icon-button>`,
    );
    await btn.updateComplete;

    await page.getByRole("button", { name: "Keyboard focus" }).element();
    await userEvent.tab();

    const control = getControl(btn);
    expect(btn.shadowRoot?.activeElement).toBe(control);
    expect(control.matches(":focus-visible")).toBe(true);
    expect(getComputedStyle(control).outlineStyle).toBe("solid");
  });
});
