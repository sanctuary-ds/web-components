import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html, nothing } from "lit";
import "../badge/register.js";
import "../button/register.js";
import "../chip/register.js";
import "../icon-button/register.js";
import "./register.js";
import type { CardLayout, CardPadding, CardVariant } from "./index.js";

interface CardStoryArgs {
  variant: CardVariant;
  padding: CardPadding;
  layout: CardLayout;
  interactive: boolean;
  selected: boolean;
}

const meta: Meta<CardStoryArgs> = {
  title: "Components/Card",
  component: "san-card",
  argTypes: {
    variant: {
      control: "select",
      options: ["outlined", "elevated", "filled"],
      description:
        "Visual surface tier: `outlined` (`--san-surface-raised-1` + hairline border), `elevated` (`--san-surface-raised-2` + shadow), and `filled` (`--san-surface-sunken`).",
      table: { category: "Appearance" },
    },
    padding: {
      control: "select",
      options: ["none", "sm", "md", "lg"],
      description:
        "Content region padding preset (`0`, `--san-space-3`, `--san-space-5`, or `--san-space-6`); full-bleed `media` stays edge-to-edge.",
      table: { category: "Appearance" },
    },
    layout: {
      control: "select",
      options: ["vertical", "horizontal", "auto"],
      description:
        "Arrangement of `media` and content regions (`auto` switches to 2 columns at `@container (inline-size >= 30rem)` when media is slotted).",
      table: { category: "Layout" },
    },
    interactive: {
      control: "boolean",
      description:
        "Enables hover border/elevation emphasis and a `:focus-within` outline when nested controls receive focus.",
      table: { category: "Behavior" },
    },
    selected: {
      control: "boolean",
      description:
        "Applies Sanctuary's `:state(selected)` accent border and non-layout-shifting highlight ring.",
      table: { category: "State" },
    },
  },
  args: {
    variant: "outlined",
    padding: "md",
    layout: "vertical",
    interactive: false,
    selected: false,
  },
};

export default meta;

const EYEBROW_STYLE =
  "margin: 0; font: var(--san-type-inscription); letter-spacing: var(--san-type-inscription-tracking); color: var(--san-text-subtle); text-transform: uppercase;";
const TITLE_STYLE = "margin: 0; font: var(--san-type-title-md); color: var(--san-text);";
const BODY_STYLE = "margin: 0; font: var(--san-type-body-sm); color: var(--san-text-muted);";
const META_STYLE = "font: var(--san-type-label-md); color: var(--san-text-subtle);";
const FOOTER_ROW_STYLE =
  "display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: var(--san-space-2);";

function iconBookmark() {
  return html`
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      stroke-width="1.75"
      aria-hidden="true"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M5.5 3.5h9a1 1 0 0 1 1 1v12l-5.5-3.25L4.5 16.5v-12a1 1 0 0 1 1-1z"
      />
    </svg>
  `;
}

function iconArrowRight(slot?: "start" | "end") {
  return html`
    <svg
      slot=${slot ?? nothing}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      stroke-width="1.75"
      aria-hidden="true"
    >
      <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 10h11m-4.5-4.5L15.5 10 11 14.5" />
    </svg>
  `;
}

function stainedGlassLancetSvg(label?: string) {
  return html`
    <svg
      slot="media"
      viewBox="0 0 360 200"
      preserveAspectRatio="xMidYMid slice"
      role=${label ? "img" : nothing}
      aria-label=${label || nothing}
      aria-hidden=${label ? nothing : "true"}
      style="background: var(--san-surface-sunken);"
    >
      <rect width="360" height="200" fill="var(--san-surface-sunken)" />
      <path
        d="M36 200V92C36 52 72 22 108 16C144 22 180 52 180 92V200Z"
        fill="var(--san-accent-pane)"
        stroke="var(--san-lead)"
        stroke-width="3"
      />
      <path
        d="M180 200V92C180 52 216 22 252 16C288 22 324 52 324 92V200Z"
        fill="var(--san-info-pane)"
        stroke="var(--san-lead)"
        stroke-width="3"
      />
      <path
        d="M108 16C144 22 180 52 180 92C180 52 216 22 252 16C228 42 206 72 180 110C154 72 132 42 108 16Z"
        fill="var(--san-warning-pane)"
        stroke="var(--san-lead)"
        stroke-width="3"
      />
      <circle
        cx="180"
        cy="62"
        r="24"
        fill="var(--san-accent)"
        fill-opacity="0.28"
        stroke="var(--san-lead)"
        stroke-width="3"
      />
      <line x1="108" y1="16" x2="108" y2="200" stroke="var(--san-lead)" stroke-width="2.5" />
      <line x1="252" y1="16" x2="252" y2="200" stroke="var(--san-lead)" stroke-width="2.5" />
      <line x1="36" y1="120" x2="324" y2="120" stroke="var(--san-lead)" stroke-width="2.5" />
      <line x1="36" y1="162" x2="324" y2="162" stroke="var(--san-lead)" stroke-width="2.5" />
    </svg>
  `;
}

