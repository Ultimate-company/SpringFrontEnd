import {styled} from "@mui/system";
import Tooltip, {tooltipClasses, TooltipProps} from "@mui/material/Tooltip";
import React from "react";

const StyledTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: 'red',
        color: 'white'
    },
}));

export default StyledTooltip;
