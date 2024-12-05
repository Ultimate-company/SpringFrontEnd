import {FormControl, TextField} from "@mui/material";
import React from "react";
import { NumericFormat, NumericFormatProps } from 'react-number-format';
import {TextFieldInputProps} from "Frontend/components/FormInputs/TextFieldInput";

interface CustomProps {
    onChange: (event: { target: { name: string; value: string } }) => void;
    name: string;
    prefix: string;
    thousandSeparator: boolean;
}

const NumericFormatCustom = React.forwardRef<NumericFormatProps, CustomProps>(
    function NumericFormatCustom(props, ref) {
        const { onChange, prefix, thousandSeparator, ...other } = props;
        return (
            <NumericFormat
                {...other}
                getInputRef={ref}
                onValueChange={(values) => {
                    onChange({
                        target: {
                            name: props.name,
                            value: values.value,
                        },
                    });
                }}
                thousandSeparator = {thousandSeparator}
                valueIsNumericString
                prefix={prefix}
            />
        );
    },
);


const AmountFieldInput = (props: TextFieldInputProps) => {
    return (
        <FormControl
            fullWidth
            variant="outlined">
            <TextField
                margin="dense"
                variant="outlined"
                name={props.name}
                id={props.name}
                disabled={props.disabled == undefined ? false : props.disabled}
                helperText={props.helperText}
                label={props.label}
                onChange={props.onChange || (() => {})}
                placeholder={props.placeholder || ""}
                required={props.required || false}
                fullWidth={props.fullWidth || false}
                inputRef={props.inputRef}
                InputProps={{
                    inputComponent: NumericFormatCustom as any,
                    inputProps: {
                        prefix: props.prefix ? props.prefix + " " : "₹ ",
                        thousandSeparator: props.thousandSeparator ?? true
                    }
                }}
                InputLabelProps={{ shrink: true }}
            />
        </FormControl>
    );
}

export default AmountFieldInput;