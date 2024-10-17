import {FormControl, TextField} from "@mui/material";
import React from "react";

export interface TextFieldInputProps {
    maxLength?: number
    required: boolean;
    fullWidth: boolean;
    label: string;
    name: string;
    value?: string;
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
    onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
    placeholder?: string;
    inputProps?: object;
    helperText?: string;
    inputRef?: React.RefObject<HTMLInputElement>;
    disabled?: boolean;
    onKeyPress?: React.KeyboardEventHandler<HTMLInputElement>;
    productIdQuantityMapping?: Map<number, number>;
    prefix?: string;
    thousandSeparator?: boolean;
}
const TextFieldInput = (props: TextFieldInputProps) => {
    return (
        <FormControl
            fullWidth
            variant="outlined">
            <TextField
                margin="dense"
                variant="outlined"
                name={props.name}
                id={props.name}
                {...(props.disabled && { disabled: true })}
                {...(props.value && { value: props.value })}
                {...(props.helperText && { label: props.helperText })}
                {...(props.label && { label: props.label })}
                {...(props.onChange && { onChange: props.onChange })}
                {...(props.onKeyDown && { onKeyDown: props.onKeyDown })}
                {...(props.placeholder && { placeholder: props.placeholder })}
                {...(props.required && { required: true })}
                {...(props.fullWidth && { fullWidth: true })}
                {...(props.inputRef && { inputRef: props.inputRef })}
                inputProps={{
                    maxLength: props.maxLength,
                    ...props.inputProps
                }}
                InputLabelProps={{ shrink: true }}
            />
        </FormControl>
    );
}

export default TextFieldInput;