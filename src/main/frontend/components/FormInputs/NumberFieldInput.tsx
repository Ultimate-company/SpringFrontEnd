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
                disabled={props.disabled == undefined ? false : props.disabled}
                helperText={props.helperText}
                label={props.label}
                onChange={props.onChange || (() => {})}
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

export default NumberFieldInput;