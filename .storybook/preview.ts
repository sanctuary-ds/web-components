import "@sanctuary-ds/tokens/css";
import {
  defaultFlavor,
  defaultGlazing,
  flavors,
  glazings,
  pigments,
} from "@sanctuary-ds/tokens/palette";
import { type Preview, setCustomElementsManifest } from "@storybook/web-components-vite";
import { html } from "lit";
import customElements from "../custom-elements.json" with { type: "json" };

interface CemManifest {
  modules?: Array<{
    declarations?: Array<{
      members?: Array<{ name?: string }>;
      attributes?: Array<{ name?: string; fieldName?: string }>;
    }>;
  }>;
}

/**
 * Deduplicates Storybook Controls when a component exposes both a camelCase JS
 * property (e.g. `formAction`) and its lowercase HTML attribute (`formaction`).
 * `custom-elements.json` on disk stays untouched for HTML/IDE autocompletion.
 */
function prepareStorybookManifest(manifest: CemManifest): CemManifest {
  if (!Array.isArray(manifest.modules)) {
    return manifest;
  }

  return {
    ...manifest,
    modules: manifest.modules.map((mod) => {
      if (!Array.isArray(mod.declarations)) {
        return mod;
      }

      return {
        ...mod,
        declarations: mod.declarations.map((decl) => {
          if (!Array.isArray(decl.attributes) || !Array.isArray(decl.members)) {
            return decl;
          }
          const memberNames = new Set(decl.members.map((member) => member.name));
          return {
            ...decl,
            attributes: decl.attributes.filter(
              (attr) =>
                !(
                  attr.fieldName &&
                  attr.fieldName !== attr.name &&
                  memberNames.has(attr.fieldName)
                ),
            ),
          };
        }),
      };
    }),
  };
}

setCustomElementsManifest(prepareStorybookManifest(customElements as CemManifest));

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

const surfaceItems = [
  { value: "surface-sunken", title: "Surface sunken" },
  { value: "surface", title: "Surface (default)" },
  { value: "surface-raised-1", title: "Raised 1" },
  { value: "surface-raised-2", title: "Raised 2" },
  { value: "surface-raised-3", title: "Raised 3" },
  { value: "surface-raised-4", title: "Raised 4" },
];

const validSurfaces = new Set(surfaceItems.map((item) => item.value));

const directionItems = [
  { value: "ltr", title: "LTR" },
  { value: "rtl", title: "RTL" },
];

const validDirections = new Set(directionItems.map((item) => item.value));

const preview: Preview = {
  parameters: {
    backgrounds: {
      disable: true,
    },
    controls: {
      expanded: true,
      sort: "requiredFirst",
    },
  },
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
    surface: {
      description: "Sanctuary surface elevation token",
      toolbar: {
        title: "Surface",
        items: surfaceItems,
        dynamicTitle: true,
      },
    },
    direction: {
      description: "Document writing direction",
      toolbar: {
        title: "Direction",
        items: directionItems,
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    flavor: defaultFlavor,
    accent: "",
    glazing: defaultGlazing,
    surface: "surface",
    direction: "ltr",
  },
  decorators: [
    (story, context) => {
      const flavor = String(context.globals.flavor ?? defaultFlavor);
      const accent = String(context.globals.accent ?? "");
      const glazing = String(context.globals.glazing ?? defaultGlazing);
      const rawSurface = String(context.globals.surface ?? "surface");
      const surface = validSurfaces.has(rawSurface) ? rawSurface : "surface";
      const rawDirection = String(context.globals.direction ?? "ltr");
      const direction = validDirections.has(rawDirection) ? rawDirection : "ltr";

      document.documentElement.setAttribute("data-san-flavor", flavor);
      document.documentElement.setAttribute("data-san-glazing", glazing);
      document.documentElement.dir = direction;
      if (accent) {
        document.documentElement.setAttribute("data-san-accent", accent);
      } else {
        document.documentElement.removeAttribute("data-san-accent");
      }

      document.body.style.background = `var(--san-${surface})`;
      document.body.style.color = "var(--san-text)";
      document.body.style.font = "var(--san-type-body-md)";

      return html`<div style="padding: var(--san-space-4);">${story()}</div>`;
    },
  ],
};

export default preview;
