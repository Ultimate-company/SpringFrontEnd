import {Button} from "@mui/material";
import React from "react";

interface LinkButtonInputProps {
    fullWidth?: boolean;
    label: string;
    handleSubmit: () => void;
    href?: string;
}
const LinkButton = (props: LinkButtonInputProps) => {
    return(
        <Button
            {...(props.fullWidth !== undefined && props.fullWidth && { fullWidth: true })}
            color="primary"
            size="large"
            variant="outlined"
            {...(props.handleSubmit !== undefined ? { onClick: () => props.handleSubmit() } : {})}
            { ...(props.href !== undefined ? { href: props.href } : {}) }
        >
            {props.label}
        </Button>
    );
}
export default LinkButton;