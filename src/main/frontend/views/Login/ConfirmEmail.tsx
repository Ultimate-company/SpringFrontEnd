import {Typography} from "@mui/material";
import React from "react";
import {loginApi} from "Frontend/api/ApiCalls";
import {LoginRequestModel} from "Frontend/api/Models/CentralModels/Login";
import {navigatingRoutes} from "Frontend/navigation";

const ConfirmEmail = () => {
    // state variables
    const [state, setState] = React.useState<string>("");
    React.useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const userId: number = queryParams.get("UserId") ? parseInt(queryParams.get("UserId") as string) : 0;
        const token: string = queryParams.get("Token") ? queryParams.get("Token") as string : "";

        let addEditUserModel: Partial<LoginRequestModel> = {
            userId: userId,
            token: token
        };

        //LoginApi.ConfirmEmail(addEditUserModel as LoginRequestModel).then(result => setState(result));
    }, []);

    return <>
        {state == "Your Account has been Successfully Confirmed" ? <div>
            <Typography
                color="textSecondary"
                variant="body1"
                style={{margin: 30}}
            >
                {state}
            </Typography>
            <br/>
            <p style={{margin: 30}}>
                Please click <a href={navigatingRoutes.dashboard.login}>here </a>to return back to
                the login page
            </p>
        </div> : <Typography
            color="textSecondary"
            variant="body1"
            style={{margin: 30}}
        >
            {state}
        </Typography>}
    </>;
};
export default ConfirmEmail;