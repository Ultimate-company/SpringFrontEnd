import React from 'react';
import { useTheme } from "@mui/material/styles";
import CheckboxInput from '../FormInputs/CheckboxInput';

interface CustomToolbarProps {
    checkboxes: {
        label: string;
        checked: boolean;
        onCheckboxChange: any;
    }[];
}

const CustomToolbar = (props:CustomToolbarProps) => {
    const theme = useTheme(); // Get the current theme
    return (
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            {props.checkboxes.map((checkbox, index) => (
                <div key={index}
                     style={{
                         background: theme.palette.mode === 'dark' ? '#424242' : '#f0f0f0',
                         borderRadius: '4px',
                         padding: '8px',
                         marginRight: '8px'}}>
                    <CheckboxInput
                        name={checkbox.label}
                        label={checkbox.label}
                        checked={checkbox.checked}
                        onChange={checkbox.onCheckboxChange}
                    />
                </div>
            ))}
        </div>
    );
};

export default CustomToolbar;