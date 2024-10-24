import {Autocomplete, Chip, FormControl, Grid, TextField} from "@mui/material";
import RenderInput, {InputType} from "Frontend/components/FormRenderer/RenderInput";
import React from "react";
import OutletLayout from "Frontend/components/Layouts/DashboardLayout/OutletLayout";
import SectionLayout from "Frontend/components/Layouts/DashboardLayout/SectionLayout";
import {RichTextEditorRef} from "mui-tiptap";
import {carrierUrls, productUrls} from "Frontend/api/Endpoints";
import BlueButton from "Frontend/components/FormInputs/BlueButton";
import ActionFooter from "Frontend/components/FormRenderer/ActionFooter";
import {navigatingRoutes} from "Frontend/navigation";
import {carrierApi, pickupLocationApi, productApi, userApi} from "Frontend/api/ApiCalls";
import {useOutletContext} from "react-router-dom";
import {Carrier} from "Frontend/api/Models/CentralModels/Carrier";
import {imageToByteArrayMap} from "Frontend/components/commonHelperFunctions";
import {permissionChecks} from "Frontend/api/Models/CarrierModels/Permissions";
import {Permissions} from "Frontend/api/Models/CentralModels/User";

// Predefined array of issue types
const predefinedIssueTypes = [
    "Bug",
    "Task",
    "Story",
    "Epic",
    "Subtask",
    "Improvement",
    "New Feature",
    "Incident",
    "Change Request",
    "Support Request",
    "Requirement",
    "Test Case",
    "Test Plan",
    "Research",
    "Design",
    "Risk",
    "Task Force",
    "Story Point",
    "Release",
    "Documentation",
    "Configuration",
    "Refactor",
    "Technical Debt"
];


