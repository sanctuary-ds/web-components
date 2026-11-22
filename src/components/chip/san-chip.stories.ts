import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html, nothing } from "lit";
import "./register.js";
import type { ChipIntent, ChipSize, ChipVariant } from "./index.js";

interface ChipStoryArgs {
  variant: ChipVariant;
  intent: ChipIntent;
  size: ChipSize;
  pill: boolean;
  selectable: boolean;
  selected: boolean;
  removable: boolean;
  removeLabel: string;
  value: string;
  disabled: boolean;
}

const meta: Meta<ChipStoryArgs> = {
  title: "Components/Chip",
  component: "san-chip",
  argTypes: {
    variant: {
      control: "select",
      options: ["outlined", "soft", "filled"],
      description:
        "Visual emphasis: `outlined` (default) for bordered chips, `soft` for tinted secondary chips, and `filled` for high-emphasis chips.",
      table: { category: "Appearance" },
    },
    intent: {
      control: "select",
      options: ["neutral", "accent", "danger", "warning", "success", "info"],
      description: "Semantic color intent applied to the chip surface, border, and text.",
      table: { category: "Appearance" },
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description:
        "Size preset controlling minimum height (`sm` 24px, `md` 28px, `lg` 32px), inline padding, typography, and icon scale.",
      table: { category: "Appearance" },
    },
    pill: {
      control: "boolean",
      description: "Applies fully rounded pill corners (`--san-radius-full`).",
      table: { category: "Appearance" },
    },
    selectable: {
      control: "boolean",
      description:
        "Renders the chip content inside an interactive `<button>` with `aria-pressed` that toggles `selected` and emits `change` on user activation.",
      table: { category: "Behavior" },
    },
    selected: {
      control: "boolean",
      description:
        "Selected state reflected to `:state(selected)` and `aria-pressed`, transitioning to Sanctuary's tinted glass pane with a leading checkmark when no `start` icon is slotted.",
      table: { category: "State" },
    },
    removable: {
      control: "boolean",
      description:
        "Renders a sibling remove `<button>` that emits a cancelable `remove` event (also triggered by `Backspace`/`Delete` when `selectable`).",
      table: { category: "Behavior" },
    },
    removeLabel: {
      control: "text",
      description:
        'Accessible label forwarded to the remove button (`aria-label`); defaults to `"Remove <label>"` or `"Remove"`.',
      table: { category: "Accessibility" },
    },
    value: {
      control: "text",
      description: "Value identifier for filter and tag collections.",
      table: { category: "Behavior" },
    },
    disabled: {
      control: "boolean",
      description:
        "Disables action and remove buttons, suppresses interaction, and applies disabled surface, border, and text tokens.",
      table: { category: "State" },
    },
  },
  args: {
    variant: "outlined",
    intent: "neutral",
    size: "md",
    pill: false,
    selectable: false,
    selected: false,
    removable: false,
    removeLabel: "",
    value: "",
    disabled: false,
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

function iconFilter(slot?: "start" | "end") {
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
        d="M3.5 5.5h13M6 10h8M8.5 14.5h3"
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

function handleChipRemove(event: Event): void {
  if (event.defaultPrevented) {
    return;
  }
  const target = event.target;
  if (target instanceof Element) {
    target.closest("san-chip")?.remove();
  }
}

export const Overview: StoryObj<ChipStoryArgs> = {
  render: (args) => html`
    <san-chip
      variant=${args.variant}
      intent=${args.intent}
      size=${args.size}
      ?pill=${args.pill}
      ?selectable=${args.selectable}
      ?selected=${args.selected}
      ?removable=${args.removable}
      remove-label=${args.removeLabel || nothing}
      value=${args.value || nothing}
      ?disabled=${args.disabled}
    >
      Design tokens
    </san-chip>
  `,
};

export const Variants: StoryObj = {
  render: () => html`
    <div style="display: grid; gap: var(--san-space-3);">
      <div style="display: flex; flex-wrap: wrap; align-items: center; gap: var(--san-space-3);">
        <san-chip variant="outlined">Outlined</san-chip>
        <san-chip variant="soft">Soft</san-chip>
        <san-chip variant="filled">Filled</san-chip>
      </div>
      <div style="display: flex; flex-wrap: wrap; align-items: center; gap: var(--san-space-3);">
        <san-chip variant="outlined" intent="accent">Outlined accent</san-chip>
        <san-chip variant="soft" intent="accent">Soft accent</san-chip>
        <san-chip variant="filled" intent="accent">Filled accent</san-chip>
      </div>
      <div style="display: flex; flex-wrap: wrap; align-items: center; gap: var(--san-space-3);">
        <san-chip variant="outlined" intent="accent" selectable selected>Outlined selected</san-chip>
        <san-chip variant="soft" intent="accent" selectable selected>Soft selected</san-chip>
        <san-chip variant="filled" intent="accent" selectable selected>Filled selected</san-chip>
      </div>
    </div>
  `,
};

export const Intents: StoryObj = {
  render: () => html`
    <div style="display: grid; gap: var(--san-space-3);">
      ${(["outlined", "soft", "filled"] as const).map(
        (variant) => html`
          <div style="display: flex; flex-wrap: wrap; align-items: center; gap: var(--san-space-2-5);">
            <san-chip variant=${variant} intent="neutral">Neutral</san-chip>
            <san-chip variant=${variant} intent="accent">Accent</san-chip>
            <san-chip variant=${variant} intent="danger">Danger</san-chip>
            <san-chip variant=${variant} intent="warning">Warning</san-chip>
            <san-chip variant=${variant} intent="success">Success</san-chip>
            <san-chip variant=${variant} intent="info">Info</san-chip>
          </div>
        `,
      )}
    </div>
  `,
};

export const Sizes: StoryObj = {
  render: () => html`
    <div style="display: flex; flex-wrap: wrap; align-items: center; gap: var(--san-space-3);">
      <san-chip size="sm" intent="accent">Small</san-chip>
      <san-chip size="md" intent="accent">Medium</san-chip>
      <san-chip size="lg" intent="accent">Large</san-chip>
    </div>
  `,
};

export const SelectableFilters: StoryObj = {
  render: () => html`
    <div style="display: grid; gap: var(--san-space-3);">
      <div style="display: flex; flex-wrap: wrap; align-items: center; gap: var(--san-space-2-5);">
        <san-chip selectable selected value="all" intent="accent">
          ${iconFilter("start")}
          All
        </san-chip>
        <san-chip selectable value="components">Components</san-chip>
        <san-chip selectable selected value="tokens" intent="accent">Tokens</san-chip>
        <san-chip selectable value="accessibility">Accessibility</san-chip>
        <san-chip selectable value="patterns">Patterns</san-chip>
      </div>
      <div style="display: flex; flex-wrap: wrap; align-items: center; gap: var(--san-space-2-5);">
        <san-chip variant="soft" selectable selected value="ready" intent="success">
          ${iconCheck("start")}
          Ready
        </san-chip>
        <san-chip variant="soft" selectable value="review" intent="warning">In review</san-chip>
        <san-chip variant="soft" selectable value="blocked" intent="danger">Blocked</san-chip>
        <san-chip variant="soft" selectable value="scheduled" intent="info">Scheduled</san-chip>
      </div>
    </div>
  `,
};

export const RemovableTags: StoryObj = {
  render: () => html`
    <div
      style="display: flex; flex-wrap: wrap; align-items: center; gap: var(--san-space-2-5);"
      @remove=${handleChipRemove}
    >
      <san-chip removable value="typescript">TypeScript</san-chip>
      <san-chip removable variant="soft" intent="accent" value="lit">Lit 3</san-chip>
      <san-chip removable variant="soft" intent="info" value="tokens">Design Tokens</san-chip>
      <san-chip
        removable
        variant="outlined"
        intent="success"
        value="a11y"
        remove-label="Remove accessibility tag"
      >
        Accessibility
      </san-chip>
    </div>
  `,
};

export const SelectableAndRemovable: StoryObj = {
  render: () => html`
    <div
      style="display: flex; flex-wrap: wrap; align-items: center; gap: var(--san-space-2-5);"
      @remove=${handleChipRemove}
    >
      <san-chip selectable selected removable intent="accent" value="status-open">
        Status: Open
      </san-chip>
      <san-chip selectable removable variant="soft" intent="info" value="priority-high">
        Priority: High
      </san-chip>
      <san-chip selectable selected removable variant="soft" intent="success" value="verified">
        ${iconCheck("start")}
        Verified
      </san-chip>
      <san-chip selectable removable variant="outlined" value="milestone-1">
        Milestone 1
      </san-chip>
    </div>
  `,
};

export const WithIcons: StoryObj = {
  render: () => html`
    <div style="display: flex; flex-wrap: wrap; align-items: center; gap: var(--san-space-3);">
      <san-chip variant="soft" intent="accent">
        ${iconSparkle("start")}
        Beta
      </san-chip>
      <san-chip variant="filled" intent="success">
        ${iconCheck("start")}
        Verified
      </san-chip>
      <san-chip variant="outlined" intent="info">
        Release notes
        ${iconArrowRight("end")}
      </san-chip>
      <san-chip variant="soft" intent="warning" size="sm" selectable removable>
        ${iconSparkle("start")}
        Preview
        ${iconArrowRight("end")}
      </san-chip>
    </div>
  `,
};

export const Pill: StoryObj = {
  render: () => html`
    <div style="display: flex; flex-wrap: wrap; align-items: center; gap: var(--san-space-3);">
      <san-chip pill variant="outlined" intent="neutral">Outlined pill</san-chip>
      <san-chip pill variant="soft" intent="accent">Soft pill</san-chip>
      <san-chip pill variant="filled" intent="info">Filled pill</san-chip>
      <san-chip pill selectable selected intent="accent">
        ${iconCheck("start")}
        Selected pill
      </san-chip>
      <san-chip pill removable variant="soft" intent="success">Removable pill</san-chip>
    </div>
  `,
};

export const DisabledStates: StoryObj = {
  render: () => html`
    <div style="display: flex; flex-wrap: wrap; align-items: center; gap: var(--san-space-3);">
      <san-chip disabled>Disabled static</san-chip>
      <san-chip variant="soft" disabled>Disabled soft</san-chip>
      <san-chip variant="filled" disabled>Disabled filled</san-chip>
      <san-chip selectable disabled>Disabled selectable</san-chip>
      <san-chip selectable selected disabled intent="accent">Disabled selected</san-chip>
      <san-chip removable disabled>Disabled removable</san-chip>
      <san-chip selectable selected removable disabled intent="info">
        Disabled selectable & removable
      </san-chip>
    </div>
  `,
};
