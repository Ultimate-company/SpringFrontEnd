import {Link as RouterLink} from "react-router-dom";
import {
    Container,
    Link
} from "@mui/material";
import React from 'react';
import {loginApi} from "Frontend/api/ApiCalls";
import {LoginRequestModel} from "Frontend/api/Models/CentralModels/Login";
import Header from "../../components/Fonts/Header";
import SubHeader from "../../components/Fonts/SubHeader";
import TextFieldInput from "../../components/FormInputs/TextFieldInput";
import PasswordInput from "../../components/FormInputs/PasswordInput";
import CheckboxInput from "../../components/FormInputs/CheckboxInput";
import BlueButton from "../../components/FormInputs/BlueButton";
import DateInput from "Frontend/components/FormInputs/DateInput";
import {navigatingRoutes} from "Frontend/navigation";

interface RegisterState {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dob: string;
    password: string;
    confirmPassword: string;
    termsAndConditions: boolean;
    showPassword: boolean;
}
const defaultRegisterState: RegisterState = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dob: "",
    password: "",
    confirmPassword: "",
    termsAndConditions: false,
    showPassword: false,
};

const Register = () => {
    // state variables
    const [state, setState] = React.useState<RegisterState>(defaultRegisterState);

    // custom functions
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.name == "termsAndConditions") {
            setState({
                ...state,
                [event.target.name]: event.target.checked,
            });
        } else {
            setState({
                ...state,
                [event.target.name]: event.target.value,
            });
        }
    };

    const handleShowPasswordStateChange = () => {
        setState({
            ...state,
            showPassword: !state.showPassword,
        })
    }

    const handleSubmit = () => {
        let loginRequestModel:Partial<LoginRequestModel> = {
            firstName: state.firstName,
            lastName: state.lastName,
            loginName: state.email,
            password: state.password,
            confirmPassword: state.confirmPassword,
            isTermsAndConditions: state.termsAndConditions,
            dob: state.dob,
            phone: state.phone
        };
        loginApi.signUp(loginRequestModel as LoginRequestModel).then(() => {});
    }

    // react render function
    return (
        <Container maxWidth="md" style={{ border: "1px solid black", padding:100}}>
            <Header label="Create account"/>
            <SubHeader text="Use your email and phone to create new account"/><br/>
            <TextFieldInput
                fullWidth={true}
                required={true}
                label="First Name"
                name="firstName"
                value={state.firstName}
                onChange={handleChange}
            /><br/>
            <TextFieldInput
                fullWidth={true}
                required={true}
                label="Last Name"
                name="lastName"
                value={state.lastName}
                onChange={handleChange}
            /><br/>
            <TextFieldInput
                fullWidth={true}
                required={true}
                label="Email Address"
                name="email"
                value={state.email}
                onChange={handleChange}
            /><br/>
            <TextFieldInput
                maxLength={10}
                fullWidth={true}
                required={true}
                label="Phone"
                name="phone"
                value={state.phone}
                onChange={handleChange}
            /><br/>
            <DateInput
                fullWidth={true}
                required={true}
                label="Date of birth"
                name="dob"
                value={state.dob}
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
            <PasswordInput
                fullWidth={true}
                required={true}
                state={state.showPassword}
                label="Confirm Password"
                name="confirmPassword"
                value={state.confirmPassword}
                onChange={handleChange}
                handleShowPasswordStateChange={handleShowPasswordStateChange}
            /><br/><br/>
            <CheckboxInput
                label="Please Agree to the given terms and conditions"
                checked={state.termsAndConditions}
                name="termsAndConditions"
                onChange={handleChange}
            /><br/>
            <BlueButton
                fullWidth={true}
                label="Sign Up"
                handleSubmit={handleSubmit}
            /><br/><br/>

            <Link component={RouterLink} to={navigatingRoutes.dashboard.login} variant="h6">
                <SubHeader align="center" color="primary" variant="body1" text="Sign In"/>
            </Link>
        </Container>
    );
};

export default Register;