import {Typography, Box, Alert, } from "@mui/material";
import React from "react";
import {loginApi} from "Frontend/api/ApiCalls";
import {LoginRequestModel} from "Frontend/api/Models/CentralModels/Login";
import {navigatingRoutes} from "Frontend/navigation";
import { AlertColor } from "@mui/material/Alert";

const ConfirmEmail = () => {
    // state variables
    const [accountConfirmed, setAccountConfirmed] = React.useState<boolean>(false);
    const [message, setMessage] = React.useState<string>("");

    React.useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const userId: number = queryParams.get("UserId") ? parseInt(queryParams.get("UserId") as string) : 0;
        const token: string = queryParams.get("Token") ? queryParams.get("Token") as string : "";

        let addEditUserModel: Partial<LoginRequestModel> = {
            userId: userId,
            token: token
        };

        loginApi.confirmEmail(addEditUserModel as LoginRequestModel)
            .then((response: boolean) => {
                if(response) {
                    setAccountConfirmed(response);
                    setMessage("Account has been confirmed successfully please proceed to the login page and login using the temporary password received in your email.");
                }
                else {
                    setAccountConfirmed(response);
                    setMessage("There has been an error confirming your account please contact your administrator.");
                }
            });
    }, []);
    // token from db: $2a$10$lFaS.S0.GU.Eg2dgcIgAyuw/y72LEpE5iMuya2IorJx0vUfANhi0.
    // token from wb: $2a$10$lFaS.S0.GU.Eg2dgcIgAyuw/y72LEpE5iMuya2IorJx0vUfANhi0.

    const alertSeverity: AlertColor = accountConfirmed ? "success" : "error";
    return (
        <Box sx={{ padding: 3 }}>
            {/* Display success or error message */}
            {message && (
                <Alert severity={alertSeverity} sx={{ marginBottom: 2 }}>
                    {message}
                </Alert>
            )}

            {/* Conditionally render confirmation status */}
            <Typography color="textSecondary" variant="body1" style={{ margin: 30 }}>
                {accountConfirmed
                    ? "Your Account has been Successfully Confirmed."
                    : "Please check the confirmation status."}
            </Typography>

            <Typography color="textSecondary" variant="body1" style={{ margin: 30 }}>
                {accountConfirmed
                    ? <> Please click <a href={navigatingRoutes.dashboard.login}>here</a> to return to the login page.</>
                    : <></>
                }
            </Typography>
        </Box>
    );
};
export default ConfirmEmail;