import { Autocomplete, Box, FormControl, TextField } from "@mui/material";
import React from "react";

export interface MultipleAutoCompleteProps {
    required: boolean;
    fullWidth: boolean;
    label: string;
    value?: { id: string; label: string; }[];
    onChange?: (
        event: React.SyntheticEvent<Element, Event>,
        value: { id: string; label: string; }[],
        reason: string
    ) => void;
    disabled?: boolean;
    options: {
        group?: string;
        items: { id: string; label: string; }[]
    }[];
    onInputChange?: (
        event: React.SyntheticEvent<Element, Event>,
        value: string,
        reason: string
    ) => void;
}

const MultipleAutoCompleteDropdown = (props: MultipleAutoCompleteProps) => {
    const groupedOptions = props.options.some(option => option.group !== undefined);

    return (
        <FormControl
            fullWidth
            variant="outlined"
        >
            <Autocomplete
                multiple
                value={props.value || []}
                onChange={(event, newValue, reason) => {
                    // Prevent duplicates
                    const uniqueValue = newValue.filter((option, index, self) =>
                        index === self.findIndex((t) => t.id === option.id)
                    );

                    if (props.onChange) {
                        props.onChange(event, uniqueValue, reason);
                    }
                }}
                onInputChange={(event, value, reason) => {
                    if (props.onInputChange) {
                        props.onInputChange(event, value, reason);
                    }
                }}
                options={props.options.flatMap(group => group.items)}
                groupBy={groupedOptions ? (option) => props.options.find(group => group.items.includes(option))?.group || "" : undefined}
                getOptionLabel={(option) => option.label ?? ""}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        inputProps={{
                            ...params.inputProps,
                            autoComplete: "new-password", // disable autocomplete and autofill
                        }}
                        margin="dense"
                        {...(props.label && { label: props.label })}
                        {...(props.required && { required: true })}
                        InputLabelProps={{ shrink: true }}
                    />
                )}
                renderOption={(optionProps, option) => (
                    <Box
                        component="li"
                        sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                        {...optionProps}
                    >
                        {option.label}
                    </Box>
                )}
                isOptionEqualToValue={(option, value) => option.id === value.id} // Ensure highlighting
                disableCloseOnSelect
            />
        </FormControl>
    )
}

export default MultipleAutoCompleteDropdown;