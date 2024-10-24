import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {Box, IconButton, Popper, Toolbar, Typography, Switch} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faList, faCalendar, faBell, faSignOut, faBars} from '@fortawesome/free-solid-svg-icons'
import {loginApi, messageApi} from "../../../api/ApiCalls";
import { styled} from '@mui/material/styles';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Logo from "Frontend/components/Layouts/DashboardLayout/Logo";
import MessageList from "Frontend/views/Message/Components/MessageList";
import {MessageResponseModel} from "Frontend/api/Models/CarrierModels/Message";
import {StyledBadge} from "Frontend/components/OtherComponents/StyledBadge";
import BodyText from "Frontend/components/Fonts/BodyText";

interface DashboardNavbarProps {
    open: boolean;
    handleDrawer: () => void;
}
interface AppBarProps extends MuiAppBarProps {
    open: boolean;
}

const drawerWidth = 240;
const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const DashboardNavbar = (props: DashboardNavbarProps) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [newMessageCount, setNewMessageCount] = React.useState(0);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(anchorEl ? null : event.currentTarget);
    };

    const [themeMode, setThemeMode] = React.useState(localStorage.getItem('theme') || 'light');
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popper' : undefined;

    const handleThemeToggle = () => {
        let newTheme = themeMode === 'dark' ? 'light' : 'dark'
        setThemeMode(newTheme);
        localStorage.setItem('theme', newTheme);
        window.location.reload();
    };

    React.useEffect(() => {
        messageApi(() => {}).getMessagesByUserId().then((messageResponseModels: MessageResponseModel[]) => {
            let unreadMessageCount = messageResponseModels.filter(message => !message.read).length;
            setNewMessageCount(unreadMessageCount);
        })
    }, []);

    return (
        <AppBar position="fixed" open={props.open}>
            <Toolbar>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    onClick={props.handleDrawer}
                    edge="start"
                    sx={{
                        marginRight: 5,
                        ...(props.open && { display: 'none' }),
                    }}
                >
                    <FontAwesomeIcon icon={faBars} size="xs"/>
                </IconButton>
                <RouterLink to="/">
                    <Logo />
                </RouterLink> &nbsp;&nbsp;&nbsp;&nbsp;
                <Typography variant="h6" noWrap component="div">
                    Ultimate Company
                </Typography>
                <Box sx={{ flexGrow: 1 }} />
                <BodyText text="Dark Mode"/>
                <Switch
                    checked={themeMode === 'dark'}
                    onChange={handleThemeToggle}
                    color="default"
                />
                <IconButton component={RouterLink} to="/dashboard/todolist" color="inherit">
                    <FontAwesomeIcon icon={faList} size="xs"/>
                </IconButton>&nbsp;&nbsp;&nbsp;
                <IconButton component={RouterLink} to="/dashboard/schedule" color="inherit">
                    <FontAwesomeIcon icon={faCalendar} size="xs"/>
                </IconButton>&nbsp;&nbsp;&nbsp;
                <IconButton color="inherit" onClick={handleClick}>
                    <StyledBadge badgeContent={newMessageCount}>
                        <FontAwesomeIcon icon={faBell} size="xs"/>
                    </StyledBadge>
                </IconButton>&nbsp;&nbsp;&nbsp;
                <Popper id={id} open={open} anchorEl={anchorEl} placement="bottom-end">
                    <MessageList/>
                </Popper>
                <IconButton color="inherit" onClick={() => loginApi.logOut().then(() => {})}>
                    <FontAwesomeIcon icon={faSignOut} size="xs"/>
                </IconButton>
            </Toolbar>
        </AppBar>
    );
};
export default DashboardNavbar;