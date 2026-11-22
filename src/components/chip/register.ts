import { defineElement } from "../../internal/register.js";
import { SanChip } from "./san-chip.js";

defineElement("san-chip", SanChip);

declare global {
  interface HTMLElementTagNameMap {
    "san-chip": SanChip;
  }
}
