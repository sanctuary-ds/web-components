const INTERNAL_STATIC_MEMBERS = new Set([
  "styles",
  "shadowRootOptions",
  "formAssociated",
  "properties",
  "observedAttributes",
]);

const INTERNAL_LIFECYCLE_METHODS = new Set([
  "formAssociatedCallback",
  "formDisabledCallback",
  "formResetCallback",
  "formStateRestoreCallback",
]);

/**
 * Removes private, protected, and Lit/FACE internal static or lifecycle members
 * from the generated Custom Elements Manifest so Storybook controls and IDE
 * autocompletion only expose the public component API.
 */
function stripInternalMembersPlugin() {
  return {
    name: "strip-internal-members",
    packageLinkPhase({ customElementsManifest }) {
      for (const mod of customElementsManifest.modules ?? []) {
        for (const decl of mod.declarations ?? []) {
          if (!Array.isArray(decl.members)) {
            continue;
          }

          decl.members = decl.members.filter((member) => {
            if (member.privacy === "private" || member.privacy === "protected") {
              return false;
            }
            if (member.name?.startsWith("#")) {
              return false;
            }
            if (member.static && INTERNAL_STATIC_MEMBERS.has(member.name)) {
              return false;
            }
            if (member.kind === "method" && INTERNAL_LIFECYCLE_METHODS.has(member.name)) {
              return false;
            }
            return true;
          });
        }
      }
    },
  };
}

export default {
  globs: ["src/**/*.ts"],
  exclude: ["src/**/*.test.ts", "src/**/*.stories.ts"],
  outdir: ".",
  litelement: true,
  packagejson: true,
  plugins: [stripInternalMembersPlugin()],
};
