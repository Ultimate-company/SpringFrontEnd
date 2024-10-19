import React from "react";
import TextFieldInput from "Frontend/components/FormInputs/TextFieldInput";
import DateInput from "Frontend/components/FormInputs/DateInput";
import {formatDate, formatPhoneNumber} from "Frontend/components/commonHelperFunctions";
import Dropdown from "Frontend/components/FormInputs/Dropdown";
import {DataItem} from "Frontend/api/Models/CentralModels/Data";
import PhoneInput from "Frontend/components/FormInputs/PhoneInput";
import RenderView from "Frontend/components/FormRenderer/RenderView";
import NumberFieldInput from "Frontend/components/FormInputs/NumberFieldInput";
import AmountFieldInput from "Frontend/components/FormInputs/AmountFieldInput";
import TextAreaInput from "Frontend/components/FormInputs/TextAreaInput";
import CheckboxInput from "Frontend/components/FormInputs/CheckboxInput";
import RichTextAreaInput from "Frontend/components/FormInputs/RichTextAreaInput";
import RadioInput from "Frontend/components/FormInputs/RadioInput";
import AutoCompleteDropdown from "Frontend/components/FormInputs/AutoCompleteDropdown";
import RatingInput from "Frontend/components/FormInputs/RatingInput";
import MultipleAutoCompleteDropdown from "Frontend/components/FormInputs/MultipleAutoCompleteDropdown";
import ColorPickerInput from "Frontend/components/FormInputs/ColorPickerInput";

export enum InputType {
    TextField,
    Dropdown,
    Radio,
    MultiSelectDropdown,
    Date,
    Checkbox,
    Phone,
    NumberField,
    AmountField,
    TextArea,
    RichTextArea,
    AutoCompleteDropdown,
    MultipleAutoCompleteDropdown,
    ColorPicker,
    Rating,
}

export interface InputProps {
    inputType: InputType;
    fullWidth?: boolean;
    required?: boolean;
    label: string;
    style?: any;
    data?: DataItem[];
    autoCompleteOptions?: any;
    name?: string;
    value?: string | Date | any;
    handleChange?: any;
    onInputChange?: any;
    disabled?: boolean;
    isView: boolean;
    inputRef?: any;
    checked?: boolean;
    rteRef?: any;
    prefix?: string;
    precision?: number;
    onCreated?: any;
    thousandSeparator?: boolean;
    displayColorPalet?: boolean;
}

