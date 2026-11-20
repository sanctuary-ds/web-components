import { css, html } from "lit";
import { afterEach, describe, expect, it, vi } from "vitest";
import { defineElement, focusStyles, resetStyles, SanctuaryElement } from "../src/index.js";
import { expectAccessible } from "./helpers/a11y.js";

class TestProbeElement extends SanctuaryElement {
  static override styles = [
    resetStyles,
    focusStyles,
    css`
      :host {
        display: inline-flex;
      }

      :host(:state(busy)) button {
        opacity: 0.5;
      }

      button {
        font: var(--san-type-label-lg);
        letter-spacing: var(--san-type-label-lg-tracking);
        background: var(--san-glaze-bg);
        color: var(--san-glaze-fg);
        border: var(--san-border-width-hairline) solid var(--san-glaze-border);
        border-radius: var(--san-radius-md);
        padding: var(--san-space-1-5) var(--san-space-3);
      }
    `,
  ];

  setBusy(active: boolean): void {
    this.setCustomState("busy", active);
    if (this.internals) {
      this.internals.ariaBusy = active ? "true" : "false";
    }
  }

  get busy(): boolean {
    return this.hasCustomState("busy");
  }

  protected override render() {
    return html`<button type="button" part="control"><slot></slot></button>`;
  }
}

const TEST_TAG = "san-test-probe";
defineElement(TEST_TAG, TestProbeElement);

describe("Phase 0 foundation", () => {
  afterEach(() => {
    document.body.innerHTML = "";
    document.documentElement.removeAttribute("data-san-flavor");
  });

  it("loads @sanctuary-ds/tokens@0.4.0 CSS tokens across flavors", () => {
    const rootStyle = getComputedStyle(document.documentElement);

    expect(rootStyle.getPropertyValue("--san-focus-ring-width").trim()).toBe("0.125rem");
    expect(rootStyle.getPropertyValue("--san-focus-ring-offset").trim()).toBe("0.125rem");
    expect(rootStyle.getPropertyValue("--san-space-1-5").trim()).toBe("0.375rem");
    expect(rootStyle.getPropertyValue("--san-space-2-5").trim()).toBe("0.625rem");
    expect(rootStyle.getPropertyValue("--san-type-label-lg-size").trim()).toBe("0.875rem");
    expect(rootStyle.getPropertyValue("--san-danger-glaze-bg").trim()).not.toBe("");
    expect(rootStyle.getPropertyValue("--san-surface-disabled").trim()).not.toBe("");

    const complineSurface = rootStyle.getPropertyValue("--san-surface").trim();
    document.documentElement.setAttribute("data-san-flavor", "lauds");
    const laudsSurface = getComputedStyle(document.documentElement)
      .getPropertyValue("--san-surface")
      .trim();

    expect(laudsSurface).not.toBe("");
    expect(laudsSurface).not.toBe(complineSurface);
  });

  it("registers custom elements idempotently and warns on conflicting classes", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    expect(() => defineElement(TEST_TAG, TestProbeElement)).not.toThrow();
    expect(warnSpy).not.toHaveBeenCalled();

    class ConflictingProbeElement extends HTMLElement {}
    expect(() => defineElement(TEST_TAG, ConflictingProbeElement)).not.toThrow();
    expect(warnSpy).toHaveBeenCalledOnce();

    warnSpy.mockRestore();
  });

  it("supports ElementInternals custom states, [hidden] reset, and passes axe-core", async () => {
    const host = document.createElement(TEST_TAG) as TestProbeElement;
    host.textContent = "Inspect foundation";
    document.body.append(host);
    await host.updateComplete;

    expect(getComputedStyle(host).display).toBe("inline-flex");

    host.setBusy(true);
    expect(host.busy).toBe(true);
    expect(host.matches(":state(busy)")).toBe(true);

    const button = host.shadowRoot?.querySelector("button");
    expect(button).not.toBeNull();
    expect(getComputedStyle(button as HTMLButtonElement).opacity).toBe("0.5");

    host.setBusy(false);
    expect(host.busy).toBe(false);
    expect(host.matches(":state(busy)")).toBe(false);

    await expectAccessible(host);

    host.hidden = true;
    expect(getComputedStyle(host).display).toBe("none");
  });
});
