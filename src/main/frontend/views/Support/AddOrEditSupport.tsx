import OutletLayout from "Frontend/components/Layouts/DashboardLayout/OutletLayout";
import SectionLayout from "Frontend/components/Layouts/DashboardLayout/SectionLayout";
import RenderInput, {InputType} from "Frontend/components/FormRenderer/RenderInput";
import React, {ChangeEvent} from "react";
import {Grid, List, ListItem, ListItemAvatar, ListItemText, IconButton, Avatar} from "@mui/material";
import {useOutletContext} from "react-router-dom";
import {
    getFileIcon,
    getURLParamValue,
    imageToByteArrayMap,
    isEditMode,
    isViewMode
} from "Frontend/components/commonHelperFunctions";
import {
    type RichTextEditorRef,
} from "mui-tiptap";
import ActionFooter from "Frontend/components/FormRenderer/ActionFooter";
import {navigatingRoutes} from "Frontend/navigation";
import {carrierApi, productApi, supportApi, userApi} from "Frontend/api/ApiCalls";
import {Carrier} from "Frontend/api/Models/CentralModels/Carrier";
import TurndownService from "turndown";
import { defaultSchema } from '@atlaskit/adf-schema';
import { JSONTransformer} from '@atlaskit/editor-json-transformer';
import { MarkdownTransformer } from '@atlaskit/editor-markdown-transformer';
import {DataItem} from "Frontend/api/Models/CentralModels/Data";
import {
    Attachment,
    GetTicketDetailsResponseModel,
    SupportComments,
    SupportRequestModel,
    Comment
} from "Frontend/api/Models/CarrierModels/Support";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faDownload,
    faTrash
} from "@fortawesome/free-solid-svg-icons";
import BodyText from "Frontend/components/Fonts/BodyText";
import {Permissions} from "Frontend/api/Models/CentralModels/User";
import {permissionChecks} from "Frontend/api/Models/CarrierModels/Permissions";
import CommentSection from "Frontend/views/Support/Components/CommentSection";
import {supportUrls} from "Frontend/api/Endpoints";
import BlueButton from "Frontend/components/FormInputs/BlueButton";

