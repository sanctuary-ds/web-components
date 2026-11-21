import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html, nothing } from "lit";
import "../toggle-button/register.js";
import "./register.js";
import type {
  ToggleButtonIntent,
  ToggleButtonSize,
  ToggleButtonVariant,
} from "../toggle-button/index.js";
import type { ToggleButtonGroupOrientation, ToggleButtonGroupSelection } from "./index.js";

interface ToggleButtonGroupStoryArgs {
  selection: ToggleButtonGroupSelection;
  mandatory: boolean;
  value: string;
  values: string[];
  variant: ToggleButtonVariant;
  intent: ToggleButtonIntent;
  size: ToggleButtonSize;
  pill: boolean;
  orientation: ToggleButtonGroupOrientation;
  separated: boolean;
  disabled: boolean;
  label: string;
}

const meta: Meta<ToggleButtonGroupStoryArgs> = {
  title: "Components/Toggle Button Group",
  component: "san-toggle-button-group",
  argTypes: {
    selection: {
      control: "select",
      options: ["single", "multiple"],
      description:
        "Selection coordination mode: `single` allows at most one pressed button, while `multiple` allows any number.",
      table: { category: "Selection" },
    },
    mandatory: {
      control: "boolean",
      description: "Prevents user clicks from deselecting the last remaining pressed button.",
      table: { category: "Selection" },
    },
    value: {
      control: "text",
      description: "Active value in `single` mode, or the first selected value in `multiple` mode.",
      table: { category: "Selection" },
    },
    values: {
      control: "object",
      description: "Ordered array of currently selected non-empty button `value` strings.",
      table: { category: "Selection" },
    },
    variant: {
      control: "select",
      options: ["outlined", "soft", "ghost"],
      description: "Visual emphasis variant propagated to managed `<san-toggle-button>` children.",
      table: { category: "Appearance" },
    },
    intent: {
      control: "select",
      options: ["accent", "danger", "warning", "success", "info"],
      description: "Semantic color intent propagated to managed `<san-toggle-button>` children.",
      table: { category: "Appearance" },
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Control size preset (`sm`, `md`, `lg`) propagated to managed children.",
      table: { category: "Appearance" },
    },
    pill: {
      control: "boolean",
      description:
        "Applies pill outer corners in attached mode, or propagates `pill` to each button when `separated`.",
      table: { category: "Appearance" },
    },
    orientation: {
      control: "select",
      options: ["horizontal", "vertical"],
      description: "Layout axis and arrow-key navigation direction (`horizontal` or `vertical`).",
      table: { category: "Layout" },
    },
    separated: {
      control: "boolean",
      description:
        "Switches from an attached segmented bar to a spaced toolbar using `--san-toggle-button-group-gap`.",
      table: { category: "Layout" },
    },
    disabled: {
      control: "boolean",
      description:
        "Disables all managed buttons while preserving individually disabled buttons when re-enabled.",
      table: { category: "State" },
    },
    label: {
      control: "text",
      description:
        'Accessible name applied to the host `role="toolbar"` when `aria-label` or `aria-labelledby` is absent.',
      table: { category: "Accessibility" },
    },
  },
  args: {
    selection: "single",
    mandatory: false,
    value: "left",
    values: ["left"],
    variant: "outlined",
    intent: "accent",
    size: "md",
    pill: false,
    orientation: "horizontal",
    separated: false,
    disabled: false,
    label: "Text alignment",
  },
};

export default meta;

function iconAlignLeft(slot?: "start" | "end") {
  return html`
    <svg
      slot=${slot ?? nothing}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      stroke-width="1.75"
      aria-hidden="true"
    >
      <path stroke-linecap="round" d="M3.5 5h13M3.5 8.5h8.5M3.5 12h13M3.5 15.5h9.5" />
    </svg>
  `;
}

function iconAlignCenter(slot?: "start" | "end") {
  return html`
    <svg
      slot=${slot ?? nothing}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      stroke-width="1.75"
      aria-hidden="true"
    >
      <path stroke-linecap="round" d="M3.5 5h13M5.75 8.5h8.5M3.5 12h13M5.25 15.5h9.5" />
    </svg>
  `;
}

