import { jsx } from "react/jsx-runtime";
import { _enum } from "@hilla/form";
import { Checkbox } from "@hilla/react-components/Checkbox.js";
import { DatePicker } from "@hilla/react-components/DatePicker.js";
import { DateTimePicker } from "@hilla/react-components/DateTimePicker.js";
import { IntegerField } from "@hilla/react-components/IntegerField.js";
import { NumberField } from "@hilla/react-components/NumberField.js";
import { Select } from "@hilla/react-components/Select.js";
import { TextArea } from "@hilla/react-components/TextArea.js";
import { TextField } from "@hilla/react-components/TextField.js";
import { TimePicker } from "@hilla/react-components/TimePicker.js";
import { useFormPart } from "@hilla/react-form";
import { useEffect, useMemo } from "react";
import { useDatePickerI18n, useDateTimePickerI18n } from "./locale.js";
import { convertToTitleCase } from "./util.js";
function getPropertyModel(form, propertyInfo) {
  const pathParts = propertyInfo.name.split(".");
  return pathParts.reduce((model, property) => model ? model[property] : void 0, form.model);
}
function AutoFormTextField({ field, fieldProps }) {
  return /* @__PURE__ */ jsx(TextField, { ...field, ...fieldProps });
}
function AutoFormIntegerField({ field, fieldProps }) {
  return /* @__PURE__ */ jsx(IntegerField, { ...field, ...fieldProps });
}
function AutoFormDecimalField({ field, fieldProps }) {
  return /* @__PURE__ */ jsx(NumberField, { ...field, ...fieldProps });
}
function AutoFormDateField({ field, fieldProps }) {
  const i18n = useDatePickerI18n();
  return /* @__PURE__ */ jsx(DatePicker, { i18n, ...field, ...fieldProps });
}
function AutoFormTimeField({ field, fieldProps }) {
  return /* @__PURE__ */ jsx(TimePicker, { ...field, ...fieldProps });
}
function AutoFormDateTimeField({ field, fieldProps }) {
  const i18n = useDateTimePickerI18n();
  return /* @__PURE__ */ jsx(DateTimePicker, { i18n, ...field, ...fieldProps });
}
function AutoFormEnumField({ model, field, fieldProps }) {
  const enumModel = model;
  const options = Object.keys(enumModel[_enum]).map((value) => ({
    label: convertToTitleCase(value),
    value
  }));
  return /* @__PURE__ */ jsx(Select, { ...field, ...fieldProps, items: options });
}
function AutoFormBooleanField({ field, fieldProps }) {
  return /* @__PURE__ */ jsx(Checkbox, { ...field, ...fieldProps });
}
function AutoFormObjectField({ model, fieldProps }) {
  const part = useFormPart(model);
  const jsonString = part.value ? JSON.stringify(part.value) : "";
  return /* @__PURE__ */ jsx(TextArea, { ...fieldProps, value: jsonString, readonly: true });
}
function AutoFormField(props) {
  const { form, propertyInfo, options } = props;
  const label = options.label ?? propertyInfo.humanReadableName;
  const model = getPropertyModel(form, propertyInfo);
  const field = form.field(model);
  const formPart = useFormPart(model);
  const defaultValidators = useMemo(() => formPart.validators, []);
  const { validators } = options;
  useEffect(() => {
    formPart.setValidators([...defaultValidators, ...validators ?? []]);
  }, [validators]);
  if (options.renderer) {
    const customFieldProps = { ...field, disabled: props.disabled, label };
    return options.renderer({ field: customFieldProps });
  }
  const fieldProps = {
    id: options.id,
    className: options.className,
    style: options.style,
    label,
    placeholder: options.placeholder,
    helperText: options.helperText,
    colspan: options.colspan,
    disabled: options.disabled ?? props.disabled,
    readonly: options.readonly
  };
  switch (props.propertyInfo.type) {
    case "string":
      return /* @__PURE__ */ jsx(AutoFormTextField, { model, field, fieldProps });
    case "integer":
      return /* @__PURE__ */ jsx(AutoFormIntegerField, { model, field, fieldProps });
    case "decimal":
      return /* @__PURE__ */ jsx(AutoFormDecimalField, { model, field, fieldProps });
    case "date":
      return /* @__PURE__ */ jsx(AutoFormDateField, { model, field, fieldProps });
    case "time":
      return /* @__PURE__ */ jsx(AutoFormTimeField, { model, field, fieldProps });
    case "datetime":
      return /* @__PURE__ */ jsx(AutoFormDateTimeField, { model, field, fieldProps });
    case "enum":
      return /* @__PURE__ */ jsx(AutoFormEnumField, { model, field, fieldProps });
    case "boolean":
      return /* @__PURE__ */ jsx(AutoFormBooleanField, { model, field, fieldProps });
    case "object":
      return /* @__PURE__ */ jsx(AutoFormObjectField, { model, field, fieldProps });
    default:
      return null;
  }
}
export {
  AutoFormField
};
//# sourceMappingURL=autoform-field.js.map
