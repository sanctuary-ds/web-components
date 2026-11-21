import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html, nothing } from "lit";
import "./register.js";
import type { BadgeIntent, BadgeSize, BadgeVariant } from "./index.js";

interface BadgeStoryArgs {
  variant: BadgeVariant;
  intent: BadgeIntent;
  size: BadgeSize;
  pill: boolean;
  dot: boolean;
  label: string;
}

const meta: Meta<BadgeStoryArgs> = {
  title: "Components/Badge",
  component: "san-badge",
  argTypes: {
    variant: {
      control: "select",
      options: ["soft", "filled", "outlined"],
      description:
        "Visual emphasis: `soft` for tinted secondary indicators, `filled` for glazed high-emphasis indicators, and `outlined` for bordered indicators.",
      table: { category: "Appearance" },
    },
    intent: {
      control: "select",
      options: ["neutral", "accent", "danger", "warning", "success", "info"],
      description: "Semantic color intent applied to the badge surface, border, text, and dot.",
      table: { category: "Appearance" },
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description:
        "Size preset controlling minimum height, inline padding, typography, icon size, and dot size.",
      table: { category: "Appearance" },
    },
    pill: {
      control: "boolean",
      description: "Applies fully rounded pill corners (`--san-radius-full`).",
      table: { category: "Appearance" },
    },
    dot: {
      control: "boolean",
      description:
        "Renders a leading status indicator dot beside text, or a compact circular dot when all slots are empty.",
      table: { category: "Appearance" },
    },
    label: {
      control: "text",
      description:
        'Accessible label exposed via `ElementInternals` (`role="img"` + `aria-label`) on dot-only or non-text badges.',
      table: { category: "Accessibility" },
    },
  },
  args: {
    variant: "soft",
    intent: "neutral",
    size: "md",
    pill: false,
    dot: false,
    label: "",
  },
};

export default meta;

function iconSparkle(slot?: "start" | "end") {
  return html`
    <svg
      slot=${slot ?? nothing}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      stroke-width="1.75"
      aria-hidden="true"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M10 2.5 11.9 7.1 16.5 9l-4.6 1.9L10 15.5l-1.9-4.6L3.5 9l4.6-1.9L10 2.5z"
      />
    </svg>
  `;
}

function iconCheck(slot?: "start" | "end") {
  return html`
    <svg
      slot=${slot ?? nothing}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      aria-hidden="true"
    >
      <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 10.5 3.5 3.5 7.5-7.5" />
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
      <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 10h11m0 0-4-4m4 4-4 4" />
    </svg>
  `;
}

export const Overview: StoryObj<BadgeStoryArgs> = {
  render: (args) => html`
    <san-badge
      variant=${args.variant}
      intent=${args.intent}
      size=${args.size}
      ?pill=${args.pill}
      ?dot=${args.dot}
      label=${args.label || nothing}
    >
      Stable
    </san-badge>
  `,
};

export const Variants: StoryObj = {
  render: () => html`
    <div style="display: grid; gap: var(--san-space-3);">
      <div style="display: flex; flex-wrap: wrap; align-items: center; gap: var(--san-space-3);">
        <san-badge variant="soft">Soft</san-badge>
        <san-badge variant="filled">Filled</san-badge>
        <san-badge variant="outlined">Outlined</san-badge>
      </div>
      <div style="display: flex; flex-wrap: wrap; align-items: center; gap: var(--san-space-3);">
        <san-badge variant="soft" intent="accent">Soft accent</san-badge>
        <san-badge variant="filled" intent="accent">Filled accent</san-badge>
        <san-badge variant="outlined" intent="accent">Outlined accent</san-badge>
      </div>
    </div>
  `,
};

export const Intents: StoryObj = {
  render: () => html`
    <div style="display: grid; gap: var(--san-space-3);">
      ${(["soft", "filled", "outlined"] as const).map(
        (variant) => html`
          <div style="display: flex; flex-wrap: wrap; align-items: center; gap: var(--san-space-2-5);">
            <san-badge variant=${variant} intent="neutral">Neutral</san-badge>
            <san-badge variant=${variant} intent="accent">Accent</san-badge>
            <san-badge variant=${variant} intent="danger">Danger</san-badge>
            <san-badge variant=${variant} intent="warning">Warning</san-badge>
            <san-badge variant=${variant} intent="success">Success</san-badge>
            <san-badge variant=${variant} intent="info">Info</san-badge>
          </div>
        `,
      )}
    </div>
  `,
};

