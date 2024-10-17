import React from 'react';
import { FormControl, Box } from '@mui/material';
import { MuiColorInput } from 'mui-color-input'

interface ColorPickerProps {
    value: string;
    handleChange: (color: string) => void;
    label?: string;
    required?: boolean;
    disabled?: boolean;
}

const ColorPickerInput = (props: ColorPickerProps) => {
    return (
        <FormControl
            fullWidth
            variant="outlined"
            required={props.required}
            disabled={props.disabled}
            margin="dense"
        >
            <Box>
                <MuiColorInput
                    format="hex"
                    value={props.value}
                    onChange={props.handleChange}
                    sx={{ width: '100%' }}
                    disabled={props.disabled}
                />
            </Box>
        </FormControl>
    );
}

export default ColorPickerInput;