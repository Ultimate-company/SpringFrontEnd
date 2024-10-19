import {Toaster, ToastOptions} from "react-hot-toast";

export const notificationSettings : ToastOptions = {
    duration: 6000,
    position: 'bottom-center',
    style: {
        minWidth: '250px',
    }
};

export const warningNotificationSettings: ToastOptions = {
    duration: 6000,
    position: 'bottom-center',
    style: {
        minWidth: '250px',
        backgroundColor: 'yellow'
    }
};

const NotificationSnackbar = () => {
    return(
        <Toaster
            containerStyle={{
                top: 20,
                left: 20,
                bottom: 20,
                right: 20,
            }}
            toastOptions={{
                success: {
                    style: {
                        width: '100%',
                        background: 'green',
                        color: 'white'
                    },
                },
                error: {
                    style: {
                        background: 'red',
                        color: 'white'
                    },
                },
            }}
        />
    );
}

export default NotificationSnackbar;