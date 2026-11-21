import { defineElement } from "../../internal/register.js";
import { SanToggleButtonGroup } from "./san-toggle-button-group.js";

defineElement("san-toggle-button-group", SanToggleButtonGroup);

declare global {
  interface HTMLElementTagNameMap {
    "san-toggle-button-group": SanToggleButtonGroup;
  }
}
