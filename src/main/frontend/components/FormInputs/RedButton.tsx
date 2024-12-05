import {Button} from "@mui/material";
import React from "react";

interface RedButtonInputProps {
    fullWidth?: boolean;
    label: string;
    handleSubmit: () => void;
    href?: string;
}
const RedButton = (props: RedButtonInputProps) => {
    if(props.href){
        return(
            <Button
                fullWidth={props.fullWidth || false}
                color="error"
                size="large"
                variant="contained"
                href={props.href || ""}
            >
                {props.label}
            </Button>
        );
    }
    else {
        return(
            <Button
                fullWidth={props.fullWidth || false}
                color="error"
                size="large"
                variant="contained"
                onClick={props.handleSubmit ? () => props.handleSubmit() : () => {}}
            >
                {props.label}
            </Button>
        );
    }
}
export default RedButton;