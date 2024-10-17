import {Card, Divider, Grid} from "@mui/material";
import React from "react";
import SectionLayout from "Frontend/components/Layouts/DashboardLayout/SectionLayout";
import RenderInput, {InputType} from "Frontend/components/FormRenderer/RenderInput";
import BlueButton from "Frontend/components/FormInputs/BlueButton";
import {DataItem} from "Frontend/api/Models/CentralModels/Data";
interface AddPaymentDetailsProps {
    paymentMode: string;
    setPaymentMode: (paymentMode: string) => void;

    line1: string;
    setLine1: (line1: string) => void;

    line2: string;
    setLine2: (line2: string) => void;

    city: string;
    setCity: (city: string) => void;

    state: string;
    setState: (state: string) => void;
    states: DataItem[];

    zipCode: string;
    setZipCode: (zipCode: string) => void;

    isView: boolean;
}
const AddPaymentDetails = (props: AddPaymentDetailsProps) => {
    // RazorPay payment function
    async function displayRazorpay() {
        new Promise(resolve => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });

        /*
            Algorithm:
            1. Validate all the data
            2. create a razorpay order id with the required payment
            3. get the required data from order controller
            4. open razorpay payment link
            5. on success create a order and shiprocket order
        */
    }
    return(
        <SectionLayout
            sectionTitle="Payment Details"
            sectionSubTitle="Enter billing address and payment mode"
        >
            <Grid item md={6} xs={12}>
                <RenderInput
                    inputType={InputType.Radio}
                    label="Payment Mode"
                    value={props.paymentMode}
                    handleChange={React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => props.setPaymentMode(event.target.value), [props.paymentMode])}
                    isView={props.isView}
                    data={[
                        {
                            title: "COD",
                            value: "COD",
                            key: "COD"
                        },
                        {
                            title: "Defer",
                            value: "Defer",
                            key: "Defer"
                        },
                        {
                            title: "Pay Now",
                            value: "Pay Now",
                            key: "Pay Now"
                        }
                    ]}
                />
            </Grid>
            {
                props.paymentMode == "Pay Now" ?
                    <>
                        <Grid item md={12} xs={12}>
                            <BlueButton
                                label = "Pay Now"
                                handleSubmit={displayRazorpay}
                            />
                        </Grid>
                        <Grid item md={6} xs={12}>
                            <RenderInput
                                inputType={InputType.TextField}
                                label="Line 1"
                                value={props.line1}
                                handleChange={React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => props.setLine1(event.target.value), [props.line1])}
                                isView={props.isView}
                            />
                        </Grid>
                        <Grid item md={6} xs={12}>
                            <RenderInput
                                inputType={InputType.TextField}
                                label="Line 2"
                                required={false}
                                value={props.line2}
                                handleChange={React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => props.setLine2(event.target.value), [props.line2])}
                                isView={props.isView}
                            />
                        </Grid>
                        <Grid item md={6} xs={12}>
                            <RenderInput
                                inputType={InputType.TextField}
                                label="City"
                                value={props.city}
                                handleChange={React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => props.setCity(event.target.value), [props.city])}
                                isView={props.isView}
                            />
                        </Grid>
                        <Grid item md={6} xs={12}>
                            <RenderInput
                                inputType={InputType.Dropdown}
                                label="State"
                                value={props.state}
                                data={props.states}
                                handleChange={React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => props.setState(event.target.value), [props.state, props.states])}
                                isView={props.isView}
                            />
                        </Grid>
                        <Grid item md={6} xs={12}>
                            <RenderInput
                                inputType={InputType.TextField}
                                label="Zip Code"
                                value={props.zipCode}
                                handleChange={React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => props.setZipCode(event.target.value), [props.zipCode])}
                                isView={props.isView}
                            />
                        </Grid>
                    </>
                     :
                    <></>
            }
        </SectionLayout>
    )
}
export default AddPaymentDetails;