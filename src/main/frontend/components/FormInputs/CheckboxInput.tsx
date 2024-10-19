import {Box, Checkbox, Typography} from "@mui/material";
import React from "react";
interface CheckboxInputProps{
    name?: string;
    label?: string;
    checked: boolean;
    disabled?: boolean;
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
    checkboxStyle?: React.CSSProperties;
}

const CheckboxInput= (props: CheckboxInputProps) => {
    return (
        <Box
            sx={{
                alignItems: "center",
                display: "flex",
                ml: -1,
            }}
        >
            <Checkbox
                {...(props.disabled && {disabled: props.disabled})}
                checked = {props.checked}
                {...(props.name && {name: props.name})}
                {...(props.onChange && {onChange: props.onChange})}
                sx = {{...props.checkboxStyle}}
            />
            {
                props.label != undefined ?
                    <Typography color="textSecondary" variant="body1">
                        {props.label}
                    </Typography> :
                    <></>
            }
        </Box>
    );
}

export default CheckboxInput;
