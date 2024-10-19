import OutletLayout from "Frontend/components/Layouts/DashboardLayout/OutletLayout";
import React from "react";
import SectionLayout from "Frontend/components/Layouts/DashboardLayout/SectionLayout";
import {DataItem} from "Frontend/api/Models/CentralModels/Data";
import {Grid} from "@mui/material";
import RenderInput, {InputType} from "Frontend/components/FormRenderer/RenderInput";
import {getURLParamValue, isEditMode, isViewMode} from "Frontend/components/commonHelperFunctions";
import {dataApi, leadApi, userApi} from "Frontend/api/ApiCalls";
import {useOutletContext} from "react-router-dom";
import {GridRowSelectionModel} from "@mui/x-data-grid";
import UserSelectionGrid from "Frontend/components/DataGridsForSelection/UserSelectionGrid";
import ActionFooter from "Frontend/components/FormRenderer/ActionFooter";
import {navigatingRoutes} from "Frontend/navigation";
import {LeadRequestModel, LeadResponseModel} from "Frontend/api/Models/CarrierModels/Lead";

const AddOrEditLead = () => {
    // state variables
    const [setLoading] = useOutletContext<any>();

    // state variables for data
    const [leadStatuses, setLeadStatuses] = React.useState<DataItem[]>([]);
    const [states, setStates] = React.useState<DataItem[]>([]);

    // state variables for lead personal details
    const [firstName, setFirstName] = React.useState<string>("");
    const [lastName, setLastName] = React.useState<string>("");
    const [email, setEmail] = React.useState<string>("");
    const [phone, setPhone] = React.useState<string>("");
    const [fax, setFax] = React.useState<string>("");
    const [title, setTitle] = React.useState<string>("");
    const [leadStatus, setLeadStatus] = React.useState<string>("");

    // state variables for address
    const [line1, setLine1] = React.useState<string>("");
    const [line2, setLine2] = React.useState<string>("");
    const [landmark, setLandmark] = React.useState<string>("");
    const [city, setCity] = React.useState<string>("");
    const [state, setState] = React.useState<string>("");
    const [zipCode, setZipCode] = React.useState<string>("");
    const [nameOnAddress, setNameOnAddress] = React.useState<string>("");
    const [phoneOnAddress, setPhoneOnAddress] = React.useState<string>("");

    // state variables for company
    const [company, setCompany] = React.useState<string>("");
    const [companySize, setCompanySize] = React.useState<number>(1);
    const [website, setWebsite] = React.useState<string>("");
    const [annualRevenue, setAnnualRevenue] = React.useState<string>("");

    // misc state variables
    const [notes, setNotes] = React.useState<string>("");

    // selected userIds
    const [selectedUserIds, setSelectedUserIds] = React.useState<GridRowSelectionModel>([]);

    // local variables
    const isEdit = isEditMode("leadId");
    const isView = isViewMode("leadId");
    let leadId = (isEdit || isView) ? parseInt(getURLParamValue("leadId") as string) : null;

    // function to fetch lead details by id
    const handleFetchLeadDetailsById = (leadId: number) => {
        leadApi(setLoading).getLeadDetailsById(leadId).then((leadResponseModel: LeadResponseModel) => {
            // set the lead personal details
            setFirstName(leadResponseModel.lead.firstName);
            setLastName(leadResponseModel.lead.lastName);
            setEmail(leadResponseModel.lead.email);
            setPhone(leadResponseModel.lead.phone);
            setFax(leadResponseModel.lead.fax ?? "");
            setTitle(leadResponseModel.lead.title ?? "");
            setLeadStatus(leadResponseModel.lead.leadStatus);
            setSelectedUserIds(leadResponseModel.lead.assignedAgentId ? [leadResponseModel.lead.assignedAgentId] : []);

            // set the lead company details
            setCompany(leadResponseModel.lead.company);
            setCompanySize(leadResponseModel.lead.companySize ?? 1);
            setWebsite(leadResponseModel.lead.website ?? "");
            setAnnualRevenue(leadResponseModel.lead.annualRevenue ?? "");

            // set the lead address details
            setLine1(leadResponseModel.address.line1);
            setLine2(leadResponseModel.address.line2 ?? "");
            setLandmark(leadResponseModel.address.landmark ?? "");
            setCity(leadResponseModel.address.city);
            setState(leadResponseModel.address.state);
            setZipCode(leadResponseModel.address.zipCode);
            setNameOnAddress(leadResponseModel.address.nameOnAddress ?? "");
            setPhoneOnAddress(leadResponseModel.address.phoneOnAddress ?? "");

            // set misc
            setNotes(leadResponseModel.lead.notes ?? "");
        });
    }

    // function to create/edit lead
    const handleSubmit = () => {
        let requestData: LeadRequestModel = {
            lead: {
                firstName: firstName,
                lastName: lastName,
                email: email,
                phone: phone,
                fax: fax,
                title: title,
                leadStatus: leadStatus,
                leadId: isEdit ? leadId as number : undefined,
                company: company,
                companySize: companySize,
                website: website,
                annualRevenue: annualRevenue,
                notes: notes,
                assignedAgentId: selectedUserIds && selectedUserIds.length > 0 ? parseInt(selectedUserIds[0].toString()) : undefined
            },
            address: {
                line1: line1,
                line2: line2,
                landmark: landmark,
                city: city,
                state: state,
                zipCode: zipCode,
                nameOnAddress: nameOnAddress,
                phoneOnAddress: phoneOnAddress
            },
        };

        if(isEdit) {
            leadApi(setLoading).updateLead(requestData).then(() => {});
        }
        else{
            leadApi(setLoading).createLead(requestData).then(() => {});
        }
    }

    React.useEffect(() => {
        dataApi(setLoading).getStates().then((_states: DataItem[]) => {
            setStates(_states);
        });

        dataApi(setLoading).getLeadStatuses().then((_leadStatuses: DataItem[]) => {
            setLeadStatuses(_leadStatuses);
        });

        if(isView || isEdit) {
            handleFetchLeadDetailsById(leadId as number);
        }
    }, []);

    return(
        <OutletLayout card={false}>
            <SectionLayout
                sectionTitle="Lead Details"
                sectionSubTitle="This information can be edited"
            >
                <Grid item md={6} xs={12}>
                    <RenderInput
                        inputType={InputType.TextField}
                        label="First Name"
                        value={firstName}
                        handleChange={React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => setFirstName(event.target.value), [firstName])}
                        isView={isView}
                    />
                </Grid>
                <Grid item md={6} xs={12}>
                    <RenderInput
                        inputType={InputType.TextField}
                        label="Last Name"
                        value={lastName}
                        handleChange={React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => setLastName(event.target.value), [lastName])}
                        isView={isView}
                    />
                </Grid>
                <Grid item md={6} xs={12}>
                    <RenderInput
                        inputType={InputType.TextField}
                        label="Email"
                        value={email}
                        handleChange={React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => setEmail(event.target.value), [email])}
                        isView={isView}
                    />
                </Grid>
                <Grid item md={6} xs={12}>
                    <RenderInput
                        inputType={InputType.Phone}
                        label="Phone"
                        value={phone}
                        handleChange={React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => setPhone(event.target.value), [phone])}
                        isView={isView}
                    />
                </Grid>
                <Grid item md={6} xs={12}>
                    <RenderInput
                        inputType={InputType.Phone}
                        label="Fax"
                        required={false}
                        value={fax}
                        handleChange={React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => setFax(event.target.value), [fax])}
                        isView={isView}
                    />
                </Grid>
                <Grid item md={6} xs={12}>
                    <RenderInput
                        inputType={InputType.TextField}
                        label="Title"
                        value={title}
                        handleChange={React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => setTitle(event.target.value), [title])}
                        isView={isView}
                    />
                </Grid>
                <Grid item md={6} xs={12}>
                    <RenderInput
                        inputType={InputType.Dropdown}
                        label="Lead Status"
                        value={leadStatus}
                        handleChange={React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => setLeadStatus(event.target.value), [leadStatus, leadStatuses])}
                        data={leadStatuses}
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
            </SectionLayout><br/>

            <SectionLayout
                sectionTitle="Company Details"
                sectionSubTitle="This information can be edited"
            >
                <Grid item md={6} xs={12}>
                    <RenderInput
                        inputType={InputType.TextField}
                        label="Company"
                        value={company}
                        handleChange={React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => setCompany(event.target.value), [company])}
                        isView={isView}
                    />
                </Grid>
                <Grid item md={6} xs={12}>
                    <RenderInput
                        inputType={InputType.NumberField}
                        label="Company Size"
                        required={false}
                        value={companySize.toString()}
                        handleChange={React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => setCompanySize(parseInt(event.target.value)), [companySize])}
                        isView={isView}
                    />
                </Grid>
                <Grid item md={6} xs={12}>
                    <RenderInput
                        inputType={InputType.TextField}
                        label="Website"
                        required={false}
                        value={website}
                        handleChange={React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => setWebsite(event.target.value), [website])}
                        isView={isView}
                    />
                </Grid>
                <Grid item md={6} xs={12}>
                    <RenderInput
                        inputType={InputType.AmountField}
                        label="Annual Revenue"
                        required={false}
                        value={annualRevenue}
                        handleChange={React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => setAnnualRevenue(event.target.value), [annualRevenue])}
                        isView={isView}
                    />
                </Grid>
            </SectionLayout><br/>
            <SectionLayout
                sectionTitle="Misc Information"
                sectionSubTitle="This information can be edited"
            >
                <Grid item md={12} xs={12}>
                    <RenderInput
                        inputType={InputType.TextArea}
                        label="Notes"
                        value={notes}
                        required={false}
                        handleChange={React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => setNotes(event.target.value), [notes])}
                        isView={isView}
                    />
                </Grid>
            </SectionLayout><br/>

            <SectionLayout
                sectionTitle="Assigned Agent"
                sectionSubTitle="Select one agent/user that will be assigned to handle the given lead."
            >
                <Grid item md={12} xs={12}>
                    <UserSelectionGrid
                        isView={isView}
                        setLoading={setLoading}
                        selectedUserIds={selectedUserIds}
                        setSelectedUserIds={React.useCallback((selectedUserIds: GridRowSelectionModel) => setSelectedUserIds(selectedUserIds), [selectedUserIds])}
                        singleSelection={true}
                    />
                </Grid>
            </SectionLayout><br/>

            {isView ?
                <></> :
                <ActionFooter
                    paramValue="leadId"
                    handleSubmit={handleSubmit}
                    cancelUrl={navigatingRoutes.dashboard.leads}
                    buttonText="Lead"
                />
            }
        </OutletLayout>
    );
}
export default AddOrEditLead;