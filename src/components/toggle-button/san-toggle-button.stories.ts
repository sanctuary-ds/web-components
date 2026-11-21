import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html, nothing } from "lit";
import "./register.js";
import type { ToggleButtonIntent, ToggleButtonSize, ToggleButtonVariant } from "./index.js";

interface ToggleButtonStoryArgs {
  pressed: boolean;
  variant: ToggleButtonVariant;
  intent: ToggleButtonIntent;
  size: ToggleButtonSize;
  pill: boolean;
  label: string;
  value: string;
  disabled: boolean;
}

const meta: Meta<ToggleButtonStoryArgs> = {
  title: "Components/Toggle Button",
  component: "san-toggle-button",
  argTypes: {
    pressed: {
      control: "boolean",
      description:
        "Pressed toggle state mapped to `aria-pressed` and `:state(pressed)`, activating Sanctuary glazing feedback.",
      table: { category: "State" },
    },
    disabled: {
      control: "boolean",
      description: "Disables interaction and applies disabled surface and text tokens.",
      table: { category: "State" },
    },
    variant: {
      control: "select",
      options: ["outlined", "soft", "ghost"],
      description:
        "Unpressed visual emphasis: `outlined` (default) for bordered toggles, `soft` for tinted secondary toggles, and `ghost` for toolbar controls.",
      table: { category: "Appearance" },
    },
    intent: {
      control: "select",
      options: ["accent", "danger", "warning", "success", "info"],
      description: "Semantic color intent applied to the pressed glazing surface and focus ring.",
      table: { category: "Appearance" },
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description:
        "Control size preset (`sm` 32px, `md` 40px, `lg` 48px) controlling height, padding, typography, and icon scale.",
      table: { category: "Appearance" },
    },
    pill: {
      control: "boolean",
      description: "Applies fully rounded pill/circular corners (`--san-radius-full`).",
      table: { category: "Appearance" },
    },
    label: {
      control: "text",
      description:
        "Accessible label forwarded to `aria-label` on the internal `<button>` (required when slotted with only an icon).",
      table: { category: "Accessibility" },
    },
    value: {
      control: "text",
      description:
        "Optional identifier used when coordinating inside a `<san-toggle-button-group>`.",
      table: { category: "Group" },
    },
  },
  args: {
    pressed: false,
    variant: "outlined",
    intent: "accent",
    size: "md",
    pill: false,
    label: "",
    value: "pin",
    disabled: false,
  },
};

export default meta;

