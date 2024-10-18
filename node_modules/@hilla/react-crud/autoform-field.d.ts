import { type Validator } from '@hilla/form';
import type { FieldDirectiveResult, UseFormResult } from '@hilla/react-form';
import type { CSSProperties, JSX } from 'react';
import type { PropertyInfo } from './model-info.js';
export type AutoFormFieldProps = Readonly<{
    propertyInfo: PropertyInfo;
    form: UseFormResult<any>;
    options: FieldOptions;
    disabled?: boolean;
}>;
type CustomFormFieldProps = FieldDirectiveResult & Readonly<{
    label?: string;
    disabled?: boolean;
}>;
export type FieldOptions = Readonly<{
    /**
     * The id to apply to the field.
     */
    id?: string;
    /**
     * The class names to add to the field.
     */
    className?: string;
    /**
     * The style to apply to the field.
     */
    style?: CSSProperties;
    /**
     * The label to show for the field. If not specified, a human-readable label
     * is generated from the property name.
     */
    label?: string;
    /**
     * The placeholder to when the field is empty.
     *
     * Note that some field types, such as checkbox, do not support a placeholder.
     */
    placeholder?: string;
    /**
     * The helper text to display below the field.
     *
     * Note that some field types, such as checkbox, do not support a helper text.
     */
    helperText?: string;
    /**
     * The number of columns to span. This value is passed to the underlying
     * FormLayout, unless a custom layout is used. In that case, the value is
     * ignored.
     */
    colspan?: number;
    /**
     * Whether the field should be disabled.
     */
    disabled?: boolean;
    /**
     * Whether the field should be readonly.
     */
    readonly?: boolean;
    /**
     * Allows to specify a custom renderer for the field, for example to render a
     * custom type of field or apply an additional layout around the field. The
     * renderer receives field props that must be applied to the custom field
     * component in order to connect it to the form.
     *
     * Example:
     * ```tsx
     * {
     *   renderer: ({ field }) => (
     *     <TextArea {...field} />
     *   )
     * }
     * ```
     */
    renderer?(props: {
        field: CustomFormFieldProps;
    }): JSX.Element;
    /**
     * Validators to apply to the field. The validators are added to the form
     * when the field is rendered.
     * UseMemo is recommended for the validators, so that they are not recreated
     * on every render.
     */
    validators?: Validator[];
}>;
export declare function AutoFormField(props: AutoFormFieldProps): JSX.Element | null;
export {};
//# sourceMappingURL=autoform-field.d.ts.map