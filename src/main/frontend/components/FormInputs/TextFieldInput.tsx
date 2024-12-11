import {FormControl, TextField} from "@mui/material";
import React from "react";

export interface TextFieldInputProps {
    maxLength?: number
    required: boolean;
    fullWidth: boolean;
    label: string;
    name: string;
    value?: string;
    setValue?: (value: string) => void;
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
                disabled={props.disabled ?? false}
                value={props.value ?? "" }
                helperText={props.helperText}
                label={props.label}
                placeholder={props.placeholder || ""}
                required={props.required || false}
                fullWidth={props.fullWidth || false}
                inputRef={props.inputRef}
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