function stainedGlassRoseSvg(label?: string) {
  return html`
    <svg
      slot="media"
      viewBox="0 0 360 200"
      preserveAspectRatio="xMidYMid slice"
      role=${label ? "img" : nothing}
      aria-label=${label || nothing}
      aria-hidden=${label ? nothing : "true"}
      style="background: var(--san-surface-sunken);"
    >
      <rect width="360" height="200" fill="var(--san-surface-sunken)" />
      <rect
        x="24"
        y="20"
        width="312"
        height="160"
        rx="12"
        fill="var(--san-surface-raised-1)"
        stroke="var(--san-lead-soft)"
        stroke-width="2"
      />
      <circle
        cx="180"
        cy="100"
        r="66"
        fill="var(--san-accent-pane)"
        stroke="var(--san-lead)"
        stroke-width="3"
      />
      <circle
        cx="180"
        cy="100"
        r="40"
        fill="var(--san-info-pane)"
        stroke="var(--san-lead)"
        stroke-width="2.5"
      />
      <circle
        cx="180"
        cy="100"
        r="16"
        fill="var(--san-success-pane)"
        stroke="var(--san-lead)"
        stroke-width="2.5"
      />
      <line x1="114" y1="100" x2="246" y2="100" stroke="var(--san-lead)" stroke-width="2" />
      <line x1="180" y1="34" x2="180" y2="166" stroke="var(--san-lead)" stroke-width="2" />
      <line x1="133" y1="53" x2="227" y2="147" stroke="var(--san-lead)" stroke-width="2" />
      <line x1="227" y1="53" x2="133" y2="147" stroke="var(--san-lead)" stroke-width="2" />
    </svg>
  `;
}

function stainedGlassClerestorySvg(label?: string) {
  return html`
    <svg
      slot="media"
      viewBox="0 0 360 200"
      preserveAspectRatio="xMidYMid slice"
      role=${label ? "img" : nothing}
      aria-label=${label || nothing}
      aria-hidden=${label ? nothing : "true"}
      style="background: var(--san-surface-sunken);"
    >
      <rect width="360" height="200" fill="var(--san-surface-sunken)" />
      <path
        d="M30 200V68C30 42 54 24 80 24C106 24 130 42 130 68V200Z"
        fill="var(--san-info-pane)"
        stroke="var(--san-lead)"
        stroke-width="3"
      />
      <path
        d="M130 200V68C130 42 154 24 180 24C206 24 230 42 230 68V200Z"
        fill="var(--san-accent-pane)"
        stroke="var(--san-lead)"
        stroke-width="3"
      />
      <path
        d="M230 200V68C230 42 254 24 280 24C306 24 330 42 330 68V200Z"
        fill="var(--san-success-pane)"
        stroke="var(--san-lead)"
        stroke-width="3"
      />
      <line x1="30" y1="108" x2="330" y2="108" stroke="var(--san-lead)" stroke-width="2.5" />
      <line x1="30" y1="154" x2="330" y2="154" stroke="var(--san-lead)" stroke-width="2.5" />
    </svg>
  `;
}

function handleToggleSelected(event: Event): void {
  const target = event.currentTarget;
  if (!(target instanceof Element)) {
    return;
  }
  const card = target.closest("san-card");
  if (card) {
    card.selected = !card.selected;
  }
}