const AddOrEditSupport = () => {
    // state variables
    const [setLoading] = useOutletContext<any>();
    const [permissions, setPermissions] = React.useState<string[]>([]);
    const [supportComments, setSupportComments] = React.useState<SupportComments[]>([]);
    const [comments, setComments] = React.useState<Comment[]>([]);
    const [userIdFullNameMapping, setUserIdFullNameMapping] = React.useState<Map<number, string>>(new Map());

    // state variables for lead personal details
    const [summary, setSummary] = React.useState<string>("");
    const [descriptionHtml, setDisciptionHtml] = React.useState<string>("");
    const [issueTypeName, setIssueTypeName] = React.useState<string>("");
    const [issueTypes, setIssueTypes] = React.useState<DataItem[]>([]);
    const [formData, setFormData] = React.useState<FormData>(new FormData());
    const [commentFormData, setCommentFormData] = React.useState<FormData>(new FormData());
    const [attachments, setAttachments] = React.useState<Attachment[]>([]);

    // textarea states
    const rteRef = React.useRef<RichTextEditorRef>(null);
    const rteRefComment = React.useRef<RichTextEditorRef>(null);

    // local variables
    const isEdit = isEditMode("ticketId");
    const isView = isViewMode("ticketId");
    let ticketId = (isEdit || isView) ? getURLParamValue("ticketId") as string : null;

    const fileUploadChange = (event: ChangeEvent<HTMLInputElement>) => {
        const fileInput = event.target as HTMLInputElement;
        if (!fileInput.files) return; // Exit if there are no files

        let localFormData = new FormData();
        if (fileInput.files) {
            for (let i = 0; i < fileInput.files.length; i++) {
                localFormData.append(i.toString(), fileInput.files[i]);
            }
        }

        setFormData(localFormData);
    };

    const fileUploadChangeForComments = (event: ChangeEvent<HTMLInputElement>) => {
        const fileInput = event.target as HTMLInputElement;
        if (!fileInput.files) return; // Exit if there are no files

        let localFormData = new FormData();
        if (fileInput.files) {
            for (let i = 0; i < fileInput.files.length; i++) {
                localFormData.append(i.toString(), fileInput.files[i]);
            }
        }

        setCommentFormData(localFormData);
    };

    const handleSubmit = (addComment: boolean) => {
        const adfDocument = new JSONTransformer()
            .encode(
                new MarkdownTransformer(defaultSchema)
                    .parse(
                        new TurndownService().turndown(
                            addComment ? rteRefComment.current?.editor?.getHTML() ?? "" : rteRef.current?.editor?.getHTML() ?? ""
                        )
                    )
            );

        let images = new Map<string, File | undefined>();
        for (const [key, value] of addComment ? commentFormData.entries() : formData.entries()) {
            if (value instanceof File) {
                let fileName = value.name;
                let uniqueFileName = fileName;
                let counter = 1;

                // Check if the file name already exists in the map
                while (images.has(uniqueFileName)) {
                    // Append a number to the file name
                    uniqueFileName = `${fileName} (${counter})`;
                    counter++;
                }

                // Add the file to the map with the unique file name
                images.set(uniqueFileName, value);
            }
        }

        imageToByteArrayMap(images)
            .then((response: Map<string, string>) => {
                carrierApi.getLoggedInCarrier().then((carrier: Carrier) => {
                    let requestData: SupportRequestModel = {
                        jsonContent: JSON.stringify(adfDocument),
                        imagesBase64: Object.fromEntries(response),
                        jsonDocNode: adfDocument
                    };

                    if (!addComment) {
                        requestData.jsonContent = `{
                            "fields": {
                                "project": {
                                    "key": "${carrier.jiraProjectKey}"
                                },
                                "summary": "${summary}",
                                "description": ${JSON.stringify(adfDocument)},
                                "issuetype": {
                                    "name": "${issueTypeName}"
                                }
                            }
                        }`;
                    }

                    if (addComment) {
                        supportApi(setLoading).addComment(ticketId as string, requestData).then(() => {});
                    } else {
                        if (isEdit) {
                            supportApi(setLoading).editTicket(ticketId as string, requestData).then(() => {});
                        } else {
                            supportApi(setLoading).createTicket(requestData).then(() => {});
                        }
                    }
                });
            });
    }

    const handleFetchDetailsByTicketId = (ticketId: string) => {
        userApi(setLoading).getLoggedInUserPermissions()
            .then((response: Permissions) => {
                const permissionSplit = Object.values(response)
                    .flatMap(str => typeof str === 'string'? str.split(',') : []);
                setPermissions(permissionSplit);
        });

        supportApi(setLoading).getTicketDetailsById(ticketId as string)
            .then((response: GetTicketDetailsResponseModel) => {
                // set ticket details
                setSummary(response.fields?.summary ?? "");
                setDisciptionHtml(response.renderedFields?.description ?? "");
                const proseMirrorDiv = document.querySelectorAll('.ProseMirror');
                if(proseMirrorDiv.length >= 1 && proseMirrorDiv[0] != null) {
                    proseMirrorDiv[0].innerHTML = response.renderedFields?.description ?? "";
                }
                setIssueTypeName(response.fields?.issuetype?.name ?? "");

                // set the attachments
                setAttachments(response.fields?.attachment ?? []);

                // set the comments
                setComments(response.fields?.comment?.comments ?? []);
                setSupportComments(response.supportComments ?? []);
                setUserIdFullNameMapping(response.userIdFullNameMapping ?? new Map());
            });
    }

    React.useEffect(() => {
        carrierApi.getLoggedInCarrier()
            .then((carrier: Carrier) => {
                const issueTypes = carrier.issueTypes?.split(",") || [];
                const data: DataItem[] = issueTypes.map(issueType => ({
                    key: issueType.trim(),
                    value: issueType.trim(),
                    title: issueType.trim()
                }));
                setIssueTypes(data);

                if(isEdit || isView) {
                    handleFetchDetailsByTicketId(ticketId as string);
                }
            });
    }, [])

    return(
        <OutletLayout card={false}>
            <SectionLayout
                sectionTitle = "Ticket Details"
                sectionSubTitle = "This information can be edited"
            >
                <Grid item md={12} xs={12}>
                    <RenderInput
                        inputType={InputType.TextField}
                        label="Summary"
                        value={summary}
                        handleChange={React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => setSummary(event.target.value), [summary])}
                        isView={isView}
                    />
                </Grid>
                <Grid item md={12} xs={12}>
                    <RenderInput
                        inputType={InputType.RichTextArea}
                        rteRef={rteRef}
                        label="Description"
                        isView={isView}
                        value={descriptionHtml}
                    />
                </Grid>
                <Grid item md={6} xs={12}>
                    <RenderInput
                        inputType={InputType.Dropdown}
                        label="Issue Type"
                        value={issueTypeName}
                        handleChange={React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => setIssueTypeName(event.target.value), [issueTypeName, issueTypes])}
                        isView={isView}
                        data={issueTypes}
                    />
                </Grid>
                <Grid item md={6} xs={12}>
                    {isView ?
                        <></> :
                        <div style={{marginTop: 22}}>
                            <label>Attachments: </label>
                            <input
                                id="files"
                                type="file"
                                multiple
                                onChange={fileUploadChange}
                            />
                        </div>
                    }
                </Grid>
                <Grid
                    item
                    md={12}
                    xs={12}
                    container
                    direction="column"
                    justifyContent="center"
                    alignItems="center"
                >
                    {(isView || isEdit) && (
                        <>
                            <BodyText text={`<b>Attachments: </b>`}/>
                            <List style={{height: 400, width: '50%', overflow: "scroll"}}>
                                {attachments.map((attachment, index) => (
                                    <ListItem key={index} secondaryAction={
                                        <div>
                                            {permissions.includes(permissionChecks.supportPermissions.downloadAttachments) && (
                                                <IconButton edge="end" aria-label="download" style={{ marginRight: 20 }} onClick={() => {
                                                    window.location.href = `${supportUrls.getAttachmentById}/${attachment.id}`
                                                }}>
                                                    <FontAwesomeIcon icon={faDownload} size="sm" />
                                                </IconButton>
                                            )}
                                        </div>
                                    }>
                                        <ListItemAvatar>
                                            <Avatar>
                                                <FontAwesomeIcon icon={getFileIcon(attachment.filename as string)} size="sm" />
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText primary={attachment.filename} />
                                    </ListItem>
                                ))}
                            </List>
                        </>
                    )}
                </Grid>
            </SectionLayout><br/>
            {
                isView || isEdit ?
                    <SectionLayout
                        sectionTitle = "Comments"
                        sectionSubTitle = ""
                    >
                        <CommentSection
                            comments = {comments}
                            setComment = {setComments}
                            supportComment = {supportComments}
                            setSupportComment = {setSupportComments}
                            userIdFullNameMapping = {userIdFullNameMapping}
                            setLoading = {setLoading}
                            ticketId = {ticketId as string}
                        />
                        {
                            isEdit ?
                                <>
                                    <Grid item md={12} xs={12}>
                                        <RenderInput
                                            inputType={InputType.RichTextArea}
                                            rteRef={rteRefComment}
                                            label="Comment"
                                            isView={isView}
                                            name="insertEditor"
                                        />
                                    </Grid>
                                    <Grid item md={2} xs={12}>
                                        <BlueButton
                                            label="Submit Comment"
                                            handleSubmit={() => handleSubmit(true)}
                                        />
                                    </Grid>
                                    <Grid item md={4} xs={12}>
                                        <div style={{marginTop:10}}>
                                            <label>Attachments: </label>
                                            <input
                                                id="files"
                                                type="file"
                                                multiple
                                                onChange={fileUploadChangeForComments}
                                            />
                                        </div>
                                    </Grid>
                                </>
                                :
                                <></>
                        }
                    </SectionLayout> : <></>
            }
            {isView ?
                <></> :
                <>
                    <br/>
                    <ActionFooter
                        paramValue="ticketId"
                        handleSubmit={() => handleSubmit(false)}
                        cancelUrl={navigatingRoutes.dashboard.support}
                        customButtonText={isEdit ? "Edit Request" : "Submit Request"}
                    />
                </>
            }
        </OutletLayout>

    );
}

export default AddOrEditSupport;