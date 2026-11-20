import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { page, userEvent } from "vitest/browser";
import "../src/components/button/register.js";
import { SanButton } from "../src/components/button/index.js";
import { SanButton as RootSanButton } from "../src/index.js";
import { expectAccessible } from "./helpers/a11y.js";

function renderButton(htmlText: string): SanButton {
  const wrapper = document.createElement("div");
  wrapper.innerHTML = htmlText.trim();
  const el = wrapper.firstElementChild as SanButton;
  document.body.append(el);
  return el;
}

function getControl(btn: SanButton): HTMLElement {
  const control = btn.shadowRoot?.querySelector<HTMLElement>("[part='base']");
  if (!control) {
    throw new Error("Expected [part='base'] control in shadowRoot");
  }
  return control;
}

describe("<san-button>", () => {
  beforeEach(() => {
    document.body.style.background = "var(--san-surface)";
    document.body.style.color = "var(--san-text)";
  });

  afterEach(() => {
    document.body.innerHTML = "";
    document.body.style.removeProperty("background");
    document.body.style.removeProperty("color");
    document.documentElement.removeAttribute("data-san-flavor");
    document.documentElement.removeAttribute("data-san-glazing");
    document.documentElement.removeAttribute("data-san-accent");
  });

  it("exports SanButton from root and component subpath and registers san-button", () => {
    expect(RootSanButton).toBe(SanButton);
    expect(customElements.get("san-button")).toBe(SanButton);
  });

  it("defaults to filled, accent, md, type=button with delegatesFocus and host attributes intact", async () => {
    const btn = renderButton(
      `<san-button id="save-btn" title="Save changes" aria-label="Save item">Save</san-button>`,
    );
    await btn.updateComplete;

    expect(btn.variant).toBe("filled");
    expect(btn.intent).toBe("accent");
    expect(btn.size).toBe("md");
    expect(btn.type).toBe("button");
    expect(btn.pill).toBe(false);
    expect(btn.disabled).toBe(false);
    expect(btn.loading).toBe(false);

    expect(btn.id).toBe("save-btn");
    expect(btn.title).toBe("Save changes");
    expect(btn.getAttribute("aria-label")).toBe("Save item");

    const control = getControl(btn);
    expect(control.tagName).toBe("BUTTON");
    expect(control.getAttribute("type")).toBe("button");

    btn.focus();
    expect(btn.shadowRoot?.activeElement).toBe(control);

    await expectAccessible(btn);
  });

  it("renders variants (filled, soft, outlined, ghost) with distinct visuals and passes axe-core in compline and lauds", async () => {
    const variants = ["filled", "soft", "outlined", "ghost"] as const;

    for (const flavor of ["compline", "lauds"] as const) {
      document.documentElement.setAttribute("data-san-flavor", flavor);
      const buttons: SanButton[] = [];

      for (const variant of variants) {
        const btn = renderButton(`<san-button variant="${variant}">${variant}</san-button>`);
        await btn.updateComplete;
        buttons.push(btn);
        await expectAccessible(btn);
      }

      const styles = buttons.map((b) => {
        const cs = getComputedStyle(getControl(b));
        return {
          bg: cs.backgroundColor,
          border: cs.borderColor,
        };
      });

      expect(styles[0]?.bg).not.toBe("rgba(0, 0, 0, 0)");
      expect(styles[1]?.bg).not.toBe("rgba(0, 0, 0, 0)");
      expect(styles[1]?.bg).not.toBe(styles[0]?.bg);
      expect(styles[2]?.bg).toBe("rgba(0, 0, 0, 0)");
      expect(styles[3]?.bg).toBe("rgba(0, 0, 0, 0)");
      expect(styles[2]?.border).not.toBe("rgba(0, 0, 0, 0)");
      expect(styles[3]?.border).toBe("rgba(0, 0, 0, 0)");

      for (const btn of buttons) {
        btn.remove();
      }
    }
  });

  it("remaps intent colors and focus-ring-color inside Shadow DOM", async () => {
    const intents = ["accent", "danger", "warning", "success", "info"] as const;
    const bgColors = new Set<string>();

    for (const intent of intents) {
      const btn = renderButton(`<san-button intent="${intent}">${intent}</san-button>`);
      await btn.updateComplete;

      const control = getControl(btn);
      bgColors.add(getComputedStyle(control).backgroundColor);

      if (intent !== "accent") {
        const expectedColor = getComputedStyle(document.documentElement)
          .getPropertyValue(`--san-${intent}`)
          .trim();
        const hostFocusColor = getComputedStyle(btn)
          .getPropertyValue("--san-focus-ring-color")
          .trim();
        expect(hostFocusColor).toBe(expectedColor);
        expect(expectedColor).not.toBe("");
      }

      await expectAccessible(btn);
    }

    expect(bgColors.size).toBe(intents.length);
  });

  it("supports sm, md, lg sizes and grows gracefully for multi-line labels without clipping", async () => {
    const sm = renderButton(`<san-button size="sm">Small</san-button>`);
    const md = renderButton(`<san-button size="md">Medium</san-button>`);
    const lg = renderButton(`<san-button size="lg">Large</san-button>`);
    await Promise.all([sm.updateComplete, md.updateComplete, lg.updateComplete]);

    const smHeight = getControl(sm).getBoundingClientRect().height;
    const mdHeight = getControl(md).getBoundingClientRect().height;
    const lgHeight = getControl(lg).getBoundingClientRect().height;

    expect(smHeight).toBeCloseTo(32, 0);
    expect(mdHeight).toBeCloseTo(40, 0);
    expect(lgHeight).toBeCloseTo(48, 0);

    expect(getComputedStyle(getControl(sm)).borderTopLeftRadius).toBe("4px");
    expect(getComputedStyle(getControl(md)).borderTopLeftRadius).toBe("8px");
    expect(getComputedStyle(getControl(lg)).borderTopLeftRadius).toBe("8px");

    const wrapping = renderButton(
      `<san-button size="md" style="max-inline-size: 10rem;">This is a very long enterprise action label that wraps onto multiple lines</san-button>`,
    );
    await wrapping.updateComplete;

    const control = getControl(wrapping);
    expect(control.getBoundingClientRect().height).toBeGreaterThan(48);
    expect(control.scrollHeight).toBeLessThanOrEqual(control.clientHeight + 1);
  });

  it("applies pill radius and Tier-5 slots, parts, and CSS custom properties", async () => {
    const pillBtn = renderButton(`<san-button pill>Pill Action</san-button>`);
    await pillBtn.updateComplete;
    const pillControl = getControl(pillBtn);
    expect(Number.parseFloat(getComputedStyle(pillControl).borderTopLeftRadius)).toBeGreaterThan(
      100,
    );

    const custom = renderButton(`
      <san-button style="--san-button-bg: rgb(10, 20, 30); --san-button-fg: rgb(240, 245, 250); --san-button-radius: 4px;">
        <span slot="start" data-testid="start-icon">*</span>
        Custom
        <span slot="end" data-testid="end-icon">&gt;</span>
      </san-button>
    `);
    await custom.updateComplete;

    expect(custom.shadowRoot?.querySelector("[part='start']")).not.toBeNull();
    expect(custom.shadowRoot?.querySelector("[part='label']")).not.toBeNull();
    expect(custom.shadowRoot?.querySelector("[part='end']")).not.toBeNull();
    expect(custom.shadowRoot?.querySelector("[part='spinner']")).not.toBeNull();

    const customControl = getControl(custom);
    const cs = getComputedStyle(customControl);
    expect(cs.backgroundColor).toBe("rgb(10, 20, 30)");
    expect(cs.color).toBe("rgb(240, 245, 250)");
    expect(cs.borderTopLeftRadius).toBe("4px");
  });

  it("renders slotted SVG icons without explicit width or height attributes at non-zero icon size", async () => {
    const btn = renderButton(
      `<san-button><svg slot="start" viewBox="0 0 20 20"><path d="M0 0h20v20H0z"/></svg>Launch</san-button>`,
    );
    await btn.updateComplete;

    const svg = btn.querySelector("svg");
    expect(svg).not.toBeNull();
    if (svg) {
      const rect = svg.getBoundingClientRect();
      expect(rect.width).toBeGreaterThan(0);
      expect(rect.height).toBeGreaterThan(0);
      expect(rect.width).toBeGreaterThanOrEqual(16);
      expect(rect.height).toBeGreaterThanOrEqual(16);
    }

    await expectAccessible(btn);
  });

  it("inherits Sanctuary glazing across pot-metal, flashed, grisaille in compline and lauds", async () => {
    for (const flavor of ["compline", "lauds"] as const) {
      document.documentElement.setAttribute("data-san-flavor", flavor);
      const glazingBgs = new Set<string>();

      for (const glazing of ["pot-metal", "flashed", "grisaille"] as const) {
        document.documentElement.setAttribute("data-san-glazing", glazing);
        const btn = renderButton(`<san-button>${flavor}-${glazing}</san-button>`);
        await btn.updateComplete;

        const control = getControl(btn);
        glazingBgs.add(getComputedStyle(control).backgroundColor);
        await expectAccessible(btn);
        btn.remove();
      }

      expect(glazingBgs.size).toBe(3);
    }
  });

  it("renders link mode with href, safe target=_blank rel, and disabled link semantics", async () => {
    const link = renderButton(
      `<san-button href="https://example.com" target="_blank">External Docs</san-button>`,
    );
    await link.updateComplete;

    const anchor = getControl(link);
    expect(anchor.tagName).toBe("A");
    expect(anchor.getAttribute("href")).toBe("https://example.com");
    expect(anchor.getAttribute("rel")).toBe("noopener noreferrer");
    await expectAccessible(link);

    const customRel = renderButton(
      `<san-button href="https://example.com" target="_blank" rel="author">Author</san-button>`,
    );
    await customRel.updateComplete;
    expect(getControl(customRel).getAttribute("rel")).toBe("author");

    const disabledLink = renderButton(
      `<san-button href="https://example.com" disabled>Disabled Link</san-button>`,
    );
    await disabledLink.updateComplete;
    const disabledAnchor = getControl(disabledLink);
    expect(disabledAnchor.hasAttribute("href")).toBe(false);
    expect(disabledAnchor.getAttribute("aria-disabled")).toBe("true");
    expect(disabledAnchor.getAttribute("tabindex")).toBe("-1");
    await expectAccessible(disabledLink);

    // Removing href attribute returns the control from <a> back to <button>
    link.removeAttribute("href");
    await link.updateComplete;
    expect(getControl(link).tagName).toBe("BUTTON");
  });

  it("integrates with <form> for submit, reset, formnovalidate, and <fieldset disabled>", async () => {
    const form = document.createElement("form");
    form.innerHTML = `
      <input name="username" value="initial" required />
      <fieldset>
        <san-button type="submit" name="action" value="save" formnovalidate>Submit</san-button>
        <san-button type="reset">Reset</san-button>
        <san-button type="button">Neutral</san-button>
      </fieldset>
    `;
    document.body.append(form);

    const input = form.querySelector("input");
    const fieldset = form.querySelector("fieldset");
    const buttons = Array.from(form.querySelectorAll("san-button")) as SanButton[];
    const [submitBtn, resetBtn, neutralBtn] = buttons;
    if (!input || !fieldset || !submitBtn || !resetBtn || !neutralBtn) {
      throw new Error("Expected form controls to exist");
    }

    await Promise.all([
      submitBtn.updateComplete,
      resetBtn.updateComplete,
      neutralBtn.updateComplete,
    ]);

    let submittedAction: FormDataEntryValue | null = null;
    const submitSpy = vi.fn((event: SubmitEvent) => {
      event.preventDefault();
      submittedAction = new FormData(form).get("action");
    });
    form.addEventListener("submit", submitSpy);

    // Neutral type="button" does not submit
    await userEvent.click(neutralBtn);
    expect(submitSpy).not.toHaveBeenCalled();

    // Submit button submits form with name/value (and bypasses required via formnovalidate)
    input.value = "";
    await userEvent.click(submitBtn);
    expect(submitSpy).toHaveBeenCalledOnce();
    expect(submittedAction).toBe("save");

    // Reset button resets form inputs
    input.value = "changed";
    await userEvent.click(resetBtn);
    expect(input.value).toBe("initial");

    // Fieldset disabled disables internal control without mutating host disabled attribute
    fieldset.disabled = true;
    await submitBtn.updateComplete;

    const internalSubmit = getControl(submitBtn) as HTMLButtonElement;
    expect(internalSubmit.disabled).toBe(true);
    expect(submitBtn.hasAttribute("disabled")).toBe(false);
    expect(submitBtn.disabled).toBe(false);

    submitBtn.click();
    expect(submitSpy).toHaveBeenCalledOnce();

    // Re-enabling fieldset re-enables button cleanly
    fieldset.disabled = false;
    await submitBtn.updateComplete;
    expect(internalSubmit.disabled).toBe(false);

    await userEvent.click(submitBtn);
    expect(submitSpy).toHaveBeenCalledTimes(2);
  });

  it("applies and restores form overrides and ignores removed form override attributes", async () => {
    const form = document.createElement("form");
    form.setAttribute("action", "/original");
    form.setAttribute("method", "get");
    form.innerHTML = `
      <san-button
        type="submit"
        formaction="/override"
        formmethod="post"
        formenctype="multipart/form-data"
        formtarget="_blank"
      >
        Save
      </san-button>
    `;
    document.body.append(form);

    const submitBtn = form.querySelector("san-button") as SanButton;
    await submitBtn.updateComplete;

    let observedAction: string | null = null;
    let observedMethod: string | null = null;
    let observedEnctype: string | null = null;
    let observedTarget: string | null = null;

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      observedAction = form.getAttribute("action");
      observedMethod = form.getAttribute("method");
      observedEnctype = form.getAttribute("enctype");
      observedTarget = form.getAttribute("target");
    });

    await userEvent.click(submitBtn);
    expect(observedAction).toBe("/override");
    expect(observedMethod).toBe("post");
    expect(observedEnctype).toBe("multipart/form-data");
    expect(observedTarget).toBe("_blank");

    // Original attributes restored and absent ones removed
    expect(form.getAttribute("action")).toBe("/original");
    expect(form.getAttribute("method")).toBe("get");
    expect(form.hasAttribute("enctype")).toBe(false);
    expect(form.hasAttribute("target")).toBe(false);

    // Removing form override attributes must not write "null" onto the form
    submitBtn.removeAttribute("formaction");
    submitBtn.removeAttribute("formmethod");
    submitBtn.removeAttribute("formenctype");
    submitBtn.removeAttribute("formtarget");
    await submitBtn.updateComplete;

    await userEvent.click(submitBtn);
    expect(observedAction).toBe("/original");
    expect(observedMethod).toBe("get");
    expect(observedEnctype).toBeNull();
    expect(observedTarget).toBeNull();
  });

  it("handles loading state with :state(loading), aria-busy, focusability, click blocking, and zero CLS", async () => {
    const btn = renderButton(`<san-button>Publish Changes</san-button>`);
    await btn.updateComplete;

    const idleWidth = btn.getBoundingClientRect().width;
    const clickSpy = vi.fn();
    btn.addEventListener("click", clickSpy);

    btn.loading = true;
    await btn.updateComplete;

    expect(btn.matches(":state(loading)")).toBe(true);
    const control = getControl(btn) as HTMLButtonElement;
    expect(control.disabled).toBe(false);
    expect(control.getAttribute("aria-busy")).toBe("true");
    expect(control.getAttribute("aria-disabled")).toBe("true");

    // Remains focusable
    btn.focus();
    expect(btn.shadowRoot?.activeElement).toBe(control);

    // Blocks clicks
    await userEvent.click(btn);
    btn.click();
    expect(clickSpy).not.toHaveBeenCalled();

    // Preserves width and displays spinner while keeping accessible name
    const loadingWidth = btn.getBoundingClientRect().width;
    expect(Math.abs(loadingWidth - idleWidth)).toBeLessThanOrEqual(0.5);

    const label = btn.shadowRoot?.querySelector<HTMLElement>("[part='label']");
    const spinner = btn.shadowRoot?.querySelector<HTMLElement>("[part='spinner']");
    expect(label).not.toBeNull();
    expect(spinner).not.toBeNull();
    if (label && spinner) {
      expect(getComputedStyle(label).opacity).toBe("0");
      expect(getComputedStyle(spinner).display).not.toBe("none");
    }

    await expectAccessible(btn);

    btn.loading = false;
    await btn.updateComplete;
    expect(btn.matches(":state(loading)")).toBe(false);
    await userEvent.click(btn);
    expect(clickSpy).toHaveBeenCalledOnce();
  });

  it("shows :focus-visible outline when focused via keyboard", async () => {
    const btn = renderButton(`<san-button>Keyboard Focus</san-button>`);
    await btn.updateComplete;

    await page.getByRole("button", { name: "Keyboard Focus" }).element();
    await userEvent.tab();

    const control = getControl(btn);
    expect(btn.shadowRoot?.activeElement).toBe(control);
    expect(control.matches(":focus-visible")).toBe(true);
    expect(getComputedStyle(control).outlineStyle).toBe("solid");
  });
});
