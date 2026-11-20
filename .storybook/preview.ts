import "@sanctuary-ds/tokens/css";
import {
  defaultFlavor,
  defaultGlazing,
  flavors,
  glazings,
  pigments,
} from "@sanctuary-ds/tokens/palette";
import type { Preview } from "@storybook/web-components-vite";
import { html } from "lit";

const flavorItems = Object.entries(flavors).map(([id, flavor]) => ({
  value: id,
  title: `${flavor.name} (${flavor.scheme})`,
}));

const pigmentItems = [
  { value: "", title: "Flavor default" },
  ...Object.keys(pigments).map((id) => ({
    value: id,
    title: id.charAt(0).toUpperCase() + id.slice(1),
  })),
];

const glazingItems = Object.entries(glazings).map(([id, glazing]) => ({
  value: id,
  title: glazing.name,
}));

const preview: Preview = {
  globalTypes: {
    flavor: {
      description: "Sanctuary canonical flavor",
      toolbar: {
        title: "Flavor",
        items: flavorItems,
        dynamicTitle: true,
      },
    },
    accent: {
      description: "Sanctuary pigment accent override",
      toolbar: {
        title: "Accent",
        items: pigmentItems,
        dynamicTitle: true,
      },
    },
    glazing: {
      description: "Sanctuary glazing axis",
      toolbar: {
        title: "Glazing",
        items: glazingItems,
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    flavor: defaultFlavor,
    accent: "",
    glazing: defaultGlazing,
  },
  decorators: [
    (story, context) => {
      const flavor = String(context.globals.flavor ?? defaultFlavor);
      const accent = String(context.globals.accent ?? "");
      const glazing = String(context.globals.glazing ?? defaultGlazing);

      document.documentElement.setAttribute("data-san-flavor", flavor);
      document.documentElement.setAttribute("data-san-glazing", glazing);
      if (accent) {
        document.documentElement.setAttribute("data-san-accent", accent);
      } else {
        document.documentElement.removeAttribute("data-san-accent");
      }

      document.body.style.background = "var(--san-surface)";
      document.body.style.color = "var(--san-text)";
      document.body.style.font = "var(--san-type-body-md)";

      return html`<div style="padding: var(--san-space-4);">${story()}</div>`;
    },
  ],
};

export default preview;
