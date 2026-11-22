import { defineElement } from "../../internal/register.js";
import { SanBadge } from "./san-badge.js";

defineElement("san-badge", SanBadge);

declare global {
  interface HTMLElementTagNameMap {
    "san-badge": SanBadge;
  }
}
