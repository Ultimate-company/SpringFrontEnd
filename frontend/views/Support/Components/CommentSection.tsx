import {
    Avatar,
    Button,
    Typography,
    Stack,
    Card,
    Box,
    Grid
} from "@mui/material";
import React, {ChangeEvent} from "react";
import {getRandomColor, imageToByteArrayMap, removeAnchorAndImageTagsFromHTML, renderComment} from "Frontend/components/commonHelperFunctions";
import { Delete, Edit, Cancel} from "@mui/icons-material";
import {carrierApi, supportApi, userApi} from "Frontend/api/ApiCalls";
import {User} from "Frontend/api/Models/CentralModels/User";
import {useConfirm} from "material-ui-confirm";
import {SupportComments, Comment, Body, SupportRequestModel} from "Frontend/api/Models/CarrierModels/Support";
import RenderInput, {InputType} from "Frontend/components/FormRenderer/RenderInput";
import BlueButton from "Frontend/components/FormInputs/BlueButton";
import {RichTextEditorRef} from "mui-tiptap";
import parse from "html-react-parser";
import {JSONTransformer} from "@atlaskit/editor-json-transformer";
import {MarkdownTransformer} from "@atlaskit/editor-markdown-transformer";
import {defaultSchema} from "@atlaskit/adf-schema";
import TurndownService from "turndown";
import {Carrier} from "Frontend/api/Models/CentralModels/Carrier";

interface CommentSectionProps {
    comments: Comment[];
    setComment: (comments: Comment[]) => void;
    supportComment: SupportComments[];
    setSupportComment: (supportComments: SupportComments[]) => void;
    userIdFullNameMapping: Object;
    setLoading: any;
    ticketId: string;
}

