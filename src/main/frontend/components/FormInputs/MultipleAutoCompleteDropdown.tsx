import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import {DataItem} from "Frontend/api/Models/CentralModels/Data";

export interface MultipleAutoCompleteProps {
    required: boolean;
    label: string;
    values: string[];
    onChange?: (
        event: React.SyntheticEvent<Element, Event>,
        value: string[],
        reason: string
    ) => void;
    disabled?: boolean;
    options: DataItem[]
    multipleSelect: boolean
}

export default function MultipleAutoCompleteDropdown(props: MultipleAutoCompleteProps) {
    function handleChange(
        event: React.SyntheticEvent<Element, Event>,
        value: DataItem | DataItem[] | null, // Allow both single and multiple selection
        reason: string
    ) {
        // If multiple selection, convert to string[]
        if (Array.isArray(value)) {
            const selectedValues = value.map((item) => `${item.group}:${item.key}`);
            if (props.onChange) {
                props.onChange(event, selectedValues, reason);
            }
        } else if (value) { // If single selection, convert to string[]
            const selectedValue = `${value.group}:${value.key}`;
            if (props.onChange) {
                props.onChange(event, [selectedValue], reason);
            }
        }
    }

    if(props.options && props.options.length > 0) {
        if(props.multipleSelect) {
            let selectedItems: DataItem[] = [];
            if(props.values && props.values.length > 0) {
                let selectedIndexes = props.options
                    .map((option, index) => props.values.includes(option.group ?? "" + ":" + option.key) ? index : -1)
                    .filter(index => index !== -1); // Filter out the -1 values
                selectedItems = selectedIndexes.map(idx => props.options[idx]);
            }
            return (
                <Autocomplete
                    multiple
                    options={props.options}
                    value={selectedItems}
                    onChange={handleChange}
                    groupBy={(option) => option.group ?? ""}
                    getOptionLabel={(option) => option.value}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            inputProps={{
                                ...params.inputProps,
                                autoComplete: "new-password", // disable autocomplete and autofill
                            }}
                            margin="dense"
                            label={props.label || ""}
                            required={props.required || false}
                            InputLabelProps={{ shrink: true }}
                        />
                    )}
                />
            );
        }
        else {
            let selectedIndex = -1;
            if(props.values !== undefined
                && props.values !== null
                && props.values.length > 0) {
                selectedIndex = props.options.findIndex(item => `${item.group}:${item.key}` === props.values[0]);
            }

            return (
                <Autocomplete
                    options={props.options}
                    onChange={handleChange}
                    value={selectedIndex != -1 ? props.options[selectedIndex] : undefined}
                    groupBy={(option) => option.group ?? ""}
                    getOptionLabel={(option) => option.value}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            inputProps={{
                                ...params.inputProps,
                                autoComplete: "new-password", // disable autocomplete and autofill
                            }}
                            margin="dense"
                            label={props.label || ""}
                            required={props.required || false}
                            InputLabelProps={{ shrink: true }}
                        />
                    )}
                />
            );
        }

    }
    else{
        return <></>;
    }
}