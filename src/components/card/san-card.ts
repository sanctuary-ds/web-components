import { type CSSResultGroup, html, type PropertyDeclarations, type PropertyValues } from "lit";
import { SanctuaryElement } from "../../internal/sanctuary-element.js";
import { resetStyles } from "../../styles/reset.js";
import { cardStyles } from "./san-card.styles.js";

/** Surface hierarchy variant of `<san-card>`. */
export type CardVariant = "outlined" | "elevated" | "filled";

/** Internal content padding scale of `<san-card>`. */
export type CardPadding = "none" | "sm" | "md" | "lg";

/** Responsive arrangement of media and content regions in `<san-card>`. */
export type CardLayout = "vertical" | "horizontal" | "auto";

function hasSlotNodesContent(nodes: readonly Node[]): boolean {
  return nodes.some((node) => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      return true;
    }
    return node.nodeType === Node.TEXT_NODE && (node.textContent?.trim().length ?? 0) > 0;
  });
}

function getLightDomSlotNodes(host: HTMLElement): {
  media: Node[];
  header: Node[];
  body: Node[];
  footer: Node[];
} {
  const media: Node[] = [];
  const header: Node[] = [];
  const body: Node[] = [];
  const footer: Node[] = [];

  for (const node of Array.from(host.childNodes)) {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const slotName = (node as Element).getAttribute("slot");
      if (slotName === "media") {
        media.push(node);
      } else if (slotName === "header") {
        header.push(node);
      } else if (slotName === "footer") {
        footer.push(node);
      } else if (!slotName) {
        body.push(node);
      }
    } else {
      body.push(node);
    }
  }

  return { media, header, body, footer };
}

/**
 * Structured surface container built on Sanctuary surface tiers, container
 * queries, and semantic `<article>` landmarks without trapping nested controls.
 *
 * @tagname san-card
 * @summary Surface container with auto-collapsing media, header, body, and footer regions and container-query responsive layout.
 *
 * @slot - Main body content region.
 * @slot media - Full-bleed media region (`<img>`, `<picture>`, `<video>`, `<svg>`); sets `:state(has-media)`.
 * @slot header - Header region for titles, eyebrows, and header actions.
 * @slot footer - Footer region for actions and metadata, separated by a `--san-lead-soft` divider when header or body content is present.
 *
 * @csspart base - Root `<article>` container.
 * @csspart media - Full-bleed container wrapping the `media` slot.
 * @csspart header - Semantic `<header>` wrapping the `header` slot.
 * @csspart body - Container wrapping the default body slot.
 * @csspart footer - Semantic `<footer>` wrapping the `footer` slot.
 *
 * @cssprop [--san-card-bg] - Override surface background color.
 * @cssprop [--san-card-fg=var(--san-text)] - Override foreground text color.
 * @cssprop [--san-card-border] - Override border color.
 * @cssprop [--san-card-border-hover] - Override hover border color when `interactive` is set.
 * @cssprop [--san-card-radius=var(--san-radius-lg)] - Outer border radius of the card.
 * @cssprop [--san-card-padding=var(--san-space-5)] - Content region padding (`0` on `none`, `--san-space-3` on `sm`, `--san-space-6` on `lg`).
 * @cssprop [--san-card-gap=var(--san-space-3)] - Vertical spacing between header, body, and footer regions.
 * @cssprop [--san-card-shadow] - Override resting or hover elevation shadow.
 * @cssprop [--san-card-media-size=14rem] - Inline size of the media column in `horizontal` and wide `auto` layouts.
 */
export class SanCard extends SanctuaryElement {
  static override styles: CSSResultGroup = [resetStyles, cardStyles];

  static override properties: PropertyDeclarations = {
    variant: { type: String, reflect: true },
    padding: { type: String, reflect: true },
    layout: { type: String, reflect: true },
    interactive: { type: Boolean, reflect: true },
    selected: { type: Boolean, reflect: true },
  };

  /** Visual surface treatment of the card (`"outlined"`, `"elevated"`, or `"filled"`). */
  declare variant: CardVariant;

  /** Internal content padding preset (`"none"`, `"sm"`, `"md"`, or `"lg"`). */
  declare padding: CardPadding;

  /** Arrangement of media and content (`"vertical"`, `"horizontal"`, or container-responsive `"auto"`). */
  declare layout: CardLayout;

  /** Enables hover elevation/border emphasis and `:focus-within` focus highlight. */
  declare interactive: boolean;

  /** Highlights the card as selected via `:state(selected)` without changing layout dimensions. */
  declare selected: boolean;

  #hasMedia = false;
  #hasHeader = false;
  #hasBody = false;
  #hasFooter = false;

  constructor() {
    super();
    this.variant = "outlined";
    this.padding = "md";
    this.layout = "vertical";
    this.interactive = false;
    this.selected = false;
  }

  protected override willUpdate(changedProperties: PropertyValues<this>): void {
    if (!this.hasUpdated) {
      const nodes = getLightDomSlotNodes(this);
      this.#hasMedia = hasSlotNodesContent(nodes.media);
      this.#hasHeader = hasSlotNodesContent(nodes.header);
      this.#hasBody = hasSlotNodesContent(nodes.body);
      this.#hasFooter = hasSlotNodesContent(nodes.footer);
      this.setCustomState("has-media", this.#hasMedia);
    }

    if (!this.hasUpdated || changedProperties.has("selected")) {
      this.setCustomState("selected", Boolean(this.selected));
    }
  }

  readonly #handleMediaSlotChange = (event: Event): void => {
    const slot = event.currentTarget as HTMLSlotElement;
    const next = hasSlotNodesContent(slot.assignedNodes({ flatten: true }));
    if (next !== this.#hasMedia) {
      this.#hasMedia = next;
      this.setCustomState("has-media", next);
      this.requestUpdate();
    }
  };

  readonly #handleHeaderSlotChange = (event: Event): void => {
    const slot = event.currentTarget as HTMLSlotElement;
    const next = hasSlotNodesContent(slot.assignedNodes({ flatten: true }));
    if (next !== this.#hasHeader) {
      this.#hasHeader = next;
      this.requestUpdate();
    }
  };

  readonly #handleBodySlotChange = (event: Event): void => {
    const slot = event.currentTarget as HTMLSlotElement;
    const next = hasSlotNodesContent(slot.assignedNodes({ flatten: true }));
    if (next !== this.#hasBody) {
      this.#hasBody = next;
      this.requestUpdate();
    }
  };

  readonly #handleFooterSlotChange = (event: Event): void => {
    const slot = event.currentTarget as HTMLSlotElement;
    const next = hasSlotNodesContent(slot.assignedNodes({ flatten: true }));
    if (next !== this.#hasFooter) {
      this.#hasFooter = next;
      this.requestUpdate();
    }
  };

  protected override render() {
    return html`
      <article part="base" class="card">
        <div part="media" class="media" ?hidden=${!this.#hasMedia}>
          <slot name="media" @slotchange=${this.#handleMediaSlotChange}></slot>
        </div>
        <header part="header" class="header" ?hidden=${!this.#hasHeader}>
          <slot name="header" @slotchange=${this.#handleHeaderSlotChange}></slot>
        </header>
        <div part="body" class="body" ?hidden=${!this.#hasBody}>
          <slot @slotchange=${this.#handleBodySlotChange}></slot>
        </div>
        <footer part="footer" class="footer" ?hidden=${!this.#hasFooter}>
          <slot name="footer" @slotchange=${this.#handleFooterSlotChange}></slot>
        </footer>
      </article>
    `;
  }
}