export const Overview: StoryObj<CardStoryArgs> = {
  render: (args) => html`
    <div style="max-inline-size: 38rem;">
      <san-card
        variant=${args.variant}
        padding=${args.padding}
        layout=${args.layout}
        ?interactive=${args.interactive}
        ?selected=${args.selected}
      >
        ${stainedGlassLancetSvg()}
        <div slot="header" style="display: grid; gap: var(--san-space-1);">
          <p style=${EYEBROW_STYLE}>Surface Container</p>
          <h3 style=${TITLE_STYLE}>Sanctuary Nave Architecture</h3>
        </div>
        <p style=${BODY_STYLE}>
          Structured surface container with auto-collapsing regions, container-query responsive
          layout, and semantic article landmarks that never trap nested controls.
        </p>
        <div slot="footer" style=${FOOTER_ROW_STYLE}>
          <span style=${META_STYLE}>Updated 2h ago</span>
          <san-button variant="soft" size="sm">
            Inspect specs
            ${iconArrowRight("end")}
          </san-button>
        </div>
      </san-card>
    </div>
  `,
};

export const Variants: StoryObj = {
  render: () => html`
    <div
      style="display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 16rem), 1fr)); gap: var(--san-space-5);"
    >
      <san-card variant="outlined">
        <div slot="header" style="display: grid; gap: var(--san-space-1);">
          <p style=${EYEBROW_STYLE}>Outlined</p>
          <h3 style=${TITLE_STYLE}>Raised 1 + Hairline</h3>
        </div>
        <p style=${BODY_STYLE}>
          Default architectural container pairing <code>--san-surface-raised-1</code> with a crisp
          <code>--san-lead</code> hairline border.
        </p>
        <div slot="footer" style=${FOOTER_ROW_STYLE}>
          <span style=${META_STYLE}>--san-elevation-0</span>
          <san-badge variant="outlined" size="sm">Default</san-badge>
        </div>
      </san-card>

      <san-card variant="elevated">
        <div slot="header" style="display: grid; gap: var(--san-space-1);">
          <p style=${EYEBROW_STYLE}>Elevated</p>
          <h3 style=${TITLE_STYLE}>Raised 2 + Umbra</h3>
        </div>
        <p style=${BODY_STYLE}>
          Promotes focal surfaces using <code>--san-surface-raised-2</code>, soft lead framing, and
          <code>--san-elevation-2</code> depth.
        </p>
        <div slot="footer" style=${FOOTER_ROW_STYLE}>
          <span style=${META_STYLE}>--san-elevation-2</span>
          <san-badge variant="soft" intent="accent" size="sm">Featured</san-badge>
        </div>
      </san-card>

      <san-card variant="filled">
        <div slot="header" style="display: grid; gap: var(--san-space-1);">
          <p style=${EYEBROW_STYLE}>Filled</p>
          <h3 style=${TITLE_STYLE}>Sunken Stone</h3>
        </div>
        <p style=${BODY_STYLE}>
          Recessed <code>--san-surface-sunken</code> surface for secondary panels, quiet groupings,
          and inset summaries.
        </p>
        <div slot="footer" style=${FOOTER_ROW_STYLE}>
          <span style=${META_STYLE}>Transparent border</span>
          <san-badge variant="soft" size="sm">Quiet</san-badge>
        </div>
      </san-card>
    </div>
  `,
};

export const Padding: StoryObj = {
  render: () => html`
    <div
      style="display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 15rem), 1fr)); gap: var(--san-space-4); align-items: start;"
    >
      <san-card padding="none">
        <div
          slot="header"
          style="padding: var(--san-space-3); background: var(--san-surface-sunken);"
        >
          <h3 style=${TITLE_STYLE}>padding="none"</h3>
        </div>
        <div style="padding: var(--san-space-3);">
          <p style=${BODY_STYLE}>Zero internal content padding for custom flush layouts.</p>
        </div>
        <div slot="footer" style="padding: var(--san-space-3);">
          <span style=${META_STYLE}>0</span>
        </div>
      </san-card>

      <san-card padding="sm">
        <h3 slot="header" style=${TITLE_STYLE}>padding="sm"</h3>
        <p style=${BODY_STYLE}>Compact density for dense dashboards and sidebars.</p>
        <div slot="footer">
          <span style=${META_STYLE}>--san-space-3</span>
        </div>
      </san-card>

      <san-card padding="md">
        <h3 slot="header" style=${TITLE_STYLE}>padding="md"</h3>
        <p style=${BODY_STYLE}>Balanced default rhythm for general content cards.</p>
        <div slot="footer">
          <span style=${META_STYLE}>--san-space-5</span>
        </div>
      </san-card>

      <san-card padding="lg">
        <h3 slot="header" style=${TITLE_STYLE}>padding="lg"</h3>
        <p style=${BODY_STYLE}>Generous breathing room for editorial and hero panels.</p>
        <div slot="footer">
          <span style=${META_STYLE}>--san-space-6</span>
        </div>
      </san-card>
    </div>
  `,
};

