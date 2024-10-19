import {Button} from "@mui/material";
import React from "react";

interface RedButtonInputProps {
    fullWidth?: boolean;
    label: string;
    handleSubmit: () => void;
    href?: string;
}
const RedButton = (props: RedButtonInputProps) => {
    return(
        <Button
            {...(props.fullWidth !== undefined && props.fullWidth && { fullWidth: true })}
            color="error"
            size="large"
            variant="contained"
            {...(props.handleSubmit !== undefined ? { onClick: () => props.handleSubmit() } : {})}
            { ...(props.href !== undefined ? { href: props.href } : {}) }
        >
            {props.label}
        </Button>
    );
}
export default RedButton;