function __REGISTER__(feature) {
  window.Vaadin ??= {};
  window.Vaadin.registrations ??= [];
  window.Vaadin.registrations.push({
    is: feature ? `${"@hilla/react-crud"}/${feature}` : "@hilla/react-crud",
    version: "2.5.5"
  });
}
export * from "./autogrid-feature.js";
export * from "./autoform-feature.js";
export * from "./autocrud-feature.js";
__REGISTER__();
//# sourceMappingURL=index.js.map