export const WithMedia: StoryObj = {
  render: () => html`
    <div
      style="display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 18rem), 1fr)); gap: var(--san-space-5);"
    >
      <san-card variant="outlined">
        ${stainedGlassLancetSvg("Geometric lancet arch stained glass diagram")}
        <div slot="header" style="display: grid; gap: var(--san-space-1);">
          <p style=${EYEBROW_STYLE}>Full-bleed Media</p>
          <h3 style=${TITLE_STYLE}>Lancet Arcade</h3>
        </div>
        <p style=${BODY_STYLE}>
          Slotted media renders edge-to-edge above the padded header, body, and footer regions.
        </p>
      </san-card>

      <san-card variant="elevated">
        ${stainedGlassRoseSvg("Geometric rose window stained glass diagram")}
        <div slot="header" style="display: grid; gap: var(--san-space-1);">
          <p style=${EYEBROW_STYLE}>Oculus Study</p>
          <h3 style=${TITLE_STYLE}>Rose Tracery</h3>
        </div>
        <p style=${BODY_STYLE}>
          Header and footer regions collapse cleanly when omitted, leaving only active regions.
        </p>
        <div slot="footer" style=${FOOTER_ROW_STYLE}>
          <span style=${META_STYLE}>Part: media</span>
          <san-button variant="ghost" size="sm">Open plate</san-button>
        </div>
      </san-card>
    </div>
  `,
};

export const HorizontalAndAutoLayout: StoryObj = {
  render: () => html`
    <div style="display: grid; gap: var(--san-space-6); max-inline-size: 46rem;">
      <div style="display: grid; gap: var(--san-space-2);">
        <p style=${META_STYLE}>layout="horizontal" with slotted media (2-column grid)</p>
        <san-card layout="horizontal" variant="outlined">
          ${stainedGlassClerestorySvg("Three-bay clerestory stained glass illustration")}
          <div slot="header" style="display: grid; gap: var(--san-space-1);">
            <p style=${EYEBROW_STYLE}>Horizontal</p>
            <h3 style=${TITLE_STYLE}>Clerestory Glazing</h3>
          </div>
          <p style=${BODY_STYLE}>
            Places media in the inline-start column (<code>--san-card-media-size</code>) while
            header, body, and footer stack in the inline-end column.
          </p>
          <div slot="footer" style=${FOOTER_ROW_STYLE}>
            <span style=${META_STYLE}>:state(has-media) active</span>
            <san-button variant="soft" size="sm">Inspect</san-button>
          </div>
        </san-card>
      </div>

      <div style="display: grid; gap: var(--san-space-2);">
        <p style=${META_STYLE}>
          layout="horizontal" without media (auto-collapses to a full-width single column)
        </p>
        <san-card layout="horizontal" variant="filled">
          <div slot="header" style="display: grid; gap: var(--san-space-1);">
            <p style=${EYEBROW_STYLE}>No Media Slotted</p>
            <h3 style=${TITLE_STYLE}>No Empty Media Track Reserved</h3>
          </div>
          <p style=${BODY_STYLE}>
            Because <code>:state(has-media)</code> is inactive, content expands across the entire
            card width instead of leaving a blank track.
          </p>
        </san-card>
      </div>

      <div style="display: grid; gap: var(--san-space-3);">
        <p style=${META_STYLE}>
          layout="auto" container query adaptation (switches at inline-size &gt;= 30rem)
        </p>
        <div style="display: flex; flex-wrap: wrap; gap: var(--san-space-5); align-items: start;">
          <div style="inline-size: min(100%, 34rem); display: grid; gap: var(--san-space-2);">
            <span style=${META_STYLE}>Wide container (34rem)</span>
            <san-card layout="auto" variant="elevated">
              ${stainedGlassLancetSvg()}
              <h3 slot="header" style=${TITLE_STYLE}>Adapts Horizontally</h3>
              <p style=${BODY_STYLE}>
                Container inline-size meets the <code>30rem</code> threshold, arranging media beside
                the content stack.
              </p>
            </san-card>
          </div>

          <div style="inline-size: min(100%, 19rem); display: grid; gap: var(--san-space-2);">
            <span style=${META_STYLE}>Narrow container (19rem)</span>
            <san-card layout="auto" variant="elevated">
              ${stainedGlassLancetSvg()}
              <h3 slot="header" style=${TITLE_STYLE}>Stacks Vertically</h3>
              <p style=${BODY_STYLE}>
                Container inline-size is below <code>30rem</code>, stacking media cleanly on top.
              </p>
            </san-card>
          </div>
        </div>
      </div>
    </div>
  `,
};

