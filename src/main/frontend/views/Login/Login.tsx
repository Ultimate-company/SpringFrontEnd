import React from 'react';
import {Link as RouterLink} from "react-router-dom";
import {
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    Link,
} from "@mui/material";
import {loginApi} from "Frontend/api/ApiCalls";
import {navigatingRoutes} from "Frontend/navigation";
import {LoginRequestModel} from "Frontend/api/Models/CentralModels/Login";
import {GoogleLogin} from '@react-oauth/google';
import Header from "../../components/Fonts/Header";
import SubHeader from "../../components/Fonts/SubHeader";
import TextFieldInput from "../../components/FormInputs/TextFieldInput";
import PasswordInput from "../../components/FormInputs/PasswordInput";
import BlueButton from "../../components/FormInputs/BlueButton";
import RedButton from "../../components/FormInputs/RedButton";
import BodyText from "Frontend/components/Fonts/BodyText";

interface LoginState {
    email: string;
    password: string;
    forgotPasswordEmail: string;
    showPassword: boolean;
    dialogOpen: boolean;
}
const defaultLoginState: LoginState = {
    email: "masterAccount-1@gmail.com",
    password: "Code@123",
    forgotPasswordEmail: "",
    showPassword: false,
    dialogOpen: false
};

const Login = () => {
    // state variables
    const [state, setState] = React.useState<LoginState>(defaultLoginState);

    // custom page functions
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = event.target;
        setState({
            ...state,
            [name]: value,
        });
    }

    const handleOnSuccessGoogleLogin = async (googleData: any) => {
        // await LoginApi.GoogleSignIn({
        //     AccessToken: googleData.accessToken,
        //     GoogleId: googleData.googleId,
        //     TokenId: googleData.tokenId,
        //     ImageUrl: googleData.profileObj.imageUrl,
        //     Email: googleData.profileObj.email,
        //     FamilyName: googleData.profileObj.familyName,
        //     GivenName: googleData.profileObj.givenName,
        //     Name: googleData.profileObj.name,
        // });
    };

    const handleShowPasswordStateChange = () => {
        setState({
            ...state,
            showPassword: !state.showPassword,
        })
    }

    const handleSubmit = () => {
        let loginRequestModel: Partial<LoginRequestModel> = {
            loginName: state.email,
            password: state.password,
        };
        loginApi.signIn(loginRequestModel as LoginRequestModel);
    }


    // react render function
    return (
        <Container maxWidth="md" style={{ border: "1px solid black", padding: "100px"}}>
            <Header label="Sign In"/>
            <SubHeader text="Sign in on the internal platform"/><br/>
            <GoogleLogin
                onSuccess={credentialResponse => {
                    console.log(credentialResponse);
                }}
                onError={() => {
                    console.log('Login Failed');
                }}
            /><br/>
            <SubHeader align="center" color="textSecondary" variant="body1" text="or login with email address"/><br/>
            <TextFieldInput
                fullWidth={true}
                required={true}
                label="Email address"
                name="email"
                value={state.email}
                onChange={handleChange}
            /><br/><br/>
            <PasswordInput
                fullWidth={true}
                required={true}
                state={state.showPassword}
                label="Password"
                name="password"
                value={state.password}
                onChange={handleChange}
                handleShowPasswordStateChange={handleShowPasswordStateChange}
            /><br/><br/>
            <BlueButton
                fullWidth={true}
                label="Sign In"
                handleSubmit={handleSubmit}
            /><br/><br/>

            <Link onClick={() => setState({
                ...state,
                dialogOpen: true
            })} variant="h6">
                <SubHeader align="center" color="textSecondary" variant="body1" text="Forgot Password?"/>
            </Link><br/>

            <Dialog
                open={state.dialogOpen}
                onClose={() => setState({
                    ...state,
                    dialogOpen: false
                })}
                maxWidth="md"
                fullWidth
            >
                <SubHeader text = "Reset Password" variant="h4"/>
                <DialogContent style={{ padding: '20px' }}>
                    <BodyText text=" Please enter your email, once you click on submit you should get an email with a temporary
                                      password. Please use the temporary password to login to your account.
                                      Once you login to the account you can then reset your password." />
                    <TextFieldInput
                        fullWidth={true}
                        required={true}
                        label="Email address"
                        name="forgotPasswordEmail"
                        value={state.forgotPasswordEmail}
                        onChange={handleChange}
                    />
                </DialogContent>
                <DialogActions style={{ padding: '20px' }}>
                    <RedButton
                        fullWidth={true}
                        label="Cancel"
                        handleSubmit={() => {
                            setState({
                                ...state,
                                dialogOpen: false
                            })
                        }}
                    />
                    <BlueButton
                        fullWidth={true}
                        label="Reset"
                        handleSubmit={() => {}}
                    />
                </DialogActions>
            </Dialog>

            <Link component={RouterLink} to={navigatingRoutes.dashboard.register} variant="h6">
                <SubHeader align="center" color="primary" variant="body1" text="Sign Up"/>
            </Link>
        </Container>
    );
};

export default Login;
