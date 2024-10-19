import {FormControl, TextField} from "@mui/material";
import React from "react";
import {TextFieldInputProps} from "Frontend/components/FormInputs/TextFieldInput";

const NumberFieldInput = (props: TextFieldInputProps) => {
    let value = props.value;
    if(props.productIdQuantityMapping) {
        const productId = parseInt(props.name.split('_')[1], 10);
        value = props.productIdQuantityMapping.get(productId)?.toString() || '';
    }

    return (
        <FormControl
            fullWidth
            variant="outlined">
            <TextField
                type="number"
                margin="dense"
                variant="outlined"
                name={props.name}
                id={props.name}
                value={value}
                {...(props.disabled && { disabled: true })}
                {...(props.helperText && { label: props.helperText })}
                {...(props.label && { label: props.label })}
                {...(props.onChange && { onChange: props.onChange })}
                {...(props.onKeyPress && { onKeyPress: props.onKeyPress })}
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

export default NumberFieldInput;