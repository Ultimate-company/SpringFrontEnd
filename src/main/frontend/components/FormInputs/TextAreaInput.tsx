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
                disabled={props.disabled || false}
                value={props.value || ""}
                label={props.helperText || props.label || ""}
                onChange={props.onChange || (() => {})}
                onKeyDown={props.onKeyDown || (() => {})}
                placeholder={props.placeholder || ""}
                required={props.required || false}
                fullWidth={props.fullWidth || false}
                inputRef={props.inputRef || null}
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