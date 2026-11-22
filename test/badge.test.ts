import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import "../src/components/badge/register.js";
import { SanBadge } from "../src/components/badge/index.js";
import { SanBadge as RootSanBadge } from "../src/index.js";
import { expectAccessible } from "./helpers/a11y.js";

const SAMPLE_ICON = `<svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><circle cx="10" cy="10" r="6"/></svg>`;

function renderBadge(htmlText: string): SanBadge {
  const wrapper = document.createElement("div");
  wrapper.innerHTML = htmlText.trim();
  const el = wrapper.firstElementChild as SanBadge;
  document.body.append(el);
  return el;
}

function getBase(el: SanBadge): HTMLSpanElement {
  const base = el.shadowRoot?.querySelector<HTMLSpanElement>("[part='base']");
  if (!base) {
    throw new Error("Expected [part='base'] element in shadowRoot");
  }
  return base;
}

function getPart<T extends Element = HTMLElement>(el: SanBadge, part: string): T {
  const node = el.shadowRoot?.querySelector<T>(`[part='${part}']`);
  if (!node) {
    throw new Error(`Expected [part='${part}'] element in shadowRoot`);
  }
  return node;
}

describe("<san-badge>", () => {
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
  });

  it("exports SanBadge from root and subpath and registers san-badge", () => {
    expect(RootSanBadge).toBe(SanBadge);
    expect(customElements.get("san-badge")).toBe(SanBadge);
  });

  it("defaults to soft, neutral, md and enforces passive non-interactive contract", async () => {
    const el = renderBadge(`<san-badge>Draft</san-badge>`);
    await el.updateComplete;

    expect(el.variant).toBe("soft");
    expect(el.intent).toBe("neutral");
    expect(el.size).toBe("md");
    expect(el.pill).toBe(false);
    expect(el.dot).toBe(false);
    expect(el.label).toBe("");

    expect(el.getAttribute("variant")).toBe("soft");
    expect(el.getAttribute("intent")).toBe("neutral");
    expect(el.getAttribute("size")).toBe("md");
    expect(el.hasAttribute("pill")).toBe(false);
    expect(el.hasAttribute("dot")).toBe(false);
    expect(el.matches(":state(dot-only)")).toBe(false);

    const base = getBase(el);
    expect(base.tagName).toBe("SPAN");
    expect(el.shadowRoot?.querySelector("button, a, [tabindex]")).toBeNull();
    expect(el.hasAttribute("tabindex")).toBe(false);

    el.focus();
    expect(document.activeElement).not.toBe(el);
    expect(el.shadowRoot?.activeElement).toBeNull();

    await expectAccessible(el);
  });

  it("passes axe-core across all 3 variants x 6 intents in lauds and compline flavors", async () => {
    const variants = ["soft", "filled", "outlined"] as const;
    const intents = ["neutral", "accent", "danger", "warning", "success", "info"] as const;

    for (const flavor of ["lauds", "compline"] as const) {
      document.documentElement.setAttribute("data-san-flavor", flavor);

      for (const variant of variants) {
        const bgSet = new Set<string>();
        const fgSet = new Set<string>();

        for (const intent of intents) {
          const el = renderBadge(
            `<san-badge variant="${variant}" intent="${intent}">${intent}</san-badge>`,
          );
          await el.updateComplete;

          const styles = getComputedStyle(getBase(el));
          bgSet.add(styles.backgroundColor);
          fgSet.add(styles.color);

          if (variant === "outlined") {
            expect(styles.backgroundColor).toBe("rgba(0, 0, 0, 0)");
          } else {
            expect(styles.backgroundColor).not.toBe("rgba(0, 0, 0, 0)");
          }

          await expectAccessible(el);
          el.remove();
        }

        if (variant === "outlined") {
          expect(fgSet.size).toBe(intents.length);
        } else {
          expect(bgSet.size).toBe(intents.length);
        }
      }
    }
  });

  it("supports sm, md, lg sizes, pill radius, and direct start/end SVG bounding boxes", async () => {
    const sm = renderBadge(
      `<san-badge size="sm"><svg slot="start" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><circle cx="10" cy="10" r="6"/></svg>Small</san-badge>`,
    );
    const md = renderBadge(`<san-badge size="md">Medium</san-badge>`);
    const lg = renderBadge(
      `<san-badge size="lg" pill>Large<svg slot="end" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><circle cx="10" cy="10" r="6"/></svg></san-badge>`,
    );
    const withBoth = renderBadge(
      `<san-badge size="md"><svg slot="start" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><circle cx="10" cy="10" r="6"/></svg>Both<svg slot="end" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><circle cx="10" cy="10" r="6"/></svg></san-badge>`,
    );

    await Promise.all([
      sm.updateComplete,
      md.updateComplete,
      lg.updateComplete,
      withBoth.updateComplete,
    ]);

    expect(sm.getBoundingClientRect().height).toBeCloseTo(20, 0);
    expect(md.getBoundingClientRect().height).toBeCloseTo(24, 0);
    expect(lg.getBoundingClientRect().height).toBeCloseTo(28, 0);
    expect(Number.parseFloat(getComputedStyle(getBase(lg)).borderRadius)).toBeGreaterThanOrEqual(
      999,
    );

    expect(getPart(md, "start").hidden).toBe(true);
    expect(getPart(md, "end").hidden).toBe(true);

    const smStartSvg = sm.querySelector("svg[slot='start']") as SVGSVGElement;
    const mdStartSvg = withBoth.querySelector("svg[slot='start']") as SVGSVGElement;
    const mdEndSvg = withBoth.querySelector("svg[slot='end']") as SVGSVGElement;
    const lgEndSvg = lg.querySelector("svg[slot='end']") as SVGSVGElement;

    expect(smStartSvg.getBoundingClientRect().width).toBeCloseTo(12, 0);
    expect(smStartSvg.getBoundingClientRect().height).toBeCloseTo(12, 0);
    expect(mdStartSvg.getBoundingClientRect().width).toBeCloseTo(14, 0);
    expect(mdEndSvg.getBoundingClientRect().width).toBeCloseTo(14, 0);
    expect(lgEndSvg.getBoundingClientRect().width).toBeCloseTo(16, 0);
    expect(lgEndSvg.getBoundingClientRect().height).toBeCloseTo(16, 0);

    for (const el of [sm, md, lg, withBoth]) {
      await expectAccessible(el);
    }
  });

  it("supports dot with text, dot-only :state(dot-only) with label, decorative dot, null-guard, and dynamic slot transitions", async () => {
    const withText = renderBadge(`<san-badge dot intent="success">Online</san-badge>`);
    await withText.updateComplete;

    const withTextDot = getPart(withText, "dot");
    expect(withTextDot.hidden).toBe(false);
    expect(withTextDot.getAttribute("aria-hidden")).toBe("true");
    expect(withText.matches(":state(dot-only)")).toBe(false);
    expect(getBase(withText).hasAttribute("aria-hidden")).toBe(false);
    await expectAccessible(withText);

    const dotOnlyLabelled = renderBadge(
      `<san-badge dot intent="success" label="Online"></san-badge>`,
    );
    await dotOnlyLabelled.updateComplete;

    expect(dotOnlyLabelled.matches(":state(dot-only)")).toBe(true);
    expect(getBase(dotOnlyLabelled).hasAttribute("aria-hidden")).toBe(false);
    const dotOnlyRect = dotOnlyLabelled.getBoundingClientRect();
    expect(dotOnlyRect.width).toBeCloseTo(8, 0);
    expect(dotOnlyRect.height).toBeCloseTo(8, 0);
    await expectAccessible(dotOnlyLabelled);

    // Decorative dot-only without label hides base from accessibility tree
    const decorativeDot = renderBadge(`<san-badge dot size="sm" intent="info"></san-badge>`);
    await decorativeDot.updateComplete;
    expect(decorativeDot.matches(":state(dot-only)")).toBe(true);
    expect(getBase(decorativeDot).getAttribute("aria-hidden")).toBe("true");
    const smDotRect = decorativeDot.getBoundingClientRect();
    expect(smDotRect.width).toBeCloseTo(6, 0);
    expect(smDotRect.height).toBeCloseTo(6, 0);
    await expectAccessible(decorativeDot);

    // Null/undefined label guards must not throw
    dotOnlyLabelled.removeAttribute("label");
    await dotOnlyLabelled.updateComplete;
    expect(getBase(dotOnlyLabelled).getAttribute("aria-hidden")).toBe("true");
    await expectAccessible(dotOnlyLabelled);

    (dotOnlyLabelled as unknown as { label: string | undefined }).label = undefined;
    await dotOnlyLabelled.updateComplete;
    expect(getBase(dotOnlyLabelled).getAttribute("aria-hidden")).toBe("true");

    dotOnlyLabelled.label = "Online";
    await dotOnlyLabelled.updateComplete;
    expect(getBase(dotOnlyLabelled).hasAttribute("aria-hidden")).toBe(false);
    await expectAccessible(dotOnlyLabelled);

    // Dynamic slot transition: adding text exits :state(dot-only); removing restores it
    dotOnlyLabelled.append(document.createTextNode("Online"));
    await dotOnlyLabelled.updateComplete;
    expect(dotOnlyLabelled.matches(":state(dot-only)")).toBe(false);
    expect(getBase(dotOnlyLabelled).hasAttribute("aria-hidden")).toBe(false);

    dotOnlyLabelled.lastChild?.remove();
    await dotOnlyLabelled.updateComplete;
    expect(dotOnlyLabelled.matches(":state(dot-only)")).toBe(true);
    expect(getBase(dotOnlyLabelled).hasAttribute("aria-hidden")).toBe(false);

    // Non-text icon-only badge with label passes axe-core
    const iconOnlyBadge = renderBadge(`<san-badge label="Verified">${SAMPLE_ICON}</san-badge>`);
    await iconOnlyBadge.updateComplete;
    expect(iconOnlyBadge.matches(":state(dot-only)")).toBe(false);
    await expectAccessible(iconOnlyBadge);
  });

  it("exposes role='img' and aria-label via ElementInternals and falls back to host attributes when unavailable", async () => {
    const originalAttach = HTMLElement.prototype.attachInternals;
    const internalsRef: { current: ElementInternals | null } = { current: null };
    vi.spyOn(HTMLElement.prototype, "attachInternals").mockImplementation(function (
      this: HTMLElement,
    ) {
      internalsRef.current = originalAttach.call(this);
      return internalsRef.current;
    });

    const el = renderBadge(`<san-badge dot label="Online"></san-badge>`);
    await el.updateComplete;

    expect(internalsRef.current).not.toBeNull();
    expect(internalsRef.current?.role).toBe("img");
    expect(internalsRef.current?.ariaLabel).toBe("Online");
    expect(el.hasAttribute("role")).toBe(false);
    expect(el.hasAttribute("aria-label")).toBe(false);

    el.append(document.createTextNode("Online"));
    await el.updateComplete;
    expect(internalsRef.current?.role).toBeNull();
    expect(internalsRef.current?.ariaLabel).toBeNull();

    el.lastChild?.remove();
    await el.updateComplete;
    expect(internalsRef.current?.role).toBe("img");
    expect(internalsRef.current?.ariaLabel).toBe("Online");

    vi.restoreAllMocks();
    vi.spyOn(HTMLElement.prototype, "attachInternals").mockImplementation(
      () => ({ states: new Set<string>() }) as unknown as ElementInternals,
    );

    const fallbackEl = renderBadge(`<san-badge dot label="Fallback"></san-badge>`);
    await fallbackEl.updateComplete;
    expect(fallbackEl.getAttribute("role")).toBe("img");
    expect(fallbackEl.getAttribute("aria-label")).toBe("Fallback");
    await expectAccessible(fallbackEl);

    fallbackEl.removeAttribute("label");
    await fallbackEl.updateComplete;
    expect(fallbackEl.hasAttribute("role")).toBe(false);
    expect(fallbackEl.hasAttribute("aria-label")).toBe(false);
    expect(getBase(fallbackEl).getAttribute("aria-hidden")).toBe("true");
    await expectAccessible(fallbackEl);
  });

  it("truncates long labels to a single line with ellipsis and uses tabular-nums", async () => {
    const el = renderBadge(
      `<san-badge style="max-inline-size: 8rem;">Very long status badge label 1234567890</san-badge>`,
    );
    await el.updateComplete;

    const labelEl = getPart(el, "label");
    const labelStyles = getComputedStyle(labelEl);
    expect(labelStyles.whiteSpace).toBe("nowrap");
    expect(labelStyles.overflow).toBe("hidden");
    expect(labelStyles.textOverflow).toBe("ellipsis");
    expect(labelStyles.fontVariantNumeric).toBe("tabular-nums");
    expect(el.getBoundingClientRect().height).toBeCloseTo(24, 0);
    expect(el.getBoundingClientRect().width).toBeLessThanOrEqual(129);
    expect(labelEl.scrollWidth).toBeGreaterThan(labelEl.clientWidth);
  });

  it("applies Tier-5 CSS custom property overrides", async () => {
    const el = renderBadge(
      `<san-badge dot style="
        --san-badge-bg: rgb(10, 20, 30);
        --san-badge-fg: rgb(240, 245, 250);
        --san-badge-border: rgb(100, 110, 120);
        --san-badge-radius: 12px;
        --san-badge-height: 36px;
        --san-badge-padding-inline: 20px;
        --san-badge-gap: 12px;
        --san-badge-dot-size: 10px;
      "><svg slot="start" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><circle cx="10" cy="10" r="6"/></svg>Custom</san-badge>`,
    );
    el.style.setProperty("--san-badge-icon-size", "18px");
    await el.updateComplete;

    const baseStyles = getComputedStyle(getBase(el));
    expect(baseStyles.backgroundColor).toBe("rgb(10, 20, 30)");
    expect(baseStyles.color).toBe("rgb(240, 245, 250)");
    expect(baseStyles.borderColor).toBe("rgb(100, 110, 120)");
    expect(baseStyles.borderRadius).toBe("12px");
    expect(baseStyles.minBlockSize).toBe("36px");
    expect(baseStyles.paddingInline).toBe("20px");
    expect(baseStyles.gap).toBe("12px");

    const dotStyles = getComputedStyle(getPart(el, "dot"));
    expect(dotStyles.width).toBe("10px");
    expect(dotStyles.height).toBe("10px");

    const svg = el.querySelector("svg[slot='start']") as SVGSVGElement;
    expect(svg.getBoundingClientRect().width).toBeCloseTo(18, 0);
  });
});
