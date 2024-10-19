import React, {ReactNode} from "react";
import { Typography } from "@mui/material";

interface SubHeaderInputProps {
    text: string;
    align?: "right" | "left" | "center" | "inherit" | "justify";
    color?: string;
    variant?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "subtitle1" | "subtitle2" | "body1" | "body2" | "caption" | "button" | "overline";
    children?: ReactNode;
}

const SubHeader = (props: SubHeaderInputProps) => {
    return (
        <Typography
            align={props.align}
            color={props.color !== undefined ? props.color : "textPrimary"}
            variant={props.variant}
        >
            {props.text}
            {props.children}
        </Typography>
    );
}
export default SubHeader;