const AddOrEditApiKeys = () => {
    // state variables
    const [setLoading] = useOutletContext<any>();

    // carrier details
    const [name, setName] = React.useState<string>("");
    const [website, setWebsite] = React.useState<string>("");
    const [description, setDescription] = React.useState<string>("");

    // database details
    const [databaseName, setDatabaseName] = React.useState<string>("");

    // shiprocket keys
    const [shiprocketEmail, setShiprocketEmail] = React.useState<string>("");
    const [shiprocketPassword, setShiprocketPassword] = React.useState<string>("");

    // razorpay api keys
    const [razorpayApiKey, setRazorpayApiKey] = React.useState<string>("");
    const [razorpayApiSecret, setRazorpayapiSecret] = React.useState<string>("");

    // send grid api keys
    const [sendGridApiKey, setSendGridApiKey] = React.useState<string>("");
    const [sendGridEmailAddress, setSendGridEmailAddress] = React.useState<string>("");
    const [sendGridSenderName, setSendGridSenderName] = React.useState<string>("");

    // jira keys
    const [jiraUserName, setJiraUserName] = React.useState<string>("");
    const [jiraPassword, setJiraPassword] = React.useState<string>("");
    const [jiraProjectUrl, setJiraProjectUrl] = React.useState<string>("");
    const [jiraProjectKey, setJiraProjectKey] = React.useState<string>("");
    const [issueTypes, setIssueTypes] = React.useState<string>("");

    // other local state variables
    const [carrierId, setCarrierId] = React.useState<number>();
    const [formData, setFormData] = React.useState<FormData>(new FormData());
    const [imageBase64, setImageBase64] = React.useState<string>("");
    const rteRef = React.useRef<RichTextEditorRef>(null);
    const [isView, setIsView] = React.useState<boolean>(false);
    let imageKey = "carrierImage";

    const handleSubmit = () => {
        setLoading(true);
        let requestData: Carrier = {
            carrierId: carrierId as number,

            // carrier details
            name: name,
            website: website,
            description: rteRef.current?.editor?.getHTML() ?? "",
            image: imageBase64,

            // database details
            databaseName: databaseName,

            // shiprocket keys
            shipRocketEmail: shiprocketEmail,
            shipRocketPassword: shiprocketPassword,

            // razorpay keys
            razorpayApikey: razorpayApiKey,
            razorpayApiSecret: razorpayApiSecret,

            // sendgrid keys
            sendgridApikey: sendGridApiKey,
            sendgridEmailAddress: sendGridEmailAddress,
            sendgridSenderName: sendGridSenderName,

            // jira keys
            jiraUserName: jiraUserName,
            jiraPassword: jiraPassword,
            jiraProjectUrl: jiraProjectUrl,
            jiraProjectKey: jiraProjectKey,
            issueTypes: issueTypes
        }

        carrierApi.updateApiKeys(requestData)
            .then((_: boolean) => {
                setLoading(false);
            });
    }
    const handleImageUpload = (event: any) => {
        // open image
        document.getElementById(event.target.id + "Input")?.click();

        // save image to form data
        //--> done in file upload change

        // load image to div
        //-->done in file upload change
    };
    const fileUploadChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const fileInput = event.target;
        const ImageId = fileInput.id.replace("Input", "");
        const file = fileInput.files?.[0];

        if (file) {
            formData.append(ImageId, file);
            const imageElement = document.getElementById(ImageId) as HTMLImageElement;
            if (imageElement) {
                imageElement.src = URL.createObjectURL(file);
            }

            // set base 64 images
            let images = new Map<string, File | undefined>();
            images.set(imageKey, file as File);
            imageToByteArrayMap(images)
                .then((response: Map<string, string>) => {
                    setImageBase64(response.get(imageKey) as string);
                });

            setFormData(formData);
        }
    };
    const removeFile = () => {
        // Reset form data
        setFormData(new FormData());
        setImageBase64("");

        // Reset each image and input field
        const imageElement = document.getElementById(imageKey) as HTMLImageElement | null;
        const inputElement = document.getElementById(imageKey + "Input") as HTMLInputElement | null;

        if (imageElement) {
            imageElement.src = productUrls.getStaticImage + `?imageName=Blank.png`;
        }
        if (inputElement) {
            inputElement.value = "";
        }
    };

    React.useEffect(() => {
        userApi(setLoading).getLoggedInUserPermissions()
            .then((permissions: Permissions) => {
                const permissionSplit = Object.values(permissions)
                    .flatMap(str => typeof str === 'string'? str.split(',') : []);

                if (permissionSplit.includes(permissionChecks.apiKeyPermissions.insertApiKeys) ||
                    permissionSplit.includes(permissionChecks.apiKeyPermissions.updateApiKeys)) {
                    setIsView(false);
                }
                else {
                    setIsView(true);
                }
            });

        carrierApi.getLoggedInCarrier()
            .then((carrier : Carrier) => {
                // set carrier details
                setCarrierId(carrier.carrierId);
                setName(carrier.name ?? "");
                setWebsite(carrier.website ?? "");
                const proseMirrorDiv = document.querySelectorAll('.ProseMirror');
                if(proseMirrorDiv.length >= 1 && proseMirrorDiv[0] != null) {
                    proseMirrorDiv[0].innerHTML = carrier.description ?? "";
                }

                // set database details
                setDatabaseName(carrier.databaseName ?? "");

                // set shiprocket keys
                setShiprocketEmail(carrier.shipRocketEmail ?? "");
                setShiprocketPassword(carrier.shipRocketPassword ?? "");

                // set razorpay keys
                setRazorpayApiKey(carrier.razorpayApikey ?? "");
                setRazorpayapiSecret(carrier.razorpayApiSecret ?? "");

                // set sendgrid keys
                setSendGridApiKey(carrier.sendgridApikey ?? "");
                setSendGridEmailAddress(carrier.sendgridEmailAddress ?? "");
                setSendGridSenderName(carrier.sendgridSenderName ?? "");

                // set jira keys
                setJiraUserName(carrier.jiraUserName ?? "");
                setJiraPassword(carrier.jiraPassword ?? "");
                setJiraProjectUrl(carrier.jiraProjectUrl ?? "");
                setJiraProjectKey(carrier.jiraProjectKey ?? "");
                setIssueTypes(carrier.issueTypes ?? "");

                // set the image
                setImageBase64(carrier.imageBase64 ?? "");
                const imageElement = document.getElementById("carrierImage") as HTMLImageElement | null;
                const inputElement = document.getElementById("carrierImage" + "Input") as HTMLInputElement | null;

                // Reset the image source and input value
                if (imageElement) {
                    imageElement.src = carrierUrls.getCarrierImage + `?imageName=${carrier.image}`;
                }
                if (inputElement) {
                    inputElement.value = "";
                }
            });
    }, []);

    return(
        <OutletLayout card={false}>
            <SectionLayout
                sectionTitle = "Carrier Details"
                sectionSubTitle = "This information can be edited"
            >
                <Grid item md={6} xs={12}>
                    <RenderInput
                        inputType={InputType.TextField}
                        label="Carrier Name"
                        value={name}
                        handleChange={React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => setName(event.target.value), [name])}
                        isView={isView}
                        disabled={true}
                    />
                </Grid>
                <Grid item md={6} xs={12}>
                    <RenderInput
                        inputType={InputType.TextField}
                        label="Website"
                        value={website}
                        handleChange={React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => setWebsite(event.target.value), [website])}
                        isView={isView}
                    />
                </Grid>
                <Grid item md={12} xs={12}>
                    <RenderInput
                        inputType={InputType.RichTextArea}
                        rteRef={rteRef}
                        label="Carrier Description"
                        isView={isView}
                        value={description}
                    />
                </Grid>
                <Grid container justifyContent="center" item md={12} xs={12}>
                    <img
                        id={imageKey}
                        onClick={handleImageUpload}
                        style={{
                            border: "2px dotted black",
                            height: 200,
                            width: 200,
                        }}
                        src={carrierUrls.getCarrierImage + `?carrierId=${carrierId}`}
                        alt={""}
                    />
                    {
                        !isView ?
                            <input
                                accept="image/*"
                                type="file"
                                id={imageKey + "Input"}
                                style={{width: 0, height: 0, overflow: "hidden"}}
                                onChange={fileUploadChange}
                            /> : <></>
                    }
                    {
                        !isView ? <Grid item xs={12}>
                            <Grid container justifyContent="center" spacing={3}>
                                <Grid
                                    style={{marginTop:20}}
                                    key="Main"
                                    item>
                                    <BlueButton
                                        label="Remove Images"
                                        handleSubmit={removeFile}
                                    />
                                </Grid>
                            </Grid>
                        </Grid> : <></>
                    }
                </Grid>
            </SectionLayout><br/>

            <SectionLayout
                sectionTitle = "Database Details"
                sectionSubTitle = "This information can be edited"
            >
                <Grid item md={6} xs={12}>
                    <RenderInput
                        inputType={InputType.TextField}
                        label="Database Name"
                        value={databaseName}
                        handleChange={React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => setDatabaseName(event.target.value), [databaseName])}
                        isView={isView}
                        disabled={true}
                    />
                </Grid>
            </SectionLayout><br/>

            <SectionLayout
                sectionTitle = "Shiprocket Keys"
                sectionSubTitle = "This information can be edited"
            >
                <Grid item md={6} xs={12}>
                    <RenderInput
                        inputType={InputType.TextField}
                        label="Shiprocket email"
                        value={shiprocketEmail}
                        handleChange={React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => setShiprocketEmail(event.target.value), [shiprocketEmail])}
                        isView={isView}
                    />
                </Grid>
                <Grid item md={6} xs={12}>
                    <RenderInput
                        inputType={InputType.TextField}
                        label="Shiprocket password"
                        value={shiprocketPassword}
                        handleChange={React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => setShiprocketPassword(event.target.value), [shiprocketPassword])}
                        isView={isView}
                    />
                </Grid>
            </SectionLayout> <br/>

            <SectionLayout
                sectionTitle = "Razorpay api Keys"
                sectionSubTitle = "This information can be edited"
            >
                <Grid item md={6} xs={12}>
                    <RenderInput
                        inputType={InputType.TextField}
                        label="Razorpay key"
                        value={razorpayApiKey}
                        handleChange={React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => setRazorpayApiKey(event.target.value), [razorpayApiKey])}
                        isView={isView}
                    />
                </Grid>
                <Grid item md={6} xs={12}>
                    <RenderInput
                        inputType={InputType.TextField}
                        label="Razorpay api secret"
                        value={razorpayApiSecret}
                        handleChange={React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => setRazorpayapiSecret(event.target.value), [razorpayApiSecret])}
                        isView={isView}
                    />
                </Grid>
            </SectionLayout> <br/>

            <SectionLayout
                sectionTitle = "Sendgrid Keys"
                sectionSubTitle = "This information can be edited"
            >
                <Grid item md={6} xs={12}>
                    <RenderInput
                        inputType={InputType.TextField}
                        label="Sendgrid api key"
                        value={sendGridApiKey}
                        handleChange={React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => setSendGridApiKey(event.target.value), [sendGridApiKey])}
                        isView={isView}
                    />
                </Grid>
                <Grid item md={6} xs={12}>
                    <RenderInput
                        inputType={InputType.TextField}
                        label="Sengrid email address"
                        value={sendGridEmailAddress}
                        handleChange={React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => setSendGridEmailAddress(event.target.value), [sendGridEmailAddress])}
                        isView={isView}
                    />
                </Grid>
                <Grid item md={6} xs={12}>
                    <RenderInput
                        inputType={InputType.TextField}
                        label="Sengrid sender name"
                        value={sendGridSenderName}
                        handleChange={React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => setSendGridSenderName(event.target.value), [sendGridSenderName])}
                        isView={isView}
                    />
                </Grid>
            </SectionLayout> <br/>

            <SectionLayout
                sectionTitle = "Jira keys"
                sectionSubTitle = "This information can be edited"
            >
                <Grid item md={6} xs={12}>
                    <RenderInput
                        inputType={InputType.TextField}
                        label="Username"
                        value={jiraUserName}
                        handleChange={React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => setJiraUserName(event.target.value), [jiraUserName])}
                        isView={isView}
                    />
                </Grid>
                <Grid item md={6} xs={12}>
                    <RenderInput
                        inputType={InputType.TextField}
                        label="Password"
                        value={jiraPassword}
                        handleChange={React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => setJiraPassword(event.target.value), [jiraPassword])}
                        isView={isView}
                    />
                </Grid>
                <Grid item md={6} xs={12}>
                    <RenderInput
                        inputType={InputType.TextField}
                        label="Project Url"
                        value={jiraProjectUrl}
                        handleChange={React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => setJiraProjectUrl(event.target.value), [jiraProjectUrl])}
                        isView={isView}
                    />
                </Grid>
                <Grid item md={6} xs={12}>
                    <RenderInput
                        inputType={InputType.TextField}
                        label="Project Key"
                        value={jiraProjectKey}
                        handleChange={React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => setJiraProjectKey(event.target.value), [jiraProjectKey])}
                        isView={isView}
                    />
                </Grid>
                <Grid item md={6} xs={12}>
                    <Autocomplete
                        multiple
                        id="tags-filled"
                        options = {[
                            ...predefinedIssueTypes,
                            ...(issueTypes ? issueTypes.split(",").map(option => option.trim()).filter(option => !new Set(predefinedIssueTypes).has(option)) : [])
                        ]}
                        onChange={(event, newValue) => {
                            setIssueTypes(newValue.join(","));
                        }}
                        value={issueTypes && issueTypes.length > 0
                            ? issueTypes.split(",").map((option: string) => option.trim())
                            : []}
                        freeSolo
                        renderTags={(value: readonly string[], getTagProps) =>
                            value.map((option: string, index: number) => {
                                const { key, ...tagProps } = getTagProps({ index });
                                return (
                                    <Chip variant="outlined" label={option} key={key} {...tagProps} />
                                );
                            })
                        }
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                inputProps={{
                                    ...params.inputProps,
                                    autoComplete: "new-password", // disable autocomplete and autofill
                                }}
                                margin="dense"
                                required={true}
                                label="Issue Types"
                                InputLabelProps={{ shrink: true }}
                            />
                        )}
                    />
                </Grid>
            </SectionLayout> <br/>
            {isView ?
                <></> :
                <ActionFooter
                    paramValue="keyId"
                    handleSubmit={handleSubmit}
                    cancelUrl={navigatingRoutes.dashboard.dashboard}
                    customButtonText="Update carrier config"
                />
            }
        </OutletLayout>
    );
}
export default AddOrEditApiKeys;