const RenderInput = (inputProp: InputProps) => {
    switch (inputProp.inputType) {
        case InputType.Rating:
            // render text field component
            if(inputProp.isView){
                return (
                    <RenderView
                        label={inputProp.label}
                        value={inputProp.value}
                        required={inputProp.required ?? true}
                    />
                )
            }
            return (
                <RatingInput
                    value={inputProp.value}
                    precision={inputProp.precision ?? 0.1}
                    setValue={inputProp.handleChange}
                    label={inputProp.label}
                />
            );
        case InputType.TextField:
            // render text field component
            if(inputProp.isView){
                return (
                    <RenderView
                        label={inputProp.label}
                        value={inputProp.value?.toString()}
                        required={inputProp.required ?? true}
                    />
                )
            }
            return (
                <TextFieldInput
                    disabled={inputProp.disabled ?? false}
                    inputRef={inputProp.inputRef}
                    required={inputProp.required ?? true}
                    fullWidth={inputProp.fullWidth ?? true}
                    label={inputProp.label}
                    name={inputProp.name as string}
                    value={inputProp.value as string}
                    onChange={inputProp.handleChange}
                />
            );
        case InputType.Date:
            // render date component
            if(inputProp.isView){
                return (
                    <RenderView
                        label={inputProp.label}
                        value={inputProp.value ? new Date(inputProp.value) : ""}
                        required={inputProp.required ?? true}
                    />
                )
            }
            return (
                <DateInput
                    inputRef={inputProp.inputRef}
                    disabled={inputProp.disabled ?? false}
                    required={inputProp.required ?? true}
                    fullWidth={inputProp.fullWidth ?? true}
                    label={inputProp.label}
                    name={inputProp.name as string}
                    value={formatDate(inputProp.value as string, "yyyy/mm/dd")}
                    onChange={inputProp.handleChange}
                />
            );
        case InputType.Phone:
            // render phone component
            if(inputProp.isView){
                return (
                    <RenderView
                        label={inputProp.label}
                        value={formatPhoneNumber(inputProp.value as string)}
                        required={inputProp.required ?? true}
                    />
                )
            }
            return (
                <PhoneInput
                    disabled={inputProp.disabled ?? false}
                    inputRef={inputProp.inputRef}
                    required={inputProp.required ?? true}
                    fullWidth={inputProp.fullWidth ?? true}
                    label={inputProp.label}
                    name={inputProp.name as string}
                    value={inputProp.value as string}
                    onChange={inputProp.handleChange}
                />
            );
        case InputType.Dropdown:
            // render dropdown component
            if(inputProp.isView){
                return (
                    <RenderView
                        label={inputProp.label}
                        value={inputProp.data?.find(data => data.value === inputProp.value?.toString())?.key}
                        required={inputProp.required ?? true}
                    />
                )
            }
            return (
                <Dropdown
                    disabled={inputProp.disabled ?? false}
                    required={inputProp.required ?? true}
                    fullWidth={inputProp.fullWidth ?? true}
                    label={inputProp.label}
                    name={inputProp.name as string}
                    value={inputProp.value as string}
                    onChange={inputProp.handleChange}
                    data={inputProp.data}
                />
            );
        case InputType.NumberField:
            // render number field  component
            if(inputProp.isView){
                return (
                    <RenderView
                        label={inputProp.label}
                        value={inputProp.value}
                        required={inputProp.required ?? true}
                    />
                )
            }
            return (
                <NumberFieldInput
                    inputRef={inputProp.inputRef}
                    disabled={inputProp.disabled ?? false}
                    required={inputProp.required ?? true}
                    fullWidth={inputProp.fullWidth ?? true}
                    label={inputProp.label}
                    name={inputProp.name as string}
                    value={inputProp.value as string}
                    onChange={inputProp.handleChange}
                />
            );
        case InputType.AmountField:
            // render number field  component
            if(inputProp.isView){
                return (
                    <RenderView
                        label={inputProp.label}
                        value={inputProp.prefix != "" && inputProp.prefix != null ?
                            inputProp.prefix + " " + inputProp.value.toString() :
                            "₹ " + inputProp.value.toString()}
                        required={inputProp.required ?? true}
                    />
                )
            }
            return (
                <AmountFieldInput
                    inputRef={inputProp.inputRef}
                    disabled={inputProp.disabled ?? false}
                    required={inputProp.required ?? true}
                    fullWidth={inputProp.fullWidth ?? true}
                    label={inputProp.label}
                    name={inputProp.name as string}
                    value={inputProp.value as string}
                    onChange={inputProp.handleChange}
                    prefix={inputProp.prefix}
                    thousandSeparator={inputProp.thousandSeparator}
                />
            );
        case InputType.TextArea:
            // render number field  component
            if(inputProp.isView){
                return (
                    <RenderView
                        label={inputProp.label}
                        value={inputProp.value}
                        required={inputProp.required ?? true}
                    />
                )
            }
            return (
                <TextAreaInput
                    inputRef={inputProp.inputRef}
                    disabled={inputProp.disabled ?? false}
                    required={inputProp.required ?? true}
                    fullWidth={inputProp.fullWidth ?? true}
                    label={inputProp.label}
                    name={inputProp.name as string}
                    value={inputProp.value as string}
                    onChange={inputProp.handleChange}
                />
            );
        case InputType.Checkbox:
            // render checkbox input field  component
            if(inputProp.isView){
                return (
                    <RenderView
                        label={inputProp.label}
                        value={inputProp.checked !== undefined ? (inputProp.checked ? "Yes" : "No") : "No"}
                        required={inputProp.required ?? true}
                    />
                )
            }
            return (
                <CheckboxInput
                    disabled={inputProp.disabled ?? false}
                    onChange={inputProp.handleChange}
                    checked={inputProp.checked ?? false}
                    label={inputProp.label}
                />
            );
        case InputType.RichTextArea:
            // render RichTextArea input field  component
            if(inputProp.isView){
                return (
                    <RenderView
                        label={inputProp.label}
                        value={inputProp.value}
                        required={inputProp.required ?? true}
                        richText={true}
                    />
                )
            }
            return (
                <RichTextAreaInput
                    rteRef = {inputProp.rteRef}
                    label={inputProp.label}
                    onCreated={inputProp.onCreated}
                    name={inputProp.name ?? inputProp.label}
                />
            );

        case InputType.Radio:
            // render checkbox input field  component
            if(inputProp.isView){
                return (
                    <RenderView
                        label={inputProp.label}
                        value={inputProp.checked !== undefined ? (inputProp.checked ? "Yes" : "No") : "No"}
                        required={inputProp.required ?? true}
                    />
                )
            }
            return (
                <RadioInput
                    disabled={inputProp.disabled ?? false}
                    onChange={inputProp.handleChange}
                    checked={inputProp.checked ?? false}
                    label={inputProp.label}
                    data={inputProp.data}
                    value={inputProp.value}
                />
            );
        case InputType.AutoCompleteDropdown:
            if(inputProp.isView) {
                return (
                    <RenderView
                        label={inputProp.label}
                        value={"ColorLabel: " + inputProp.value.label + " Color Hash: " + inputProp.value.id} // change this if this input is used anywhere else except color
                        required={inputProp.required ?? true}
                    />
                );
            }
            else {
                return(
                    <AutoCompleteDropdown
                        labelValue={inputProp.value.label}
                        idValue={inputProp.value.id}
                        required={inputProp.required ?? true}
                        fullWidth={inputProp.fullWidth ?? true}
                        label={inputProp.label}
                        options={inputProp.autoCompleteOptions}
                        onChange={inputProp.handleChange}
                        onInputChange={inputProp.onInputChange}
                        displayColorPalet={inputProp.required ?? true}
                    />
                );
            }

        case InputType.MultipleAutoCompleteDropdown:
            if(inputProp.isView) {
                return (
                    <RenderView
                        label={inputProp.label}
                        value={inputProp.value}
                        required={inputProp.required ?? true}
                    />
                );
            }
            else {
                return(
                    <MultipleAutoCompleteDropdown
                        required={inputProp.required ?? true}
                        fullWidth={inputProp.required ?? true}
                        label={inputProp.label}
                        value={inputProp.value}
                        onChange={inputProp.handleChange}
                        onInputChange={inputProp.onInputChange}
                        options={inputProp.autoCompleteOptions}
                    />
                );
            }
        case InputType.ColorPicker:
            if(inputProp.isView) {
                return (
                    <RenderView
                        label={inputProp.label}
                        value={inputProp.value}
                        required={inputProp.required ?? true}
                    />
                );
            }
            else {
                return(
                    <ColorPickerInput
                        value={inputProp.value}
                        handleChange={inputProp.handleChange}
                        required={inputProp.required ?? true}
                        label={inputProp.label}
                    />
                );
            }
        case InputType.MultiSelectDropdown:
            // render multi select dropdown component
            return (<div></div>);
        default:
            throw new Error(`Unknown input type: ${inputProp.inputType}`);
    }
};

export default React.memo(RenderInput);