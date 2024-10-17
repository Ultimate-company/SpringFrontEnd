function __REGISTER__(feature) {
  window.Vaadin ??= {};
  window.Vaadin.registrations ??= [];
  window.Vaadin.registrations.push({
    is: feature ? `${"@hilla/react-crud"}/${feature}` : "@hilla/react-crud",
    version: "2.5.5"
  });
}
import { jsx } from "react/jsx-runtime";
import React, { forwardRef } from "react";
function convertToTitleCase(inputString) {
  const stringWithSpaces = inputString.replace(/_/gu, " ");
  const words = stringWithSpaces.split(" ");
  const titleCaseWords = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
  return titleCaseWords.join(" ");
}
function registerStylesheet(stylesheet) {
  const css = Array.from(stylesheet.cssRules).map((rule) => rule.cssText).join("\n");
  const styleTag = document.createElement("style");
  styleTag.textContent = css;
  document.head.prepend(styleTag);
}
const registeredFeatures = /* @__PURE__ */ new Set();
function useFeatureRegistration(feature) {
  if (registeredFeatures.has(feature)) {
    return;
  }
  registeredFeatures.add(feature);
  __REGISTER__(feature);
}
function featureRegistration(Component, feature) {
  return forwardRef((props, ref) => {
    useFeatureRegistration(feature);
    return /* @__PURE__ */ jsx(Component, { ...props, ref });
  });
}
export {
  convertToTitleCase,
  featureRegistration,
  registerStylesheet
};
//# sourceMappingURL=util.js.map
