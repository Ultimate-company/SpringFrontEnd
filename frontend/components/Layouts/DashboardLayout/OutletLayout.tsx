import {Card} from '@mui/material';
import React, {ReactNode} from 'react';
import NotificationSnackbar, {notificationSettings} from "Frontend/components/Snackbar/NotificationSnackbar";
import toast from "react-hot-toast";

interface OutletLayoutProps {
    children: ReactNode;
    card: boolean;
}

const OutletLayout = (props: OutletLayoutProps) => {
    React.useEffect(() => {
        const storedMessage = sessionStorage.getItem('redirectMessage');
        if (storedMessage) {
            toast.success(storedMessage,  notificationSettings);
            sessionStorage.removeItem('redirectMessage'); // Clear message from session
        }
    }, []);

    if(props.card)
    {
        return (
            <Card style={{
                padding: 24,
                marginLeft:20,
                marginRight:20}}>
                <NotificationSnackbar/>
                {props.children}
            </Card>
        );
    }
    else {
        return (
            <div style={{
                padding: 24,
                marginLeft:20,
                marginRight:20}}>
                <NotificationSnackbar/>
                {props.children}
            </div>
        );
    }
};
export default OutletLayout;
