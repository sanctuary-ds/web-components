import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { userEvent } from "vitest/browser";
import "../src/components/badge/register.js";
import "../src/components/button/register.js";
import "../src/components/card/register.js";
import "../src/components/chip/register.js";
import { SanCard } from "../src/components/card/index.js";
import { SanCard as RootSanCard } from "../src/index.js";
import { expectAccessible } from "./helpers/a11y.js";

const SAMPLE_MEDIA = `<svg slot="media" viewBox="0 0 160 120" aria-hidden="true"><rect width="160" height="120" fill="currentColor"/></svg>`;

function renderCard(htmlText: string, containerStyle?: string): SanCard {
  const wrapper = document.createElement("div");
  if (containerStyle) {
    wrapper.style.cssText = containerStyle;
  }
  wrapper.innerHTML = htmlText.trim();
  const el = wrapper.firstElementChild as SanCard;
  document.body.append(wrapper);
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

async function nextFrame(): Promise<void> {
  await new Promise<void>((resolve) => {
    requestAnimationFrame(() => resolve());
  });
}

async function settleSlotUpdate(el: SanCard): Promise<void> {
  await Promise.resolve();
  await el.updateComplete;
}

function getBase(el: SanCard): HTMLElement {
  const base = el.shadowRoot?.querySelector<HTMLElement>("[part='base']");
  if (!base) {
    throw new Error("Expected [part='base'] element in shadowRoot");
  }
  return base;
}

function getPart<T extends Element = HTMLElement>(el: SanCard, part: string): T {
  const node = el.shadowRoot?.querySelector<T>(`[part='${part}']`);
  if (!node) {
    throw new Error(`Expected [part='${part}'] element in shadowRoot`);
  }
  return node;
}

describe("<san-card>", () => {
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

  it("exports SanCard from root and subpath and registers san-card", () => {
    expect(RootSanCard).toBe(SanCard);
    expect(customElements.get("san-card")).toBe(SanCard);
  });

  it("defaults to outlined, md, vertical and renders semantic <article part='base'> without trapping focus", async () => {
    const el = renderCard(`<san-card>Card body</san-card>`);
    await el.updateComplete;

    expect(el.variant).toBe("outlined");
    expect(el.padding).toBe("md");
    expect(el.layout).toBe("vertical");
    expect(el.interactive).toBe(false);
    expect(el.selected).toBe(false);

    expect(el.getAttribute("variant")).toBe("outlined");
    expect(el.getAttribute("padding")).toBe("md");
    expect(el.getAttribute("layout")).toBe("vertical");
    expect(el.hasAttribute("interactive")).toBe(false);
    expect(el.hasAttribute("selected")).toBe(false);
    expect(el.matches(":state(has-media)")).toBe(false);
    expect(el.matches(":state(selected)")).toBe(false);

    const base = getBase(el);
    expect(base.tagName).toBe("ARTICLE");
    expect(el.shadowRoot?.querySelector("button, a, [tabindex]")).toBeNull();

    const regions = Array.from(base.children).map((child) => child.getAttribute("part"));
    expect(regions).toEqual(["media", "header", "body", "footer"]);

    el.focus();
    expect(document.activeElement).not.toBe(el);
    expect(el.shadowRoot?.activeElement).toBeNull();

    await expectAccessible(el);
  });

  it("passes axe-core across outlined, elevated, and filled variants in lauds and compline flavors", async () => {
    const variants = ["outlined", "elevated", "filled"] as const;

    for (const flavor of ["lauds", "compline"] as const) {
      document.documentElement.setAttribute("data-san-flavor", flavor);

      const backgrounds: string[] = [];
      const borders: string[] = [];
      const shadows: string[] = [];

      for (const variant of variants) {
        const el = renderCard(
          `<san-card variant="${variant}">
            <h3 slot="header">Sanctuary ${variant}</h3>
            <p>Stone, glass, and light surface hierarchy.</p>
            <div slot="footer">Footer metadata</div>
          </san-card>`,
        );
        await el.updateComplete;

        const styles = getComputedStyle(getBase(el));
        backgrounds.push(styles.backgroundColor);
        borders.push(styles.borderTopColor);
        shadows.push(styles.boxShadow);

        if (variant === "elevated") {
          expect(styles.boxShadow).not.toBe("none");
        }
        if (variant === "filled") {
          expect(styles.borderTopColor).toBe("rgba(0, 0, 0, 0)");
        }

        await expectAccessible(el);
        el.parentElement?.remove();
      }

      expect(new Set(backgrounds).size).toBe(variants.length);
      expect(new Set(borders).size).toBe(variants.length);
      expect(shadows[1]).not.toBe(shadows[0]);
    }
  });

  it("applies padding presets none, sm, md, and lg", async () => {
    const none = renderCard(`<san-card padding="none">None</san-card>`);
    const sm = renderCard(`<san-card padding="sm">Small</san-card>`);
    const md = renderCard(`<san-card padding="md">Medium</san-card>`);
    const lg = renderCard(`<san-card padding="lg">Large</san-card>`);
    await Promise.all([
      none.updateComplete,
      sm.updateComplete,
      md.updateComplete,
      lg.updateComplete,
    ]);

    expect(getComputedStyle(getPart(none, "body")).paddingTop).toBe("0px");
    expect(getComputedStyle(getPart(none, "body")).paddingInlineStart).toBe("0px");
    expect(getComputedStyle(getPart(sm, "body")).paddingTop).toBe("12px");
    expect(getComputedStyle(getPart(md, "body")).paddingTop).toBe("20px");
    expect(getComputedStyle(getPart(lg, "body")).paddingTop).toBe("24px");
  });

  it("auto-collapses empty regions, ignores whitespace/comments, and reacts to dynamic slot changes", async () => {
    const el = renderCard(`<san-card><!-- comment -->   \n  </san-card>`);
    await el.updateComplete;

    const media = getPart(el, "media");
    const header = getPart(el, "header");
    const body = getPart(el, "body");
    const footer = getPart(el, "footer");

    expect(media.hidden).toBe(true);
    expect(header.hidden).toBe(true);
    expect(body.hidden).toBe(true);
    expect(footer.hidden).toBe(true);
    expect(el.matches(":state(has-media)")).toBe(false);

    // Footer alone has no top divider
    const footerNode = document.createElement("span");
    footerNode.slot = "footer";
    footerNode.textContent = "Action";
    el.append(footerNode);
    await settleSlotUpdate(el);
    expect(footer.hidden).toBe(false);
    expect(getComputedStyle(footer).borderTopWidth).toBe("0px");

    // Adding body reveals body and turns on the footer divider
    const bodyNode = document.createElement("p");
    bodyNode.textContent = "Main content";
    el.append(bodyNode);
    await settleSlotUpdate(el);
    expect(body.hidden).toBe(false);
    expect(getComputedStyle(footer).borderTopWidth).toBe("1px");

    // Adding header & media reveals those regions and sets :state(has-media)
    const headerNode = document.createElement("h3");
    headerNode.slot = "header";
    headerNode.textContent = "Title";
    el.append(headerNode);

    const mediaNode = document.createElement("div");
    mediaNode.slot = "media";
    mediaNode.textContent = "Media";
    el.append(mediaNode);
    await settleSlotUpdate(el);
    expect(header.hidden).toBe(false);
    expect(media.hidden).toBe(false);
    expect(el.matches(":state(has-media)")).toBe(true);

    // Removing media hides media and clears :state(has-media)
    mediaNode.remove();
    await settleSlotUpdate(el);
    expect(media.hidden).toBe(true);
    expect(el.matches(":state(has-media)")).toBe(false);

    // Removing body & header leaves footer without a top divider
    bodyNode.remove();
    headerNode.remove();
    await settleSlotUpdate(el);
    expect(body.hidden).toBe(true);
    expect(header.hidden).toBe(true);
    expect(getComputedStyle(footer).borderTopWidth).toBe("0px");
  });

  it("uses 2-column horizontal layout only when :state(has-media) is active", async () => {
    const withMedia = renderCard(
      `<san-card layout="horizontal" style="inline-size: 36rem;">
        ${SAMPLE_MEDIA}
        <h3 slot="header">Horizontal with media</h3>
        <p>Body beside media.</p>
        <div slot="footer">Footer</div>
      </san-card>`,
    );
    const withoutMedia = renderCard(
      `<san-card layout="horizontal" style="inline-size: 36rem;">
        <h3 slot="header">Horizontal without media</h3>
        <p>Should occupy full single column.</p>
      </san-card>`,
    );
    await Promise.all([withMedia.updateComplete, withoutMedia.updateComplete]);
    await nextFrame();

    expect(withMedia.matches(":state(has-media)")).toBe(true);
    const mediaRect = getPart(withMedia, "media").getBoundingClientRect();
    const headerRect = getPart(withMedia, "header").getBoundingClientRect();
    const bodyRect = getPart(withMedia, "body").getBoundingClientRect();
    expect(mediaRect.width).toBeCloseTo(224, 0);
    expect(mediaRect.right).toBeLessThanOrEqual(headerRect.left + 1);
    expect(mediaRect.right).toBeLessThanOrEqual(bodyRect.left + 1);
    expect(mediaRect.top).toBeLessThanOrEqual(headerRect.top + 1);

    expect(withoutMedia.matches(":state(has-media)")).toBe(false);
    const cardRect = getBase(withoutMedia).getBoundingClientRect();
    const singleBodyRect = getPart(withoutMedia, "body").getBoundingClientRect();
    expect(singleBodyRect.left).toBeCloseTo(cardRect.left + 1, 0);
    expect(singleBodyRect.width).toBeCloseTo(cardRect.width - 2, 0);
  });

  it("adapts layout='auto' via container query at 30rem only when media is present", async () => {
    const card = renderCard(
      `<san-card layout="auto">
        ${SAMPLE_MEDIA}
        <h3 slot="header">Responsive card</h3>
        <p>Adapts to container inline-size.</p>
        <div slot="footer">Footer</div>
      </san-card>`,
      "inline-size: 24rem;",
    );
    const container = card.parentElement as HTMLDivElement;
    await card.updateComplete;
    await nextFrame();

    // Below 30rem (24rem = 384px): stacked vertically
    let mediaRect = getPart(card, "media").getBoundingClientRect();
    let headerRect = getPart(card, "header").getBoundingClientRect();
    expect(mediaRect.bottom).toBeLessThanOrEqual(headerRect.top + 1);
    expect(mediaRect.width).toBeGreaterThan(300);

    // At or above 30rem (36rem = 576px): switches to 2-column horizontal
    container.style.inlineSize = "36rem";
    await nextFrame();
    await nextFrame();

    mediaRect = getPart(card, "media").getBoundingClientRect();
    headerRect = getPart(card, "header").getBoundingClientRect();
    expect(mediaRect.width).toBeCloseTo(224, 0);
    expect(mediaRect.right).toBeLessThanOrEqual(headerRect.left + 1);
    expect(mediaRect.top).toBeLessThanOrEqual(headerRect.top + 1);

    // Removing media while wide reverts to single-column
    card.querySelector("[slot='media']")?.remove();
    await card.updateComplete;
    await nextFrame();

    const cardRect = getBase(card).getBoundingClientRect();
    const bodyRect = getPart(card, "body").getBoundingClientRect();
    expect(bodyRect.width).toBeCloseTo(cardRect.width - 2, 0);
  });

  it("supports interactive hover/focus-within emphasis and non-shifting selected state", async () => {
    const el = renderCard(
      `<san-card interactive style="inline-size: 24rem;">
        <h3 slot="header">Interactive Card</h3>
        <p>Body copy</p>
        <san-button slot="footer" size="sm">Inspect</san-button>
      </san-card>`,
    );
    await el.updateComplete;

    const base = getBase(el);
    const initialRect = base.getBoundingClientRect();
    const initialBorderWidth = getComputedStyle(base).borderTopWidth;
    const initialPadding = getComputedStyle(getPart(el, "body")).paddingTop;
    const initialBorderColor = getComputedStyle(base).borderTopColor;

    // Hover emphasis on interactive card
    await userEvent.hover(base);
    await settleTransitions(base);
    expect(getComputedStyle(base).boxShadow).not.toBe("none");

    // Focus-within outline when nested control focuses
    await userEvent.tab();
    expect(base.matches(":focus-within")).toBe(true);
    expect(getComputedStyle(base).outlineStyle).toBe("solid");

    // Selected state preserves dimensions, border-width, and padding (zero layout shift)
    el.selected = true;
    await el.updateComplete;
    await settleTransitions(base);

    expect(el.matches(":state(selected)")).toBe(true);
    const selectedRect = base.getBoundingClientRect();
    expect(selectedRect.width).toBeCloseTo(initialRect.width, 1);
    expect(selectedRect.height).toBeCloseTo(initialRect.height, 1);
    expect(getComputedStyle(base).borderTopWidth).toBe(initialBorderWidth);
    expect(getComputedStyle(getPart(el, "body")).paddingTop).toBe(initialPadding);
    expect(getComputedStyle(base).borderTopColor).not.toBe(initialBorderColor);
    expect(getComputedStyle(base).boxShadow).not.toBe("none");

    await expectAccessible(el);
  });

  it("keeps composed Sanctuary controls operable and accessible inside <san-card>", async () => {
    const el = renderCard(
      `<san-card variant="elevated">
        <div slot="header" style="display: flex; justify-content: space-between; align-items: center;">
          <span>Release 0.4.0</span>
          <san-badge intent="success" dot>Stable</san-badge>
        </div>
        <p>Composed Sanctuary controls inside card body and footer.</p>
        <san-chip selectable>Tokens</san-chip>
        <san-button slot="footer" variant="filled" intent="accent" size="sm">Open</san-button>
      </san-card>`,
    );
    await el.updateComplete;

    const chip = el.querySelector("san-chip");
    const button = el.querySelector("san-button");
    if (!chip || !button) {
      throw new Error("Expected slotted san-chip and san-button");
    }

    const buttonSpy = vi.fn();
    button.addEventListener("click", buttonSpy);

    await userEvent.click(chip);
    await chip.updateComplete;
    expect(chip.selected).toBe(true);

    await userEvent.click(button);
    expect(buttonSpy).toHaveBeenCalledTimes(1);

    await expectAccessible(el);
  });

  it("applies Tier-5 CSS custom property overrides", async () => {
    const el = renderCard(
      `<san-card layout="horizontal" style="
        inline-size: 40rem;
        --san-card-bg: rgb(12, 24, 36);
        --san-card-fg: rgb(235, 242, 250);
        --san-card-border: rgb(90, 120, 150);
        --san-card-border-hover: rgb(180, 210, 240);
        --san-card-radius: 18px;
        --san-card-padding: 28px;
        --san-card-gap: 16px;
        --san-card-shadow: 0 8px 16px rgba(0, 0, 0, 0.25);
        --san-card-media-size: 180px;
      " interactive>
        ${SAMPLE_MEDIA}
        <h3 slot="header">Custom Card</h3>
        <p>Tier-5 token overrides.</p>
        <div slot="footer">Footer</div>
      </san-card>`,
    );
    await el.updateComplete;
    await nextFrame();

    const base = getBase(el);
    const baseStyles = getComputedStyle(base);
    expect(baseStyles.backgroundColor).toBe("rgb(12, 24, 36)");
    expect(baseStyles.color).toBe("rgb(235, 242, 250)");
    expect(baseStyles.borderTopColor).toBe("rgb(90, 120, 150)");
    expect(baseStyles.borderRadius).toBe("18px");
    expect(baseStyles.boxShadow).toContain("rgba(0, 0, 0, 0.25)");

    expect(getComputedStyle(getPart(el, "header")).paddingTop).toBe("28px");
    expect(getComputedStyle(getPart(el, "header")).paddingInlineStart).toBe("28px");
    expect(getComputedStyle(getPart(el, "body")).paddingTop).toBe("16px");
    expect(getPart(el, "media").getBoundingClientRect().width).toBeCloseTo(180, 0);

    await userEvent.hover(base);
    await settleTransitions(base);
    expect(getComputedStyle(base).borderTopColor).toBe("rgb(180, 210, 240)");
  });
});
