import { Button, Link } from "@mui/material";
import React from "react";

interface BlueButtonInputProps {
    fullWidth?: boolean;
    label: string;
    handleSubmit?: () => void;
    href?: string;
}

const BlueButton = (props: BlueButtonInputProps) => {
    return (
        props.href? (
            <Link href={props.href} underline="none">
                <Button
                    {...(props.fullWidth!== undefined && props.fullWidth && { fullWidth: true })}
                    color="primary"
                    size="large"
                    variant="contained"
                    onClick={props.handleSubmit}
                >
                    {props.label}
                </Button>
            </Link>
        ) : (
            <Button
                {...(props.fullWidth!== undefined && props.fullWidth && { fullWidth: true })}
                color="primary"
                size="large"
                variant="contained"
                onClick={props.handleSubmit}
            >
                {props.label}
            </Button>
        )
    );
}

export default BlueButton;