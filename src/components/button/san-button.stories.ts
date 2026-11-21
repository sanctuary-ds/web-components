import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html, nothing } from "lit";
import "./register.js";
import type { ButtonIntent, ButtonSize, ButtonType, ButtonVariant } from "./index.js";

interface ButtonStoryArgs {
  variant: ButtonVariant;
  intent: ButtonIntent;
  size: ButtonSize;
  pill: boolean;
  disabled: boolean;
  loading: boolean;
  type: ButtonType;
  name: string;
  value: string;
  href: string;
  target: string;
  rel: string;
  download: string;
}

const meta: Meta<ButtonStoryArgs> = {
  title: "Components/Button",
  component: "san-button",
  argTypes: {
    variant: {
      control: "select",
      options: ["filled", "soft", "outlined", "ghost"],
      description:
        "Visual emphasis: `filled` for primary CTAs following active glazing, `soft` for medium-emphasis secondary actions, `outlined` for neutral bordered secondary actions, and `ghost` for low-emphasis tertiary actions.",
      table: { category: "Appearance" },
    },
    intent: {
      control: "select",
      options: ["accent", "danger", "warning", "success", "info"],
      description: "Semantic color intent applied to the surface, border, and focus ring.",
      table: { category: "Appearance" },
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description:
        "Control size preset controlling minimum height, padding, icon size, and typography.",
      table: { category: "Appearance" },
    },
    pill: {
      control: "boolean",
      description: "Applies fully rounded pill corners (`--san-radius-full`).",
      table: { category: "Appearance" },
    },
    disabled: {
      control: "boolean",
      description: "Disables interaction and applies disabled surface and text tokens.",
      table: { category: "State" },
    },
    loading: {
      control: "boolean",
      description:
        "Shows a centered spinner, sets `aria-busy` and `:state(loading)`, preserves button width, and blocks clicks while staying focusable.",
      table: { category: "State" },
    },
    href: {
      control: "text",
      description: "Destination URL. When set, renders a native `<a>` instead of `<button>`.",
      table: { category: "Link" },
    },
    target: {
      control: "text",
      description: "Browsing context target for link mode (e.g. `_blank`).",
      table: { category: "Link" },
    },
    rel: {
      control: "text",
      description:
        'Link relationship attribute. Defaults to `noopener noreferrer` when `target="_blank"` and unset.',
      table: { category: "Link" },
    },
    download: {
      control: "text",
      description: "Prompts downloading the linked resource with the optional filename.",
      table: { category: "Link" },
    },
    type: {
      control: "select",
      options: ["button", "submit", "reset"],
      description: "Native button behavior inside an associated form when `href` is unset.",
      table: { category: "Form" },
    },
    name: {
      control: "text",
      description: 'Field name submitted with the form when `type="submit"`.',
      table: { category: "Form" },
    },
    value: {
      control: "text",
      description: 'Field value submitted with the form when `type="submit"`.',
      table: { category: "Form" },
    },
    formAction: { control: false, table: { category: "Form" } },
    formEnctype: { control: false, table: { category: "Form" } },
    formMethod: { control: false, table: { category: "Form" } },
    formNoValidate: { control: false, table: { category: "Form" } },
    formTarget: { control: false, table: { category: "Form" } },
  },
  args: {
    variant: "filled",
    intent: "accent",
    size: "md",
    pill: false,
    disabled: false,
    loading: false,
    type: "button",
    name: "",
    value: "",
    href: "",
    target: "",
    rel: "",
    download: "",
  },
};

export default meta;

function iconSpark(slot?: "start" | "end") {
  return html`
    <svg slot=${slot ?? nothing} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M10 2l1.9 5.1L17 9l-5.1 1.9L10 16l-1.9-5.1L3 9l5.1-1.9L10 2z" />
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

export const Overview: StoryObj<ButtonStoryArgs> = {
  render: (args) => html`
    <san-button
      variant=${args.variant}
      intent=${args.intent}
      size=${args.size}
      ?pill=${args.pill}
      ?disabled=${args.disabled}
      ?loading=${args.loading}
      type=${args.type}
      name=${args.name || nothing}
      value=${args.value || nothing}
      href=${args.href || nothing}
      target=${args.target || nothing}
      rel=${args.rel || nothing}
      download=${args.download || nothing}
    >
      Publish release
    </san-button>
  `,
};

export const Variants: StoryObj = {
  render: () => html`
    <div style="display: flex; flex-wrap: wrap; align-items: center; gap: var(--san-space-3);">
      <san-button variant="filled">Filled primary</san-button>
      <san-button variant="soft">Soft secondary</san-button>
      <san-button variant="outlined">Outlined neutral</san-button>
      <san-button variant="ghost">Ghost subtle</san-button>
    </div>
  `,
};

export const Intents: StoryObj = {
  render: () => html`
    <div style="display: grid; gap: var(--san-space-3);">
      ${(["filled", "soft", "outlined", "ghost"] as const).map(
        (variant) => html`
          <div style="display: flex; flex-wrap: wrap; align-items: center; gap: var(--san-space-2-5);">
            <san-button variant=${variant} intent="accent">
              ${iconSpark("start")}
              Accent
            </san-button>
            <san-button variant=${variant} intent="danger">Delete item</san-button>
            <san-button variant=${variant} intent="warning">Review warning</san-button>
            <san-button variant=${variant} intent="success">Approve build</san-button>
            <san-button variant=${variant} intent="info">Inspect details</san-button>
          </div>
        `,
      )}
    </div>
  `,
};

export const Sizes: StoryObj = {
  render: () => html`
    <div style="display: flex; flex-wrap: wrap; align-items: center; gap: var(--san-space-3);">
      <san-button size="sm">Compact action</san-button>
      <san-button size="md">Standard action</san-button>
      <san-button size="lg">Prominent action</san-button>
      <san-button size="md" style="max-inline-size: 13rem;">
        Multi-line enterprise confirmation label that expands smoothly
      </san-button>
    </div>
  `,
};

export const PillAndIconSlots: StoryObj = {
  render: () => html`
    <div style="display: flex; flex-wrap: wrap; align-items: center; gap: var(--san-space-3);">
      <san-button pill>
        ${iconSpark("start")}
        Generate preview
      </san-button>
      <san-button variant="soft" pill>
        Continue setup
        ${iconArrowRight("end")}
      </san-button>
      <san-button variant="outlined" pill>
        ${iconSpark("start")}
        Explore workspace
        ${iconArrowRight("end")}
      </san-button>
    </div>
  `,
};

export const States: StoryObj = {
  render: () => html`
    <div style="display: flex; flex-wrap: wrap; align-items: center; gap: var(--san-space-3);">
      <san-button disabled>Disabled filled</san-button>
      <san-button variant="soft" disabled>Disabled soft</san-button>
      <san-button variant="outlined" disabled>Disabled outlined</san-button>
      <san-button variant="ghost" disabled>Disabled ghost</san-button>
      <san-button loading>Saving changes</san-button>
      <san-button variant="soft" intent="success" loading>Deploying</san-button>
    </div>
  `,
};

export const LinkMode: StoryObj = {
  render: () => html`
    <div style="display: flex; flex-wrap: wrap; align-items: center; gap: var(--san-space-3);">
      <san-button href="https://sanctuary-ds.github.io/" target="_blank">
        Sanctuary docs
        ${iconArrowRight("end")}
      </san-button>
      <san-button variant="outlined" href="https://sanctuary-ds.github.io/" disabled>
        Disabled link
      </san-button>
    </div>
  `,
};
