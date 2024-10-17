import React from "react";
import { Typography } from "@mui/material";

interface BodyTextInputProps {
    text: string;
}

const BodyText = (props:BodyTextInputProps) => {
    return (
        <Typography
            variant="body1"
            dangerouslySetInnerHTML={{ __html: `${props.text}` }}
        />
    );
}

export default BodyText;