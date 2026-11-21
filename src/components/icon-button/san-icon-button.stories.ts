import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html, nothing } from "lit";
import "./register.js";
import type { ButtonIntent, ButtonSize, ButtonType, ButtonVariant } from "./index.js";

interface IconButtonStoryArgs {
  variant: ButtonVariant;
  intent: ButtonIntent;
  size: ButtonSize;
  pill: boolean;
  label: string;
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

const meta: Meta<IconButtonStoryArgs> = {
  title: "Components/Icon Button",
  component: "san-icon-button",
  argTypes: {
    variant: {
      control: "select",
      options: ["filled", "soft", "outlined", "ghost"],
      description:
        "Visual emphasis: `ghost` (default) for toolbars and headers, `outlined` for bordered actions, `soft` for tinted secondary controls, and `filled` for primary glazed icon actions.",
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
      description: "Square control size preset (`sm` 32px, `md` 40px, `lg` 48px) and icon scale.",
      table: { category: "Appearance" },
    },
    pill: {
      control: "boolean",
      description: "Applies fully circular corners (`--san-radius-full`).",
      table: { category: "Appearance" },
    },
    label: {
      control: "text",
      description:
        "Required accessible label mapped to `aria-label` on the internal `<button>` or `<a>` control (WCAG 4.1.2).",
      table: { category: "Accessibility" },
    },
    disabled: {
      control: "boolean",
      description: "Disables interaction and applies disabled surface and text tokens.",
      table: { category: "State" },
    },
    loading: {
      control: "boolean",
      description:
        "Shows a centered spinner, sets `aria-busy` and `:state(loading)`, preserves 1:1 dimensions, and blocks clicks while staying focusable.",
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
    variant: "ghost",
    intent: "accent",
    size: "md",
    pill: false,
    label: "Star item",
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

function iconStar() {
  return html`
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M10 2l2.4 5 5.6.8-4 3.9.9 5.5L10 14.6 5.1 17.2 6 11.7 2 7.8l5.6-.8L10 2z" />
    </svg>
  `;
}

function iconTrash() {
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
        d="M4.5 6h11m-9.5 0v9.5a1.5 1.5 0 0 0 1.5 1.5h5a1.5 1.5 0 0 0 1.5-1.5V6M8 6V4.5A1.5 1.5 0 0 1 9.5 3h1A1.5 1.5 0 0 1 12 4.5V6"
      />
    </svg>
  `;
}

function iconPin() {
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
        d="M12.5 3.5l4 4-2 2-.5 3-3.5 3.5-2.5-2.5L4 17.5l4-4-2.5-2.5L9 7.5l3-.5 2-2z"
      />
    </svg>
  `;
}

function iconExternal() {
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
        d="M11 4h5v5m0-5L9 11m-3-4H4.5A1.5 1.5 0 0 0 3 8.5v7A1.5 1.5 0 0 0 4.5 17h7a1.5 1.5 0 0 0 1.5-1.5V14"
      />
    </svg>
  `;
}

export const Overview: StoryObj<IconButtonStoryArgs> = {
  render: (args) => html`
    <san-icon-button
      variant=${args.variant}
      intent=${args.intent}
      size=${args.size}
      ?pill=${args.pill}
      label=${args.label}
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
      ${iconStar()}
    </san-icon-button>
  `,
};

export const Variants: StoryObj = {
  render: () => html`
    <div style="display: flex; flex-wrap: wrap; align-items: center; gap: var(--san-space-3);">
      <san-icon-button variant="ghost" label="Ghost action">${iconStar()}</san-icon-button>
      <san-icon-button variant="outlined" label="Outlined action">${iconStar()}</san-icon-button>
      <san-icon-button variant="soft" label="Soft action">${iconStar()}</san-icon-button>
      <san-icon-button variant="filled" label="Filled action">${iconStar()}</san-icon-button>
    </div>
  `,
};

export const Intents: StoryObj = {
  render: () => html`
    <div style="display: grid; gap: var(--san-space-3);">
      ${(["ghost", "outlined", "soft", "filled"] as const).map(
        (variant) => html`
          <div style="display: flex; flex-wrap: wrap; align-items: center; gap: var(--san-space-2-5);">
            <san-icon-button variant=${variant} intent="accent" label="Accent action">
              ${iconStar()}
            </san-icon-button>
            <san-icon-button variant=${variant} intent="danger" label="Delete item">
              ${iconTrash()}
            </san-icon-button>
            <san-icon-button variant=${variant} intent="warning" label="Warning action">
              ${iconPin()}
            </san-icon-button>
            <san-icon-button variant=${variant} intent="success" label="Success action">
              ${iconStar()}
            </san-icon-button>
            <san-icon-button variant=${variant} intent="info" label="Info action">
              ${iconExternal()}
            </san-icon-button>
          </div>
        `,
      )}
    </div>
  `,
};

export const Sizes: StoryObj = {
  render: () => html`
    <div style="display: flex; flex-wrap: wrap; align-items: center; gap: var(--san-space-3);">
      <san-icon-button variant="outlined" size="sm" label="Small icon button">
        ${iconStar()}
      </san-icon-button>
      <san-icon-button variant="outlined" size="md" label="Medium icon button">
        ${iconStar()}
      </san-icon-button>
      <san-icon-button variant="outlined" size="lg" label="Large icon button">
        ${iconStar()}
      </san-icon-button>
    </div>
  `,
};

export const Pill: StoryObj = {
  render: () => html`
    <div style="display: flex; flex-wrap: wrap; align-items: center; gap: var(--san-space-3);">
      <san-icon-button variant="filled" size="sm" pill label="Compact circular">
        ${iconStar()}
      </san-icon-button>
      <san-icon-button variant="soft" size="md" pill label="Standard circular">
        ${iconPin()}
      </san-icon-button>
      <san-icon-button variant="outlined" size="lg" pill label="Large circular">
        ${iconExternal()}
      </san-icon-button>
    </div>
  `,
};

export const States: StoryObj = {
  render: () => html`
    <div style="display: flex; flex-wrap: wrap; align-items: center; gap: var(--san-space-3);">
      <san-icon-button variant="ghost" disabled label="Disabled ghost">
        ${iconStar()}
      </san-icon-button>
      <san-icon-button variant="outlined" disabled label="Disabled outlined">
        ${iconStar()}
      </san-icon-button>
      <san-icon-button variant="soft" disabled label="Disabled soft">
        ${iconStar()}
      </san-icon-button>
      <san-icon-button variant="filled" disabled label="Disabled filled">
        ${iconStar()}
      </san-icon-button>
      <san-icon-button variant="filled" loading label="Loading action">
        ${iconStar()}
      </san-icon-button>
      <san-icon-button variant="soft" intent="success" loading label="Deploying">
        ${iconStar()}
      </san-icon-button>
    </div>
  `,
};

export const LinkMode: StoryObj = {
  render: () => html`
    <div style="display: flex; flex-wrap: wrap; align-items: center; gap: var(--san-space-3);">
      <san-icon-button
        variant="outlined"
        href="https://sanctuary-ds.github.io/"
        target="_blank"
        label="Open Sanctuary docs"
      >
        ${iconExternal()}
      </san-icon-button>
      <san-icon-button
        variant="ghost"
        href="https://sanctuary-ds.github.io/"
        disabled
        label="Disabled external link"
      >
        ${iconExternal()}
      </san-icon-button>
    </div>
  `,
};