export const InteractiveAndSelected: StoryObj = {
  render: () => html`
    <div
      style="display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 17rem), 1fr)); gap: var(--san-space-5);"
    >
      <san-card interactive variant="outlined">
        <div slot="header" style="display: grid; gap: var(--san-space-1);">
          <p style=${EYEBROW_STYLE}>Interactive</p>
          <h3 style=${TITLE_STYLE}>Hover &amp; Focus-Within</h3>
        </div>
        <p style=${BODY_STYLE}>
          Hover raises border contrast and elevation; focusing nested controls surfaces the
          Sanctuary focus ring on the card boundary.
        </p>
        <div slot="footer" style=${FOOTER_ROW_STYLE}>
          <span style=${META_STYLE}>Tab to focus</span>
          <san-button variant="outlined" size="sm" @click=${handleToggleSelected}>
            Toggle selection
          </san-button>
        </div>
      </san-card>

      <san-card selected variant="outlined">
        <div slot="header" style="display: grid; gap: var(--san-space-1);">
          <p style=${EYEBROW_STYLE}>Selected</p>
          <h3 style=${TITLE_STYLE}>Zero Layout Shift</h3>
        </div>
        <p style=${BODY_STYLE}>
          Uses <code>border-color: var(--san-accent)</code> and an inset-neutral
          <code>box-shadow</code> ring so siblings never jump.
        </p>
        <div slot="footer" style=${FOOTER_ROW_STYLE}>
          <san-badge variant="soft" intent="accent" size="sm">Selected</san-badge>
          <span style=${META_STYLE}>:state(selected)</span>
        </div>
      </san-card>

      <san-card interactive selected variant="elevated">
        <div slot="header" style="display: grid; gap: var(--san-space-1);">
          <p style=${EYEBROW_STYLE}>Interactive + Selected</p>
          <h3 style=${TITLE_STYLE}>Elevated Selection</h3>
        </div>
        <p style=${BODY_STYLE}>
          Combines interactive hover lift with persistent accent selection framing. Click the
          action below to toggle selection live.
        </p>
        <div slot="footer" style=${FOOTER_ROW_STYLE}>
          <span style=${META_STYLE}>Preserves box size</span>
          <san-button variant="soft" intent="accent" size="sm" @click=${handleToggleSelected}>
            Toggle selection
          </san-button>
        </div>
      </san-card>
    </div>
  `,
};

export const WithSanctuaryComponents: StoryObj = {
  render: () => html`
    <div style="max-inline-size: 28rem;">
      <san-card variant="elevated" interactive>
        ${stainedGlassRoseSvg("Rose window architecture plate")}
        <div
          slot="header"
          style="display: flex; align-items: flex-start; justify-content: space-between; gap: var(--san-space-3);"
        >
          <div style="display: grid; gap: var(--san-space-1);">
            <div style="display: flex; flex-wrap: wrap; align-items: center; gap: var(--san-space-2);">
              <span style=${EYEBROW_STYLE}>Phase 1 Release</span>
              <san-badge dot intent="success" size="sm">Operational</san-badge>
            </div>
            <h3 style=${TITLE_STYLE}>Design System Foundation</h3>
          </div>
          <san-icon-button variant="ghost" size="sm" label="Bookmark foundation card">
            ${iconBookmark()}
          </san-icon-button>
        </div>

        <div style="display: grid; gap: var(--san-space-3);">
          <p style=${BODY_STYLE}>
            Nested Sanctuary badges, filter chips, icon buttons, and buttons stay directly
            focusable and operable inside the semantic <code>&lt;article&gt;</code> landmark.
          </p>
          <div style="display: flex; flex-wrap: wrap; gap: var(--san-space-2);">
            <san-chip selectable selected size="sm" intent="accent">Tokens 0.4.0</san-chip>
            <san-chip selectable size="sm">Lit 3</san-chip>
            <san-chip selectable size="sm">WCAG AA</san-chip>
          </div>
        </div>

        <div slot="footer" style=${FOOTER_ROW_STYLE}>
          <san-button variant="outlined" size="sm">Changelog</san-button>
          <san-button variant="filled" intent="accent" size="sm">
            Open package
            ${iconArrowRight("end")}
          </san-button>
        </div>
      </san-card>
    </div>
  `,
};