function iconAlignRight(slot?: "start" | "end") {
  return html`
    <svg
      slot=${slot ?? nothing}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      stroke-width="1.75"
      aria-hidden="true"
    >
      <path stroke-linecap="round" d="M3.5 5h13M8 8.5h8.5M3.5 12h13M7 15.5h9.5" />
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

function iconUnderline(slot?: "start" | "end") {
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
        d="M6 4.5v5a4 4 0 0 0 8 0v-5M4.5 16h11"
      />
    </svg>
  `;
}

function iconList(slot?: "start" | "end") {
  return html`
    <svg
      slot=${slot ?? nothing}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      stroke-width="1.75"
      aria-hidden="true"
    >
      <path stroke-linecap="round" d="M7.5 5.5h9M7.5 10h9M7.5 14.5h9" />
      <circle cx="4.25" cy="5.5" r="0.75" fill="currentColor" stroke="none" />
      <circle cx="4.25" cy="10" r="0.75" fill="currentColor" stroke="none" />
      <circle cx="4.25" cy="14.5" r="0.75" fill="currentColor" stroke="none" />
    </svg>
  `;
}

function iconGrid(slot?: "start" | "end") {
  return html`
    <svg
      slot=${slot ?? nothing}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      stroke-width="1.75"
      aria-hidden="true"
    >
      <rect x="3.5" y="3.5" width="5" height="5" rx="1" />
      <rect x="11.5" y="3.5" width="5" height="5" rx="1" />
      <rect x="3.5" y="11.5" width="5" height="5" rx="1" />
      <rect x="11.5" y="11.5" width="5" height="5" rx="1" />
    </svg>
  `;
}

export const Overview: StoryObj<ToggleButtonGroupStoryArgs> = {
  render: (args) => html`
    <san-toggle-button-group
      selection=${args.selection}
      ?mandatory=${args.mandatory}
      value=${args.selection === "single" ? args.value || nothing : nothing}
      .values=${args.selection === "multiple" ? args.values : args.value ? [args.value] : []}
      variant=${args.variant}
      intent=${args.intent}
      size=${args.size}
      ?pill=${args.pill}
      orientation=${args.orientation}
      ?separated=${args.separated}
      ?disabled=${args.disabled}
      label=${args.label || nothing}
    >
      <san-toggle-button value="left">
        ${iconAlignLeft("start")}
        Left
      </san-toggle-button>
      <san-toggle-button value="center">
        ${iconAlignCenter("start")}
        Center
      </san-toggle-button>
      <san-toggle-button value="right">
        ${iconAlignRight("start")}
        Right
      </san-toggle-button>
    </san-toggle-button-group>
  `,
};

export const SelectionModes: StoryObj = {
  render: () => html`
    <div style="display: grid; gap: var(--san-space-4); justify-items: start;">
      <san-toggle-button-group selection="single" value="day" label="Single optional range">
        <san-toggle-button value="day">Day</san-toggle-button>
        <san-toggle-button value="week">Week</san-toggle-button>
        <san-toggle-button value="month">Month</san-toggle-button>
      </san-toggle-button-group>

      <san-toggle-button-group
        selection="single"
        mandatory
        value="list"
        label="Single mandatory layout"
      >
        <san-toggle-button value="list">
          ${iconList("start")}
          List
        </san-toggle-button>
        <san-toggle-button value="grid">
          ${iconGrid("start")}
          Grid
        </san-toggle-button>
      </san-toggle-button-group>

      <san-toggle-button-group
        selection="multiple"
        .values=${["bold", "italic"]}
        label="Multiple optional formatting"
      >
        <san-toggle-button value="bold">
          ${iconBold("start")}
          Bold
        </san-toggle-button>
        <san-toggle-button value="italic">
          ${iconItalic("start")}
          Italic
        </san-toggle-button>
        <san-toggle-button value="underline">
          ${iconUnderline("start")}
          Underline
        </san-toggle-button>
      </san-toggle-button-group>

      <san-toggle-button-group
        selection="multiple"
        mandatory
        .values=${["errors"]}
        label="Multiple mandatory log filters"
      >
        <san-toggle-button value="errors">Errors</san-toggle-button>
        <san-toggle-button value="warnings">Warnings</san-toggle-button>
        <san-toggle-button value="info">Info</san-toggle-button>
      </san-toggle-button-group>
    </div>
  `,
};

