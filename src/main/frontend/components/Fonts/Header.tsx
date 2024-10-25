import React from "react";
import {Typography} from "@mui/material";
interface HeaderInputProps {
    label: string;
    color?: string;
}
const Header= (props:HeaderInputProps)=> {
    return (
        <Typography color="textPrimary" variant="h5" style={{ color: props.color || "inherit" }}>
            {props.label}
        </Typography>
    );
}
export default Header;