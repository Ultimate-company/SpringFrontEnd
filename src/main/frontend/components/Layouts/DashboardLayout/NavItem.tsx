import React from 'react';
import {ListItem, ListItemButton, ListItemIcon, ListItemText} from '@mui/material';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {IconDefinition} from "@fortawesome/fontawesome-svg-core";

interface NavItemProps {
    href: string;
    icon: IconDefinition;
    title: string;
    open: boolean;
}

const NavItem = (props: NavItemProps) => {
    return (
        <ListItem key={props.title} disablePadding sx={{ display: 'block' }}>
            <ListItemButton
                component="a"
                href={props.href}
                sx={{
                    minHeight: 48,
                    justifyContent: 'center',
                }}
            >
                <ListItemIcon
                    sx={{
                        minWidth: 0,
                        mr: props.open ? 4 : 'auto',
                        justifyContent: 'center',
                    }}
                >
                    <FontAwesomeIcon icon={props.icon} size="lg" />
                </ListItemIcon>
                <ListItemText primary={props.title} sx={{ opacity: props.open ? 1 : 0 }} />
            </ListItemButton>
        </ListItem>
    );
};
export default NavItem;