import React from "react";
import {Box, Divider, Modal, Typography} from "@mui/material";
import Header from "Frontend/components/Fonts/Header";
import BodyText from "Frontend/components/Fonts/BodyText";
import ReactJson from "react-json-view";

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    wordWrap: 'break-word',
    overflowWrap: 'break-word',
    padding: '10px',
    height: 800,
    overflowY: 'scroll'
};

interface CustomModalComponentProps {
    customModalProps: CustomModalProps;
    setCustomModalProps: (customModalProps: CustomModalProps) => void;
}
export interface CustomModalProps {
    open: boolean;
    headerText: string;
    bodyText: string | Object;
    isJson: boolean;
}

const CustomModal = (props: CustomModalComponentProps) => {
    return (
        <Modal
            open={props.customModalProps.open}
            onClose={() => props.setCustomModalProps({
                ...props.customModalProps,
                open: false
            })}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Header label={props.customModalProps.headerText}/>
                <Divider/><br/>
                {
                    props.customModalProps.isJson ?
                        <>
                            <ReactJson src={props.customModalProps.bodyText as Object} />
                        </>
                        :
                        <BodyText text={props.customModalProps.bodyText as string}/>
                }
            </Box>
        </Modal>
    );
}

export default CustomModal;