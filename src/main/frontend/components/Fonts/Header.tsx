import React from "react";
import {Typography} from "@mui/material";
interface HeaderInputProps {
    label: string;
}
const Header= (props:HeaderInputProps)=> {
    return (
        <Typography color="textPrimary" variant="h4">
            {props.label}
        </Typography>
    );
}
export default Header;