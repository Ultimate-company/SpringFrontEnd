import {Button} from "@mui/material";
import React from "react";

interface LinkButtonInputProps {
    fullWidth?: boolean;
    label: string;
    handleSubmit: () => void;
    href?: string;
}
const LinkButton = (props: LinkButtonInputProps) => {
    if(props.href) {
        return(
            <Button
                fullWidth={props.fullWidth || false}
                color="primary"
                size="large"
                variant="outlined"
                href={props.href}
            >
                {props.label}
            </Button>
        );
    }
    else{
        return(
            <Button
                fullWidth={props.fullWidth || false}
                color="primary"
                size="large"
                variant="outlined"
                onClick={props.handleSubmit}
            >
                {props.label}
            </Button>
        );
    }
}
export default LinkButton;