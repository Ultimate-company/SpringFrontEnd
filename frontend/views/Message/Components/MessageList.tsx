import {
    Avatar,
    Box, Chip,
    CircularProgress,
    Divider,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText, Stack,
} from "@mui/material";
import React from "react";
import {getRandomColor} from "Frontend/components/commonHelperFunctions";
import ReactHtmlParser from 'react-html-parser';
import {messageApi} from "Frontend/api/ApiCalls";
import {MessageResponseModel} from "Frontend/api/Models/CarrierModels/Message";
import BodyText from "Frontend/components/Fonts/BodyText";
import {navigatingRoutes} from "Frontend/navigation";

interface MessageItem {
    avatarSrc: string;
    title: string;
    from: string;
    messageHtml: string;
    read: boolean;
    messageId: number;
    updated: boolean;
}

const MessageItem = (props: MessageItem) => {
    return (
        <ListItem alignItems="flex-start" sx={{ '&:hover': { backgroundColor: '#f5f5f5', }, }} onClick={() => {
            window.location.href = navigatingRoutes.dashboard.viewMessage + "?messageId=" + props.messageId + "&isView";
        }}>
            <ListItemAvatar>
                {
                    props.avatarSrc && props.avatarSrc.length > 2 ?
                        <Avatar src={props.avatarSrc}/> :
                        <Avatar style={{backgroundColor: getRandomColor()}}>{props.avatarSrc[0]}{props.avatarSrc[1]}</Avatar>
                }
            </ListItemAvatar>
            <ListItemText
                primary={
                    <React.Fragment>
                        <Stack direction="row" spacing={1}>
                            <BodyText text={props.from} />
                            { props.read ? <Chip label="New" color="success" style={{marginLeft: '8px'}} /> : <></> }
                            { props.updated ? <Chip label="Updated" color="warning" variant="outlined" style={{marginLeft: '8px'}} /> : <></>}
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
    // state variables
    const [loading, setLoading] = React.useState<boolean>(true);
    const [messageResponseModel, setMessageResponseModel] = React.useState<MessageResponseModel[]>([]);

    React.useEffect(() => {
        messageApi(() => {}).getMessagesByUserId().then((messageResponseModels: MessageResponseModel[]) => {
            setMessageResponseModel(messageResponseModels);
            setLoading(false);
        })
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
            ): (
                <List sx={{zindex:12000, maxHeight:460, minHeight:400, minWidth: 400, maxWidth: 460, overflowY:'scroll', marginTop:2, backgroundColor: 'background.paper' }}>
                    {messageResponseModel.map((messageItem, index) => (
                        <React.Fragment key={index}>
                            <MessageItem
                                avatarSrc={messageItem.user.avatar && messageItem.user.avatar != "" ? messageItem.user.avatar :
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
                    ))}
                </List>
            )}
        </>
    );
}

export default MessageList;