const CommentSection = (props: CommentSectionProps) => {
    // Hooks used in component
    const confirm = useConfirm();
    const [loggedInUser, setLoggedInUser] = React.useState<User | null>(null);
    const [editingCommentId, setEditingCommentId] = React.useState<string | null>(null);
    const [formData, setFormData] = React.useState<FormData>(new FormData());
    const [editValue, setEditValue] = React.useState<string>('');
    const rteRef = React.useRef<RichTextEditorRef>(null);

    // local helper function
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
    const getUserIdForComment = (commentId: string) => {
        return props.supportComment.find(comment => comment.commentId?.split("-")[0] == commentId)?.userId as number;
    }
    const getInitialsForAvatar = (commentId: string) => {
        // Find the comment
        const comment = props.supportComment.find(comment => comment.commentId?.split("-")[0] === commentId);

        if (comment) {
            const userId = comment.userId as number;

            // Use type assertion to inform TypeScript about the type
            const fullNameMapping = props.userIdFullNameMapping as { [key: number]: string };

            if (fullNameMapping[userId]) {
                const nameSplit = fullNameMapping[userId].split(" ");
                return (nameSplit?.[0]?.substring(0, 1).toUpperCase() ?? '') +
                    (nameSplit?.[1]?.substring(0, 1).toUpperCase() ?? '');
            }
        }
        return null;
    }
    const isUserCommentOwner = (userId: number) => {
        return loggedInUser?.userId === userId;
    };
    const handleEditClick = (comment: Comment, isCancel: boolean) => {
        if(isCancel) {
            setEditValue('');
            setEditingCommentId(null);
        }
        else {
            const scrollPosition = window.scrollY;
            setEditValue(removeAnchorAndImageTagsFromHTML(renderComment(comment.renderedBody as string, comment.body as Body)));
            setEditingCommentId(comment.id as string);

            // Restore the scroll position after rendering
            requestAnimationFrame(() => {
                window.scrollTo({
                    top: scrollPosition,
                    behavior: 'auto'
                });
            });
        }
    };
    const handleOnCreated = () => {
        const parentDiv = document.querySelector('#editCommentEditor');
        if(parentDiv){
            const proseMirrorDiv = parentDiv.querySelectorAll('.ProseMirror');
            if(proseMirrorDiv && proseMirrorDiv[0] != null) {
                proseMirrorDiv[0].innerHTML = editValue ?? "";
            }
        }
    }
    const handleSubmit = (commentId: string) => {
        const adfDocument = new JSONTransformer()
            .encode(
                new MarkdownTransformer(defaultSchema)
                    .parse(
                        new TurndownService().turndown(
                            rteRef.current?.editor?.getHTML() ?? ""
                        )
                    )
            );

        let images = new Map<string, File | undefined>();
        for (const [key, value] of formData.entries()) {
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

                    supportApi(props.setLoading).editComment(props.ticketId, commentId, requestData);
                });
            });
    }

    // Fetch logged-in user information
    React.useEffect(() => {
        userApi(props.setLoading).getLoggedInUser()
            .then((response: User) => {
                setLoggedInUser(response);
            });
    }, []);

    return (
        <div
            style={{
                width: "100%",
                maxHeight: 600,
                overflowY: "auto",
                marginLeft: 20,
                marginRight: 20,
                marginTop: 10,
                marginBottom: 10
            }}
        >
            {props.comments.map((comment, index) => (
                <Card
                    key={index}
                    style = {{
                        width: "95%",
                        margin: "30px auto"
                    }}
                >
                    <Box sx={{ p: "15px" }}>
                        <Stack spacing={2} direction="row" >
                                <Box style={{width:"100%"}}>
                                    <Stack
                                        spacing={2}
                                        direction="row"
                                        justifyContent="space-between"
                                        alignItems="center"
                                    >
                                        <Stack spacing={2} direction="row" alignItems="center">
                                            <Avatar style={{ backgroundColor: getRandomColor(parseInt(comment.id as string)) }}>
                                                {getInitialsForAvatar(comment.id as string)}
                                            </Avatar>
                                            <Typography fontWeight="bold" sx={{ color: 'neutral.darkBlue' }}>
                                                {
                                                    (props.userIdFullNameMapping as { [key: number]: string })[getUserIdForComment(comment.id as string)] ?
                                                        (props.userIdFullNameMapping as { [key: number]: string })[getUserIdForComment(comment.id as string)] ?? `${comment.author?.displayName} (Helpdesk)` :
                                                        `${comment.author?.displayName} (Helpdesk)`
                                                }
                                            </Typography>
                                            <Typography sx={{ color: 'neutral.grayishBlue' }}>
                                                {comment.created ? new Date(comment.created).toLocaleDateString() : ""}
                                            </Typography>
                                        </Stack>
                                        <Stack direction="row" spacing={1} sx={{ ml: 'auto' }}>
                                            {
                                                isUserCommentOwner(getUserIdForComment(comment.id as string) as number) ?
                                                    <Button
                                                        startIcon={<Delete />}
                                                        sx={{
                                                            color: 'custom.softRed',
                                                            fontWeight: 500,
                                                            textTransform: 'capitalize',
                                                        }}
                                                        onClick={() => {
                                                            confirm({
                                                                description: "Are you sure you want to delete this comment, this action cannot be undone?",
                                                                confirmationText: "Yes I'm Sure",
                                                                allowClose: true,
                                                                confirmationButtonProps: { autoFocus: true }
                                                            })
                                                                .then(() => {
                                                                    supportApi(props.setLoading).deleteComment(props.ticketId, comment.id as string)
                                                                        .then(() => {})
                                                                })
                                                                .catch(() => {});
                                                        }}
                                                    >
                                                        Delete
                                                    </Button>: <></>
                                            }
                                            {
                                                isUserCommentOwner(getUserIdForComment(comment.id as string) as number) ?
                                                    <Button
                                                        startIcon={editingCommentId !== comment.id ? <Edit /> : <Cancel/>}
                                                        disabled={false} // Replace with appropriate condition
                                                        sx={{
                                                            color: "custom.moderateBlue",
                                                            fontWeight: 500,
                                                            textTransform: "capitalize",
                                                        }}
                                                        onClick={() => handleEditClick(comment, editingCommentId === comment.id)}
                                                    >
                                                        {editingCommentId !== comment.id ? "Edit" : "Cancel"}
                                                    </Button> : <></>
                                            }
                                        </Stack>
                                    </Stack>
                                    {editingCommentId === comment.id ? (
                                        <>
                                            <br/>
                                            <RenderInput
                                                inputType={InputType.RichTextArea}
                                                rteRef={rteRef}
                                                label="Comment"
                                                isView={false}
                                                name="editCommentEditor"
                                                onCreated={() => {
                                                    handleOnCreated();
                                                }}
                                            /> <br/>
                                            <div style={{
                                                marginTop: 10,
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '10px'
                                            }}>
                                                <BlueButton
                                                    label="Edit Comment"
                                                    handleSubmit={() => {
                                                       handleSubmit(comment.id as string)
                                                    }}
                                                />
                                                <div style={{display: 'flex', alignItems: 'center'}}>
                                                    <label style={{marginRight: '10px'}}>Attachments:</label>
                                                    <input
                                                        id="files"
                                                        type="file"
                                                        multiple
                                                        onChange={fileUploadChange}
                                                    />
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <Typography sx={{color: 'neutral.grayishBlue', py: 2}}>
                                            {
                                                parse(renderComment(comment.renderedBody as string, comment.body as Body))
                                            }
                                        </Typography>
                                    )}
                                </Box>
                        </Stack>
                    </Box>
                </Card>
            ))}
        </div>
    );
}

export default CommentSection;