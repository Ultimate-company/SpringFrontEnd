import router from './routes';
import { RouterProvider } from 'react-router-dom';
import { ConfirmProvider } from "material-ui-confirm";
import {createTheme, ThemeProvider} from "@mui/material";

const themeMode = localStorage.getItem('theme');
const darkTheme = createTheme({
    palette: {
        mode: themeMode === 'dark' || themeMode === 'light' ? themeMode : 'light'
    },
});

export default function App() {
    return (
        <ThemeProvider theme={darkTheme}>
            <ConfirmProvider>
                <RouterProvider router={router} />
            </ConfirmProvider>
        </ThemeProvider>
    );
}