import { defineElement } from "../../internal/register.js";
import { SanButton } from "./san-button.js";

defineElement("san-button", SanButton);

declare global {
  interface HTMLElementTagNameMap {
    "san-button": SanButton;
  }
}
