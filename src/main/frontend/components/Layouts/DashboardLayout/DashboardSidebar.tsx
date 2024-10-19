import React from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import {Avatar, Box, Divider, IconButton, List} from '@mui/material';
import { deepOrange } from '@mui/material/colors';
import {faHandshake, faUser, faUserGroup,
    faBox, faFile, faClipboardList, faShoppingCart,
    faMessage, faLocation, faPercent, faTicket, faKey,
    faMoneyBill, faChevronLeft, faChevronRight, faBoxOpen, faWindowMaximize} from '@fortawesome/free-solid-svg-icons'
import { navigatingRoutes } from '../../../navigation';
import {Permissions, User} from "Frontend/api/Models/CentralModels/User";
import {userApi} from "Frontend/api/ApiCalls";
import NavItem from "Frontend/components/Layouts/DashboardLayout/NavItem";
import {IconDefinition} from "@fortawesome/fontawesome-svg-core";
import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import PrimaryFont from "Frontend/components/Fonts/PrimaryFont";
import BodyText from "Frontend/components/Fonts/BodyText";

interface DashboardSidebarProps {
    open: boolean;
    handleDrawer: () => void;
}

const permissionMapping: Record<
    string,
    {
        Location: number;
        href: string;
        icon: IconDefinition;
        title: string;
    }
> = {
    ViewLeads: {
        Location: 1,
        href: navigatingRoutes.dashboard.leads,
        icon: faHandshake,
        title: 'Leads',
    },
    ViewUser: {
        Location: 2,
        href: navigatingRoutes.dashboard.users,
        icon: faUser,
        title: 'Users',
    },
    ViewGroups: {
        Location: 3,
        href: navigatingRoutes.dashboard.userGroups,
        icon: faUserGroup,
        title: 'User Group',
    },
    ViewProducts: {
        Location: 4,
        href: navigatingRoutes.dashboard.products,
        icon: faBox,
        title: 'Products',
    },
    ViewPurchaseOrders: {
        Location: 5,
        href: navigatingRoutes.dashboard.purchaseorders,
        icon: faFile,
        title: 'Purchase Orders',
    },
    ViewSalesOrders: {
        Location: 6,
        href: navigatingRoutes.dashboard.salesorders,
        icon: faClipboardList,
        title: 'Sales Orders',
    },
    ViewOrders: {
        Location: 7,
        href: navigatingRoutes.dashboard.orders,
        icon: faShoppingCart,
        title: 'Orders',
    },
    ViewPackages: {
        Location: 8,
        href: navigatingRoutes.dashboard.packages,
        icon: faBoxOpen,
        title: 'Packages',
    },
    ViewPayments: {
        Location: 9,
        href: navigatingRoutes.dashboard.payments,
        icon: faMoneyBill,
        title: 'Payments',
    },
    ViewPromos: {
        Location: 10,
        href: navigatingRoutes.dashboard.promos,
        icon: faPercent,
        title: 'Promos',
    },
    ViewPickupLocations: {
        Location: 11,
        href: navigatingRoutes.dashboard.pickupLocations,
        icon: faLocation,
        title: 'Pickup Locations',
    },
    ViewMessages: {
        Location: 12,
        href: navigatingRoutes.dashboard.messages,
        icon: faMessage,
        title: 'Messages',
    },
    ViewWebTemplate: {
        Location: 13,
        href: navigatingRoutes.dashboard.webTemplates,
        icon: faWindowMaximize,
        title: 'Web Templates',
    },
    ViewTickets: {
        Location: 14,
        href: navigatingRoutes.dashboard.support,
        icon: faTicket,
        title: 'Support',
    },
    ViewApiKeys: {
        Location: 15,
        href: navigatingRoutes.dashboard.apikeys,
        icon: faKey,
        title: 'Api Keys',
    },
};

const items: {
    href: string;
    icon: IconDefinition;
    title: string;
}[] = new Array(13);

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));
const drawerWidth = 240;
const openedMixin = (theme: Theme): CSSObject => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});
const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme),
        }),
        ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
        }),
    }),
);


const DashboardSidebar = (props: DashboardSidebarProps) => {
    const [user, setUser] = React.useState<User>();
    const location = useLocation();

    React.useEffect(() => {
        userApi((loading: boolean) => {}).getLoggedInUser().then(function (user: User) {
            setUser(user);
        });

        userApi((loading: boolean) => {}).getLoggedInUserPermissions().then(function (permissions: Permissions) {
            for (const [key, value] of Object.entries(permissionMapping)) {
                const keyExists = Object.values(permissions)
                    .flatMap(str => typeof str === 'string' ? str.split(',') : [])
                    .includes(key);
                if(keyExists) {
                    items[value.Location] = value;
                }
            }
        });
    }, [location.pathname]);

    const content = (
            <>
                <Box
                    sx={{
                        alignItems: 'center',
                        display: 'flex',
                        flexDirection: 'column', p: 2
                    }}
                >
                    {user && user.avatar != null && user.avatar.length > 2 ? (
                        <Avatar
                            component={RouterLink}
                            src={user.avatar}
                            sx={{ cursor: 'pointer',
                                width: props.open ? 64 : 48, // Adjust width based on 'open' condition
                                height: props.open ? 64 : 48, // Adjust height based on 'open' condition
                            }}
                            to=""
                        />
                    ) : (
                        <Avatar
                            component={RouterLink}
                            style={{ backgroundColor: deepOrange[500] }}
                            sx={{ cursor: 'pointer',
                                width: props.open ? 64 : 48, // Adjust width based on 'open' condition
                                height: props.open ? 64 : 48, // Adjust height based on 'open' condition
                            }}
                            to=""
                        >
                            {user && user.avatar}
                        </Avatar>
                    )}
                    {props.open && (
                        <>
                            <br />
                            <PrimaryFont text={user && user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : ''} />
                            <BodyText text={user && user.role ? String(user.role) : ''} />
                        </>
                    )}
                </Box>
                <Divider />
                <List>
                    {items.map((item) => (
                        <NavItem
                            href={item.href}
                            key={item.title}
                            title={item.title}
                            icon={item.icon}
                            open={props.open}
                        />
                    ))}
                </List>
            </>
    );

    const theme = useTheme();
    return (
        <Drawer variant="permanent" open={props.open}>
            <DrawerHeader>
                <IconButton onClick={props.handleDrawer}>
                    {theme.direction === 'rtl' ? <FontAwesomeIcon icon={faChevronRight} size="xs"/>
                        : <FontAwesomeIcon icon={faChevronLeft} size="xs"/>}
                </IconButton>
            </DrawerHeader>
            <Divider />
            {content}
        </Drawer>
        );
};
export default DashboardSidebar;