export const Sizes: StoryObj = {
  render: () => html`
    <div style="display: flex; flex-wrap: wrap; align-items: center; gap: var(--san-space-3);">
      <san-badge size="sm" intent="accent">Small</san-badge>
      <san-badge size="md" intent="accent">Medium</san-badge>
      <san-badge size="lg" intent="accent">Large</san-badge>
    </div>
  `,
};

export const WithIcons: StoryObj = {
  render: () => html`
    <div style="display: flex; flex-wrap: wrap; align-items: center; gap: var(--san-space-3);">
      <san-badge variant="soft" intent="accent">
        ${iconSparkle("start")}
        Beta
      </san-badge>
      <san-badge variant="filled" intent="success">
        ${iconCheck("start")}
        Verified
      </san-badge>
      <san-badge variant="outlined" intent="info">
        Release notes
        ${iconArrowRight("end")}
      </san-badge>
      <san-badge variant="soft" intent="warning" size="sm">
        ${iconSparkle("start")}
        Preview
        ${iconArrowRight("end")}
      </san-badge>
    </div>
  `,
};

export const StatusDots: StoryObj = {
  render: () => html`
    <div style="display: grid; gap: var(--san-space-3);">
      <div style="display: flex; flex-wrap: wrap; align-items: center; gap: var(--san-space-3);">
        <san-badge dot intent="neutral">Idle</san-badge>
        <san-badge dot intent="accent">Syncing</san-badge>
        <san-badge dot intent="success">Operational</san-badge>
        <san-badge dot intent="warning">Degraded</san-badge>
        <san-badge dot intent="danger">Outage</san-badge>
        <san-badge dot intent="info">Scheduled</san-badge>
      </div>
      <div style="display: flex; flex-wrap: wrap; align-items: center; gap: var(--san-space-3);">
        <san-badge dot size="sm" intent="success" label="Small operational status"></san-badge>
        <san-badge dot size="md" intent="warning" label="Medium degraded status"></san-badge>
        <san-badge dot size="lg" intent="danger" label="Large outage status"></san-badge>
        <san-badge dot intent="info" label="Information status"></san-badge>
        <san-badge dot intent="accent" label="Active sync status"></san-badge>
      </div>
    </div>
  `,
};

export const Counters: StoryObj = {
  render: () => html`
    <div style="display: flex; flex-wrap: wrap; align-items: center; gap: var(--san-space-3);">
      <san-badge pill variant="filled" intent="accent" size="sm">3</san-badge>
      <san-badge pill variant="filled" intent="danger" size="sm">12</san-badge>
      <san-badge pill variant="soft" intent="neutral">99+</san-badge>
      <san-badge pill variant="outlined" intent="info">1,204</san-badge>
      <san-badge variant="soft" intent="success" size="lg">2048</san-badge>
    </div>
  `,
};

export const Pill: StoryObj = {
  render: () => html`
    <div style="display: flex; flex-wrap: wrap; align-items: center; gap: var(--san-space-3);">
      <san-badge pill variant="soft" intent="neutral">Soft pill</san-badge>
      <san-badge pill variant="filled" intent="accent">Filled pill</san-badge>
      <san-badge pill variant="outlined" intent="info">Outlined pill</san-badge>
      <san-badge pill dot variant="soft" intent="success">Live</san-badge>
      <san-badge pill variant="soft" intent="warning" size="sm">
        ${iconSparkle("start")}
        New
      </san-badge>
    </div>
  `,
};

export const Truncation: StoryObj = {
  render: () => html`
    <div style="display: grid; justify-items: start; gap: var(--san-space-3);">
      <san-badge style="max-inline-size: 10rem;">
        Very long status badge label that truncates cleanly
      </san-badge>
      <san-badge dot intent="info" style="max-inline-size: 10rem;">
        Deployment pipeline waiting for manual approval
      </san-badge>
      <san-badge variant="filled" intent="accent" pill style="max-inline-size: 10rem;">
        ${iconSparkle("start")}
        Experimental feature preview channel
      </san-badge>
    </div>
  `,
};
