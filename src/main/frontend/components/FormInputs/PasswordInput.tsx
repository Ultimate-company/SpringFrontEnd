import {FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField} from "@mui/material";
import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEye, faEyeSlash} from '@fortawesome/free-solid-svg-icons'

interface PasswordInputProps {
    required: boolean;
    fullWidth: boolean;
    state: boolean;
    name: string;
    label: string;
    value: string;
    onChange: React.ChangeEventHandler<HTMLInputElement>;
    handleShowPasswordStateChange: () => void;
}
const PasswordInput: React.FC<PasswordInputProps> = (props: PasswordInputProps) => {
    return (
        <FormControl
            fullWidth
            variant="outlined">
            <InputLabel htmlFor="outlined-adornment-password">Password *</InputLabel>
            <OutlinedInput
                {...(props.required && { required: true })}
                {...(props.fullWidth && { fullWidth: true })}
                id={props.name}
                label={props.label}
                name={props.name}
                value={props.value}
                type={props.state ? 'text' : 'password'}
                onChange={props.onChange}
                endAdornment={
                    <InputAdornment position="end">
                        <IconButton
                            aria-label="toggle password visibility"
                            onClick={props.handleShowPasswordStateChange}
                            edge="end"
                        >
                            <FontAwesomeIcon
                                icon={props.state ? faEyeSlash : faEye}
                                size="sm"
                            />
                        </IconButton>
                    </InputAdornment>
                }
            />
        </FormControl>
    );
}

export default PasswordInput;