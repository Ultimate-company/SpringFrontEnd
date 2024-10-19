import Badge, { BadgeProps } from '@mui/material/Badge';
import { styled } from '@mui/material/styles';

export const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
    '& .MuiBadge-badge': {
        right: -9,
        top: 1,
        border: `2px solid ${theme.palette.background.paper}`,
        backgroundColor: 'orange',
        padding: '0 4px',
    },
}));