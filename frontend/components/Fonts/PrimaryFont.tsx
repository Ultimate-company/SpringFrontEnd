import React from "react";
import { Typography } from "@mui/material";

interface PrimaryFontProps {
    text: string;
}

const PrimaryFont = (props : PrimaryFontProps) => {
    return (
        <Typography
            color="textPrimary"
            variant="h5"
        >
            {props.text}
        </Typography>
    );
}

export default PrimaryFont;