import {FormControl, InputLabel, MenuItem, Select, TextField} from "@mui/material";
import { DataItem } from "Frontend/api/Models/CentralModels/Data";
import React from "react";

interface DropdownInputProps {
    maxLength?: number
    required: boolean;
    fullWidth: boolean;
    label: string;
    name: string;
    value?: string;
    onChange?: any;
    onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
    placeholder?: string;
    inputProps?: object;
    data?: DataItem[];
    helperText?: string;
    disabled?: boolean;
}

const Dropdown = (props: DropdownInputProps) => {
    return (
        <FormControl
            style={{marginTop:8}}
            variant="outlined"
            fullWidth>
            <InputLabel id={props.name + "_labelid"}>{props.label}{props.required ? " *" : ""}</InputLabel>
            <Select
                labelId={props.name + "_labelid"}
                margin="dense"
                variant="outlined"
                name={props.name}
                id={props.name}
                value={props.value?.toString()}
                label={props.label + (props.required ? " *" : "")}
                onChange={props.onChange}
                inputProps={{
                    maxLength: props.maxLength,
                    ...props.inputProps
                }}
            >
                {props.data && props.data.map(
                    option => {
                        return (
                            <MenuItem key={option.key} value={option.value}>
                                {option.title}
                            </MenuItem>
                        );
                    }
                )}
            </Select>
        </FormControl>
    )
}
export default Dropdown;