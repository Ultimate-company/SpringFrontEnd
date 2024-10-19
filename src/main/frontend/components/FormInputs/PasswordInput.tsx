import {FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField} from "@mui/material";
import React from "react";
import {Icon} from "@hilla/react-components/Icon";

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
                            onClick={() => props.handleShowPasswordStateChange() }
                            onMouseDown={(event) => {
                                event.preventDefault();
                            }}
                            edge="end"
                        >
                            {props.state ? <Icon icon="vaadin:eye"
                                                        style={{ height: '20px', width: '20px' }}
                            /> : <Icon icon="vaadin:eye-slash"
                                       style={{ height: '20px', width: '20px' }}
                            />}
                        </IconButton>
                    </InputAdornment>
                }
            />
        </FormControl>
    );
}

export default PasswordInput;