import {Autocomplete, Box, FormControl, TextField} from "@mui/material";
import React from "react";

export interface AutoCompleteProps {
    required: boolean;
    fullWidth: boolean;
    label: string;
    labelValue?: string;
    idValue?: string
    onChange?: (
        event: React.SyntheticEvent<Element, Event>,
        value: { label: string | undefined; id: string | undefined } | null,
        reason: string
    ) => void;
    disabled?: boolean;
    options: { id: string; label: string; }[];
    onInputChange?: (
        event: React.SyntheticEvent<Element, Event>,
        value: string,
        reason: string
    ) => void;
    displayColorPalet?: boolean;
}

const AutoCompleteDropdown = (props: AutoCompleteProps) => {
    return (
        <FormControl
            fullWidth
            variant="outlined" >
            <Autocomplete
                value={{id: props.idValue, label: props.labelValue}}
                inputValue={props.labelValue || ""}
                autoSelect={true}
                options={props.options}
                autoHighlight
                getOptionLabel={(option) => option.label ?? ""}
                renderOption={(optionProps, option) => (
                    <Box
                        component="li"
                        sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                        {...optionProps}
                    >
                        {props.displayColorPalet ?
                            <>
                                <div
                                    style={{
                                        width: 20,
                                        height: 20,
                                        backgroundColor: option.id,
                                    }}
                                />
                                &nbsp;&nbsp;&nbsp;
                            </>
                         : <></>
                        }
                        {option.label}
                    </Box>
                )}
                onInputChange={(event, value, reason) => {
                    if (props.onInputChange) {
                        props.onInputChange(event, value, reason);
                    }
                }}
                onChange={(event, value, reason) => {
                    if (props.onChange) {
                        props.onChange(event, value, reason);
                    }
                }}
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
            />
        </FormControl>
    )
}
export default AutoCompleteDropdown;