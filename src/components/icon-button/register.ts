import { defineElement } from "../../internal/register.js";
import { SanIconButton } from "./san-icon-button.js";

defineElement("san-icon-button", SanIconButton);

declare global {
  interface HTMLElementTagNameMap {
    "san-icon-button": SanIconButton;
  }
}