function iconPin(slot?: "start" | "end") {
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
        d="M7 3.5h6l-1 4.5 2.5 2.5V12h-4v4.5L10 18l-.5-1.5V12h-4v-1.5L8 8 7 3.5z"
      />
    </svg>
  `;
}

function iconBold(slot?: "start" | "end") {
  return html`
    <svg
      slot=${slot ?? nothing}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      aria-hidden="true"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M6 4.5h4.5a3 3 0 0 1 0 6H6v-6zm0 6h5.5a3 3 0 0 1 0 6H6v-6z"
      />
    </svg>
  `;
}

function iconItalic(slot?: "start" | "end") {
  return html`
    <svg
      slot=${slot ?? nothing}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      stroke-width="1.75"
      aria-hidden="true"
    >
      <path stroke-linecap="round" stroke-linejoin="round" d="M12.5 4.5h-4m3 11h-4m3-11-3 11" />
    </svg>
  `;
}

function iconStar(slot?: "start" | "end") {
  return html`
    <svg slot=${slot ?? nothing} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M10 2l2.4 5 5.6.8-4 3.9.9 5.5L10 14.6 5.1 17.2 6 11.7 2 7.8l5.6-.8L10 2z" />
    </svg>
  `;
}

export const Overview: StoryObj<ToggleButtonStoryArgs> = {
  render: (args) => html`
    <san-toggle-button
      ?pressed=${args.pressed}
      variant=${args.variant}
      intent=${args.intent}
      size=${args.size}
      ?pill=${args.pill}
      label=${args.label || nothing}
      value=${args.value || nothing}
      ?disabled=${args.disabled}
    >
      ${iconPin("start")}
      Pin item
    </san-toggle-button>
  `,
};

export const Variants: StoryObj = {
  render: () => html`
    <div style="display: grid; gap: var(--san-space-3);">
      <div style="display: flex; flex-wrap: wrap; align-items: center; gap: var(--san-space-3);">
        <san-toggle-button variant="outlined">Outlined</san-toggle-button>
        <san-toggle-button variant="soft">Soft</san-toggle-button>
        <san-toggle-button variant="ghost">Ghost</san-toggle-button>
      </div>
      <div style="display: flex; flex-wrap: wrap; align-items: center; gap: var(--san-space-3);">
        <san-toggle-button variant="outlined" pressed>Outlined pressed</san-toggle-button>
        <san-toggle-button variant="soft" pressed>Soft pressed</san-toggle-button>
        <san-toggle-button variant="ghost" pressed>Ghost pressed</san-toggle-button>
      </div>
    </div>
  `,
};

export const Intents: StoryObj = {
  render: () => html`
    <div style="display: grid; gap: var(--san-space-3);">
      ${(["outlined", "soft", "ghost"] as const).map(
        (variant) => html`
          <div style="display: flex; flex-wrap: wrap; align-items: center; gap: var(--san-space-2-5);">
            <san-toggle-button variant=${variant} intent="accent" pressed>
              ${iconStar("start")}
              Accent
            </san-toggle-button>
            <san-toggle-button variant=${variant} intent="danger" pressed>Mute alerts</san-toggle-button>
            <san-toggle-button variant=${variant} intent="warning" pressed>Flag draft</san-toggle-button>
            <san-toggle-button variant=${variant} intent="success" pressed>Auto-approve</san-toggle-button>
            <san-toggle-button variant=${variant} intent="info" pressed>Show hints</san-toggle-button>
          </div>
        `,
      )}
    </div>
  `,
};

export const Sizes: StoryObj = {
  render: () => html`
    <div style="display: flex; flex-wrap: wrap; align-items: center; gap: var(--san-space-3);">
      <san-toggle-button size="sm">Compact</san-toggle-button>
      <san-toggle-button size="md" pressed>Standard</san-toggle-button>
      <san-toggle-button size="lg">Prominent</san-toggle-button>
    </div>
  `,
};

export const IconAndText: StoryObj = {
  render: () => html`
    <div style="display: flex; flex-wrap: wrap; align-items: center; gap: var(--san-space-3);">
      <san-toggle-button pressed>
        ${iconPin("start")}
        Pinned
      </san-toggle-button>
      <san-toggle-button variant="soft">
        ${iconStar("start")}
        Bookmark
      </san-toggle-button>
      <san-toggle-button variant="ghost" pressed>
        Highlight
        ${iconStar("end")}
      </san-toggle-button>
    </div>
  `,
};

export const IconOnly: StoryObj = {
  render: () => html`
    <div style="display: flex; flex-wrap: wrap; align-items: center; gap: var(--san-space-2);">
      <san-toggle-button variant="ghost" label="Bold" pressed>
        ${iconBold()}
      </san-toggle-button>
      <san-toggle-button variant="ghost" label="Italic">
        ${iconItalic()}
      </san-toggle-button>
      <san-toggle-button variant="outlined" label="Pin item" pressed>
        ${iconPin()}
      </san-toggle-button>
      <san-toggle-button variant="soft" size="sm" pill label="Favorite">
        ${iconStar()}
      </san-toggle-button>
      <san-toggle-button variant="outlined" size="lg" pill label="Favorite large" pressed>
        ${iconStar()}
      </san-toggle-button>
    </div>
  `,
};

export const Pill: StoryObj = {
  render: () => html`
    <div style="display: flex; flex-wrap: wrap; align-items: center; gap: var(--san-space-3);">
      <san-toggle-button pill>Unpressed pill</san-toggle-button>
      <san-toggle-button pill pressed>
        ${iconStar("start")}
        Pressed pill
      </san-toggle-button>
      <san-toggle-button variant="soft" pill pressed>Soft pill</san-toggle-button>
    </div>
  `,
};

export const States: StoryObj = {
  render: () => html`
    <div style="display: flex; flex-wrap: wrap; align-items: center; gap: var(--san-space-3);">
      <san-toggle-button disabled>Disabled outlined</san-toggle-button>
      <san-toggle-button disabled pressed>Disabled pressed</san-toggle-button>
      <san-toggle-button variant="soft" disabled>Disabled soft</san-toggle-button>
      <san-toggle-button variant="ghost" disabled>Disabled ghost</san-toggle-button>
      <san-toggle-button disabled label="Disabled icon toggle">
        ${iconPin()}
      </san-toggle-button>
    </div>
  `,
};
