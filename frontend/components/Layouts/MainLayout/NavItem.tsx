import { matchPath, NavLink as RouterLink, useLocation } from 'react-router-dom';
import { Button, ListItem } from '@mui/material';
import React from "react";

interface NavItemProps {
    href: string;
    icon: React.ElementType;
    title: string;
}

const NavItem = (props: NavItemProps) => {
    const location = useLocation();

    const active = props.href ? !!matchPath({ path: props.href, end: false }, location.pathname) : false;

    return (
        <ListItem disableGutters sx={{ display: 'flex', py: 0 }}>
            <Button
                component={RouterLink}
                sx={{
                    color: 'text.secondary',
                    fontWeight: 'medium',
                    justifyContent: 'flex-start',
                    letterSpacing: 0,
                    py: 1.25,
                    textTransform: 'none',
                    width: '100%',
                    ...(active && {
                        color: 'primary.main'
                    }),
                    '& svg': {
                        mr: 1
                    }
                }}
                to={props.href}
            >
                {props.icon && <props.icon size="20" />}
                <span>{props.title}</span>
            </Button>
        </ListItem>
    );
};

export default NavItem;
