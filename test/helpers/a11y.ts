import axe, { type ElementContext, type RunOptions } from "axe-core";
import { expect } from "vitest";

/**
 * Runs axe-core accessibility checks against a real DOM element (including
 * open Shadow DOM trees) and fails with a concise summary on any violation.
 */
export async function expectAccessible(
  target: ElementContext,
  options?: RunOptions,
): Promise<void> {
  const results = options ? await axe.run(target, options) : await axe.run(target);

  const summary = results.violations.map((violation) => ({
    id: violation.id,
    impact: violation.impact,
    help: violation.help,
    nodes: violation.nodes.map((node) => node.html),
  }));

  expect(summary, "Expected zero axe-core accessibility violations").toEqual([]);
}
