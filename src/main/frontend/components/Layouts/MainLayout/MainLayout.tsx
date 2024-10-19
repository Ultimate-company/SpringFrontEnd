import { Outlet } from 'react-router-dom';
import { styled } from '@mui/system';
import MainNavbar from './MainNavbar';
import {GoogleOAuthProvider} from "@react-oauth/google";
import {Box} from "@mui/material";
import NotificationSnackbar from '../../Snackbar/NotificationSnackbar';
import { Toaster } from 'react-hot-toast';

const MainLayoutRoot = styled('div')({
    backgroundColor: "#ffff",
    display: 'flex',
    height: '100%',
    overflow: 'hidden',
    width: '100%'
});

const MainLayoutWrapper = styled('div')({
    display: 'flex',
    flex: '1 1 auto',
    overflow: 'hidden',
    paddingTop: 64
});

const MainLayoutContainer = styled('div')({
    display: 'flex',
    flex: '1 1 auto',
    overflow: 'hidden'
});

const MainLayoutContent = styled('div')({
    flex: '1 1 auto',
    height: '100%',
    overflow: 'auto'
});

const MainLayout = () => (
    <GoogleOAuthProvider clientId="445377684807-a6modmc2pkgull0vltlvk3fqcehnp6n5.apps.googleusercontent.com">
        <MainLayoutRoot>
            <MainNavbar />
            <MainLayoutWrapper style={{marginTop:30, marginBottom:30}}>
                <MainLayoutContainer>
                    <MainLayoutContent>
                        <Box
                            sx={{
                                backgroundColor: "background.default",
                                height: "100%",
                                justifyContent: "center",
                            }}
                        >
                            <Outlet />
                        </Box>
                    </MainLayoutContent>
                </MainLayoutContainer>
            </MainLayoutWrapper>
        </MainLayoutRoot>
    </GoogleOAuthProvider>
);

export default MainLayout;