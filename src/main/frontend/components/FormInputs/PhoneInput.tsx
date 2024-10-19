import {FormControl, TextField} from "@mui/material";
import React from "react";
import InputMask from "react-input-mask";
import {TextFieldInputProps} from "Frontend/components/FormInputs/TextFieldInput";

const PhoneInput = (props: TextFieldInputProps) => {
    return (
        <FormControl
            fullWidth
            variant="outlined">
            <InputMask
                mask="999-9999-999"
                {...(props.value && { value: props.value })}
                {...(props.onChange && { onChange: props.onChange })}
            >
                <TextField
                    margin="dense"
                    variant="outlined"
                    name={props.name}
                    id={props.name}
                    {...(props.disabled && { disabled: true })}
                    {...(props.helperText && { label: props.helperText })}
                    {...(props.label && { label: props.label })}
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
            </InputMask>
        </FormControl>
    );
}

export default PhoneInput;