export const Variants: StoryObj = {
  render: () => html`
    <div style="display: grid; gap: var(--san-space-3); justify-items: start;">
      <san-toggle-button-group variant="outlined" value="week" label="Outlined time range">
        <san-toggle-button value="day">Day</san-toggle-button>
        <san-toggle-button value="week">Week</san-toggle-button>
        <san-toggle-button value="month">Month</san-toggle-button>
      </san-toggle-button-group>

      <san-toggle-button-group variant="soft" value="week" label="Soft time range">
        <san-toggle-button value="day">Day</san-toggle-button>
        <san-toggle-button value="week">Week</san-toggle-button>
        <san-toggle-button value="month">Month</san-toggle-button>
      </san-toggle-button-group>

      <san-toggle-button-group variant="ghost" value="week" label="Ghost time range">
        <san-toggle-button value="day">Day</san-toggle-button>
        <san-toggle-button value="week">Week</san-toggle-button>
        <san-toggle-button value="month">Month</san-toggle-button>
      </san-toggle-button-group>
    </div>
  `,
};

export const Intents: StoryObj = {
  render: () => html`
    <div style="display: grid; gap: var(--san-space-3); justify-items: start;">
      ${(["accent", "danger", "warning", "success", "info"] as const).map(
        (intent) => html`
          <san-toggle-button-group
            variant="outlined"
            intent=${intent}
            value="active"
            label=${`${intent} intent group`}
          >
            <san-toggle-button value="active">${intent}</san-toggle-button>
            <san-toggle-button value="secondary">Compare</san-toggle-button>
            <san-toggle-button value="reset">Clear</san-toggle-button>
          </san-toggle-button-group>
        `,
      )}
    </div>
  `,
};

export const Sizes: StoryObj = {
  render: () => html`
    <div style="display: grid; gap: var(--san-space-3); justify-items: start;">
      <san-toggle-button-group size="sm" value="compact" label="Small group">
        <san-toggle-button value="compact">Small</san-toggle-button>
        <san-toggle-button value="balanced">Dense</san-toggle-button>
        <san-toggle-button value="full">Wide</san-toggle-button>
      </san-toggle-button-group>

      <san-toggle-button-group size="md" value="standard" label="Medium group">
        <san-toggle-button value="compact">Compact</san-toggle-button>
        <san-toggle-button value="standard">Medium</san-toggle-button>
        <san-toggle-button value="wide">Wide</san-toggle-button>
      </san-toggle-button-group>

      <san-toggle-button-group size="lg" value="prominent" label="Large group">
        <san-toggle-button value="compact">Compact</san-toggle-button>
        <san-toggle-button value="standard">Standard</san-toggle-button>
        <san-toggle-button value="prominent">Large</san-toggle-button>
      </san-toggle-button-group>
    </div>
  `,
};

export const Orientation: StoryObj = {
  render: () => html`
    <div style="display: flex; flex-wrap: wrap; align-items: flex-start; gap: var(--san-space-6);">
      <san-toggle-button-group
        orientation="horizontal"
        value="left"
        label="Horizontal alignment"
      >
        <san-toggle-button value="left">Left</san-toggle-button>
        <san-toggle-button value="center">Center</san-toggle-button>
        <san-toggle-button value="right">Right</san-toggle-button>
      </san-toggle-button-group>

      <san-toggle-button-group
        orientation="vertical"
        value="center"
        label="Vertical alignment"
      >
        <san-toggle-button value="top">Top</san-toggle-button>
        <san-toggle-button value="center">Middle</san-toggle-button>
        <san-toggle-button value="bottom">Bottom</san-toggle-button>
      </san-toggle-button-group>

      <san-toggle-button-group
        orientation="vertical"
        separated
        variant="soft"
        value="grid"
        label="Vertical separated view switcher"
      >
        <san-toggle-button value="list" label="List view">
          ${iconList()}
        </san-toggle-button>
        <san-toggle-button value="grid" label="Grid view">
          ${iconGrid()}
        </san-toggle-button>
      </san-toggle-button-group>
    </div>
  `,
};

