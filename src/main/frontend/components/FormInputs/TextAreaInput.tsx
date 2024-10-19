import {FormControl, TextField} from "@mui/material";
import React from "react";
import { TextFieldInputProps } from "./TextFieldInput";

const TextAreaInput = (props: TextFieldInputProps) => {
    return (
        <FormControl
            fullWidth
            variant="outlined">
            <TextField
                margin="dense"
                variant="outlined"
                multiline
                rows={6}
                maxRows={500}
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

export default TextAreaInput;