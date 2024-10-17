import { jsx } from "react/jsx-runtime";
import { Button } from "@hilla/react-components/Button";
import { Dialog } from "@hilla/react-components/Dialog";
import { Icon } from "@hilla/react-components/Icon";
import "@vaadin/vaadin-lumo-styles/vaadin-iconset.js";
function AutoCrudDialog(props) {
  const { children, opened, onClose } = props;
  return /* @__PURE__ */ jsx(
    Dialog,
    {
      overlayClass: "auto-crud-dialog",
      opened,
      headerTitle: "Edit item",
      headerRenderer: () => /* @__PURE__ */ jsx(Button, { theme: "tertiary", onClick: onClose, "aria-label": "Close", children: /* @__PURE__ */ jsx(Icon, { icon: "lumo:cross", style: { height: "var(--lumo-icon-size-l)", width: "var(--lumo-icon-size-l)" } }) }),
      children
    }
  );
}
export {
  AutoCrudDialog
};
//# sourceMappingURL=autocrud-dialog.js.map
