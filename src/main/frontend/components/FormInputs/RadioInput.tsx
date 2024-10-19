import {Box, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup} from "@mui/material";
import React from "react";
import {DataItem} from "Frontend/api/Models/CentralModels/Data";

interface RadioInputProps{
    name?: string;
    label?: string;
    checked: boolean;
    disabled?: boolean;
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
    checkboxStyle?: React.CSSProperties;
    data?: DataItem[];
    value?: any;
}

const RadioInput= (props: RadioInputProps) => {
    return (
        <Box display="flex" alignItems="center" style={{marginTop:18}}>
            {props.label && <FormLabel component="legend" style={{ marginRight: 16}}>{props.label}</FormLabel>}
            <FormControl component="fieldset">
                <RadioGroup
                    row
                    value={props.value}
                    {...(props.name && { name: props.name })}
                    {...(props.onChange && { onChange: props.onChange })}
                >
                    {props.data &&
                        props.data.map(option => (
                            <FormControlLabel
                                key={option.value}
                                value={option.value}
                                control={<Radio />}
                                label={option.title}
                            />
                        ))}
                </RadioGroup>
            </FormControl>
        </Box>
    );
}

export default RadioInput;
