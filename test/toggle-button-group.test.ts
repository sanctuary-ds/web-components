import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { userEvent } from "vitest/browser";
import "../src/components/toggle-button/register.js";
import "../src/components/toggle-button-group/register.js";
import type { SanToggleButton } from "../src/components/toggle-button/index.js";
import { SanToggleButtonGroup } from "../src/components/toggle-button-group/index.js";
import { SanToggleButtonGroup as RootSanToggleButtonGroup } from "../src/index.js";
import { expectAccessible } from "./helpers/a11y.js";

const ICON_LEFT = `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true"><path stroke-linecap="round" d="M3 5h14M3 10h10M3 15h12"/></svg>`;
const ICON_CENTER = `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true"><path stroke-linecap="round" d="M3 5h14M5 10h10M4 15h12"/></svg>`;
const ICON_RIGHT = `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true"><path stroke-linecap="round" d="M3 5h14M7 10h10M5 15h12"/></svg>`;

function renderGroup(htmlText: string): SanToggleButtonGroup {
  const wrapper = document.createElement("div");
  wrapper.innerHTML = htmlText.trim();
  const el = wrapper.firstElementChild as SanToggleButtonGroup;
  document.body.append(el);
  return el;
}

function getButtons(group: SanToggleButtonGroup): SanToggleButton[] {
  return Array.from(group.querySelectorAll<SanToggleButton>("san-toggle-button"));
}

function getButtonTriple(
  group: SanToggleButtonGroup,
): [SanToggleButton, SanToggleButton, SanToggleButton] {
  const buttons = getButtons(group);
  if (buttons.length < 3 || !buttons[0] || !buttons[1] || !buttons[2]) {
    throw new Error(`Expected at least 3 buttons, found ${buttons.length}`);
  }
  return [buttons[0], buttons[1], buttons[2]];
}

function getButtonQuad(
  group: SanToggleButtonGroup,
): [SanToggleButton, SanToggleButton, SanToggleButton, SanToggleButton] {
  const buttons = getButtons(group);
  if (buttons.length < 4 || !buttons[0] || !buttons[1] || !buttons[2] || !buttons[3]) {
    throw new Error(`Expected at least 4 buttons, found ${buttons.length}`);
  }
  return [buttons[0], buttons[1], buttons[2], buttons[3]];
}

function getControl(button: SanToggleButton): HTMLButtonElement {
  const control = button.shadowRoot?.querySelector<HTMLButtonElement>("[part='base']");
  if (!control) {
    throw new Error("Expected [part='base'] control in <san-toggle-button>");
  }
  return control;
}

async function flushGroup(group: SanToggleButtonGroup): Promise<void> {
  await group.updateComplete;
  await Promise.all(getButtons(group).map((button) => button.updateComplete));
}

