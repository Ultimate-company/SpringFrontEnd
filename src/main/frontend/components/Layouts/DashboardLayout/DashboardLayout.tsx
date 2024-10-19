import React from 'react';
import { Outlet } from 'react-router-dom';
import DashboardNavbar from './DashboardNavbar';
import DashboardSidebar from './DashboardSidebar';
import {Box, CircularProgress, CssBaseline} from "@mui/material";
import {loginApi} from "Frontend/api/ApiCalls";

const DashboardLayout = () => {
    const [open, setOpen] = React.useState<boolean>(true);
    const [loading, setLoading] = React.useState<boolean>(false);
    const handleDrawer = () => {
        setOpen(!open);
    };

    React.useEffect(() => {
        loginApi.checkIfUserIsLoggedIn().then(() => {});
    }, []);

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <DashboardNavbar open={open} handleDrawer={handleDrawer} />
            <DashboardSidebar
                open={open} handleDrawer={handleDrawer}
            />
            <div style={{
                paddingTop:64,
                width: open ? `calc(100% - ${240}px)` : '100%',
                minHeight: '100vh',
                maxHeight: '100%',
                backgroundColor:"#dfdfdf"}}
                 className="DashboardLayoutWrapper">
                <div className="DashboardLayoutContainer">
                    <div className="DashboardLayoutContent">
                        {loading &&
                            <Box
                                sx={{
                                    position: 'fixed',
                                    width: '100%',
                                    height: '100%',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                    zIndex: 100
                                }}
                            >
                                <CircularProgress
                                    size={100}
                                />
                            </Box>
                        }
                        <Outlet context={[setLoading]}/>
                    </div>
                </div>
            </div>
            {/*<DashboardFooter/>*/}
        </Box>
    );
};
export default DashboardLayout;