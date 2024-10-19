import Tooltip, {tooltipClasses, TooltipProps} from "@mui/material/Tooltip";
import {styled} from "@mui/material/styles";

interface HtmlTooltipProps extends TooltipProps {
    title: React.ReactNode;
    children: React.ReactElement;
}

export const FormTooltip = styled(({ className, ...props }: HtmlTooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }}  children={props.children}/>
))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: '#f5f5f9',
        color: 'rgba(0, 0, 0, 0.87)',
        maxWidth: 220,
        fontSize: theme.typography.pxToRem(12),
        border: '1px solid #dadde9',
    },
}));