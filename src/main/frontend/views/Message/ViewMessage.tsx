import {getURLParamValue, isEditMode, isViewMode} from "Frontend/components/commonHelperFunctions";
import {useOutletContext} from "react-router-dom";
import React from "react";
import {messageApi} from "Frontend/api/ApiCalls";
import {MessageResponseModel} from "Frontend/api/Models/CarrierModels/Message";
import SectionLayout from "Frontend/components/Layouts/DashboardLayout/SectionLayout";
import {Grid} from "@mui/material";
import RenderInput, {InputType} from "Frontend/components/FormRenderer/RenderInput";
import OutletLayout from "Frontend/components/Layouts/DashboardLayout/OutletLayout";

const ViewMessage = () => {
    // state variables
    const [setLoading] = useOutletContext<any>();

    // state variables for message details
    const [title, setTitle] = React.useState<string>("");
    const [publishDate, setPublishDate] = React.useState<Date>(new Date());
    const [from, setFrom] = React.useState<string>("");
    const [descriptionHtml, setDescriptionHtml] = React.useState<string>("");

    // local variables
    const isEdit = isEditMode("messageId");
    const isView = isViewMode("messageId");
    let messageId = (isEdit || isView) ? parseInt(getURLParamValue("messageId") as string) : null;

    const handleFetchMessageDetailsById = (messageId: number) => {
        messageApi(setLoading).getMessageDetailsById(messageId).then((messageResponseModel: MessageResponseModel) => {
            // set state variables for message details
            setTitle(messageResponseModel.message.title)
            setPublishDate(messageResponseModel.message.publishDate);
            setDescriptionHtml(messageResponseModel.message.descriptionHtml);
            setFrom(messageResponseModel.user.firstName + " " + messageResponseModel.user.lastName);
        })
    }

    const handleSubmit = () => {
        messageApi(setLoading).setMessageReadByUserIdAndMessageId(messageId as number).then(() => {});
    }

    React.useEffect(() => {
        if(isView || isEdit) {
            handleFetchMessageDetailsById(messageId as number);
            handleSubmit();
        }
    }, []);

    return (
        <OutletLayout card={false}>
            <SectionLayout
                sectionTitle="Message Information"
                sectionSubTitle=""
            >
                <Grid item md={6} xs={12}>
                    <RenderInput
                        inputType={InputType.TextField}
                        label="Title"
                        value={title}
                        isView={isView}
                    />
                </Grid>
                <Grid item md={6} xs={12}>
                    <RenderInput
                        inputType={InputType.Date}
                        label="Publish Date"
                        value={publishDate}
                        isView={isView}
                    />
                </Grid>
                <Grid item md={6} xs={12}>
                    <RenderInput
                        inputType={InputType.TextArea}
                        label="From"
                        value={from}
                        isView={isView}
                    />
                </Grid>
                <Grid item md={12} xs={12}>
                    <RenderInput
                        inputType={InputType.RichTextArea}
                        label="Description"
                        isView={isView}
                        value={descriptionHtml}
                    />
                </Grid>
            </SectionLayout> <br/>
        </OutletLayout>
    );
}
export default ViewMessage;