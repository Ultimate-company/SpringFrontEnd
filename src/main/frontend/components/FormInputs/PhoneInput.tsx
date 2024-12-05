import { FormControl, TextField } from "@mui/material";
import React, { useState } from "react";
import { TextFieldInputProps } from "Frontend/components/FormInputs/TextFieldInput";

const maskPhoneNumber = (value: string) => {
    // Remove all non-numeric characters
    const cleanedValue = value.replace(/\D/g, "").slice(0, 10);

    // Apply masking pattern (e.g., (123) 456-7890)
    const match = cleanedValue.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
    if (match) {
        return (!match[2] ? match[1] : `(${match[1]}) ${match[2]}`) + (match[3] ? `-${match[3]}` : "");
    }
    return cleanedValue;
};

const PhoneInput = (props: TextFieldInputProps) => {
    const [value, setValue] = useState("");

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = event.target.value.replace("+91 ", "");
        let number = maskPhoneNumber(rawValue);
        setValue(number);

        let cleanPhoneNumber = number.replace(/\D/g, '');
        if(props.setValue) {
            props.setValue(cleanPhoneNumber);
        }
    };

    return (
        <FormControl fullWidth variant="outlined">
            <TextField
                margin="dense"
                variant="outlined"
                name={props.name || ""}
                id={props.name || ""}
                helperText={props.helperText}
                label={props.label}
                placeholder={props.placeholder || ""}
                required={props.required || false}
                fullWidth={props.fullWidth || false}
                inputRef={props.inputRef}
                inputProps={{
                    maxLength: 18, // Length of the complete formatted phone number including spaces, parentheses, and hyphen
                    ...props.inputProps,
                }}
                InputLabelProps={{ shrink: true }}
                value={`+91 ${value}`}
                onChange={handleChange}
            />
        </FormControl>
    );
};

export default PhoneInput;