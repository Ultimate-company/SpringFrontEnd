import {
    Avatar,
    Box,
    Chip,
    CircularProgress,
    Divider,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Stack,
    Card,
    CardContent,
} from "@mui/material";
import React from "react";
import { useTheme } from "@mui/material/styles";
import { getRandomColor } from "Frontend/components/commonHelperFunctions";
import ReactHtmlParser from 'react-html-parser';
import { messageApi } from "Frontend/api/ApiCalls";
import { MessageResponseModel } from "Frontend/api/Models/CarrierModels/Message";
import BodyText from "Frontend/components/Fonts/BodyText";
import { navigatingRoutes } from "Frontend/navigation";
import PrimaryFont from "Frontend/components/Fonts/PrimaryFont";

interface MessageItemProps {
    avatarSrc: string;
    title: string;
    from: string;
    messageHtml: string;
    read: boolean;
    messageId: number;
    updated: boolean;
}

const MessageItem = (props: MessageItemProps) => {
    const theme = useTheme(); // Access the current theme

    return (
        <ListItem
            alignItems="flex-start"
            sx={{
                '&:hover': {
                    backgroundColor: theme.palette.mode === 'dark' ? '#424242' : '#f5f5f5'
                },
                backgroundColor: theme.palette.mode === 'dark' ? '#303030' : '#ffffff'
            }}
            onClick={() => {
                window.location.href = navigatingRoutes.dashboard.viewMessage + "?messageId=" + props.messageId + "&isView";
            }}
        >
            <ListItemAvatar>
                {
                    props.avatarSrc && props.avatarSrc.length > 2 ?
                        <Avatar src={props.avatarSrc} /> :
                        <Avatar style={{ backgroundColor: getRandomColor() }}>{props.avatarSrc[0]}{props.avatarSrc[1]}</Avatar>
                }
            </ListItemAvatar>
            <ListItemText
                primary={
                    <React.Fragment>
                        <Stack direction="row" spacing={1}>
                            <BodyText text={props.from} />
                            {props.read ? <Chip label="New" color="success" style={{ marginLeft: '8px' }} /> : <></>}
                            {props.updated ? <Chip label="Updated" color="warning" variant="outlined" style={{ marginLeft: '8px' }} /> : <></>}
                        </Stack>
                    </React.Fragment>
                }
                secondary={
                    <React.Fragment>
                        <b>{props.title}</b>
                        {
                            props.messageHtml && props.messageHtml.length > 25 ?
                                <>{ReactHtmlParser(props.messageHtml.substring(0, 25))} ...</> :
                                <>{ReactHtmlParser(props.messageHtml)}</>
                        }
                    </React.Fragment>
                }
            />
        </ListItem>
    );
}

const MessageList = () => {
    const theme = useTheme();
    const [loading, setLoading] = React.useState(true);
    const [messageResponseModel, setMessageResponseModel] = React.useState<MessageResponseModel[]>([]);

    React.useEffect(() => {
        messageApi(() => {}).getMessagesByUserId().then((messageResponseModels: MessageResponseModel[]) => {
            setMessageResponseModel(messageResponseModels);
            setLoading(false);
        });
    }, []);

    return (
        <>
            {loading ? (
                <Box
                    sx={{
                        position: 'fixed',
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        zIndex: 100
                    }}
                >
                    <CircularProgress size={100} />
                </Box>
            ) : (
                <Card
                    sx={{
                        maxHeight: 460,
                        minHeight: 400,
                        minWidth: 400,
                        maxWidth: 460,
                        overflowY: 'scroll',
                        marginTop: 2,
                        backgroundColor: theme.palette.mode === 'dark' ? '#424242' : '#fffbf9'
                    }}
                >
                    <CardContent>
                        <List sx={{ zIndex: 12000 }}>
                            {messageResponseModel.length > 0 ? (
                                messageResponseModel.map((messageItem, index) => (
                                    <React.Fragment key={index}>
                                        <MessageItem
                                            avatarSrc={messageItem.user.avatar && messageItem.user.avatar !== "" ? messageItem.user.avatar :
                                                messageItem.user.firstName[0] + messageItem.user.lastName[1]}
                                            title={messageItem.message.title}
                                            from={messageItem.user.firstName + " " + messageItem.user.lastName}
                                            messageHtml={messageItem.message.descriptionHtml}
                                            read={!messageItem.read}
                                            messageId={messageItem.message.messageId as number}
                                            updated={messageItem.message.updated as boolean}
                                        />
                                        <Divider />
                                    </React.Fragment>
                                ))
                            ) : (
                                <Box
                                    sx={{
                                        paddingTop: 22,
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        height: '100%',
                                        flexDirection: 'column'
                                    }}
                                >
                                    <PrimaryFont text="No new notifications" />
                                </Box>
                            )}
                        </List>
                    </CardContent>
                </Card>
            )}
        </>
    );
}

export default MessageList;