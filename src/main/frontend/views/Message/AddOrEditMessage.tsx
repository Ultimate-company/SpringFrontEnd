import {useOutletContext} from "react-router-dom";
import React from "react";
import {GridRowSelectionModel} from "@mui/x-data-grid";
import {getURLParamValue, isEditMode, isViewMode} from "Frontend/components/commonHelperFunctions";
import OutletLayout from "Frontend/components/Layouts/DashboardLayout/OutletLayout";
import {Grid} from "@mui/material";
import RenderInput, {InputType} from "Frontend/components/FormRenderer/RenderInput";
import SectionLayout from "Frontend/components/Layouts/DashboardLayout/SectionLayout";
import UserSelectionGrid from "Frontend/components/DataGridsForSelection/UserSelectionGrid";
import GroupSelectionGrid from "Frontend/components/DataGridsForSelection/UserGroupSelectionGrid";
import ActionFooter from "Frontend/components/FormRenderer/ActionFooter";
import {navigatingRoutes} from "Frontend/navigation";
import {messageApi} from "Frontend/api/ApiCalls";
import {MessageRequestModel, MessageResponseModel} from "Frontend/api/Models/CarrierModels/Message";
import {
    type RichTextEditorRef,
} from "mui-tiptap";

const AddOrEditMessage = () => {
    // state variables
    const [setLoading] = useOutletContext<any>();

    // state variables for message details
    const [title, setTitle] = React.useState<string>("");
    const [publishDate, setPublishDate] = React.useState<Date>(new Date());
    const [sendAsEmail, setSendAsEmail] = React.useState<boolean>(false);
    const [descriptionHtml, setDescriptionHtml] = React.useState<string>("");

    // selected userIds
    const [selectedUserIds, setSelectedUserIds] = React.useState<GridRowSelectionModel>([]);
    const [selectedUserGroupIds, setSelectedUserGroupIds] = React.useState<GridRowSelectionModel>([]);

    // textarea states
    const rteRef = React.useRef<RichTextEditorRef>(null);

    // local variables
    const isEdit = isEditMode("messageId");
    const isView = isViewMode("messageId");
    let messageId = (isEdit || isView) ? parseInt(getURLParamValue("messageId") as string) : null;

    const handleFetchMessageDetailsById = (messageId: number) => {
        messageApi(setLoading).getMessageDetailsById(messageId).then((messageResponseModel: MessageResponseModel) => {
            // set state variables for message details
            setTitle(messageResponseModel.message.title)
            setPublishDate(messageResponseModel.message.publishDate);
            setSendAsEmail(messageResponseModel.message.sendAsEmail);
            setDescriptionHtml(messageResponseModel.message.descriptionHtml);

            const proseMirrorDiv = document.querySelector('.ProseMirror');
            if(proseMirrorDiv != null) {
                proseMirrorDiv.innerHTML = messageResponseModel.message.descriptionHtml;
            }

            // set selected userids and user groupIds
            setSelectedUserIds(messageResponseModel.userIds);
            setSelectedUserGroupIds(messageResponseModel.userGroupIds);
        })
    }

    const handleSubmit = () => {
        let requestData: MessageRequestModel = {
            message: {
                messageId: isEdit ? messageId as number : undefined,
                title: title,
                publishDate: publishDate,
                sendAsEmail: sendAsEmail,
                descriptionHtml: rteRef.current?.editor?.getHTML() ?? "",
            },
            userGroupIds: selectedUserGroupIds.map(userGroupId => parseInt(userGroupId.toString())),
            userIds: selectedUserIds.map(userId => parseInt(userId.toString()))
        }
        if(isEdit) {
            messageApi(setLoading).updateMessage(requestData).then(() => {});
        }
        else{
            messageApi(setLoading).createMessage(requestData).then(() => {});
        }
    }

    React.useEffect(() => {
        if(isView || isEdit) {
            handleFetchMessageDetailsById(messageId as number);
        }
    }, []);

    return (
        <OutletLayout card={false}>
            <SectionLayout
                sectionTitle="Message Informaton"
                sectionSubTitle="This information can be edited"
            >
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
                        inputType={InputType.Date}
                        label="Publish Date"
                        value={publishDate}
                        handleChange={React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => setPublishDate(new Date(event.target.value)), [publishDate])}
                        isView={isView}
                    />
                </Grid>
                <Grid item md={6} xs={12}>
                    <RenderInput
                        inputType={InputType.Checkbox}
                        label="Send As Email"
                        checked={sendAsEmail}
                        handleChange={React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => setSendAsEmail(event.target.checked), [sendAsEmail])}
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
            </SectionLayout> <br/>
            <SectionLayout
                sectionTitle="Target Users"
                sectionSubTitle="Select users who will receive this message."
            >
                <Grid item md={12} xs={12}>
                    <UserSelectionGrid
                        isView={isView}
                        setLoading={setLoading}
                        selectedUserIds={selectedUserIds}
                        setSelectedUserIds={React.useCallback((selectedUserIds: GridRowSelectionModel) => setSelectedUserIds(selectedUserIds), [selectedUserIds])}
                        singleSelection={false}
                    />
                </Grid>
            </SectionLayout><br/>
            <SectionLayout
                sectionTitle="Target User Groups"
                sectionSubTitle="Select user groups who will receive this message."
            >
                <Grid item md={12} xs={12}>
                    <GroupSelectionGrid
                        isView={isView}
                        setLoading={setLoading}
                        selectedUserGroupIds={selectedUserGroupIds}
                        setSelectedUserGroupIds={React.useCallback((selectedUSerGroupIds: GridRowSelectionModel) => setSelectedUserGroupIds(selectedUSerGroupIds), [setSelectedUserGroupIds])}
                    />
                </Grid>
            </SectionLayout><br/>

            {isView ?
                <></> :
                <ActionFooter
                    paramValue="messageId"
                    handleSubmit={handleSubmit}
                    cancelUrl={navigatingRoutes.dashboard.messages}
                    buttonText="Message"
                />
            }
        </OutletLayout>
    );
}

export default AddOrEditMessage;