export const AttachedVsSeparated: StoryObj = {
  render: () => html`
    <div style="display: grid; gap: var(--san-space-4); justify-items: start;">
      <san-toggle-button-group value="center" label="Attached alignment bar">
        <san-toggle-button value="left">
          ${iconAlignLeft("start")}
          Left
        </san-toggle-button>
        <san-toggle-button value="center">
          ${iconAlignCenter("start")}
          Center
        </san-toggle-button>
        <san-toggle-button value="right">
          ${iconAlignRight("start")}
          Right
        </san-toggle-button>
      </san-toggle-button-group>

      <san-toggle-button-group separated value="center" label="Separated alignment toolbar">
        <san-toggle-button value="left">
          ${iconAlignLeft("start")}
          Left
        </san-toggle-button>
        <san-toggle-button value="center">
          ${iconAlignCenter("start")}
          Center
        </san-toggle-button>
        <san-toggle-button value="right">
          ${iconAlignRight("start")}
          Right
        </san-toggle-button>
      </san-toggle-button-group>
    </div>
  `,
};

export const IconOnlyToolbar: StoryObj = {
  render: () => html`
    <div style="display: flex; flex-wrap: wrap; align-items: center; gap: var(--san-space-4);">
      <san-toggle-button-group
        selection="multiple"
        variant="ghost"
        separated
        .values=${["bold"]}
        label="Text formatting"
      >
        <san-toggle-button value="bold" label="Bold">
          ${iconBold()}
        </san-toggle-button>
        <san-toggle-button value="italic" label="Italic">
          ${iconItalic()}
        </san-toggle-button>
        <san-toggle-button value="underline" label="Underline">
          ${iconUnderline()}
        </san-toggle-button>
      </san-toggle-button-group>

      <san-toggle-button-group
        selection="single"
        mandatory
        variant="outlined"
        value="left"
        label="Paragraph alignment"
      >
        <san-toggle-button value="left" label="Align left">
          ${iconAlignLeft()}
        </san-toggle-button>
        <san-toggle-button value="center" label="Align center">
          ${iconAlignCenter()}
        </san-toggle-button>
        <san-toggle-button value="right" label="Align right">
          ${iconAlignRight()}
        </san-toggle-button>
      </san-toggle-button-group>
    </div>
  `,
};

export const Pill: StoryObj = {
  render: () => html`
    <div style="display: grid; gap: var(--san-space-3); justify-items: start;">
      <san-toggle-button-group pill value="week" label="Attached pill range">
        <san-toggle-button value="day">Day</san-toggle-button>
        <san-toggle-button value="week">Week</san-toggle-button>
        <san-toggle-button value="month">Month</san-toggle-button>
      </san-toggle-button-group>

      <san-toggle-button-group
        pill
        separated
        variant="soft"
        selection="multiple"
        .values=${["design", "tokens"]}
        label="Separated pill filters"
      >
        <san-toggle-button value="design">Design</san-toggle-button>
        <san-toggle-button value="tokens">Tokens</san-toggle-button>
        <san-toggle-button value="a11y">Accessibility</san-toggle-button>
      </san-toggle-button-group>
    </div>
  `,
};

export const DisabledStates: StoryObj = {
  render: () => html`
    <div style="display: grid; gap: var(--san-space-3); justify-items: start;">
      <san-toggle-button-group disabled value="week" label="Disabled group">
        <san-toggle-button value="day">Day</san-toggle-button>
        <san-toggle-button value="week">Week</san-toggle-button>
        <san-toggle-button value="month">Month</san-toggle-button>
      </san-toggle-button-group>

      <san-toggle-button-group value="week" label="Group with individually disabled item">
        <san-toggle-button value="day">Day</san-toggle-button>
        <san-toggle-button value="week">Week</san-toggle-button>
        <san-toggle-button value="year" disabled>Year (Pro)</san-toggle-button>
      </san-toggle-button-group>
    </div>
  `,
};
