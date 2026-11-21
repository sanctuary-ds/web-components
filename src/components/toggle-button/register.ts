import { defineElement } from "../../internal/register.js";
import { SanToggleButton } from "./san-toggle-button.js";

defineElement("san-toggle-button", SanToggleButton);

declare global {
  interface HTMLElementTagNameMap {
    "san-toggle-button": SanToggleButton;
  }
}
