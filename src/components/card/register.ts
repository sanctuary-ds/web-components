import { defineElement } from "../../internal/register.js";
import { SanCard } from "./san-card.js";

defineElement("san-card", SanCard);

declare global {
  interface HTMLElementTagNameMap {
    "san-card": SanCard;
  }
}
