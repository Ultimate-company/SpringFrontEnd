import {getURLParamValue, isEditMode, isViewMode } from "Frontend/components/commonHelperFunctions";
import React from "react";
import {useOutletContext} from "react-router-dom";
import {dataApi, leadApi, pickupLocationApi} from "Frontend/api/ApiCalls";
import {
    PickupLocationRequestModel,
    PickupLocationResponseModel
} from "Frontend/api/Models/CarrierModels/PickupLocation";
import {DataItem} from "Frontend/api/Models/CentralModels/Data";
import SectionLayout from "Frontend/components/Layouts/DashboardLayout/SectionLayout";
import OutletLayout from "Frontend/components/Layouts/DashboardLayout/OutletLayout";
import RenderInput, {InputType} from "Frontend/components/FormRenderer/RenderInput";
import {Grid} from "@mui/material";
import {navigatingRoutes} from "Frontend/navigation";
import ActionFooter from "Frontend/components/FormRenderer/ActionFooter";

const AddOrEditPickupLocation = () => {
    // state variables
    const [setLoading] = useOutletContext<any>();

    // state variables for data
    const [states, setStates] = React.useState<DataItem[]>([]);

    // state variables for pickup location details
    const [addressNickName, setAddressNickName] = React.useState<string>("");

    // state variables for address
    const [line1, setLine1] = React.useState<string>("");
    const [line2, setLine2] = React.useState<string>("");
    const [landmark, setLandmark] = React.useState<string>("");
    const [city, setCity] = React.useState<string>("");
    const [state, setState] = React.useState<string>("");
    const [zipCode, setZipCode] = React.useState<string>("");
    const [nameOnAddress, setNameOnAddress] = React.useState<string>("");
    const [phoneOnAddress, setPhoneOnAddress] = React.useState<string>("");
    const [emailAtAddress, setEmailAtAddress] = React.useState<string>("");

    // misc state variables
    const [notes, setNotes] = React.useState<string>("");

    // local variables
    const isEdit = isEditMode("pickupLocationId");
    const isView = isViewMode("pickupLocationId");
    let pickupLocationId = (isEdit || isView) ? parseInt(getURLParamValue("pickupLocationId") as string) : null;

    // function to fetch pickup location details by id
    const handleFetchPickupLocationDetailsById = (pickupLocationId: number) => {
        pickupLocationApi(setLoading).getPickupLocationById(pickupLocationId).then((pickupLocationResponseModel: PickupLocationResponseModel) => {
            // set the pickup location details
            setAddressNickName(pickupLocationResponseModel.pickupLocation.addressNickName);

            // set the lead address details
            setLine1(pickupLocationResponseModel.address.line1);
            setLine2(pickupLocationResponseModel.address.line2 ?? "");
            setLandmark(pickupLocationResponseModel.address.landmark ?? "");
            setCity(pickupLocationResponseModel.address.city);
            setState(pickupLocationResponseModel.address.state);
            setZipCode(pickupLocationResponseModel.address.zipCode);
            setNameOnAddress(pickupLocationResponseModel.address.nameOnAddress ?? "");
            setPhoneOnAddress(pickupLocationResponseModel.address.phoneOnAddress ?? "");
            setEmailAtAddress(pickupLocationResponseModel.address.emailAtAddress ?? "");

            // set misc
            setNotes(pickupLocationResponseModel.pickupLocation.notes ?? "");
        });
    }

    // function to create/edit pickup location
    const handleSubmit = () => {
        let requestData: PickupLocationRequestModel = {
            pickupLocation: {
                pickupLocationId: isEdit ? pickupLocationId as number : undefined,
                addressNickName: addressNickName,
                notes: notes
            },
            address: {
                line1: line1,
                line2: line2,
                landmark: landmark,
                city: city,
                state: state,
                zipCode: zipCode,
                nameOnAddress: nameOnAddress,
                phoneOnAddress: phoneOnAddress,
                emailAtAddress: emailAtAddress
            },
        }
        if(isEdit) {
            pickupLocationApi(setLoading).updatePickupLocation(requestData).then(() => {});
        }
        else {
            pickupLocationApi(setLoading).createPickupLocation(requestData).then(() => {});
        }
    }

    React.useEffect(() => {
        dataApi(setLoading).getStates().then((_states: DataItem[]) => {
            setStates(_states);
        });

        if(isView || isEdit) {
            handleFetchPickupLocationDetailsById(pickupLocationId as number);
        }
    }, []);

    return (
        <OutletLayout card={false}>
            <SectionLayout
                sectionTitle="Pickup location Information"
                sectionSubTitle="This information can be edited"
            >
                <Grid item md={12} xs={12}>
                    <RenderInput
                        inputType={InputType.TextField}
                        label="Address nick name"
                        value={addressNickName}
                        handleChange={React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => setAddressNickName(event.target.value), [addressNickName])}
                        isView={isView}
                    />
                </Grid>
            </SectionLayout><br/>

            <SectionLayout
                sectionTitle="Address Details"
                sectionSubTitle="This information can be edited"
            >
                <Grid item md={6} xs={12}>
                    <RenderInput
                        inputType={InputType.TextField}
                        label="Line 1"
                        value={line1}
                        handleChange={React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => setLine1(event.target.value), [line1])}
                        isView={isView}
                    />
                </Grid>
                <Grid item md={6} xs={12}>
                    <RenderInput
                        inputType={InputType.TextField}
                        label="Line 2"
                        required={false}
                        value={line2}
                        handleChange={React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => setLine2(event.target.value), [line2])}
                        isView={isView}
                    />
                </Grid>
                <Grid item md={6} xs={12}>
                    <RenderInput
                        inputType={InputType.TextField}
                        label="Landmark"
                        required={false}
                        value={landmark}
                        handleChange={React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => setLandmark(event.target.value), [landmark])}
                        isView={isView}
                    />
                </Grid>
                <Grid item md={6} xs={12}>
                    <RenderInput
                        inputType={InputType.TextField}
                        label="City"
                        value={city}
                        handleChange={React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => setCity(event.target.value), [city])}
                        isView={isView}
                    />
                </Grid>
                <Grid item md={6} xs={12}>
                    <RenderInput
                        inputType={InputType.Dropdown}
                        label="State"
                        value={state}
                        data={states}
                        handleChange={React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => setState(event.target.value), [state, states])}
                        isView={isView}
                    />
                </Grid>
                <Grid item md={6} xs={12}>
                    <RenderInput
                        inputType={InputType.TextField}
                        label="Zip Code"
                        value={zipCode}
                        handleChange={React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => setZipCode(event.target.value), [zipCode])}
                        isView={isView}
                    />
                </Grid>
                <Grid item md={6} xs={12}>
                    <RenderInput
                        inputType={InputType.TextField}
                        label="Name on Address"
                        value={nameOnAddress}
                        handleChange={React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => setNameOnAddress(event.target.value), [nameOnAddress])}
                        isView={isView}
                    />
                </Grid>
                <Grid item md={6} xs={12}>
                    <RenderInput
                        inputType={InputType.Phone}
                        label="Phone on Address"
                        value={phoneOnAddress}
                        handleChange={React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => setPhoneOnAddress(event.target.value), [phoneOnAddress])}
                        isView={isView}
                    />
                </Grid>
                <Grid item md={6} xs={12}>
                    <RenderInput
                        inputType={InputType.TextField}
                        label="Email at Address"
                        value={emailAtAddress}
                        required={false}
                        handleChange={React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => setEmailAtAddress(event.target.value), [emailAtAddress])}
                        isView={isView}
                    />
                </Grid>
            </SectionLayout><br/>

            {isView ?
                <></> :
                <ActionFooter
                    paramValue="pickupLocationId"
                    handleSubmit={handleSubmit}
                    cancelUrl={navigatingRoutes.dashboard.pickupLocations}
                    buttonText="Pickup Location"
                />
            }
        </OutletLayout>
    );


}
export default AddOrEditPickupLocation