import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";

const meta: Meta = {
  title: "Foundations/Tokens Contract",
};

export default meta;

export const SurfacesAndStatuses: StoryObj = {
  render: () => html`
    <section
      style="
        display: grid;
        gap: var(--san-space-4);
        max-width: var(--san-size-measure);
      "
    >
      <header style="display: grid; gap: var(--san-space-1);">
        <h1 style="margin: 0; font: var(--san-type-headline-sm); letter-spacing: var(--san-type-headline-sm-tracking);">
          Sanctuary Tokens 0.4.0 Workbench
        </h1>
        <p style="margin: 0; color: var(--san-text-muted); font: var(--san-type-body-sm);">
          Switch Flavor, Accent, and Glazing in the toolbar to verify inherited CSS custom properties.
        </p>
      </header>

      <div style="display: flex; flex-wrap: wrap; gap: var(--san-space-2-5);">
        <button
          type="button"
          style="
            font: var(--san-type-label-lg);
            letter-spacing: var(--san-type-label-lg-tracking);
            background: var(--san-glaze-bg);
            color: var(--san-glaze-fg);
            border: var(--san-border-width-hairline) solid var(--san-glaze-border);
            border-radius: var(--san-radius-md);
            padding: var(--san-space-2) var(--san-space-4);
            cursor: pointer;
          "
        >
          Accent Glaze
        </button>

        ${(["danger", "warning", "success", "info"] as const).map(
          (status) => html`
            <button
              type="button"
              style="
                font: var(--san-type-label-lg);
                letter-spacing: var(--san-type-label-lg-tracking);
                background: var(--san-${status}-glaze-bg);
                color: var(--san-${status}-glaze-fg);
                border: var(--san-border-width-hairline) solid var(--san-${status}-glaze-border);
                border-radius: var(--san-radius-md);
                padding: var(--san-space-2) var(--san-space-4);
                cursor: pointer;
              "
            >
              ${status}
            </button>
          `,
        )}
      </div>
    </section>
  `,
};