export const ComposedGrid: StoryObj = {
  render: () => html`
    <div
      style="display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 19rem), 1fr)); gap: var(--san-space-5);"
    >
      <san-card variant="outlined" interactive>
        ${stainedGlassLancetSvg()}
        <div
          slot="header"
          style="display: flex; align-items: flex-start; justify-content: space-between; gap: var(--san-space-2);"
        >
          <div style="display: grid; gap: var(--san-space-1);">
            <san-badge variant="soft" intent="accent" size="sm">Tokens</san-badge>
            <h3 style=${TITLE_STYLE}>Lauds &amp; Compline</h3>
          </div>
          <san-icon-button variant="ghost" size="sm" label="Bookmark Lauds and Compline">
            ${iconBookmark()}
          </san-icon-button>
        </div>
        <div style="display: grid; gap: var(--san-space-3);">
          <p style=${BODY_STYLE}>
            Switch flavors and glazing from the Storybook toolbar to verify stone surfaces and
            hairline contrast in both light and dark schemes.
          </p>
          <div style="display: flex; flex-wrap: wrap; gap: var(--san-space-1-5);">
            <san-chip size="sm" variant="soft">Light</san-chip>
            <san-chip size="sm" variant="soft">Dark</san-chip>
          </div>
        </div>
        <div slot="footer" style=${FOOTER_ROW_STYLE}>
          <span style=${META_STYLE}>v0.4.0</span>
          <san-button variant="soft" size="sm">Inspect</san-button>
        </div>
      </san-card>

      <san-card variant="elevated" interactive selected>
        ${stainedGlassClerestorySvg()}
        <div
          slot="header"
          style="display: flex; align-items: flex-start; justify-content: space-between; gap: var(--san-space-2);"
        >
          <div style="display: grid; gap: var(--san-space-1);">
            <san-badge dot intent="info" size="sm">Selected</san-badge>
            <h3 style=${TITLE_STYLE}>Container Queries</h3>
          </div>
          <san-icon-button variant="ghost" size="sm" label="Bookmark Container Queries">
            ${iconBookmark()}
          </san-icon-button>
        </div>
        <div style="display: grid; gap: var(--san-space-3);">
          <p style=${BODY_STYLE}>
            <code>layout="auto"</code> responds to host inline width rather than viewport width,
            keeping grid cards cohesive across breakpoints.
          </p>
          <div style="display: flex; flex-wrap: wrap; gap: var(--san-space-1-5);">
            <san-chip size="sm" selectable selected intent="accent">Responsive</san-chip>
            <san-chip size="sm" variant="outlined">@container</san-chip>
          </div>
        </div>
        <div slot="footer" style=${FOOTER_ROW_STYLE}>
          <span style=${META_STYLE}>30rem threshold</span>
          <san-button variant="filled" intent="accent" size="sm">Selected</san-button>
        </div>
      </san-card>

      <san-card variant="filled">
        ${stainedGlassRoseSvg()}
        <div
          slot="header"
          style="display: flex; align-items: flex-start; justify-content: space-between; gap: var(--san-space-2);"
        >
          <div style="display: grid; gap: var(--san-space-1);">
            <san-badge dot intent="warning" size="sm">Draft</san-badge>
            <h3 style=${TITLE_STYLE}>Tier-5 Overrides</h3>
          </div>
          <san-icon-button variant="ghost" size="sm" label="Bookmark Tier-5 Overrides">
            ${iconBookmark()}
          </san-icon-button>
        </div>
        <div style="display: grid; gap: var(--san-space-3);">
          <p style=${BODY_STYLE}>
            Customize radius, padding, gap, border, and media track width via
            <code>--san-card-*</code> custom properties without breaking themes.
          </p>
          <div style="display: flex; flex-wrap: wrap; gap: var(--san-space-1-5);">
            <san-chip size="sm" variant="outlined">CSS Parts</san-chip>
            <san-chip size="sm" variant="outlined">Custom Props</san-chip>
          </div>
        </div>
        <div slot="footer" style=${FOOTER_ROW_STYLE}>
          <span style=${META_STYLE}>9 tokens</span>
          <san-button variant="ghost" size="sm">API table</san-button>
        </div>
      </san-card>
    </div>
  `,
};