describe("<san-toggle-button-group>", () => {
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
    document.documentElement.removeAttribute("dir");
  });

  it("exports SanToggleButtonGroup from root and subpath and registers san-toggle-button-group", () => {
    expect(RootSanToggleButtonGroup).toBe(SanToggleButtonGroup);
    expect(customElements.get("san-toggle-button-group")).toBe(SanToggleButtonGroup);
  });

  it("defaults to single, horizontal, outlined, accent, md, attached with toolbar semantics and accessible label guards", async () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    const unlabelled = renderGroup(`
      <san-toggle-button-group>
        <san-toggle-button value="left">Left</san-toggle-button>
        <san-toggle-button value="right">Right</san-toggle-button>
      </san-toggle-button-group>
    `);
    await flushGroup(unlabelled);

    expect(unlabelled.selection).toBe("single");
    expect(unlabelled.mandatory).toBe(false);
    expect(unlabelled.orientation).toBe("horizontal");
    expect(unlabelled.variant).toBe("outlined");
    expect(unlabelled.intent).toBe("accent");
    expect(unlabelled.size).toBe("md");
    expect(unlabelled.pill).toBe(false);
    expect(unlabelled.separated).toBe(false);
    expect(unlabelled.disabled).toBe(false);
    expect(unlabelled.value).toBe("");
    expect(unlabelled.values).toEqual([]);
    expect(warnSpy).toHaveBeenCalledOnce();
    expect(warnSpy.mock.calls[0]?.[0]).toContain("san-toggle-button-group");

    // Re-rendering does not duplicate the warning
    unlabelled.size = "sm";
    await flushGroup(unlabelled);
    expect(warnSpy).toHaveBeenCalledOnce();
    warnSpy.mockClear();

    // Removing label or setting undefined must not throw
    unlabelled.label = "Text alignment";
    await flushGroup(unlabelled);
    await expectAccessible(unlabelled);

    unlabelled.removeAttribute("label");
    await flushGroup(unlabelled);
    (unlabelled as unknown as { label: string | undefined }).label = undefined;
    await flushGroup(unlabelled);

    // Host aria-labelledby satisfies accessible name without warning
    const main = document.createElement("main");
    main.innerHTML = `
      <h2 id="fmt-heading">Formatting</h2>
      <san-toggle-button-group aria-labelledby="fmt-heading">
        <san-toggle-button value="bold">Bold</san-toggle-button>
      </san-toggle-button-group>
    `;
    document.body.append(main);
    const labelledBy = main.querySelector("san-toggle-button-group") as SanToggleButtonGroup;
    await flushGroup(labelledBy);
    expect(warnSpy).not.toHaveBeenCalled();
    await expectAccessible(main);
  });

  it("coordinates single selection, emits one bubbling composed change on group, and enforces mandatory", async () => {
    const group = renderGroup(`
      <san-toggle-button-group label="Text alignment" value="center">
        <san-toggle-button value="left">Left</san-toggle-button>
        <san-toggle-button value="center">Center</san-toggle-button>
        <san-toggle-button value="right">Right</san-toggle-button>
      </san-toggle-button-group>
    `);
    await flushGroup(group);

    const [left, center, right] = getButtonTriple(group);
    expect(left.pressed).toBe(false);
    expect(center.pressed).toBe(true);
    expect(right.pressed).toBe(false);
    expect(group.value).toBe("center");
    expect(group.values).toEqual(["center"]);

    const groupChanges: Array<{ target: EventTarget | null; value: string; values: string[] }> = [];
    const docChanges: Array<EventTarget | null> = [];
    group.addEventListener("change", (event) => {
      groupChanges.push({
        target: event.target,
        value: group.value,
        values: [...group.values],
      });
      expect(event.bubbles).toBe(true);
      expect(event.composed).toBe(true);
    });
    document.body.addEventListener("change", (event) => {
      docChanges.push(event.target);
    });

    await userEvent.click(right);
    await flushGroup(group);

    expect(left.pressed).toBe(false);
    expect(center.pressed).toBe(false);
    expect(right.pressed).toBe(true);
    expect(group.value).toBe("right");
    expect(group.values).toEqual(["right"]);
    expect(groupChanges).toEqual([{ target: group, value: "right", values: ["right"] }]);
    expect(docChanges).toEqual([group]);

    // Default mandatory=false allows deselecting the active button
    await userEvent.click(right);
    await flushGroup(group);
    expect(right.pressed).toBe(false);
    expect(group.value).toBe("");
    expect(group.values).toEqual([]);
    expect(groupChanges).toHaveLength(2);

    // Enabling mandatory prevents user click from deselecting the sole active button
    group.mandatory = true;
    group.value = "left";
    await flushGroup(group);
    // Programmatic value change must NOT emit change
    expect(groupChanges).toHaveLength(2);
    expect(left.pressed).toBe(true);

    const childChangeSpy = vi.fn();
    left.addEventListener("change", childChangeSpy);

    await userEvent.click(left);
    await flushGroup(group);
    expect(left.pressed).toBe(true);
    expect(group.value).toBe("left");
    expect(group.values).toEqual(["left"]);
    expect(childChangeSpy).not.toHaveBeenCalled();
    expect(groupChanges).toHaveLength(2);

    // Switching to another button still works under mandatory
    await userEvent.click(center);
    await flushGroup(group);
    expect(left.pressed).toBe(false);
    expect(center.pressed).toBe(true);
    expect(group.value).toBe("center");
    expect(groupChanges).toHaveLength(3);

    // Programmatic reset clears selection without emitting change
    group.value = "";
    await flushGroup(group);
    expect(center.pressed).toBe(false);
    expect(group.values).toEqual([]);
    expect(groupChanges).toHaveLength(3);

    // Controlled override inside a change listener wins synchronously on the next update
    const overrideListener = () => {
      group.value = "left";
    };
    group.addEventListener("change", overrideListener, { once: true });
    await userEvent.click(right);
    await flushGroup(group);
    expect(left.pressed).toBe(true);
    expect(right.pressed).toBe(false);
    expect(group.value).toBe("left");
    expect(group.values).toEqual(["left"]);
  });

  it("supports multiple selection, initial child pressed state, mandatory, and switching to single", async () => {
    const group = renderGroup(`
      <san-toggle-button-group label="Text styles" selection="multiple">
        <san-toggle-button value="bold" pressed>Bold</san-toggle-button>
        <san-toggle-button value="italic">Italic</san-toggle-button>
        <san-toggle-button value="underline">Underline</san-toggle-button>
      </san-toggle-button-group>
    `);
    await flushGroup(group);

    const [bold, italic, underline] = getButtonTriple(group);
    expect(bold.pressed).toBe(true);
    expect(group.values).toEqual(["bold"]);
    expect(group.value).toBe("bold");

    const changeSpy = vi.fn();
    group.addEventListener("change", changeSpy);

    await userEvent.click(underline);
    await flushGroup(group);
    expect(group.values).toEqual(["bold", "underline"]);
    expect(changeSpy).toHaveBeenCalledTimes(1);

    // mandatory in multiple mode allows deselecting while >= 2 pressed, blocks last one
    group.mandatory = true;
    await flushGroup(group);

    await userEvent.click(bold);
    await flushGroup(group);
    expect(bold.pressed).toBe(false);
    expect(underline.pressed).toBe(true);
    expect(group.values).toEqual(["underline"]);
    expect(changeSpy).toHaveBeenCalledTimes(2);

    await userEvent.click(underline);
    await flushGroup(group);
    expect(underline.pressed).toBe(true);
    expect(group.values).toEqual(["underline"]);
    expect(changeSpy).toHaveBeenCalledTimes(2);

    // Programmatic values assignment updates pressed state without emitting change
    group.values = ["bold", "italic"];
    await flushGroup(group);
    expect(bold.pressed).toBe(true);
    expect(italic.pressed).toBe(true);
    expect(underline.pressed).toBe(false);
    expect(group.values).toEqual(["bold", "italic"]);
    expect(changeSpy).toHaveBeenCalledTimes(2);

    // Switching from multiple to single collapses to the first pressed button
    group.selection = "single";
    await flushGroup(group);
    expect(bold.pressed).toBe(true);
    expect(italic.pressed).toBe(false);
    expect(group.value).toBe("bold");
    expect(group.values).toEqual(["bold"]);
  });

  it("propagates variant, intent, size, pill, and disabled while preserving individually disabled children", async () => {
    const group = renderGroup(`
      <san-toggle-button-group label="Formatting" variant="soft" intent="success" size="sm">
        <san-toggle-button value="a">Alpha</san-toggle-button>
        <san-toggle-button value="b" disabled>Beta</san-toggle-button>
        <san-toggle-button value="c">Gamma</san-toggle-button>
      </san-toggle-button-group>
    `);
    await flushGroup(group);

    const [a, b, c] = getButtonTriple(group);
    for (const btn of [a, b, c]) {
      expect(btn.variant).toBe("soft");
      expect(btn.intent).toBe("success");
      expect(btn.size).toBe("sm");
    }
    expect(a.disabled).toBe(false);
    expect(b.disabled).toBe(true);
    expect(c.disabled).toBe(false);

    // Disabling group disables all buttons; re-enabling preserves b's individual disabled state
    group.disabled = true;
    await flushGroup(group);
    expect(a.disabled).toBe(true);
    expect(b.disabled).toBe(true);
    expect(c.disabled).toBe(true);

    group.disabled = false;
    await flushGroup(group);
    expect(a.disabled).toBe(false);
    expect(b.disabled).toBe(true);
    expect(c.disabled).toBe(false);

    // Dynamically appended button inherits current group appearance
    const d = document.createElement("san-toggle-button") as SanToggleButton;
    d.value = "d";
    d.textContent = "Delta";
    group.append(d);
    await flushGroup(group);
    expect(d.variant).toBe("soft");
    expect(d.intent).toBe("success");
    expect(d.size).toBe("sm");
  });

  it("renders attached outer-only corners in LTR, RTL, vertical, single-child, pill, and separated layouts", async () => {
    const group = renderGroup(`
      <san-toggle-button-group label="Alignment">
        <san-toggle-button value="left">Left</san-toggle-button>
        <san-toggle-button value="center">Center</san-toggle-button>
        <san-toggle-button value="right">Right</san-toggle-button>
      </san-toggle-button-group>
    `);
    await flushGroup(group);

    const [left, center, right] = getButtonTriple(group);
    const leftStyle = getComputedStyle(getControl(left));
    const centerStyle = getComputedStyle(getControl(center));
    const rightStyle = getComputedStyle(getControl(right));

    // LTR horizontal attached: outer corners rounded, inner seams 0px
    expect(Number.parseFloat(leftStyle.borderTopLeftRadius)).toBeGreaterThan(0);
    expect(Number.parseFloat(leftStyle.borderBottomLeftRadius)).toBeGreaterThan(0);
    expect(Number.parseFloat(leftStyle.borderTopRightRadius)).toBe(0);
    expect(Number.parseFloat(leftStyle.borderBottomRightRadius)).toBe(0);

    expect(Number.parseFloat(centerStyle.borderTopLeftRadius)).toBe(0);
    expect(Number.parseFloat(centerStyle.borderTopRightRadius)).toBe(0);
    expect(Number.parseFloat(centerStyle.borderBottomLeftRadius)).toBe(0);
    expect(Number.parseFloat(centerStyle.borderBottomRightRadius)).toBe(0);

    expect(Number.parseFloat(rightStyle.borderTopLeftRadius)).toBe(0);
    expect(Number.parseFloat(rightStyle.borderBottomLeftRadius)).toBe(0);
    expect(Number.parseFloat(rightStyle.borderTopRightRadius)).toBeGreaterThan(0);
    expect(Number.parseFloat(rightStyle.borderBottomRightRadius)).toBeGreaterThan(0);

    // Adjacent buttons collapse shared hairline border
    const leftRect = left.getBoundingClientRect();
    const centerRect = center.getBoundingClientRect();
    expect(centerRect.left).toBeLessThanOrEqual(leftRect.right);

    // Pill in attached mode rounds outer ends to full pill while keeping inner seams 0px
    group.pill = true;
    await flushGroup(group);
    expect(
      Number.parseFloat(getComputedStyle(getControl(left)).borderTopLeftRadius),
    ).toBeGreaterThanOrEqual(999);
    expect(Number.parseFloat(getComputedStyle(getControl(left)).borderTopRightRadius)).toBe(0);
    expect(
      Number.parseFloat(getComputedStyle(getControl(right)).borderTopRightRadius),
    ).toBeGreaterThanOrEqual(999);

    // RTL horizontal attached flips rounded corners to the logical start (physical right)
    group.pill = false;
    document.documentElement.setAttribute("dir", "rtl");
    await flushGroup(group);
    const rtlFirstStyle = getComputedStyle(getControl(left));
    const rtlLastStyle = getComputedStyle(getControl(right));
    expect(Number.parseFloat(rtlFirstStyle.borderTopRightRadius)).toBeGreaterThan(0);
    expect(Number.parseFloat(rtlFirstStyle.borderTopLeftRadius)).toBe(0);
    expect(Number.parseFloat(rtlLastStyle.borderTopLeftRadius)).toBeGreaterThan(0);
    expect(Number.parseFloat(rtlLastStyle.borderTopRightRadius)).toBe(0);
    document.documentElement.removeAttribute("dir");

    // Vertical attached: top/bottom outer corners rounded and vertical stacking
    group.orientation = "vertical";
    await flushGroup(group);
    const vTopStyle = getComputedStyle(getControl(left));
    const vBottomStyle = getComputedStyle(getControl(right));
    expect(Number.parseFloat(vTopStyle.borderTopLeftRadius)).toBeGreaterThan(0);
    expect(Number.parseFloat(vTopStyle.borderTopRightRadius)).toBeGreaterThan(0);
    expect(Number.parseFloat(vTopStyle.borderBottomLeftRadius)).toBe(0);
    expect(Number.parseFloat(vBottomStyle.borderBottomLeftRadius)).toBeGreaterThan(0);
    expect(Number.parseFloat(vBottomStyle.borderBottomRightRadius)).toBeGreaterThan(0);
    expect(Number.parseFloat(vBottomStyle.borderTopLeftRadius)).toBe(0);
    expect(center.getBoundingClientRect().top).toBeGreaterThan(left.getBoundingClientRect().top);

    // Separated mode restores full corners on every button and adds gap
    group.orientation = "horizontal";
    group.separated = true;
    await flushGroup(group);
    expect(center.getBoundingClientRect().left).toBeGreaterThan(left.getBoundingClientRect().right);
    expect(
      Number.parseFloat(getComputedStyle(getControl(center)).borderTopLeftRadius),
    ).toBeGreaterThan(0);

    // Single-child attached group keeps all 4 corners rounded
    const solo = renderGroup(`
      <san-toggle-button-group label="Solo">
        <san-toggle-button value="only">Only</san-toggle-button>
      </san-toggle-button-group>
    `);
    await flushGroup(solo);
    const [only] = getButtons(solo);
    expect(only).toBeDefined();
    if (!only) {
      throw new Error("Expected solo button");
    }
    const soloStyle = getComputedStyle(getControl(only));
    expect(Number.parseFloat(soloStyle.borderTopLeftRadius)).toBeGreaterThan(0);
    expect(Number.parseFloat(soloStyle.borderTopRightRadius)).toBeGreaterThan(0);
    expect(Number.parseFloat(soloStyle.borderBottomLeftRadius)).toBeGreaterThan(0);
    expect(Number.parseFloat(soloStyle.borderBottomRightRadius)).toBeGreaterThan(0);
  });

  it("supports toolbar keyboard navigation (single tab stop, arrows, Home/End, RTL, vertical, skipping disabled)", async () => {
    const before = document.createElement("button");
    before.type = "button";
    before.textContent = "Before";
    const after = document.createElement("button");
    after.type = "button";
    after.textContent = "After";

    document.body.append(before);
    const group = renderGroup(`
      <san-toggle-button-group label="Alignment">
        <san-toggle-button value="left">Left</san-toggle-button>
        <san-toggle-button value="disabled-mid" disabled>Mid</san-toggle-button>
        <san-toggle-button value="center">Center</san-toggle-button>
        <san-toggle-button value="right">Right</san-toggle-button>
      </san-toggle-button-group>
    `);
    document.body.append(after);
    await flushGroup(group);

    const [left, , center, right] = getButtonQuad(group);

    before.focus();
    await userEvent.tab();
    expect(document.activeElement).toBe(left);

    // ArrowRight skips disabled button and moves to center
    await userEvent.keyboard("{ArrowRight}");
    expect(document.activeElement).toBe(center);

    // ArrowDown does nothing in horizontal orientation
    await userEvent.keyboard("{ArrowDown}");
    expect(document.activeElement).toBe(center);

    // End jumps to last enabled button; ArrowRight wraps to first
    await userEvent.keyboard("{End}");
    expect(document.activeElement).toBe(right);
    await userEvent.keyboard("{ArrowRight}");
    expect(document.activeElement).toBe(left);

    // ArrowLeft wraps backward to last enabled button; Home jumps to first
    await userEvent.keyboard("{ArrowLeft}");
    expect(document.activeElement).toBe(right);
    await userEvent.keyboard("{Home}");
    expect(document.activeElement).toBe(left);

    // Space activates focused toggle button
    await userEvent.keyboard("{Space}");
    await flushGroup(group);
    expect(left.pressed).toBe(true);
    expect(group.value).toBe("left");

    // Tab exits the toolbar in a single stop directly to the next focusable element
    await userEvent.tab();
    expect(document.activeElement).toBe(after);

    // Shift+Tab returns to the last focused item in the toolbar
    await userEvent.tab({ shift: true });
    expect(document.activeElement).toBe(left);

    // RTL reverses horizontal arrows
    document.documentElement.setAttribute("dir", "rtl");
    await flushGroup(group);
    await userEvent.keyboard("{ArrowLeft}");
    expect(document.activeElement).toBe(center);
    await userEvent.keyboard("{ArrowRight}");
    expect(document.activeElement).toBe(left);
    document.documentElement.removeAttribute("dir");

    // Vertical orientation uses ArrowDown/ArrowUp and ignores ArrowLeft/ArrowRight
    group.orientation = "vertical";
    await flushGroup(group);
    await userEvent.keyboard("{ArrowRight}");
    expect(document.activeElement).toBe(left);
    await userEvent.keyboard("{ArrowDown}");
    expect(document.activeElement).toBe(center);
    await userEvent.keyboard("{ArrowUp}");
    expect(document.activeElement).toBe(left);
  });

  it("passes axe-core across lauds and compline flavors, variants, intents, and icon-only toolbars", async () => {
    for (const flavor of ["lauds", "compline"] as const) {
      document.documentElement.setAttribute("data-san-flavor", flavor);

      const textGroup = renderGroup(`
        <san-toggle-button-group label="Text alignment" value="left" variant="outlined">
          <san-toggle-button value="left">Left</san-toggle-button>
          <san-toggle-button value="center">Center</san-toggle-button>
          <san-toggle-button value="right">Right</san-toggle-button>
        </san-toggle-button-group>
      `);

      const iconToolbar = renderGroup(`
        <san-toggle-button-group label="Icon alignment" variant="soft" intent="info" separated>
          <san-toggle-button value="left" label="Align left" pressed>${ICON_LEFT}</san-toggle-button>
          <san-toggle-button value="center" label="Align center">${ICON_CENTER}</san-toggle-button>
          <san-toggle-button value="right" label="Align right">${ICON_RIGHT}</san-toggle-button>
        </san-toggle-button-group>
      `);

      await Promise.all([flushGroup(textGroup), flushGroup(iconToolbar)]);
      await expectAccessible(textGroup);
      await expectAccessible(iconToolbar);

      textGroup.remove();
      iconToolbar.remove();
    }
  });
});
